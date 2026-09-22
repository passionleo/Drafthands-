import React, { useEffect, useRef, useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  Pin, 
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
  Compass
} from 'lucide-react';
import { LiveParticipant, VideoLayoutMode } from '../../types/liveClass';
import { MediaStreamErrorDetails } from '../../services/mediaStreamService';
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
}

/**
 * Robust Individual Participant Video Stream Card
 * Seamlessly switches between live camera stream and high-fidelity fallback placeholder avatar
 */
const ParticipantVideoTile: React.FC<{
  participant: LiveParticipant;
  isLocal: boolean;
  stream: MediaStream | null;
  isStage: boolean;
  mediaError?: MediaStreamErrorDetails | null;
  onRetryMedia?: () => void;
  fallbackPhoto?: string;
}> = ({
  participant,
  isLocal,
  stream,
  isStage,
  mediaError,
  onRetryMedia,
  fallbackPhoto
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const videoEl = videoRef.current;

    if (videoEl && stream && !participant.isVideoOff) {
      videoEl.srcObject = stream;
      videoEl.play()
        .then(() => {
          if (isMounted) setIsVideoPlaying(true);
        })
        .catch(err => {
          console.warn('[VideoGrid] Stream play prevented or deferred:', err);
          if (isMounted) setIsVideoPlaying(false);
        });
    } else {
      setIsVideoPlaying(false);
    }

    return () => {
      isMounted = false;
    };
  }, [stream, participant.isVideoOff]);

  const hasLiveVideoTrack = Boolean(
    stream && stream.getVideoTracks().some(track => track.enabled && track.readyState === 'live')
  );
  const shouldRenderVideo = !participant.isVideoOff && hasLiveVideoTrack;
  const isInstructor = participant.role === 'TEACHER';

  return (
    <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
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

      {/* 2. HIGH-FIDELITY FALLBACK PLACEHOLDER AVATAR */}
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

          {/* Fallback ambient photo overlay with high dark vignette */}
          {fallbackPhoto && !isLocal && (
            <div className="absolute inset-0 opacity-20 filter contrast-125">
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
              {participant.isSpeaking && (
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
                  participant.isSpeaking 
                    ? 'ring-emerald-400 ring-offset-2 ring-offset-slate-950 shadow-emerald-500/40' 
                    : isInstructor 
                    ? 'ring-amber-400/60 shadow-amber-500/20' 
                    : 'ring-cyan-500/40 shadow-cyan-500/20'
                }`}
                style={{ backgroundColor: participant.avatarBg || (isInstructor ? '#7c3aed' : '#0891b2') }}
              >
                {participant.name
                  .split(' ')
                  .map(part => part[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || (isInstructor ? 'TD' : 'ST')}

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
              ) : participant.isVideoOff ? (
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
    </div>
  );
};

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
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
  activeTopicTitle
}) => {
  // Separate Teacher(s) from Students
  const teacher = participants.find(p => p.role === 'TEACHER') || participants[0];
  const students = participants.filter(p => p.id !== teacher?.id);
  const handsRaisedCount = students.filter(s => s.isHandRaised).length;

  // Student fallback photo avatars map
  const studentPhotoMap: Record<string, string> = {
    'student-1': africanStudentsImg,
    'student-2': africanStudentsImg,
    'student-3': africanCadLabImg,
    'student-4': africanStudentsImg
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-3 space-y-4 select-none scrollbar-thin scrollbar-thumb-slate-800">
      {/* ================= 1. TEACHER / INSTRUCTOR PODIUM (TOP SECTION) ================= */}
      {teacher && (
        <div className="space-y-1.5 shrink-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-mono">
                Instructor Podium
              </span>
            </div>
            {isTeacher && onMuteAllStudents && (
              <div className="flex items-center gap-1">
                <button
                  onClick={onMuteAllStudents}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1 transition-colors border border-slate-700"
                  title="Mute all students in class"
                >
                  <VolumeX className="w-2.5 h-2.5 text-red-400" />
                  <span>Mute All</span>
                </button>
                {onLowerAllHands && handsRaisedCount > 0 && (
                  <button
                    onClick={onLowerAllHands}
                    className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-[10px] text-amber-300 flex items-center gap-1 transition-colors border border-amber-500/40"
                    title="Lower all student hands"
                  >
                    <Hand className="w-2.5 h-2.5" />
                    <span>Clear Hands</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Teacher Spotlight Stage Tile */}
          <div
            id={`video-tile-${teacher.id}`}
            className={`relative rounded-2xl overflow-hidden bg-slate-900 border transition-all duration-200 group flex flex-col justify-between ${
              teacher.isSpeaking
                ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                : 'border-amber-500/40 hover:border-amber-400'
            } ${
              layoutMode === 'SPLIT_STAGE' ? 'h-64 sm:h-72' : layoutMode === 'SPLIT_EQUAL' ? 'h-48 sm:h-52' : 'h-44'
            }`}
          >
            {/* Live Video or Fallback Avatar Tile */}
            <ParticipantVideoTile
              participant={teacher}
              isLocal={teacher.id === localParticipantId}
              stream={teacher.id === localParticipantId ? localStream : remoteStreams[teacher.id] || null}
              isStage={true}
              mediaError={teacher.id === localParticipantId ? mediaError : null}
              onRetryMedia={onRetryMedia}
              fallbackPhoto={africanCadLabImg}
            />

            {/* Top Bar: Role Pill & Status */}
            <div className="relative z-10 p-2.5 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/90 text-slate-950 font-bold text-[10px] shadow-md">
                  <Crown className="w-3 h-3" />
                  Instructor
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-slate-700/60">
                  HD 1080p
                </span>
              </div>

              {activeTopicTitle && (
                <span className="hidden sm:inline px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] text-slate-300 border border-slate-700/60 truncate max-w-[140px]">
                  {activeTopicTitle}
                </span>
              )}
            </div>

            {/* Bottom Bar: Teacher Identity & Equalizer */}
            <div className="relative z-10 p-2.5 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${teacher.isAudioMuted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {teacher.isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {teacher.name} {teacher.id === localParticipantId ? '(You)' : ''}
                  </h4>
                  <span className="text-[10px] text-slate-400">Technical Drawing Instructor</span>
                </div>
              </div>

              {/* Speech Equalizer Animation */}
              {!teacher.isAudioMuted && (
                <div className="flex items-center gap-0.5 bg-slate-950/70 px-2 py-1 rounded-lg border border-slate-800">
                  <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${teacher.isSpeaking ? 'h-3.5 animate-pulse' : 'h-1.5'}`} />
                  <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${teacher.isSpeaking ? 'h-5 animate-pulse' : 'h-2'}`} />
                  <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${teacher.isSpeaking ? 'h-4 animate-pulse' : 'h-1'}`} />
                  <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${teacher.isSpeaking ? 'h-2.5 animate-pulse' : 'h-1.5'}`} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. STUDENTS GALLERY (LOWER SECTION) ================= */}
      <div className="space-y-2 flex-1 flex flex-col min-h-0">
        {/* Students Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
              Classroom Students ({students.length})
            </span>
          </div>

          {handsRaisedCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold animate-pulse">
              <Hand className="w-3 h-3 text-amber-400" />
              <span>{handsRaisedCount} Hand{handsRaisedCount > 1 ? 's' : ''} Raised</span>
            </span>
          )}
        </div>

        {/* Responsive Students Grid */}
        <div className={`grid gap-2.5 overflow-y-auto pr-0.5 ${
          layoutMode === 'SPLIT_EQUAL' || layoutMode === 'GALLERY_FOCUS' || layoutMode === 'SPLIT_STAGE'
            ? 'grid-cols-2'
            : 'grid-cols-1'
        }`}>
          {students.map((student) => {
            const isLocal = student.id === localParticipantId;
            const peerStream = isLocal ? localStream : remoteStreams[student.id] || null;

            return (
              <div
                key={student.id}
                id={`video-tile-${student.id}`}
                className={`relative rounded-xl overflow-hidden bg-slate-900 border transition-all duration-200 group flex flex-col justify-between ${
                  student.isHandRaised
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/20'
                    : student.isSpeaking
                    ? 'border-emerald-500 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                } ${student.isSpotlighted ? 'ring-2 ring-cyan-400 border-cyan-400' : ''} ${
                  layoutMode === 'SPLIT_EQUAL' ? 'h-36 sm:h-40' : 'h-32'
                }`}
              >
                {/* Live Video or Fallback Avatar Tile */}
                <ParticipantVideoTile
                  participant={student}
                  isLocal={isLocal}
                  stream={peerStream}
                  isStage={false}
                  mediaError={isLocal ? mediaError : null}
                  onRetryMedia={onRetryMedia}
                  fallbackPhoto={studentPhotoMap[student.id]}
                />

                {/* Top Badges: Class, Drawing Permission, Hand Raise */}
                <div className="relative z-10 p-2 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-slate-300 border border-slate-700/60 text-[9px] font-medium">
                      {student.gradeOrClass || 'SS2 Technical'}
                    </span>

                    {student.hasDrawingPermission && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold backdrop-blur-sm">
                        <Pencil className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Draw</span>
                      </span>
                    )}
                  </div>

                  {/* Hand Raised Banner */}
                  {student.isHandRaised && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] animate-bounce shadow-md shadow-amber-500/40">
                      <Hand className="w-2.5 h-2.5" />
                      <span>Hand Raised</span>
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Name, Mic Status, Audio Wave & Teacher Controls */}
                <div className="relative z-10 p-2 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className={`p-1 rounded-md ${student.isAudioMuted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {student.isAudioMuted ? <MicOff className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5" />}
                    </div>
                    <span className="text-[11px] font-semibold text-white truncate max-w-[120px]" title={student.name}>
                      {student.name} {isLocal ? '(You)' : ''}
                    </span>
                  </div>

                  {/* Audio equalizer */}
                  {!student.isAudioMuted && (
                    <div className="flex items-center gap-0.5">
                      <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${student.isSpeaking ? 'h-3 animate-pulse' : 'h-1'}`} />
                      <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${student.isSpeaking ? 'h-4 animate-pulse' : 'h-1'}`} />
                      <span className={`w-0.5 rounded-full bg-emerald-400 transition-all ${student.isSpeaking ? 'h-2 animate-pulse' : 'h-1'}`} />
                    </div>
                  )}

                  {/* Teacher Quick-action Popover */}
                  {isTeacher && onToggleParticipantDrawingPermission && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={() => onToggleParticipantDrawingPermission(student.id)}
                        className={`p-1 rounded text-[10px] font-bold transition-colors ${
                          student.hasDrawingPermission
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                        title={student.hasDrawingPermission ? 'Revoke drawing on board' : 'Grant permission to draw on board'}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
