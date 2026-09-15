import React, { useEffect, useRef } from 'react';
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
  Radio
} from 'lucide-react';
import { LiveParticipant, VideoLayoutMode } from '../../types/liveClass';
import africanStudentsImg from '../../assets/images/african_students_technical_drawing_1788361928984.jpg';
import africanCadLabImg from '../../assets/images/african_higher_inst_cad_lab_1788361956625.jpg';

interface VideoGridProps {
  participants: LiveParticipant[];
  localParticipantId: string;
  localStream: MediaStream | null;
  layoutMode: VideoLayoutMode;
  onToggleSpotlight: (id: string) => void;
  onToggleParticipantAudio?: (id: string) => void;
  onToggleParticipantDrawingPermission?: (id: string) => void;
  onMuteAllStudents?: () => void;
  onLowerAllHands?: () => void;
  isTeacher: boolean;
  activeTopicTitle?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  localParticipantId,
  localStream,
  layoutMode,
  onToggleSpotlight,
  onToggleParticipantAudio,
  onToggleParticipantDrawingPermission,
  onMuteAllStudents,
  onLowerAllHands,
  isTeacher,
  activeTopicTitle
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Attach local media stream to local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Separate Teacher(s) from Students
  const teacher = participants.find(p => p.role === 'TEACHER') || participants[0];
  const students = participants.filter(p => p.id !== teacher?.id);

  const handsRaisedCount = students.filter(s => s.isHandRaised).length;

  // Student simulated photo avatars
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
            {/* Video or Photo Background */}
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
              {teacher.id === localParticipantId && localStream && !teacher.isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : !teacher.isVideoOff ? (
                <div className="w-full h-full relative">
                  <img
                    src={africanCadLabImg}
                    alt={teacher.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover brightness-90 filter"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400 gap-1.5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl ring-2 ring-amber-400/40"
                    style={{ backgroundColor: teacher.avatarBg || '#7c3aed' }}
                  >
                    {teacher.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Camera Off</span>
                </div>
              )}
            </div>

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
                {/* Video / Photo Placeholder */}
                <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                  {isLocal && localStream && !student.isVideoOff ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : !student.isVideoOff ? (
                    <div className="w-full h-full relative">
                      <img
                        src={studentPhotoMap[student.id] || africanStudentsImg}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                        style={{ backgroundColor: student.avatarBg || '#0891b2' }}
                      >
                        {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">Camera Off</span>
                    </div>
                  )}
                </div>

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

                  {/* Teacher hover controls for student */}
                  {isTeacher && !isLocal && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 absolute right-2 top-2 z-20 pointer-events-auto">
                      <button
                        onClick={() => onToggleSpotlight(student.id)}
                        className={`p-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow ${
                          student.isSpotlighted ? 'text-amber-400 border-amber-400/50' : ''
                        }`}
                        title={student.isSpotlighted ? 'Unspotlight' : 'Spotlight Student'}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      {onToggleParticipantDrawingPermission && (
                        <button
                          onClick={() => onToggleParticipantDrawingPermission(student.id)}
                          className={`p-1 rounded bg-slate-800/90 hover:bg-slate-700 border shadow ${
                            student.hasDrawingPermission ? 'text-cyan-400 border-cyan-500/50' : 'text-slate-400 border-slate-700'
                          }`}
                          title={student.hasDrawingPermission ? 'Revoke Drawing Access' : 'Grant Drawing Board Access'}
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                      {onToggleParticipantAudio && (
                        <button
                          onClick={() => onToggleParticipantAudio(student.id)}
                          className={`p-1 rounded bg-slate-800/90 hover:bg-slate-700 border shadow ${
                            student.isAudioMuted ? 'text-red-400 border-red-500/40' : 'text-emerald-400 border-emerald-500/40'
                          }`}
                          title={student.isAudioMuted ? 'Unmute Student' : 'Mute Student'}
                        >
                          {student.isAudioMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                        </button>
                      )}
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
