import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  MessageSquare, 
  Users, 
  Share2, 
  Monitor, 
  PenTool, 
  Lock, 
  Unlock, 
  PhoneOff, 
  Layout, 
  Sparkles, 
  Radio, 
  SlidersHorizontal,
  Pointer,
  Columns,
  Square,
  Maximize2,
  PictureInPicture
} from 'lucide-react';
import { DrawingPermissionMode, VideoLayoutMode } from '../../types/liveClass';

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
}

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
  onEndOrLeaveClass
}) => {
  return (
    <div className="h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 flex items-center justify-between z-30 select-none shadow-2xl">
      {/* Left: Class Info & Live/Recording Indicators */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>LIVE CLASS</span>
        </div>

        {isRecording && (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            <span>REC 1080p</span>
          </div>
        )}
      </div>

      {/* Center: Core Meeting Action Controls */}
      <div className="flex items-center gap-2">
        {/* Audio Mic Button */}
        <button
          id="btn-toggle-mic"
          onClick={onToggleAudio}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
            isAudioMuted
              ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400'
              : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-emerald-400'
          }`}
          title={isAudioMuted ? 'Unmute Microphone (M)' : 'Mute Microphone (M)'}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Cam Button */}
        <button
          id="btn-toggle-camera"
          onClick={onToggleVideo}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
            isVideoOff
              ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400'
              : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-cyan-400'
          }`}
          title={isVideoOff ? 'Start Camera Video (V)' : 'Stop Camera Video (V)'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Laser Pointer (Teacher Only) */}
        {isTeacher && (
          <button
            id="btn-toggle-laser"
            onClick={onToggleLaserPointer}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all ${
              isLaserActive
                ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30 font-bold'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-red-400'
            }`}
            title="Toggle Laser Pointer Spotlight on Students' Screens"
          >
            <Pointer className="w-4 h-4" />
            <span className="text-xs font-semibold hidden md:inline">Laser</span>
          </button>
        )}

        {/* Student Drawing Permission Selector (Teacher Only) */}
        {isTeacher ? (
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onChangeDrawingPermission('TEACHER_ONLY')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                drawingPermissionMode === 'TEACHER_ONLY'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Teacher Only Mode: Students cannot draw or modify board elements"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden lg:inline">Teacher Only</span>
            </button>

            <button
              onClick={() => onChangeDrawingPermission('COLLABORATIVE')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                drawingPermissionMode === 'COLLABORATIVE'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Collaborative Mode: All students can draw and interact on whiteboard"
            >
              <Unlock className="w-3 h-3" />
              <span className="hidden lg:inline">All Students Draw</span>
            </button>
          </div>
        ) : (
          /* Raise Hand Button for Students */
          <button
            id="btn-raise-hand"
            onClick={onToggleHandRaise}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all ${
              isHandRaised
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-amber-300'
            }`}
            title={isHandRaised ? 'Lower Hand' : 'Raise Hand to Ask Question'}
          >
            <Hand className="w-4 h-4" />
            <span className="text-xs font-semibold">{isHandRaised ? 'Hand Raised' : 'Raise Hand'}</span>
          </button>
        )}

        {/* Screen Share */}
        <button
          id="btn-share-screen"
          onClick={onToggleScreenShare}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all ${
            isScreenSharing
              ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
              : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-purple-300'
          }`}
          title="Share Desktop Screen / Application Window"
        >
          <Monitor className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Share Screen</span>
        </button>
      </div>

      {/* Right: Layout Switcher, Chat Drawer, End Call */}
      <div className="flex items-center gap-2">
        {/* Split Layout Mode Selector */}
        <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-0.5">
          <button
            onClick={() => onChangeLayoutMode('SPLIT_EQUAL')}
            className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              layoutMode === 'SPLIT_EQUAL' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="50:50 Balanced Split View (Equal Board & Video)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">50:50 Split</span>
          </button>
          <button
            onClick={() => onChangeLayoutMode('SPLIT_SIDEBAR')}
            className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              layoutMode === 'SPLIT_SIDEBAR' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="70:30 Board Focus (Wide Drawing Canvas + Video Sidebar)"
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Board Focus</span>
          </button>
          <button
            onClick={() => onChangeLayoutMode('SPLIT_STAGE')}
            className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              layoutMode === 'SPLIT_STAGE' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Video Focus (Large Classroom Video Stage + Drawing Column)"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Video Focus</span>
          </button>
          <button
            id="btn-toggle-pip"
            onClick={() => onChangeLayoutMode(layoutMode === 'FLOATING_PIP' ? 'SPLIT_EQUAL' : 'FLOATING_PIP')}
            className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              layoutMode === 'FLOATING_PIP' 
                ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-900/50' 
                : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
            }`}
            title="Toggle Draggable Picture-in-Picture Student Monitoring View"
          >
            <PictureInPicture className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">Student PiP</span>
          </button>
          <button
            onClick={() => onChangeLayoutMode('FULL_BOARD')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              layoutMode === 'FULL_BOARD' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Full Whiteboard (Maximize Canvas)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Chat & Participants Drawer Toggle */}
        <button
          id="btn-toggle-live-chat"
          onClick={onToggleChat}
          className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all ${
            isChatOpen
              ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
              : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
          }`}
          title="Open In-Class Chat & Participants Panel"
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold">{participantCount}</span>
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadChatCount}
            </span>
          )}
        </button>

        {/* End / Leave Class Button */}
        <button
          id="btn-leave-live-class"
          onClick={onEndOrLeaveClass}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
          title={isTeacher ? 'End Live Class for Everyone' : 'Leave Live Classroom'}
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">{isTeacher ? 'End Class' : 'Leave'}</span>
        </button>
      </div>
    </div>
  );
};
