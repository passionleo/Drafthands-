import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  Pin, 
  PinOff,
  Pencil, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  GraduationCap,
  Maximize2,
  Volume2,
  Users,
  CheckCircle2,
  VolumeX,
  Radio,
  AlertTriangle,
  RotateCcw,
  Compass,
  Grid,
  Film,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Activity
} from 'lucide-react';
import { LiveParticipant, VideoLayoutMode } from '../../types/liveClass';
import { MediaStreamErrorDetails } from '../../services/mediaStreamService';
import { LiveMediaErrorBoundary } from '../common/LiveMediaErrorBoundary';
import africanStudentsImg from '../../assets/images/african_students_technical_drawing_1788361928984.jpg';
import africanCadLabImg from '../../assets/images/african_higher_inst_cad_lab_1788361956625.jpg';

interface VideoGridProps {
  participants: LiveParticipant[];
  localParticipantId: string;
  localStream: MediaStream | null;
  remoteStreams?: Record<string, MediaStream>;
  mediaError?: MediaStreamErrorDetails | null;
  onRetryMedia?: () => void;
  layoutMode: VideoLayoutMode;
  onToggleSpotlight: (id: string) => void;
  onToggleParticipantAudio?: (id: string) => void;
  onToggleParticipantDrawingPermission?: (id: string) => void;
  onMuteAllStudents?: () => void;
  onLowerAllHands?: () => void;
  isTeacher: boolean;
  activeTopicTitle?: string;
  onLayoutModeChange?: (mode: VideoLayoutMode) => void;
}

/**
 * Robust Individual Participant Video Stream Card
 * Seamlessly switches between live camera stream and high-fidelity fallback placeholder avatar.
 * Defensively guarded against missing streams, null objects, or playback rejections.
 */
export const ParticipantVideoTile: React.FC<{
  participant: LiveParticipant;
  isLocal: boolean;
  stream: MediaStream | null;
  isStage?: boolean;
  mediaError?: MediaStreamErrorDetails | null;
  onRetryMedia?: () => void;
  fallbackPhoto?: string;
  onTogglePin?: () => void;
  isPinned?: boolean;
  showControls?: boolean;
  isTeacher?: boolean;
  onToggleAudio?: () => void;
  onToggleDrawingPermission?: () => void;
}> = ({
  participant,
  isLocal,
  stream,
  isStage = false,
  mediaError,
  onRetryMedia,
  fallbackPhoto,
  onTogglePin,
  isPinned = false,
  showControls = true,
  isTeacher = false,
  onToggleAudio,
  onToggleDrawingPermission
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [playError, setPlayError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const videoEl = videoRef.current;

    if (!videoEl) return;

    if (stream && !participant?.isVideoOff) {
      try {
        const videoTracks = stream.getVideoTracks ? stream.getVideoTracks() : [];
        const hasLiveTrack = videoTracks.some(t => t && t.enabled && t.readyState === 'live');

        if (hasLiveTrack) {
          videoEl.srcObject = stream;
          videoEl.play()
            .then(() => {
              if (isMounted) {
                setIsVideoPlaying(true);
                setPlayError(null);
              }
            })
            .catch(err => {
              // Benign play rejection (e.g. autoplay policy, stream aborted)
              if (isMounted) {
                setIsVideoPlaying(false);
                setPlayError(err?.message || 'Playback deferred');
              }
            });
        } else {
          setIsVideoPlaying(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setIsVideoPlaying(false);
          setPlayError(err?.message || 'Media stream error');
        }
      }
    } else {
      try {
        if (videoEl.srcObject) {
          videoEl.srcObject = null;
        }
      } catch {
        // Safe no-op
      }
      setIsVideoPlaying(false);
    }

    return () => {
      isMounted = false;
    };
  }, [stream, participant?.isVideoOff]);

  const hasLiveVideoTrack = Boolean(
    stream && 
    stream.getVideoTracks && 
    stream.getVideoTracks().some(track => track && track.enabled && track.readyState === 'live')
  );
  const shouldRenderVideo = !participant?.isVideoOff && hasLiveVideoTrack && !playError;
  const isInstructor = participant?.role === 'TEACHER';

  return (
    <LiveMediaErrorBoundary 
      mode="tile" 
      participantName={participant?.name || 'Participant'}
      onRetry={onRetryMedia}
    >
      <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden rounded-2xl group border border-slate-800/80 transition-all duration-200">
        {/* 1. REAL LIVE WEBRTC OR LOCAL MEDIA STREAM */}
        {shouldRenderVideo && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLocal ? 'scale-x-[-1]' : ''
            } ${isVideoPlaying ? 'opacity-100' : 'opacity-80'}`}
          />
        )}

        {/* 2. HIGH-FIDELITY FALLBACK TECHNICAL DRAWING AVATAR */}
        {!shouldRenderVideo && (
          <div className="w-full h-full relative flex flex-col items-center justify-center p-3 select-none overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Subtle blueprint grid pattern background */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Ambient photo overlay with dark vignette */}
            {fallbackPhoto && !isLocal && (
              <div className="absolute inset-0 opacity-20 filter contrast-125 pointer-events-none">
                <img
                  src={fallbackPhoto}
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/80" />
              </div>
            )}

            {/* Central Animated Avatar Badge */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              {/* Pulsing speech ripple rings */}
              <div className="relative">
                {participant?.isSpeaking && (
                  <>
                    <span className="absolute -inset-2.5 rounded-full bg-emerald-500/25 animate-ping" />
                    <span className="absolute -inset-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
                  </>
                )}

                {/* Avatar Circle */}
                <div
                  className={`relative rounded-full flex items-center justify-center font-bold text-white shadow-2xl ring-2 transition-all ${
                    isStage ? 'w-16 h-16 text-xl' : 'w-12 h-12 text-sm'
                  } ${
                    participant?.isSpeaking 
                      ? 'ring-emerald-400 ring-offset-2 ring-offset-slate-950 shadow-emerald-500/40' 
                      : isInstructor 
                      ? 'ring-amber-400/60 shadow-amber-500/20' 
                      : 'ring-cyan-500/40 shadow-cyan-500/20'
                  }`}
                  style={{ backgroundColor: participant?.avatarBg || (isInstructor ? '#7c3aed' : '#0891b2') }}
                >
                  {(() => {
                    try {
                      const name = participant?.name || (isInstructor ? 'Technical Instructor' : 'Draftsman');
                      const parts = name.trim().split(/\s+/).filter(Boolean);
                      if (parts.length === 0) return isInstructor ? 'TD' : 'ST';
                      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                    } catch {
                      return isInstructor ? 'TD' : 'ST';
                    }
                  })()}

                  {/* Sub-badge: Crown or Compass icon */}
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-slate-700 shadow-md">
                    {isInstructor ? (
                      <Crown className="w-3 h-3 text-amber-400" />
                    ) : (
                      <Compass className="w-3 h-3 text-cyan-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Status Feedback Label */}
              <div className="flex flex-col items-center gap-1 text-center">
                {isLocal && mediaError ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono">
                      <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                      <span>{mediaError.code === 'PERMISSION_DENIED' ? 'Camera Blocked' : 'Camera Unavailable'}</span>
                    </span>
                    {onRetryMedia && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRetryMedia();
                        }}
                        className="mt-0.5 flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-semibold transition-colors shadow-sm"
                        title="Retry camera media initialization"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Retry Camera</span>
                      </button>
                    )}
                  </div>
                ) : participant?.isVideoOff ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <VideoOff className="w-3 h-3 text-slate-500" />
                    <span>Camera Paused</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>Connecting Stream...</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. TOP OVERLAY: ROLE, PIN BUTTON & QUICK CONTROLS */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1.5">
            {isInstructor ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/90 text-slate-950 font-bold text-[10px] shadow-md backdrop-blur-sm">
                <Crown className="w-3 h-3" />
                <span>Instructor</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/80 text-slate-300 border border-slate-700/60 text-[10px] font-mono backdrop-blur-sm">
                <GraduationCap className="w-3 h-3 text-cyan-400" />
                <span>{participant?.gradeOrClass || 'SS2 Technical'}</span>
              </span>
            )}

            {participant?.hasDrawingPermission && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold backdrop-blur-sm">
                <Pencil className="w-2.5 h-2.5" />
                <span>Draw</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            {/* Active Live Reaction Bubble */}
            {participant?.activeReaction && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/95 border border-pink-500/50 shadow-xl text-base animate-bounce backdrop-blur-md">
                <span>{participant.activeReaction.emoji}</span>
              </div>
            )}

            {/* Hand Raised badge */}
            {participant?.isHandRaised && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] animate-bounce shadow-md shadow-amber-500/40">
                <Hand className="w-3 h-3" />
                <span>Raised Hand</span>
              </div>
            )}

            {/* Pin / Spotlight button */}
            {onTogglePin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin();
                }}
                className={`p-1.5 rounded-lg transition-all backdrop-blur-md ${
                  isPinned
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 opacity-0 group-hover:opacity-100'
                }`}
                title={isPinned ? 'Unpin from Stage' : 'Pin to Active Speaker Stage'}
              >
                {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* 4. BOTTOM OVERLAY: NAME, MIC STATUS & EQUALIZER */}
        <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`p-1 rounded-md ${participant?.isAudioMuted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {participant?.isAudioMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            </div>
            <span className="text-xs font-semibold text-white truncate max-w-[130px] sm:max-w-[180px]">
              {participant?.name || 'Participant'} {isLocal ? '(You)' : ''}
            </span>
          </div>

          {/* Equalizer animation when speaking */}
          {!participant?.isAudioMuted && (
            <div className="flex items-center gap-0.5 bg-slate-950/70 px-1.5 py-1 rounded-md border border-slate-800/80">
              <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${participant?.isSpeaking ? 'h-3 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${participant?.isSpeaking ? 'h-4.5 animate-pulse' : 'h-1.5'}`} />
              <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${participant?.isSpeaking ? 'h-3.5 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${participant?.isSpeaking ? 'h-2 animate-pulse' : 'h-1'}`} />
            </div>
          )}

          {/* Teacher quick actions */}
          {isTeacher && !isLocal && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              {onToggleAudio && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAudio();
                  }}
                  className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                  title={participant?.isAudioMuted ? 'Unmute Student' : 'Mute Student'}
                >
                  {participant?.isAudioMuted ? <Mic className="w-3 h-3 text-emerald-400" /> : <MicOff className="w-3 h-3 text-red-400" />}
                </button>
              )}
              {onToggleDrawingPermission && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDrawingPermission();
                  }}
                  className={`p-1 rounded transition-colors ${
                    participant?.hasDrawingPermission 
                      ? 'bg-cyan-500 text-slate-950 font-bold' 
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                  title={participant?.hasDrawingPermission ? 'Revoke drawing permission' : 'Grant drawing permission'}
                >
                  <Pencil className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </LiveMediaErrorBoundary>
  );
};

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants = [],
  localParticipantId,
  localStream,
  remoteStreams = {},
  mediaError,
  onRetryMedia,
  layoutMode,
  onToggleSpotlight,
  onToggleParticipantAudio,
  onToggleParticipantDrawingPermission,
  onMuteAllStudents,
  onLowerAllHands,
  isTeacher,
  activeTopicTitle,
  onLayoutModeChange
}) => {
  // Defensive list check
  const safeParticipants = Array.isArray(participants) ? participants : [];

  // Internal view preference: 'ACTIVE_SPEAKER' or 'GRID'
  const [internalMode, setInternalMode] = useState<'ACTIVE_SPEAKER' | 'GRID'>(() => {
    return layoutMode === 'GRID' || layoutMode === 'GALLERY_FOCUS' ? 'GRID' : 'ACTIVE_SPEAKER';
  });

  // Keep internalMode in sync if external layoutMode changes to GRID
  useEffect(() => {
    if (layoutMode === 'GRID') {
      setInternalMode('GRID');
    } else if (layoutMode === 'ACTIVE_SPEAKER' || layoutMode === 'SPLIT_STAGE' || layoutMode === 'SPLIT_EQUAL' || layoutMode === 'SPLIT_SIDEBAR') {
      setInternalMode('ACTIVE_SPEAKER');
    }
  }, [layoutMode]);

  // Track user-pinned participant ID
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);

  // Thumbnail strip scroll ref
  const stripScrollRef = useRef<HTMLDivElement>(null);

  // Find active speaker or fallback
  const activeSpeaker = useMemo(() => {
    if (pinnedParticipantId) {
      const pinned = safeParticipants.find(p => p.id === pinnedParticipantId);
      if (pinned) return pinned;
    }
    // Spotlighted participant
    const spotlighted = safeParticipants.find(p => p.isSpotlighted);
    if (spotlighted) return spotlighted;
    // Current speaker
    const speaker = safeParticipants.find(p => p.isSpeaking && !p.isAudioMuted);
    if (speaker) return speaker;
    // Teacher
    const teacher = safeParticipants.find(p => p.role === 'TEACHER');
    if (teacher) return teacher;
    // Default to first
    return safeParticipants[0] || null;
  }, [safeParticipants, pinnedParticipantId]);

  // Thumbnail strip participants (everyone except the active speaker on stage)
  const thumbnailParticipants = useMemo(() => {
    if (!activeSpeaker) return safeParticipants;
    return safeParticipants.filter(p => p.id !== activeSpeaker.id);
  }, [safeParticipants, activeSpeaker]);

  const handsRaisedCount = useMemo(() => {
    return safeParticipants.filter(p => p.isHandRaised).length;
  }, [safeParticipants]);

  // Fallback photo map
  const studentPhotoMap: Record<string, string> = {
    'student-1': africanStudentsImg,
    'student-2': africanStudentsImg,
    'student-3': africanCadLabImg,
    'student-4': africanStudentsImg
  };

  const handleScrollStrip = (direction: 'left' | 'right') => {
    if (stripScrollRef.current) {
      const delta = direction === 'left' ? -220 : 220;
      stripScrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  return (
    <LiveMediaErrorBoundary mode="grid" onRetry={onRetryMedia}>
      <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-2 sm:p-3 space-y-3 select-none overflow-hidden">
        {/* ================= TOP CONTROLS & SUB-HEADER ================= */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Participants ({safeParticipants.length})</span>
            </span>

            {handsRaisedCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold animate-pulse">
                <Hand className="w-3 h-3 text-amber-400" />
                <span>{handsRaisedCount} Raised</span>
              </span>
            )}
          </div>

          {/* Quick View Switcher: Active Speaker vs Grid View */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setInternalMode('ACTIVE_SPEAKER');
                  if (onLayoutModeChange) onLayoutModeChange('ACTIVE_SPEAKER');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  internalMode === 'ACTIVE_SPEAKER'
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Active Speaker Stage with Filmstrip Strip (Google Meet Layout)"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Speaker View</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInternalMode('GRID');
                  if (onLayoutModeChange) onLayoutModeChange('GRID');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  internalMode === 'GRID'
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Equal Participant Video Grid"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid View</span>
              </button>
            </div>

            {/* Teacher batch actions */}
            {isTeacher && (
              <div className="flex items-center gap-1">
                {onMuteAllStudents && (
                  <button
                    type="button"
                    onClick={onMuteAllStudents}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1 transition-colors border border-slate-800"
                    title="Mute all students"
                  >
                    <VolumeX className="w-3 h-3 text-red-400" />
                    <span className="hidden md:inline">Mute All</span>
                  </button>
                )}
                {onLowerAllHands && handsRaisedCount > 0 && (
                  <button
                    type="button"
                    onClick={onLowerAllHands}
                    className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1 transition-colors border border-amber-500/40"
                    title="Lower all hands"
                  >
                    <Hand className="w-3 h-3" />
                    <span className="hidden md:inline">Clear Hands</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= LAYOUT 1: ACTIVE SPEAKER + THUMBNAIL STRIP ================= */}
        {internalMode === 'ACTIVE_SPEAKER' && (
          <div className="flex-1 flex flex-col min-h-0 space-y-2.5 overflow-hidden">
            {/* Primary Active Speaker Stage */}
            {activeSpeaker && (
              <div className="flex-1 min-h-[220px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/50">
                <ParticipantVideoTile
                  participant={activeSpeaker}
                  isLocal={activeSpeaker.id === localParticipantId}
                  stream={activeSpeaker.id === localParticipantId ? localStream : remoteStreams[activeSpeaker.id] || null}
                  isStage={true}
                  mediaError={activeSpeaker.id === localParticipantId ? mediaError : null}
                  onRetryMedia={onRetryMedia}
                  fallbackPhoto={activeSpeaker.role === 'TEACHER' ? africanCadLabImg : studentPhotoMap[activeSpeaker.id]}
                  onTogglePin={() => {
                    setPinnedParticipantId(prev => prev === activeSpeaker.id ? null : activeSpeaker.id);
                  }}
                  isPinned={pinnedParticipantId === activeSpeaker.id}
                  isTeacher={isTeacher}
                  onToggleAudio={onToggleParticipantAudio ? () => onToggleParticipantAudio(activeSpeaker.id) : undefined}
                  onToggleDrawingPermission={onToggleParticipantDrawingPermission ? () => onToggleParticipantDrawingPermission(activeSpeaker.id) : undefined}
                />
              </div>
            )}

            {/* Bottom Horizontal Thumbnail Strip (Google Meet Style) */}
            {thumbnailParticipants.length > 0 && (
              <div className="h-28 sm:h-32 shrink-0 relative flex items-center group">
                {/* Scroll left button */}
                <button
                  type="button"
                  onClick={() => handleScrollStrip('left')}
                  className="absolute left-1 z-30 p-1.5 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-800"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Filmstrip container */}
                <div
                  ref={stripScrollRef}
                  className="w-full h-full flex items-center gap-2 overflow-x-auto scrollbar-none px-1 py-0.5 scroll-smooth"
                >
                  {thumbnailParticipants.map((participant) => {
                    const isLocal = participant.id === localParticipantId;
                    const peerStream = isLocal ? localStream : remoteStreams[participant.id] || null;

                    return (
                      <div
                        key={participant.id}
                        className="h-full w-40 sm:w-48 shrink-0 relative rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-cyan-400 transition-all"
                        onClick={() => setPinnedParticipantId(participant.id)}
                        title={`Click to focus on ${participant.name}`}
                      >
                        <ParticipantVideoTile
                          participant={participant}
                          isLocal={isLocal}
                          stream={peerStream}
                          isStage={false}
                          mediaError={isLocal ? mediaError : null}
                          onRetryMedia={onRetryMedia}
                          fallbackPhoto={participant.role === 'TEACHER' ? africanCadLabImg : studentPhotoMap[participant.id]}
                          onTogglePin={() => setPinnedParticipantId(participant.id)}
                          isPinned={pinnedParticipantId === participant.id}
                          isTeacher={isTeacher}
                          onToggleAudio={onToggleParticipantAudio ? () => onToggleParticipantAudio(participant.id) : undefined}
                          onToggleDrawingPermission={onToggleParticipantDrawingPermission ? () => onToggleParticipantDrawingPermission(participant.id) : undefined}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Scroll right button */}
                <button
                  type="button"
                  onClick={() => handleScrollStrip('right')}
                  className="absolute right-1 z-30 p-1.5 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-800"
                  title="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= LAYOUT 2: RESPONSIVE TILE GRID ================= */}
        {internalMode === 'GRID' && (
          <div className="flex-1 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-800">
            <div className={`grid gap-2.5 h-full ${
              safeParticipants.length === 1
                ? 'grid-cols-1'
                : safeParticipants.length <= 4
                ? 'grid-cols-1 sm:grid-cols-2 auto-rows-fr'
                : 'grid-cols-2 md:grid-cols-3 auto-rows-fr'
            }`}>
              {safeParticipants.map((participant) => {
                const isLocal = participant.id === localParticipantId;
                const peerStream = isLocal ? localStream : remoteStreams[participant.id] || null;

                return (
                  <div
                    key={participant.id}
                    className="relative min-h-[160px] sm:min-h-[180px] rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 shadow-lg transition-all"
                  >
                    <ParticipantVideoTile
                      participant={participant}
                      isLocal={isLocal}
                      stream={peerStream}
                      isStage={false}
                      mediaError={isLocal ? mediaError : null}
                      onRetryMedia={onRetryMedia}
                      fallbackPhoto={participant.role === 'TEACHER' ? africanCadLabImg : studentPhotoMap[participant.id]}
                      onTogglePin={() => {
                        setPinnedParticipantId(participant.id);
                        setInternalMode('ACTIVE_SPEAKER');
                      }}
                      isPinned={pinnedParticipantId === participant.id}
                      isTeacher={isTeacher}
                      onToggleAudio={onToggleParticipantAudio ? () => onToggleParticipantAudio(participant.id) : undefined}
                      onToggleDrawingPermission={onToggleParticipantDrawingPermission ? () => onToggleParticipantDrawingPermission(participant.id) : undefined}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </LiveMediaErrorBoundary>
  );
};
