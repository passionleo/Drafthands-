/**
 * WebRTC & Media Stream Service for Drafthands Live Classroom
 * Handles local camera/microphone acquisition, robust error handling for getUserMedia,
 * multi-stage progressive degradation, audio loudness analysis, and synthetic fallback streams.
 */

export type MediaStreamErrorCode = 
  | 'PERMISSION_DENIED'
  | 'DEVICE_NOT_FOUND'
  | 'HARDWARE_IN_USE'
  | 'CONSTRAINTS_FAILED'
  | 'SECURITY_ERROR'
  | 'UNSUPPORTED'
  | 'UNKNOWN_ERROR';

export interface MediaStreamErrorDetails {
  code: MediaStreamErrorCode;
  message: string;
  recommendedAction: string;
  isCameraBlocked: boolean;
  isHardwareMissing: boolean;
  timestamp: number;
}

export class MediaStreamService {
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private isAudioMuted: boolean = false;
  private isVideoOff: boolean = false;
  private isSyntheticStreamActive: boolean = false;
  private lastError: MediaStreamErrorDetails | null = null;
  private onAudioLevelCallback?: (level: number) => void;
  private onErrorCallback?: (err: MediaStreamErrorDetails) => void;

  /**
   * Initializes local user media (camera + microphone) with multi-stage fallback
   */
  public async initLocalMedia(
    options: { video?: boolean; audio?: boolean } = { video: true, audio: true }
  ): Promise<MediaStream> {
    this.lastError = null;
    this.isSyntheticStreamActive = false;

    // Check environment support
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      const errDetails: MediaStreamErrorDetails = {
        code: 'UNSUPPORTED',
        message: 'WebRTC media devices API is not supported in this browser context.',
        recommendedAction: 'Please open Drafthands in a modern browser (Chrome, Edge, Firefox, or Safari).',
        isCameraBlocked: false,
        isHardwareMissing: true,
        timestamp: Date.now()
      };
      this.lastError = errDetails;
      if (this.onErrorCallback) this.onErrorCallback(errDetails);
      return this.createFallbackSyntheticStream('Technical Drawing Audio/Visual Node');
    }

    const wantVideo = options.video ?? true;
    const wantAudio = options.audio ?? true;

    // STAGE 1: Attempt High-Definition 720p with noise suppression and echo cancellation
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: wantVideo ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: wantAudio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      });

      this.localStream = stream;
      this.setupAudioAnalysis(stream);
      return stream;
    } catch (err: any) {
      console.warn('[MediaStreamService] Stage 1 (HD Video/Audio) attempt failed:', err.name || err.message);

      // Handle specific browser error cases
      const errorDetails = this.classifyMediaError(err);

      // STAGE 2: If overconstrained, retry with relaxed standard constraints
      if (errorDetails.code === 'CONSTRAINTS_FAILED' || err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: wantVideo,
            audio: wantAudio
          });
          this.localStream = stream;
          this.setupAudioAnalysis(stream);
          return stream;
        } catch (stage2Err: any) {
          console.warn('[MediaStreamService] Stage 2 (Relaxed constraints) attempt failed:', stage2Err);
        }
      }

      // STAGE 3: If video failed (hardware busy, missing camera, or video blocked), attempt Audio-Only
      if (wantAudio && (errorDetails.code === 'DEVICE_NOT_FOUND' || errorDetails.code === 'HARDWARE_IN_USE' || wantVideo)) {
        try {
          console.info('[MediaStreamService] Attempting Stage 3 (Audio-Only with Synthetic Video Canvas)...');
          const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
              echoCancellation: true,
              noiseSuppression: true
            }
          });

          // Combine real microphone audio track with high-clarity synthetic drawing canvas video track
          const canvasStream = this.createSyntheticVideoStream('Microphone Active (Camera Standby)');
          const combinedStream = new MediaStream();
          audioOnlyStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
          canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

          this.localStream = combinedStream;
          this.setupAudioAnalysis(combinedStream);
          this.lastError = {
            ...errorDetails,
            message: 'Camera unavailable. Live microphone audio connected with technical placeholder.',
            recommendedAction: 'Your audio is working. You can plug in a webcam or allow camera access anytime.'
          };
          if (this.onErrorCallback) this.onErrorCallback(this.lastError);
          return combinedStream;
        } catch (stage3Err: any) {
          console.warn('[MediaStreamService] Stage 3 (Audio-only) attempt failed:', stage3Err);
        }
      }

      // STAGE 4: Full graceful synthetic stream fallback
      this.lastError = errorDetails;
      if (this.onErrorCallback) this.onErrorCallback(errorDetails);
      return this.createFallbackSyntheticStream('Technical Drawing Stream (Offline Camera)');
    }
  }

  /**
   * Classifies standard WebRTC getUserMedia errors into actionable user states
   */
  private classifyMediaError(err: any): MediaStreamErrorDetails {
    const name = err?.name || '';
    const message = err?.message || String(err);

    if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || message.includes('denied') || message.includes('dismissed')) {
      return {
        code: 'PERMISSION_DENIED',
        message: 'Camera or microphone permission was blocked or denied by browser.',
        recommendedAction: 'Click the camera/lock icon in your browser URL address bar to enable camera access, then click "Retry Camera".',
        isCameraBlocked: true,
        isHardwareMissing: false,
        timestamp: Date.now()
      };
    }

    if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || message.includes('not found')) {
      return {
        code: 'DEVICE_NOT_FOUND',
        message: 'No physical webcam or microphone detected on this computer.',
        recommendedAction: 'Check that your webcam or headset is plugged into your device and enabled.',
        isCameraBlocked: false,
        isHardwareMissing: true,
        timestamp: Date.now()
      };
    }

    if (name === 'NotReadableError' || name === 'TrackStartError' || message.includes('in use') || message.includes('busy')) {
      return {
        code: 'HARDWARE_IN_USE',
        message: 'Your webcam is currently locked or in use by another software (Zoom, Teams, or another tab).',
        recommendedAction: 'Close other video conference applications and click "Retry Camera".',
        isCameraBlocked: false,
        isHardwareMissing: false,
        timestamp: Date.now()
      };
    }

    if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
      return {
        code: 'CONSTRAINTS_FAILED',
        message: 'The requested 720p HD resolution was not supported by your camera hardware.',
        recommendedAction: 'Switching automatically to basic webcam resolution.',
        isCameraBlocked: false,
        isHardwareMissing: false,
        timestamp: Date.now()
      };
    }

    if (name === 'SecurityError') {
      return {
        code: 'SECURITY_ERROR',
        message: 'Camera and microphone access is restricted inside this embedded preview iframe.',
        recommendedAction: 'Open Drafthands in a new browser tab for direct hardware camera permissions.',
        isCameraBlocked: true,
        isHardwareMissing: false,
        timestamp: Date.now()
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: message || 'Unable to start camera video stream.',
      recommendedAction: 'Check your browser media settings and click "Retry Camera".',
      isCameraBlocked: false,
      isHardwareMissing: false,
      timestamp: Date.now()
    };
  }

  /**
   * Retries local media acquisition
   */
  public async retryLocalMedia(options: { video?: boolean; audio?: boolean } = { video: true, audio: true }): Promise<MediaStream> {
    this.cleanup();
    return this.initLocalMedia(options);
  }

  /**
   * Starts screen sharing stream
   */
  public async startScreenShare(): Promise<MediaStream | null> {
    try {
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function') {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' } as any,
          audio: false
        });
        this.screenStream = stream;
        return stream;
      }
    } catch (err) {
      console.warn('[MediaStreamService] Screen sharing canceled or unavailable:', err);
    }
    return null;
  }

  /**
   * Stops screen share
   */
  public stopScreenShare(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
  }

  /**
   * Sets up Web Audio Analyser to calculate voice loudness
   */
  private setupAudioAnalysis(stream: MediaStream) {
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 64;
      this.audioSource = this.audioContext.createMediaStreamSource(stream);
      this.audioSource.connect(this.analyserNode);

      const bufferLength = this.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!this.analyserNode || this.isAudioMuted) {
          if (this.onAudioLevelCallback) this.onAudioLevelCallback(0);
          this.animationFrameId = requestAnimationFrame(checkAudioLevel);
          return;
        }

        this.analyserNode.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(1, Math.max(0, avg / 128));

        if (this.onAudioLevelCallback) {
          this.onAudioLevelCallback(normalized);
        }

        this.animationFrameId = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (e) {
      console.warn('Audio analyser setup skipped:', e);
    }
  }

  public onAudioLevel(cb: (level: number) => void): void {
    this.onAudioLevelCallback = cb;
  }

  public onError(cb: (err: MediaStreamErrorDetails) => void): void {
    this.onErrorCallback = cb;
  }

  public getLastError(): MediaStreamErrorDetails | null {
    return this.lastError;
  }

  public isSynthetic(): boolean {
    return this.isSyntheticStreamActive;
  }

  /**
   * Toggles microphone audio track
   */
  public setAudioMute(muted: boolean): boolean {
    this.isAudioMuted = muted;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
    return this.isAudioMuted;
  }

  /**
   * Toggles camera video track
   */
  public setVideoOff(off: boolean): boolean {
    this.isVideoOff = off;
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = !off;
      });
    }
    return this.isVideoOff;
  }

  /**
   * Cleans up media stream tracks and AudioContext
   */
  public cleanup(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {
        // ignore
      }
      this.audioContext = null;
    }
  }

  /**
   * Creates a fallback synthetic stream with canvas animation
   */
  private createFallbackSyntheticStream(label: string): MediaStream {
    this.isSyntheticStreamActive = true;
    const syntheticStream = this.createSyntheticVideoStream(label);
    this.localStream = syntheticStream;
    return syntheticStream;
  }

  /**
   * Creates an HTML5 canvas-generated video stream as a graceful fallback
   */
  private createSyntheticVideoStream(label: string): MediaStream {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    let frame = 0;
    const render = () => {
      if (!ctx) return;
      frame++;

      // Background gradient: Dark slate with technical blueprint mood
      const grad = ctx.createLinearGradient(0, 0, 640, 360);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 360);

      // Grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 360);
        ctx.stroke();
      }
      for (let y = 0; y < 360; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
      }

      // Isometric 30-60 reference guide lines
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.beginPath();
      ctx.moveTo(0, 180);
      ctx.lineTo(640, 180);
      ctx.stroke();

      // Animated technical sine wave
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < 640; x += 10) {
        const y = 180 + Math.sin((x + frame * 3) * 0.03) * 16;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Label text
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(label, 320, 150);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('• Drafthands Live Classroom Stream •', 320, 220);

      requestAnimationFrame(render);
    };
    render();

    const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : new MediaStream();
    return stream;
  }
}
