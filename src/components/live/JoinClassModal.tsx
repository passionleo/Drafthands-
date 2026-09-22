import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Tv, 
  Users, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Crown,
  KeyRound
} from 'lucide-react';
import { CurriculumTier, CurriculumTopic } from '../../types/curriculum';
import { ParticipantRole } from '../../types/liveClass';
import { MediaStreamService } from '../../services/mediaStreamService';
import { useSubscription } from '../../context/SubscriptionContext';
import { LiveMediaErrorBoundary } from '../common/LiveMediaErrorBoundary';

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: CurriculumTopic[];
  activeTopic: CurriculumTopic;
  onJoinSession: (config: {
    roomCode: string;
    topicId: string;
    userName: string;
    role: ParticipantRole;
    gradeOrClass: string;
    initialAudioMuted: boolean;
    initialVideoOff: boolean;
  }) => void;
}

export const JoinClassModal: React.FC<JoinClassModalProps> = ({
  isOpen,
  onClose,
  topics,
  activeTopic,
  onJoinSession
}) => {
  const { userRole, userProfile } = useSubscription();
  const isStudent = userRole === 'STUDENT';

  const [activeTab, setActiveTab] = useState<'HOST' | 'JOIN'>(isStudent ? 'JOIN' : 'HOST');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState(activeTopic.id);
  const [userName, setUserName] = useState(userProfile?.name || 'Technical Instructor');
  const [studentName, setStudentName] = useState(userProfile?.name || 'Technical Student');
  const [gradeClass, setGradeClass] = useState('SS2 Technical');

  useEffect(() => {
    if (isStudent) {
      setActiveTab('JOIN');
    }
  }, [isStudent]);
  
  // Hardware test state
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaServiceRef = useRef<MediaStreamService | null>(null);

  // Generate random room code for teacher
  const [generatedRoomCode] = useState(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'TD-';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  });

  // Setup preview stream when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const media = new MediaStreamService();
    mediaServiceRef.current = media;

    media.initLocalMedia({ video: !isVideoOff, audio: !isAudioMuted }).then(stream => {
      setPreviewStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    });

    return () => {
      media.cleanup();
      mediaServiceRef.current = null;
    };
  }, [isOpen]);

  // Handle hardware toggle in preview
  const handleToggleMic = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (mediaServiceRef.current) {
      mediaServiceRef.current.setAudioMute(nextMuted);
    }
  };

  const handleToggleVideo = () => {
    const nextOff = !isVideoOff;
    setIsVideoOff(nextOff);
    if (mediaServiceRef.current) {
      mediaServiceRef.current.setVideoOff(nextOff);
    }
  };

  if (!isOpen) return null;

  const handleStartHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    if (mediaServiceRef.current) {
      mediaServiceRef.current.cleanup();
    }

    onJoinSession({
      roomCode: generatedRoomCode,
      topicId: selectedTopicId,
      userName: userName.trim(),
      role: 'TEACHER',
      gradeOrClass: 'Instructor / Host',
      initialAudioMuted: isAudioMuted,
      initialVideoOff: isVideoOff
    });
  };

  const handleJoinStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const code = roomCodeInput.trim().toUpperCase() || 'TD-SS2-8821';

    if (mediaServiceRef.current) {
      mediaServiceRef.current.cleanup();
    }

    onJoinSession({
      roomCode: code,
      topicId: activeTopic.id,
      userName: studentName.trim() || 'Student',
      role: 'STUDENT',
      gradeOrClass: gradeClass,
      initialAudioMuted: isAudioMuted,
      initialVideoOff: isVideoOff
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Drafthands Live Classroom
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                  2-Way Video + Synced Canvas
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Interactive real-time engineering drafting room & video conference
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector: Host Class vs Join Class */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex gap-2">
          {!isStudent && (
            <button
              onClick={() => setActiveTab('HOST')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                activeTab === 'HOST'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Host Live Class (Teacher)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('JOIN')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              activeTab === 'JOIN'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-300" />
            <span>Join with Code (Student)</span>
          </button>
        </div>

        {/* Modal Body with Hardware Preview & Form */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Camera / Audio Hardware Preview Box */}
          <LiveMediaErrorBoundary mode="tile" participantName="Local Hardware Preview">
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video max-h-56 flex items-center justify-center">
              {!isVideoOff && previewStream ? (
                <video
                  ref={el => {
                    videoPreviewRef.current = el;
                    if (el && previewStream && el.srcObject !== previewStream) {
                      try {
                        el.srcObject = previewStream;
                        el.play().catch(() => {});
                      } catch {
                        // Silent fallback
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <VideoOff className="w-8 h-8" />
                  <span className="text-xs">Camera is Off</span>
                </div>
              )}

              {/* Bottom Hardware Toggles */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 z-10">
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                    isAudioMuted ? 'bg-red-500/80 border-red-400 text-white' : 'bg-slate-900/80 border-slate-700 text-emerald-400 hover:bg-slate-800'
                  }`}
                  title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleToggleVideo}
                  className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                    isVideoOff ? 'bg-red-500/80 border-red-400 text-white' : 'bg-slate-900/80 border-slate-700 text-cyan-400 hover:bg-slate-800'
                  }`}
                  title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </LiveMediaErrorBoundary>

          {/* TAB 1: TEACHER HOST FORM */}
          {activeTab === 'HOST' ? (
            <form onSubmit={handleStartHost} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Teacher / Host Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                    placeholder="e.g. Engr. D. Adebayo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Generated Class Room Code
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-purple-500/40">
                    <KeyRound className="w-4 h-4 text-purple-400" />
                    <span className="font-mono text-sm font-bold text-purple-300 tracking-wider">
                      {generatedRoomCode}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">(Share with students)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Curriculum Topic to Teach
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.tier}] {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  As teacher, you will have master control over student drawing permissions, laser pointing, and real-time step broadcast.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Launch Live Classroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* TAB 2: STUDENT JOIN FORM */
            <form onSubmit={handleJoinStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter 6-Digit Class Code
                </label>
                <input
                  type="text"
                  required
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. TD-SS2-8821"
                  className="w-full bg-slate-950 text-cyan-300 font-mono text-sm px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Demo Student 1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Class / Grade Level
                  </label>
                  <select
                    value={gradeClass}
                    onChange={(e) => setGradeClass(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SS1 Technical">SS1 Technical Drawing</option>
                    <option value="SS2 Technical">SS2 Technical Drawing</option>
                    <option value="SS3 Technical">SS3 Technical Drawing</option>
                    <option value="Higher Ed Mech Eng">Higher Ed - Mechanical Eng</option>
                    <option value="Higher Ed Civil Eng">Higher Ed - Civil / Building</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Join Live Classroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
