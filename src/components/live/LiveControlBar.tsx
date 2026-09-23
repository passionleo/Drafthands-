import React, { useEffect, useState, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  MessageSquare, 
  Users, 
  Monitor, 
  PencilRuler, 
  Lock, 
  Unlock, 
  PhoneOff, 
  Layout, 
  Sparkles, 
  Radio, 
  Pointer, 
  Columns, 
  Maximize2, 
  PictureInPicture,
  Film,
  Grid,
  Layers,
  ChevronUp,
  Smile,
  Heart
} from 'lucide-react';
import { DrawingPermissionMode, VideoLayoutMode, LiveReactionType } from '../../types/liveClass';

interface LiveControlBarProps {
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  isScreenSharing: boolean;
  isLaserActive: boolean;
  drawingPermissionMode: DrawingPermissionMode;
  layoutMode: VideoLayoutMode;
  unreadChatCount: number;
  participantCount: number;
  isTeacher: boolean;
  isRecording: boolean;
  isChatOpen: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleHandRaise: () => void;
  onToggleScreenShare: () => void;
  onToggleLaserPointer: () => void;
  onChangeDrawingPermission: (mode: DrawingPermissionMode) => void;
  onChangeLayoutMode: (mode: VideoLayoutMode) => void;
  onToggleChat: () => void;
  onEndOrLeaveClass: () => void;
  onToggleWhiteboardOverlay?: () => void;
  isWhiteboardOverlay?: boolean;
  onSendReaction?: (emoji: string, type: LiveReactionType) => void;
}

const REACTION_OPTIONS: { emoji: string; type: LiveReactionType; label: string }[] = [
  { emoji: '👏', type: 'CLAP', label: 'Applause' },
  { emoji: '👍', type: 'THUMBS_UP', label: 'Thumbs Up' },
  { emoji: '❤️', type: 'HEART', label: 'Heart' },
  { emoji: '💡', type: 'AHA_BULB', label: 'Aha!' },
  { emoji: '🎉', type: 'CELEBRATE', label: 'Celebrate' },
  { emoji: '❓', type: 'QUESTION', label: 'Question' },
  { emoji: '🔥', type: 'FIRE', label: 'Brilliant' },
  { emoji: '👋', type: 'HAND_WAVE', label: 'Wave' }
];

export const LiveControlBar: React.FC<LiveControlBarProps> = ({
  isAudioMuted,
  isVideoOff,
  isHandRaised,
  isScreenSharing,
  isLaserActive,
  drawingPermissionMode,
  layoutMode,
  unreadChatCount,
  participantCount,
  isTeacher,
  isRecording,
  isChatOpen,
  onToggleAudio,
  onToggleVideo,
  onToggleHandRaise,
  onToggleScreenShare,
  onToggleLaserPointer,
  onChangeDrawingPermission,
  onChangeLayoutMode,
  onToggleChat,
  onEndOrLeaveClass,
  onToggleWhiteboardOverlay,
  isWhiteboardOverlay = false,
  onSendReaction
}) => {
  const [showReactionsPicker, setShowReactionsPicker] = useState<boolean>(false);
  const reactionsRef = useRef<HTMLDivElement>(null);

  // Close reaction picker on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (reactionsRef.current && !reactionsRef.current.contains(e.target as Node)) {
        setShowReactionsPicker(false);
      }
    };
    if (showReactionsPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReactionsPicker]);
  // Keyboard shortcuts (M for Mic, V for Video, H for Hand, W for Whiteboard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onToggleAudio();
      } else if (e.key.toLowerCase() === 'v' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onToggleVideo();
      } else if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onToggleHandRaise();
      } else if (e.key.toLowerCase() === 'w' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (onToggleWhiteboardOverlay) {
          onToggleWhiteboardOverlay();
        } else {
          onChangeLayoutMode(layoutMode === 'WHITEBOARD_OVERLAY' ? 'SPLIT_EQUAL' : 'WHITEBOARD_OVERLAY');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleAudio, onToggleVideo, onToggleHandRaise, onToggleWhiteboardOverlay, onChangeLayoutMode, layoutMode]);

  const isWhiteboardActive = isWhiteboardOverlay || layoutMode === 'WHITEBOARD_OVERLAY';

  return (
    <div className="h-20 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-30 select-none shadow-2xl relative">
      {/* ================= LEFT SECTION: SESSION INFO & RECORDING STATUS ================= */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">LIVE DRAFTING ROOM</span>
        </div>

        {isRecording && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono border border-red-500/20">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>REC 1080p</span>
          </div>
        )}
      </div>

      {/* ================= CENTER SECTION: GOOGLE MEET-INSPIRED PILL CONTROLS ================= */}
      <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/90 p-1.5 sm:p-2 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
        {/* 1. Audio Mute Button (Google Meet style) */}
        <button
          id="btn-toggle-mic"
          type="button"
          onClick={onToggleAudio}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
            isAudioMuted
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
          }`}
          title={isAudioMuted ? 'Turn on microphone (M)' : 'Turn off microphone (M)'}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
        </button>

        {/* 2. Video Camera Button (Google Meet style) */}
        <button
          id="btn-toggle-camera"
          type="button"
          onClick={onToggleVideo}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
            isVideoOff
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
          }`}
          title={isVideoOff ? 'Turn on camera (V)' : 'Turn off camera (V)'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-cyan-400" />}
        </button>

        {/* 3. WHITEBOARD OVERLAY TOGGLE (Tailored for Technical Drawing Classrooms) */}
        <button
          id="btn-toggle-whiteboard-overlay"
          type="button"
          onClick={() => {
            if (onToggleWhiteboardOverlay) {
              onToggleWhiteboardOverlay();
            } else {
              onChangeLayoutMode(isWhiteboardActive ? 'SPLIT_EQUAL' : 'WHITEBOARD_OVERLAY');
            }
          }}
          className={`flex items-center gap-1.5 px-3.5 h-11 rounded-xl transition-all font-semibold text-xs border ${
            isWhiteboardActive
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30 font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
          }`}
          title="Toggle Technical Drawing Whiteboard Overlay (W) — Draw with T-Square, Compass & 30/60 Triangles"
        >
          <PencilRuler className="w-4 h-4" />
          <span className="hidden sm:inline">Whiteboard Overlay</span>
        </button>

        {/* 4. Screen Share Button */}
        <button
          id="btn-share-screen"
          type="button"
          onClick={onToggleScreenShare}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
            isScreenSharing
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
          title={isScreenSharing ? 'Stop sharing screen' : 'Share screen or window'}
        >
          <Monitor className="w-5 h-5 text-purple-300" />
        </button>

        {/* 5. Raise Hand (Student) / Clear Hands or Laser (Teacher) */}
        {isTeacher ? (
          /* Laser Pointer for Technical Drawing Teacher */
          <button
            id="btn-toggle-laser"
            type="button"
            onClick={onToggleLaserPointer}
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
              isLaserActive
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 font-bold border border-red-400'
                : 'bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700'
            }`}
            title="Toggle Laser Pointer on Drafting Canvas"
          >
            <Pointer className="w-5 h-5" />
          </button>
        ) : (
          /* Student Raise Hand Button */
          <button
            id="btn-raise-hand"
            type="button"
            onClick={onToggleHandRaise}
            className={`flex items-center gap-1.5 px-3 h-11 rounded-xl transition-all text-xs font-semibold ${
              isHandRaised
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
            }`}
            title={isHandRaised ? 'Lower hand (H)' : 'Raise hand to ask question (H)'}
          >
            <Hand className="w-4 h-4" />
            <span className="hidden md:inline">{isHandRaised ? 'Hand Up' : 'Raise'}</span>
          </button>
        )}

        {/* 6. LIVE VIRTUAL CLASSROOM REACTIONS TRAY */}
        <div className="relative" ref={reactionsRef}>
          <button
            id="btn-reactions-tray"
            type="button"
            onClick={() => setShowReactionsPicker(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 h-11 rounded-xl transition-all text-xs font-semibold ${
              showReactionsPicker
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg shadow-pink-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-pink-300 border border-slate-700'
            }`}
            title="Send live classroom reaction (Applause, Heart, Thumbs Up, Sparkles)"
          >
            <Smile className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">React</span>
          </button>

          {/* Floating Reaction Drawer Popover */}
          {showReactionsPicker && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl flex items-center gap-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {REACTION_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => {
                    if (onSendReaction) onSendReaction(opt.emoji, opt.type);
                    setShowReactionsPicker(false);
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-slate-800 flex items-center justify-center text-lg sm:text-xl transition-transform hover:scale-125 active:scale-95"
                  title={`${opt.label} (${opt.emoji})`}
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 7. Teacher Drawing Permission Selector */}
        {isTeacher && (
          <div className="hidden lg:flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onChangeDrawingPermission('TEACHER_ONLY')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                drawingPermissionMode === 'TEACHER_ONLY'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Teacher Only: Students view demonstration only"
            >
              <Lock className="w-3 h-3" />
              <span>Teacher Mode</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeDrawingPermission('COLLABORATIVE')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                drawingPermissionMode === 'COLLABORATIVE'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Collaborative: Students can draw on the whiteboard"
            >
              <Unlock className="w-3 h-3" />
              <span>All Draw</span>
            </button>
          </div>
        )}

        {/* 8. Red End / Leave Call Pill Button (Iconic Google Meet) */}
        <button
          id="btn-leave-live-class"
          type="button"
          onClick={onEndOrLeaveClass}
          className="flex items-center justify-center w-14 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/40 transition-all ml-1 cursor-pointer"
          title={isTeacher ? 'End class for all students' : 'Leave meeting'}
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* ================= RIGHT SECTION: LAYOUT CHOOSER & IN-CALL CHAT ================= */}
      <div className="flex items-center gap-2">
        {/* Mobile & Tablet Quick View Switcher */}
        <div className="flex xl:hidden items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 gap-0.5">
          <button
            type="button"
            onClick={() => onChangeLayoutMode('FULL_BOARD')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              layoutMode === 'FULL_BOARD' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Show full Whiteboard only"
          >
            Board
          </button>
          <button
            type="button"
            onClick={() => onChangeLayoutMode('SPLIT_EQUAL')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              layoutMode === 'SPLIT_EQUAL' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Show Whiteboard and Video split 50:50"
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => onChangeLayoutMode('GRID')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              layoutMode === 'GRID' || layoutMode === 'ACTIVE_SPEAKER' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Show Students Video Gallery"
          >
            Video
          </button>
        </div>

        {/* Layout Mode Selector (Desktop) */}
        <div className="hidden xl:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => onChangeLayoutMode('ACTIVE_SPEAKER')}
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              layoutMode === 'ACTIVE_SPEAKER' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Speaker Stage + Thumbnail Strip"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Speaker</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeLayoutMode('GRID')}
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              layoutMode === 'GRID' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Participant Video Grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeLayoutMode('SPLIT_EQUAL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              layoutMode === 'SPLIT_EQUAL' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="50:50 Side-by-side Whiteboard & Video"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split 50:50</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeLayoutMode('WHITEBOARD_OVERLAY')}
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              layoutMode === 'WHITEBOARD_OVERLAY' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Whiteboard with Floating Participant Video Overlay"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overlay</span>
          </button>
        </div>

        {/* Chat / In-Call Messaging Drawer Toggle */}
        <button
          id="btn-toggle-live-chat"
          type="button"
          onClick={onToggleChat}
          className={`relative flex items-center justify-center w-11 h-11 rounded-xl border transition-all ${
            isChatOpen
              ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
          title="In-call chat and student messages"
        >
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-md">
              {unreadChatCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
