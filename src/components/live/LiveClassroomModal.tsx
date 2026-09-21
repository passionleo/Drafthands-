import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Tv, 
  Users, 
  MessageSquare, 
  Share2, 
  Radio, 
  Crown, 
  GraduationCap, 
  ShieldCheck, 
  Hand, 
  Pointer, 
  Sparkles, 
  Lock, 
  Unlock, 
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Layout,
  PencilRuler,
  Terminal,
  Grid3X3,
  Columns,
  BookOpen,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  Ruler,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  PictureInPicture
} from 'lucide-react';
import { CurriculumTopic } from '../../types/curriculum';
import { 
  LiveParticipant, 
  LiveClassSession, 
  LiveChatMessage, 
  DrawingPermissionMode, 
  VideoLayoutMode, 
  RemoteCursor, 
  LaserPointerPosition,
  ParticipantRole,
  ClassroomResourceTab
} from '../../types/liveClass';
import { WhiteboardElement, OnScreenInstrument, WorkspaceMode } from '../../types/whiteboard';
import { MediaStreamService } from '../../services/mediaStreamService';
import { LiveClassSyncService } from '../../services/liveClassSync';
import { VideoGrid } from './VideoGrid';
import { FloatingStudentPipOverlay } from './FloatingStudentPipOverlay';
import { LiveControlBar } from './LiveControlBar';
import { LiveChatDrawer } from './LiveChatDrawer';
import { ClassroomTeachingHub } from './ClassroomTeachingHub';
import { WhiteboardStudio } from '../whiteboard/WhiteboardStudio';
import { PastQuestionItem } from '../../data/pastQuestionsArchive';
import { StudentSubmission } from '../../types/assignments';

interface LiveClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: CurriculumTopic;
  initialRole?: ParticipantRole;
  initialRoomCode?: string;
  initialUserName?: string;
  initialGradeClass?: string;
  onNavigateToAppPart?: (partName: string) => void;
}

export const LiveClassroomModal: React.FC<LiveClassroomModalProps> = ({
  isOpen,
  onClose,
  topic: initialTopic,
  initialRole = 'TEACHER',
  initialRoomCode = 'TD-SS2-8821',
  initialUserName = 'Engr. D. Adebayo',
  initialGradeClass = 'SS2 Technical',
  onNavigateToAppPart
}) => {
  // Active Topic can be updated by instructor via Curriculum tab
  const [activeTopic, setActiveTopic] = useState<CurriculumTopic>(initialTopic);

  useEffect(() => {
    setActiveTopic(initialTopic);
  }, [initialTopic]);

  // Session configuration state
  const [role, setRole] = useState<ParticipantRole>(initialRole);
  const [userName, setUserName] = useState<string>(initialUserName);
  const [roomCode, setRoomCode] = useState<string>(initialRoomCode);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');

  // Split-Screen & Layout state
  // Default to SPLIT_EQUAL (50:50) for modern video/whiteboard split classroom
  const [layoutMode, setLayoutMode] = useState<VideoLayoutMode>('SPLIT_EQUAL');
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage given to drawing canvas (e.g. 50 = 50% board / 50% video)
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Classroom Teaching Resources Tab
  const [activeResourceTab, setActiveResourceTab] = useState<ClassroomResourceTab | null>(null);

  // Ambient floating minimization state (allows teacher/student to browse rest of app without leaving call)
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showMinimizedPip, setShowMinimizedPip] = useState<boolean>(true);

  // In-class notification banner
  const [classroomNotice, setClassroomNotice] = useState<string | null>(null);

  // Meeting & Media state
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isLaserActive, setIsLaserActive] = useState<boolean>(false);
  const [isRecording] = useState<boolean>(true);
  const [drawingPermissionMode, setDrawingPermissionMode] = useState<DrawingPermissionMode>('TEACHER_ONLY');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  // Local media stream
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const mediaServiceRef = useRef<MediaStreamService | null>(null);
  const syncServiceRef = useRef<LiveClassSyncService | null>(null);

  // Participants roster (Teacher + Students)
  const [participants, setParticipants] = useState<LiveParticipant[]>([
    {
      id: 'teacher-1',
      name: initialRole === 'TEACHER' ? initialUserName : 'Demo Technical Instructor',
      role: 'TEACHER',
      avatarBg: '#7c3aed',
      isAudioMuted: false,
      isVideoOff: false,
      isHandRaised: false,
      isSpeaking: true,
      audioLevel: 0.7,
      hasDrawingPermission: true,
      isSpotlighted: true,
      joinedAt: Date.now() - 300000,
      gradeOrClass: 'Technical Instructor'
    },
    {
      id: 'student-1',
      name: initialRole === 'STUDENT' ? initialUserName : 'Demo Student 1',
      role: 'STUDENT',
      avatarBg: '#0891b2',
      isAudioMuted: true,
      isVideoOff: false,
      isHandRaised: false,
      isSpeaking: false,
      audioLevel: 0,
      hasDrawingPermission: false,
      isSpotlighted: false,
      joinedAt: Date.now() - 250000,
      gradeOrClass: 'SS2 Technical'
    },
    {
      id: 'student-2',
      name: 'Demo Student 2',
      role: 'STUDENT',
      avatarBg: '#ea580c',
      isAudioMuted: true,
      isVideoOff: false,
      isHandRaised: true,
      isSpeaking: false,
      audioLevel: 0,
      hasDrawingPermission: false,
      isSpotlighted: false,
      joinedAt: Date.now() - 200000,
      gradeOrClass: 'SS2 Technical'
    },
    {
      id: 'student-3',
      name: 'Demo Student 3',
      role: 'STUDENT',
      avatarBg: '#16a34a',
      isAudioMuted: false,
      isVideoOff: true,
      isHandRaised: false,
      isSpeaking: false,
      audioLevel: 0,
      hasDrawingPermission: true,
      isSpotlighted: false,
      joinedAt: Date.now() - 150000,
      gradeOrClass: 'SS2 Technical'
    },
    {
      id: 'student-4',
      name: 'Demo Student 4',
      role: 'STUDENT',
      avatarBg: '#2563eb',
      isAudioMuted: true,
      isVideoOff: false,
      isHandRaised: false,
      isSpeaking: false,
      audioLevel: 0,
      hasDrawingPermission: false,
      isSpotlighted: false,
      joinedAt: Date.now() - 100000,
      gradeOrClass: 'SS2 Technical'
    }
  ]);

  // Live in-class messages
  const [messages, setMessages] = useState<LiveChatMessage[]>([
    {
      id: 'msg-1',
      senderId: 'teacher-1',
      senderName: 'Demo Technical Instructor',
      senderRole: 'TEACHER',
      text: `Good day class! Today we are practicing ${activeTopic.title}. Pay close attention to the construction line weights (2H pencil vs HB outline).`,
      timestamp: '10:00 AM'
    },
    {
      id: 'msg-2',
      senderId: 'student-2',
      senderName: 'Demo Student 2',
      senderRole: 'STUDENT',
      text: 'Sir, what scale ratio should we use on the triangular scale rule for this exercise?',
      timestamp: '10:02 AM',
      isQuestion: true,
      upvotes: 3
    }
  ]);

  // Remote interactive indicators
  const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});
  const [laserPointer, setLaserPointer] = useState<LaserPointerPosition>({
    active: false,
    x: 0,
    y: 0,
    teacherName: 'Engr. D. Adebayo',
    color: '#ef4444'
  });

  const localParticipantId = role === 'TEACHER' ? 'teacher-1' : 'student-1';
  const isTeacher = role === 'TEACHER';

  // Timer updater
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setElapsedTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, sessionStartTime]);

  // Automatically dismiss classroom notices after 4 seconds
  useEffect(() => {
    if (!classroomNotice) return;
    const timer = setTimeout(() => setClassroomNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [classroomNotice]);

  // Initialize Media and Real-Time Sync services
  useEffect(() => {
    if (!isOpen) return;

    // 1. Setup Media
    const media = new MediaStreamService();
    mediaServiceRef.current = media;

    media.initLocalMedia({ video: !isVideoOff, audio: !isAudioMuted }).then(stream => {
      setLocalStream(stream);
    });

    media.onAudioLevel((level) => {
      if (level > 0.15) {
        setParticipants(prev => prev.map(p => p.id === localParticipantId ? { ...p, isSpeaking: true, audioLevel: level } : p));
      } else {
        setParticipants(prev => prev.map(p => p.id === localParticipantId ? { ...p, isSpeaking: false, audioLevel: 0 } : p));
      }
    });

    // 2. Setup Real-time Sync
    const sync = new LiveClassSyncService(roomCode, localParticipantId, userName);
    syncServiceRef.current = sync;

    const unsubscribe = sync.subscribe((msg) => {
      if (msg.type === 'CHAT_MESSAGE') {
        setMessages(prev => [...prev, msg.payload]);
        if (!isChatOpen) {
          setUnreadChatCount(prev => prev + 1);
        }
      } else if (msg.type === 'LASER_POINTER_MOVE') {
        setLaserPointer(msg.payload);
      } else if (msg.type === 'PERMISSION_CHANGE') {
        setDrawingPermissionMode(msg.payload.mode);
      } else if (msg.type === 'CURSOR_MOVE') {
        setRemoteCursors(prev => ({
          ...prev,
          [msg.senderId]: {
            participantId: msg.senderId,
            participantName: msg.senderName,
            role: msg.payload.role,
            color: msg.payload.color,
            x: msg.payload.x,
            y: msg.payload.y,
            lastActive: Date.now()
          }
        }));
      }
    });

    return () => {
      media.cleanup();
      mediaServiceRef.current = null;
      unsubscribe();
      sync.destroy();
      syncServiceRef.current = null;
    };
  }, [isOpen, roomCode, localParticipantId, userName]);

  // Toggle local microphone
  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (mediaServiceRef.current) {
      mediaServiceRef.current.setAudioMute(nextMuted);
    }
    setParticipants(prev => prev.map(p => p.id === localParticipantId ? { ...p, isAudioMuted: nextMuted } : p));
  };

  // Toggle local camera
  const handleToggleVideo = () => {
    const nextOff = !isVideoOff;
    setIsVideoOff(nextOff);
    if (mediaServiceRef.current) {
      mediaServiceRef.current.setVideoOff(nextOff);
    }
    setParticipants(prev => prev.map(p => p.id === localParticipantId ? { ...p, isVideoOff: nextOff } : p));
  };

  // Student Raise Hand
  const handleToggleHandRaise = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    setParticipants(prev => prev.map(p => p.id === localParticipantId ? { ...p, isHandRaised: nextState } : p));
    if (syncServiceRef.current) {
      syncServiceRef.current.broadcast('HAND_RAISE', { isHandRaised: nextState, studentName: userName });
    }
  };

  // Toggle Screen Share
  const handleToggleScreenShare = async () => {
    if (!isScreenSharing && mediaServiceRef.current) {
      const stream = await mediaServiceRef.current.startScreenShare();
      if (stream) {
        setIsScreenSharing(true);
      }
    } else if (mediaServiceRef.current) {
      mediaServiceRef.current.stopScreenShare();
      setIsScreenSharing(false);
    }
  };

  // Toggle Laser Pointer
  const handleToggleLaserPointer = () => {
    const nextActive = !isLaserActive;
    setIsLaserActive(nextActive);
    if (syncServiceRef.current) {
      syncServiceRef.current.broadcast('LASER_POINTER_MOVE', {
        active: nextActive,
        x: 400,
        y: 300,
        teacherName: userName,
        color: '#ef4444'
      });
    }
  };

  // Change Drawing Permission Mode
  const handleChangeDrawingPermission = (mode: DrawingPermissionMode) => {
    setDrawingPermissionMode(mode);
    if (syncServiceRef.current) {
      syncServiceRef.current.broadcast('PERMISSION_CHANGE', { mode });
    }
    setClassroomNotice(`Drawing permission changed to ${mode.replace('_', ' ')}`);
  };

  // Send in-class chat message
  const handleSendMessage = (text: string, isQuestion?: boolean) => {
    const newMsg: LiveChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: localParticipantId,
      senderName: userName,
      senderRole: role,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuestion,
      upvotes: 0
    };

    setMessages(prev => [...prev, newMsg]);
    if (syncServiceRef.current) {
      syncServiceRef.current.broadcast('CHAT_MESSAGE', newMsg);
    }
  };

  // Upvote Question
  const handleUpvoteQuestion = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, upvotes: (m.upvotes || 0) + 1 } : m));
  };

  // Copy Room Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Set Split Ratio Preset
  const handleSetSplitRatio = (ratio: number, mode: VideoLayoutMode) => {
    setSplitRatio(ratio);
    setLayoutMode(mode);
  };

  // Handlers for teaching resources actions
  const handleProjectStepsToBoard = (targetTopic: CurriculumTopic) => {
    setActiveTopic(targetTopic);
    setActiveResourceTab(null);
    setClassroomNotice(`Projected "${targetTopic.title}" geometric construction steps to class whiteboard!`);
  };

  const handleLoadPastQuestionToBoard = (pq: PastQuestionItem) => {
    setActiveResourceTab(null);
    setClassroomNotice(`Loaded ${pq.examBody} ${pq.year} practical exercise onto classroom drawing sheet!`);
  };

  const handleLoadStudentSubmissionToBoard = (submission: StudentSubmission) => {
    setActiveResourceTab(null);
    setClassroomNotice(`Loaded ${submission.studentName}'s technical drawing for live class evaluation & grading!`);
  };

  // Handle Resizer Drag
  const handleResizerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = window.innerWidth;
      const newRatio = Math.max(25, Math.min(75, Math.round((moveEvent.clientX / containerWidth) * 100)));
      setSplitRatio(newRatio);
      if (newRatio > 65) setLayoutMode('SPLIT_SIDEBAR');
      else if (newRatio < 40) setLayoutMode('SPLIT_STAGE');
      else setLayoutMode('SPLIT_EQUAL');
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;

  // ================= AMBIENT MINIMIZED FLOATING CALL BAR + PiP OVERLAY =================
  if (isMinimized) {
    return (
      <>
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 px-3 sm:px-4 py-2 rounded-2xl shadow-2xl text-xs text-white animate-in slide-in-from-top duration-200 select-none max-w-[95vw] overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] hidden sm:inline">Live Class Active</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-300 font-bold shrink-0">{roomCode}</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-300 truncate max-w-[140px] hidden md:inline" title={activeTopic.title}>
            {activeTopic.title}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {elapsedTime}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 shrink-0">{participants.length} in Call</span>

          {/* Toggle Floating Student PiP */}
          <button
            type="button"
            onClick={() => setShowMinimizedPip(prev => !prev)}
            className={`ml-1 px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              showMinimizedPip 
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' 
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Toggle Draggable Student PiP Video Overlay"
          >
            <PictureInPicture className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Student PiP</span>
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 shadow-md transition-all shrink-0"
            title="Restore full split-screen classroom view"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Full Classroom</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
            title="Leave Live Class"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Draggable PiP Overlay when browsing rest of app */}
        {showMinimizedPip && (
          <FloatingStudentPipOverlay
            participants={participants}
            localParticipantId={localParticipantId}
            localStream={localStream}
            isTeacher={isTeacher}
            onToggleSpotlight={(id) => {
              setParticipants(prev => prev.map(p => ({ ...p, isSpotlighted: p.id === id ? !p.isSpotlighted : p.isSpotlighted })));
            }}
            onToggleParticipantAudio={(id) => {
              setParticipants(prev => prev.map(p => p.id === id ? { ...p, isAudioMuted: !p.isAudioMuted } : p));
            }}
            onToggleParticipantDrawingPermission={(id) => {
              setParticipants(prev => prev.map(p => p.id === id ? { ...p, hasDrawingPermission: !p.hasDrawingPermission } : p));
            }}
            onMuteAllStudents={() => {
              setParticipants(prev => prev.map(p => p.role !== 'TEACHER' ? { ...p, isAudioMuted: true } : p));
              setClassroomNotice('All students muted.');
            }}
            onLowerAllHands={() => {
              setParticipants(prev => prev.map(p => ({ ...p, isHandRaised: false })));
              setClassroomNotice('All raised hands cleared.');
            }}
            onRestoreSplitView={() => {
              setIsMinimized(false);
              setLayoutMode('SPLIT_EQUAL');
            }}
            onClose={() => setShowMinimizedPip(false)}
            activeTopicTitle={activeTopic.title}
            initialCorner="BOTTOM_RIGHT"
          />
        )}
      </>
    );
  }

  // Determine if current user is allowed to draw
  const canDraw = isTeacher || drawingPermissionMode === 'COLLABORATIVE' || (participants.find(p => p.id === localParticipantId)?.hasDrawingPermission ?? false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden animate-in fade-in duration-200">
      {/* 1. TOP LIVE CLASSROOM STATUS & IN-CLASS NAVIGATION BAR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 shadow-md">
        {/* Left: Class Title, Topic & Live Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white truncate">Virtual Classroom</span>
              <span className="hidden md:inline text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/40 truncate max-w-[200px]">
                {activeTopic.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {elapsedTime}
              </span>
              <span>•</span>
              <span className="truncate">Instructor: {participants.find(p => p.role === 'TEACHER')?.name || 'Engr. Adebayo'}</span>
            </div>
          </div>
        </div>

        {/* Center: In-Class Resources & App Navigation Hub Tabs */}
        <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-0.5 text-xs">
          <button
            onClick={() => setActiveResourceTab(null)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeResourceTab === null
                ? 'bg-slate-800 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <PencilRuler className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drawing Board</span>
          </button>

          <button
            onClick={() => setActiveResourceTab('CURRICULUM')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeResourceTab === 'CURRICULUM'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Curriculum</span>
          </button>

          <button
            onClick={() => setActiveResourceTab('PAST_QUESTIONS')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeResourceTab === 'PAST_QUESTIONS'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Past Questions</span>
          </button>

          <button
            onClick={() => setActiveResourceTab('TEXTBOOK_PLATES')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeResourceTab === 'TEXTBOOK_PLATES'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Textbook Plates</span>
          </button>

          <button
            onClick={() => setActiveResourceTab('ASSIGNMENTS')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeResourceTab === 'ASSIGNMENTS'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student Work</span>
          </button>

          <button
            onClick={() => setActiveResourceTab('ISO_STANDARDS')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeResourceTab === 'ISO_STANDARDS'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-cyan-400" />
            <span>ISO 128</span>
          </button>
        </div>

        {/* Right: Room Code, Split Selector, App Minimizer & Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Split Presets */}
          <div className="hidden xl:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-0.5 text-xs">
            <button
              onClick={() => handleSetSplitRatio(50, 'SPLIT_EQUAL')}
              className={`px-2 py-0.5 rounded-lg transition-colors font-mono ${
                layoutMode === 'SPLIT_EQUAL' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="50:50 Equal Split View"
            >
              50:50
            </button>
            <button
              onClick={() => handleSetSplitRatio(70, 'SPLIT_SIDEBAR')}
              className={`px-2 py-0.5 rounded-lg transition-colors font-mono ${
                layoutMode === 'SPLIT_SIDEBAR' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="70:30 Board Focus View"
            >
              70:30
            </button>
            <button
              onClick={() => handleSetSplitRatio(30, 'SPLIT_STAGE')}
              className={`px-2 py-0.5 rounded-lg transition-colors font-mono ${
                layoutMode === 'SPLIT_STAGE' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="30:70 Video Stage Focus View"
            >
              30:70
            </button>
            <button
              onClick={() => setLayoutMode(layoutMode === 'FLOATING_PIP' ? 'SPLIT_EQUAL' : 'FLOATING_PIP')}
              className={`px-2 py-0.5 rounded-lg transition-colors font-mono flex items-center gap-1 ${
                layoutMode === 'FLOATING_PIP' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Draggable Floating Student PiP Overlay on Board"
            >
              <PictureInPicture className="w-3 h-3" />
              <span>PiP</span>
            </button>
          </div>

          {/* Room Code */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Code:</span>
            <span className="font-mono font-bold text-cyan-300">{roomCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title="Copy Room Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Minimize / Browse App Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
            title="Minimize classroom to floating top bar and browse other app sections"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Browse App</span>
          </button>

          {/* Close / Leave */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Leave Virtual Classroom"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Classroom Toast Alert Banner */}
      {classroomNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-cyan-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-cyan-400/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>{classroomNotice}</span>
        </div>
      )}

      {/* 2. MAIN SPLIT-VIEWPORT: DRAWING SECTION & VIDEO/IMAGE STAGE */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* ================= A. DRAWING SECTION (LEFT / SPLIT) ================= */}
        <div
          className="flex flex-col min-w-0 bg-slate-950 relative overflow-hidden transition-all duration-75"
          style={{
            width: layoutMode === 'FULL_BOARD' || layoutMode === 'FLOATING_PIP'
              ? '100%'
              : `${splitRatio}%`
          }}
        >
          {/* Real-time remote cursor indicators */}
          {Object.values(remoteCursors).map((cur: RemoteCursor) => (
            <div
              key={cur.participantId}
              className="absolute pointer-events-none z-30 transition-all duration-75 flex items-center gap-1"
              style={{ left: cur.x, top: cur.y }}
            >
              <div
                className="w-3 h-3 rounded-full border-2 border-white shadow-lg animate-pulse"
                style={{ backgroundColor: cur.color }}
              />
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-md whitespace-nowrap"
                style={{ backgroundColor: cur.color }}
              >
                {cur.participantName}
              </span>
            </div>
          ))}

          {/* Teacher Laser Pointer Spotlight */}
          {laserPointer.active && (
            <div
              className="absolute pointer-events-none z-40 transition-all duration-100 flex items-center justify-center"
              style={{ left: laserPointer.x - 15, top: laserPointer.y - 15 }}
            >
              <div className="w-8 h-8 rounded-full bg-red-500/40 animate-ping absolute" />
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-xl shadow-red-500/80" />
            </div>
          )}

          {/* Embedded Full Whiteboard Studio */}
          <div className="flex-1 flex flex-col min-h-0">
            <WhiteboardStudio
              topic={activeTopic}
              onClose={onClose}
              initialMode="TRADITIONAL_BOARD"
            />
          </div>

          {/* If Full Board mode, provide floating pill to restore video panel or enable Student PiP */}
          {layoutMode === 'FULL_BOARD' && (
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <button
                onClick={() => setLayoutMode('FLOATING_PIP')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-xs text-cyan-300 hover:text-white hover:bg-cyan-900 shadow-xl backdrop-blur-md transition-all cursor-pointer"
                title="Enable Picture-in-Picture Student Monitoring View while drawing"
              >
                <PictureInPicture className="w-3.5 h-3.5 text-cyan-400" />
                <span>Student PiP ({participants.length - 1})</span>
              </button>
              <button
                onClick={() => setLayoutMode('SPLIT_EQUAL')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 hover:text-white hover:bg-slate-800 shadow-xl backdrop-blur-md transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Show Video Stage</span>
              </button>
            </div>
          )}
        </div>

        {/* ================= RESIZE DIVIDER HANDLE ================= */}
        {layoutMode !== 'FULL_BOARD' && layoutMode !== 'FLOATING_PIP' && (
          <div
            onMouseDown={handleResizerMouseDown}
            className={`w-1.5 bg-slate-800 hover:bg-cyan-500 transition-colors cursor-col-resize z-20 flex items-center justify-center group relative ${
              isResizing ? 'bg-cyan-500' : ''
            }`}
            title="Drag to adjust split width between Drawing Board and Video Stage"
          >
            <div className="w-4 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="w-0.5 h-3 bg-slate-400 rounded-full" />
            </div>
          </div>
        )}

        {/* ================= B. CLASSROOM VIDEO & TEACHING SECTION (RIGHT / SPLIT) ================= */}
        {layoutMode !== 'FULL_BOARD' && layoutMode !== 'FLOATING_PIP' && (
          <div
            className="flex flex-col min-w-0 bg-slate-950 border-l border-slate-800 shrink-0 z-20 transition-all duration-75"
            style={{ width: `${100 - splitRatio}%` }}
          >
            {/* If a resource tab is selected (Curriculum, Past Questions, Textbook Plates, Assignments, ISO 128), render the Teaching Hub */}
            {activeResourceTab ? (
              <ClassroomTeachingHub
                activeTab={activeResourceTab}
                onSelectTab={setActiveResourceTab}
                currentTopic={activeTopic}
                onSelectTopic={(t) => {
                  setActiveTopic(t);
                  setClassroomNotice(`Class topic switched to: ${t.title}`);
                }}
                onProjectStepsToBoard={handleProjectStepsToBoard}
                onLoadPastQuestionToBoard={handleLoadPastQuestionToBoard}
                onLoadStudentSubmissionToBoard={handleLoadStudentSubmissionToBoard}
                onCloseHub={() => setActiveResourceTab(null)}
                onMinimizeClassroom={() => setIsMinimized(true)}
                onNavigateToAppPart={onNavigateToAppPart}
              />
            ) : (
              /* Dedicated Video Stage: Separate Teacher Podium and Student Gallery */
              <div className="flex-1 flex flex-col min-h-0">
                <VideoGrid
                  participants={participants}
                  localParticipantId={localParticipantId}
                  localStream={localStream}
                  layoutMode={layoutMode}
                  onToggleSpotlight={(id) => {
                    setParticipants(prev => prev.map(p => ({ ...p, isSpotlighted: p.id === id ? !p.isSpotlighted : p.isSpotlighted })));
                  }}
                  onToggleParticipantAudio={(id) => {
                    setParticipants(prev => prev.map(p => p.id === id ? { ...p, isAudioMuted: !p.isAudioMuted } : p));
                  }}
                  onToggleParticipantDrawingPermission={(id) => {
                    setParticipants(prev => prev.map(p => p.id === id ? { ...p, hasDrawingPermission: !p.hasDrawingPermission } : p));
                  }}
                  onMuteAllStudents={() => {
                    setParticipants(prev => prev.map(p => p.role !== 'TEACHER' ? { ...p, isAudioMuted: true } : p));
                    setClassroomNotice('All students muted.');
                  }}
                  onLowerAllHands={() => {
                    setParticipants(prev => prev.map(p => ({ ...p, isHandRaised: false })));
                    setClassroomNotice('All raised hands cleared.');
                  }}
                  isTeacher={isTeacher}
                  activeTopicTitle={activeTopic.title}
                />
              </div>
            )}
          </div>
        )}

        {/* ================= C. FLOATING PICTURE-IN-PICTURE VIDEO DOCK ================= */}
        {layoutMode === 'FLOATING_PIP' && (
          <FloatingStudentPipOverlay
            participants={participants}
            localParticipantId={localParticipantId}
            localStream={localStream}
            isTeacher={isTeacher}
            onToggleSpotlight={(id) => {
              setParticipants(prev => prev.map(p => ({ ...p, isSpotlighted: p.id === id ? !p.isSpotlighted : p.isSpotlighted })));
            }}
            onToggleParticipantAudio={(id) => {
              setParticipants(prev => prev.map(p => p.id === id ? { ...p, isAudioMuted: !p.isAudioMuted } : p));
            }}
            onToggleParticipantDrawingPermission={(id) => {
              setParticipants(prev => prev.map(p => p.id === id ? { ...p, hasDrawingPermission: !p.hasDrawingPermission } : p));
            }}
            onMuteAllStudents={() => {
              setParticipants(prev => prev.map(p => p.role !== 'TEACHER' ? { ...p, isAudioMuted: true } : p));
              setClassroomNotice('All students muted.');
            }}
            onLowerAllHands={() => {
              setParticipants(prev => prev.map(p => ({ ...p, isHandRaised: false })));
              setClassroomNotice('All raised hands cleared.');
            }}
            onRestoreSplitView={() => setLayoutMode('SPLIT_EQUAL')}
            onClose={() => setLayoutMode('FULL_BOARD')}
            activeTopicTitle={activeTopic.title}
            initialCorner="TOP_RIGHT"
          />
        )}

        {/* ================= D. IN-CLASS LIVE CHAT & PARTICIPANTS DRAWER ================= */}
        <LiveChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={handleSendMessage}
          onUpvoteQuestion={handleUpvoteQuestion}
          participants={participants}
          localParticipantId={localParticipantId}
          isTeacher={isTeacher}
          onMuteAllStudents={() => {
            setParticipants(prev => prev.map(p => p.role !== 'TEACHER' ? { ...p, isAudioMuted: true } : p));
          }}
          onToggleStudentAudio={(id) => {
            setParticipants(prev => prev.map(p => p.id === id ? { ...p, isAudioMuted: !p.isAudioMuted } : p));
          }}
          onToggleStudentDrawing={(id) => {
            setParticipants(prev => prev.map(p => p.id === id ? { ...p, hasDrawingPermission: !p.hasDrawingPermission } : p));
          }}
          onLowerStudentHand={(id) => {
            setParticipants(prev => prev.map(p => p.id === id ? { ...p, isHandRaised: false } : p));
          }}
        />
      </div>

      {/* 3. BOTTOM LIVE CONTROL BAR */}
      <LiveControlBar
        isAudioMuted={isAudioMuted}
        isVideoOff={isVideoOff}
        isHandRaised={isHandRaised}
        isScreenSharing={isScreenSharing}
        isLaserActive={isLaserActive}
        drawingPermissionMode={drawingPermissionMode}
        layoutMode={layoutMode}
        unreadChatCount={unreadChatCount}
        participantCount={participants.length}
        isTeacher={isTeacher}
        isRecording={isRecording}
        isChatOpen={isChatOpen}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onToggleHandRaise={handleToggleHandRaise}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleLaserPointer={handleToggleLaserPointer}
        onChangeDrawingPermission={handleChangeDrawingPermission}
        onChangeLayoutMode={(mode) => {
          setLayoutMode(mode);
          if (mode === 'SPLIT_EQUAL') setSplitRatio(50);
          else if (mode === 'SPLIT_SIDEBAR') setSplitRatio(70);
          else if (mode === 'SPLIT_STAGE') setSplitRatio(30);
        }}
        onToggleChat={() => {
          setIsChatOpen(prev => !prev);
          setUnreadChatCount(0);
        }}
        onEndOrLeaveClass={onClose}
      />
    </div>
  );
};
