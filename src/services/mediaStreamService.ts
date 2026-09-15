/**
 * WebRTC & Media Stream Service for Drafthands Live Classroom
 * Handles local camera/microphone acquisition, audio analysis (sound waves),
 * screen sharing streams, and fallback synthetic media streams.
 */

export class MediaStreamService {
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private isAudioMuted: boolean = false;
  private isVideoOff: boolean = false;
  private onAudioLevelCallback?: (level: number) => void;

  /**
   * Initializes local user media (camera + microphone)
   */
  public async initLocalMedia(options: { video?: boolean; audio?: boolean } = { video: true, audio: true }): Promise<MediaStream> {
    try {
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: options.video ? { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } } : false,
          audio: options.audio ? { echoCancellation: true, noiseSuppression: true, autoGainControl: true } : false
        });
        this.localStream = stream;
        this.setupAudioAnalysis(stream);
        return stream;
      }
    } catch (err) {
      console.warn('[MediaStreamService] Native camera/mic access not granted or iframe sandboxed. Using synthetic fallback stream:', err);
    }

    // Synthetic fallback stream (SVG/Canvas based video stream + silent audio)
    const syntheticStream = this.createSyntheticVideoStream('Drafthands Live Feed');
    this.localStream = syntheticStream;
    return syntheticStream;
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
   * Sets up Web Audio Analyser to calculate voice loudness (for speaking indicator)
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
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  /**
   * Creates an HTML5 canvas-generated video stream as a graceful fallback in sandboxed environments
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
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 640, 360);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 360);

      // Grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
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

      // Animated wave
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < 640; x += 10) {
        const y = 180 + Math.sin((x + frame * 4) * 0.03) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Label text
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.fillText(label, 320, 160);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('• 720p HD Technical Drawing Stream •', 320, 220);

      requestAnimationFrame(render);
    };
    render();

    const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : new MediaStream();
    return stream;
  }
}
