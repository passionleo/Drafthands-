/**
 * Real-Time Canvas & Live Classroom Synchronization Engine for Drafthands
 * Supports BroadcastChannel, cross-tab storage events, and WebSocket pipelines
 * with idempotent message handling, full state reconciliation, and optimistic updates.
 */

import { LiveSyncMessage, LiveSyncEventType } from '../types/liveClass';

export type LiveSyncListener = (message: LiveSyncMessage) => void;

export class LiveClassSyncService {
  private roomCode: string;
  private userId: string;
  private userName: string;
  private broadcastChannel: BroadcastChannel | null = null;
  private ws: WebSocket | null = null;
  private listeners: Set<LiveSyncListener> = new Set();
  private processedMessageIds: Set<string> = new Set();
  private maxHistorySize: number = 300;
  private storageListener: ((e: StorageEvent) => void) | null = null;
  private isDestroyed: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageQueue: string[] = [];

  constructor(roomCode: string, userId: string, userName: string) {
    this.roomCode = roomCode;
    this.userId = userId;
    this.userName = userName;
    this.initBroadcastChannel();
    this.initStorageFallback();
    this.initWebSocket();
  }

  /**
   * Initializes local cross-tab / multi-window broadcast channel
   */
  private initBroadcastChannel(): void {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel(`drafthands_live_${this.roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingMessage(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization fallback:', err);
      }
    }
  }

  /**
   * Cross-window storage event fallback for multi-tab testing
   */
  private initStorageFallback(): void {
    if (typeof window !== 'undefined') {
      this.storageListener = (e: StorageEvent) => {
        if (e.key === `drafthands_signal_${this.roomCode}` && e.newValue) {
          try {
            const msg: LiveSyncMessage = JSON.parse(e.newValue);
            this.handleIncomingMessage(msg);
          } catch (err) {
            // ignore
          }
        }
      };
      window.addEventListener('storage', this.storageListener);
    }
  }

  /**
   * Initializes WebSocket connection with automatic reconnection and queueing
   */
  private initWebSocket(): void {
    if (this.isDestroyed) return;
    try {
      if (typeof window === 'undefined' || !window.location) return;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live/${this.roomCode}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (this.isDestroyed) {
          ws.close();
          return;
        }
        console.log(`[LiveSync] Connected to real-time live classroom: ${this.roomCode}`);
        this.ws = ws;

        // Flush any buffered messages
        while (this.messageQueue.length > 0 && ws.readyState === WebSocket.OPEN) {
          const item = this.messageQueue.shift();
          if (item) {
            try {
              ws.send(item);
            } catch {}
          }
        }

        // Announce presence and request latest board state
        this.broadcast('PARTICIPANT_JOIN', { userId: this.userId, userName: this.userName });
        this.broadcast('REQUEST_FULL_SYNC', { userId: this.userId });
      };

      ws.onmessage = (evt) => {
        try {
          const msg: LiveSyncMessage = JSON.parse(evt.data);
          this.handleIncomingMessage(msg);
        } catch (e) {
          // ignore malformed ws packet
        }
      };

      ws.onerror = () => {
        // Silently fallback to reconnect
      };

      ws.onclose = () => {
        this.ws = null;
        if (!this.isDestroyed) {
          if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => {
            this.initWebSocket();
          }, 2500);
        }
      };

      this.ws = ws;
    } catch (e) {
      // WS fallback
    }
  }

  /**
   * Handles incoming message with idempotency check
   */
  private handleIncomingMessage(msg: LiveSyncMessage): void {
    if (!msg || !msg.id || msg.roomCode !== this.roomCode) return;
    if (msg.senderId === this.userId) return; // ignore our own reflections

    if (this.processedMessageIds.has(msg.id)) {
      return; // Deduplicate
    }

    this.processedMessageIds.add(msg.id);
    if (this.processedMessageIds.size > this.maxHistorySize) {
      const firstKey = this.processedMessageIds.values().next().value;
      if (firstKey) this.processedMessageIds.delete(firstKey);
    }

    // Notify registered listeners
    this.listeners.forEach(listener => {
      try {
        listener(msg);
      } catch (err) {
        console.error('[LiveSync] Listener execution error:', err);
      }
    });
  }

  /**
   * Broadcasts a real-time event across all channels
   */
  public broadcast(type: LiveSyncEventType, payload: any): void {
    const msg: LiveSyncMessage = {
      id: `${this.userId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      roomCode: this.roomCode,
      senderId: this.userId,
      senderName: this.userName,
      type,
      payload,
      timestamp: Date.now()
    };

    // 1. Post to BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (err) {
        console.warn('BroadcastChannel postMessage error:', err);
      }
    }

    // 2. Post to StorageEvent fallback
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`drafthands_signal_${this.roomCode}`, JSON.stringify(msg));
      } catch (err) {
        // ignore quota errors
      }
    }

    // 3. Send over WebSocket if connected, otherwise buffer in queue
    const serialized = JSON.stringify(msg);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(serialized);
      } catch (err) {
        console.warn('WebSocket send error:', err);
      }
    } else {
      if (this.messageQueue.length < 100) {
        this.messageQueue.push(serialized);
      }
    }
  }

  /**
   * Subscribes to live sync events
   */
  public subscribe(listener: LiveSyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Cleans up all connections and channels
   */
  public destroy(): void {
    this.isDestroyed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageQueue = [];
    this.listeners.clear();
    this.processedMessageIds.clear();
  }
}
