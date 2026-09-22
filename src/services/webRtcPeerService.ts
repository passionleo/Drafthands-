/**
 * Production-ready WebRTC Peer Connection & Signaling Service for Drafthands Live Classroom
 * Handles peer-to-peer 2-way video & audio session establishment between Teacher and Student devices.
 * Uses Google STUN traversal, deterministic initiator assignment, ICE trickle buffering,
 * and seamless track replacement when hardware switches or fails.
 */

import { LiveClassSyncService } from './liveClassSync';
import { ParticipantRole, LiveSyncMessage } from '../types/liveClass';

export type PeerConnectionState = 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';

export interface WebRtcCallbacks {
  onRemoteStream: (peerId: string, stream: MediaStream) => void;
  onRemoteStreamRemoved: (peerId: string) => void;
  onPeerStateChange: (peerId: string, state: PeerConnectionState) => void;
}

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 4
};

export class WebRtcPeerService {
  private localUserId: string;
  private localUserName: string;
  private localRole: ParticipantRole;
  private syncService: LiveClassSyncService;
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private remoteStreams: Map<string, MediaStream> = new Map();
  private pendingIceCandidates: Map<string, RTCIceCandidateInit[]> = new Map();
  private callbacks: WebRtcCallbacks;
  private unsubscribeSync: (() => void) | null = null;
  private isDestroyed: boolean = false;

  constructor(
    localUserId: string,
    localUserName: string,
    localRole: ParticipantRole,
    syncService: LiveClassSyncService,
    callbacks: WebRtcCallbacks
  ) {
    this.localUserId = localUserId;
    this.localUserName = localUserName;
    this.localRole = localRole;
    this.syncService = syncService;
    this.callbacks = callbacks;

    this.setupSignaling();
  }

  /**
   * Sets or updates the local media stream (camera + mic or synthetic fallback)
   */
  public setLocalStream(stream: MediaStream | null): void {
    this.localStream = stream;

    // Update tracks on all active peer connections
    this.peerConnections.forEach((pc) => {
      if (pc.signalingState === 'closed') return;

      const senders = pc.getSenders();
      if (stream) {
        stream.getTracks().forEach((newTrack) => {
          const matchingSender = senders.find(s => s.track?.kind === newTrack.kind);
          if (matchingSender) {
            matchingSender.replaceTrack(newTrack).catch(err => {
              console.warn('[WebRTC] Error replacing track:', err);
            });
          } else {
            try {
              pc.addTrack(newTrack, stream);
            } catch (err) {
              console.warn('[WebRTC] Error adding new track:', err);
            }
          }
        });
      }
    });
  }

  /**
   * Announce presence to all other peers in the room
   */
  public announceJoin(): void {
    this.syncService.broadcast('WEBRTC_SIGNAL_JOIN', {
      participantId: this.localUserId,
      name: this.localUserName,
      role: this.localRole
    });
  }

  /**
   * Subscribes to signaling events over LiveClassSyncService
   */
  private setupSignaling(): void {
    this.unsubscribeSync = this.syncService.subscribe(async (msg: LiveSyncMessage) => {
      if (this.isDestroyed) return;

      try {
        switch (msg.type) {
          case 'WEBRTC_SIGNAL_JOIN':
            await this.handlePeerJoin(msg);
            break;

          case 'WEBRTC_SIGNAL_OFFER':
            if (msg.payload?.targetId === this.localUserId) {
              await this.handleIncomingOffer(msg.senderId, msg.payload.sdp);
            }
            break;

          case 'WEBRTC_SIGNAL_ANSWER':
            if (msg.payload?.targetId === this.localUserId) {
              await this.handleIncomingAnswer(msg.senderId, msg.payload.sdp);
            }
            break;

          case 'WEBRTC_SIGNAL_ICE':
            if (msg.payload?.targetId === this.localUserId) {
              await this.handleIncomingIce(msg.senderId, msg.payload.candidate);
            }
            break;

          case 'WEBRTC_SIGNAL_LEAVE':
          case 'PARTICIPANT_LEAVE':
            this.handlePeerLeave(msg.payload?.participantId || msg.senderId);
            break;
        }
      } catch (err) {
        console.error('[WebRTC] Error processing signaling message:', err);
      }
    });
  }

  /**
   * Deterministic negotiation initiator:
   * Teacher always initiates to Student.
   * If both are students, the one with alphabetical lower ID initiates to avoid collision.
   */
  private shouldInitiateOfferTo(remotePeerId: string, remoteRole?: ParticipantRole): boolean {
    if (this.localRole === 'TEACHER' && remoteRole !== 'TEACHER') {
      return true;
    }
    if (remoteRole === 'TEACHER' && this.localRole !== 'TEACHER') {
      return false;
    }
    return this.localUserId < remotePeerId;
  }

  /**
   * Handles peer joined event
   */
  private async handlePeerJoin(msg: LiveSyncMessage): Promise<void> {
    const peerId = msg.senderId;
    if (peerId === this.localUserId) return;

    const remoteRole = msg.payload?.role as ParticipantRole | undefined;

    // Check if we should initiate the WebRTC offer
    if (this.shouldInitiateOfferTo(peerId, remoteRole)) {
      console.log(`[WebRTC] Initiating offer to peer: ${peerId}`);
      await this.initiateCall(peerId);
    }
  }

  /**
   * Creates RTCPeerConnection and sends WebRTC Offer to remote peer
   */
  private async initiateCall(peerId: string): Promise<void> {
    const pc = this.getOrCreatePeerConnection(peerId);

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await pc.setLocalDescription(offer);

      this.syncService.broadcast('WEBRTC_SIGNAL_OFFER', {
        targetId: peerId,
        sdp: offer
      });
    } catch (err) {
      console.error(`[WebRTC] Failed to create or send offer to ${peerId}:`, err);
    }
  }

  /**
   * Handles incoming WebRTC Offer
   */
  private async handleIncomingOffer(senderId: string, sdp: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.getOrCreatePeerConnection(senderId);

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      // Process any buffered ICE candidates that arrived before the offer
      await this.drainPendingIceCandidates(senderId, pc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      this.syncService.broadcast('WEBRTC_SIGNAL_ANSWER', {
        targetId: senderId,
        sdp: answer
      });
    } catch (err) {
      console.error(`[WebRTC] Failed to process incoming offer from ${senderId}:`, err);
    }
  }

  /**
   * Handles incoming WebRTC Answer
   */
  private async handleIncomingAnswer(senderId: string, sdp: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.peerConnections.get(senderId);
    if (!pc) {
      console.warn(`[WebRTC] Received answer from unknown peer: ${senderId}`);
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      await this.drainPendingIceCandidates(senderId, pc);
    } catch (err) {
      console.error(`[WebRTC] Failed to set remote answer from ${senderId}:`, err);
    }
  }

  /**
   * Handles incoming ICE candidate
   */
  private async handleIncomingIce(senderId: string, candidateInit: RTCIceCandidateInit): Promise<void> {
    const pc = this.peerConnections.get(senderId);
    if (pc && pc.remoteDescription && pc.remoteDescription.type) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidateInit));
      } catch (err) {
        console.warn(`[WebRTC] Error adding ICE candidate from ${senderId}:`, err);
      }
    } else {
      // Buffer candidate until remote description is set
      const pending = this.pendingIceCandidates.get(senderId) || [];
      pending.push(candidateInit);
      this.pendingIceCandidates.set(senderId, pending);
    }
  }

  /**
   * Empties pending ICE queue once remote description is ready
   */
  private async drainPendingIceCandidates(peerId: string, pc: RTCPeerConnection): Promise<void> {
    const pending = this.pendingIceCandidates.get(peerId);
    if (!pending || pending.length === 0) return;

    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn(`[WebRTC] Error draining ICE candidate:`, err);
      }
    }
    this.pendingIceCandidates.delete(peerId);
  }

  /**
   * Retrieves existing peer connection or creates a new one with full event bindings
   */
  private getOrCreatePeerConnection(peerId: string): RTCPeerConnection {
    const existing = this.peerConnections.get(peerId);
    if (existing && existing.signalingState !== 'closed') {
      return existing;
    }

    if (existing) {
      existing.close();
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peerConnections.set(peerId, pc);

    // 1. Add current local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        try {
          pc.addTrack(track, this.localStream!);
        } catch (err) {
          console.warn('[WebRTC] Track add error:', err);
        }
      });
    }

    // 2. ICE Candidate trickling
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.syncService.broadcast('WEBRTC_SIGNAL_ICE', {
          targetId: peerId,
          candidate: event.candidate.toJSON()
        });
      }
    };

    // 3. Track arrival from remote peer
    pc.ontrack = (event) => {
      console.log(`[WebRTC] Track received from peer ${peerId}:`, event.track.kind);
      let stream = this.remoteStreams.get(peerId);
      if (!stream) {
        stream = event.streams[0] || new MediaStream();
        this.remoteStreams.set(peerId, stream);
      }
      if (!stream.getTracks().includes(event.track)) {
        stream.addTrack(event.track);
      }
      this.callbacks.onRemoteStream(peerId, stream);
    };

    // 4. Connection State transitions
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState as PeerConnectionState;
      console.log(`[WebRTC] Peer ${peerId} connection state:`, state);
      this.callbacks.onPeerStateChange(peerId, state);

      if (state === 'failed') {
        // Attempt ICE restart if negotiation failed
        this.attemptIceRestart(peerId, pc);
      } else if (state === 'closed' || state === 'disconnected') {
        this.callbacks.onRemoteStreamRemoved(peerId);
      }
    };

    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      if (state === 'failed' || state === 'disconnected') {
        console.warn(`[WebRTC] ICE connection state: ${state} for peer ${peerId}`);
      }
    };

    return pc;
  }

  /**
   * Attempts ICE restart on transient network interruption
   */
  private async attemptIceRestart(peerId: string, pc: RTCPeerConnection): Promise<void> {
    try {
      if (pc.signalingState === 'closed') return;
      const offer = await pc.createOffer({ iceRestart: true });
      await pc.setLocalDescription(offer);
      this.syncService.broadcast('WEBRTC_SIGNAL_OFFER', {
        targetId: peerId,
        sdp: offer
      });
    } catch (err) {
      console.warn(`[WebRTC] ICE restart failed for ${peerId}:`, err);
    }
  }

  /**
   * Handles peer leaving the classroom
   */
  private handlePeerLeave(peerId: string): void {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }
    this.remoteStreams.delete(peerId);
    this.pendingIceCandidates.delete(peerId);
    this.callbacks.onRemoteStreamRemoved(peerId);
  }

  /**
   * Returns current active remote media stream for a given peer
   */
  public getRemoteStream(peerId: string): MediaStream | null {
    return this.remoteStreams.get(peerId) || null;
  }

  /**
   * Closes all peer connections and cleans up listeners
   */
  public destroy(): void {
    this.isDestroyed = true;

    // Broadcast leave notification
    try {
      this.syncService.broadcast('WEBRTC_SIGNAL_LEAVE', {
        participantId: this.localUserId
      });
    } catch (err) {
      // ignore
    }

    if (this.unsubscribeSync) {
      this.unsubscribeSync();
      this.unsubscribeSync = null;
    }

    this.peerConnections.forEach((pc) => {
      try {
        pc.close();
      } catch (e) {
        // ignore
      }
    });

    this.peerConnections.clear();
    this.remoteStreams.clear();
    this.pendingIceCandidates.clear();
  }
}
