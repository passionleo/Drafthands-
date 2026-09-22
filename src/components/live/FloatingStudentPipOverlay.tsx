import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  X, 
  Minimize2, 
  Maximize2, 
  GripHorizontal, 
  Mic, 
  MicOff, 
  Hand, 
  VolumeX, 
  Columns, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Pin, 
  Lock, 
  Unlock, 
  CornerDownRight, 
  Layers, 
  Radio, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Film
} from 'lucide-react';
import { LiveParticipant } from '../../types/liveClass';
import { MediaStreamErrorDetails } from '../../services/mediaStreamService';
import africanStudentsImg from '../../assets/images/african_students_technical_drawing_1788361928984.jpg';
import africanCadLabImg from '../../assets/images/african_higher_inst_cad_lab_1788361956625.jpg';

export type PipDisplayMode = 'EXPANDED_GRID' | 'COMPACT_FILMSTRIP' | 'MINIMIZED_PILL';
export type PipCornerPosition = 'TOP_RIGHT' | 'TOP_LEFT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT';

interface FloatingStudentPipOverlayProps {
  participants: LiveParticipant[];
  localParticipantId: string;
  localStream: MediaStream | null;
  remoteStreams?: Record<string, MediaStream>;
  mediaError?: MediaStreamErrorDetails | null;
  onRetryMedia?: () => void;
  isTeacher: boolean;
  onToggleSpotlight?: (id: string) => void;
  onToggleParticipantAudio?: (id: string) => void;
  onToggleParticipantDrawingPermission?: (id: string) => void;
  onMuteAllStudents?: () => void;
  onLowerAllHands?: () => void;
  onRestoreSplitView?: () => void;
  onClose?: () => void;
  activeTopicTitle?: string;
  initialCorner?: PipCornerPosition;
}

export const FloatingStudentPipOverlay: React.FC<FloatingStudentPipOverlayProps> = ({
  participants,
  localParticipantId,
  localStream,
  remoteStreams = {},
  mediaError,
  onRetryMedia,
  isTeacher,
  onToggleSpotlight,
  onToggleParticipantAudio,
  onToggleParticipantDrawingPermission,
  onMuteAllStudents,
  onLowerAllHands,
  onRestoreSplitView,
  onClose,
  activeTopicTitle,
  initialCorner = 'TOP_RIGHT'
}) => {
  // Display layout mode: 
  // 'EXPANDED_GRID' = 2x2 grid, 
  // 'COMPACT_FILMSTRIP' = horizontal row, 
  // 'MINIMIZED_PILL' = compact floating badge
  const [displayMode, setDisplayMode] = useState<PipDisplayMode>('EXPANDED_GRID');
  
  // Transparency mode: 1 = solid, 0.85 = translucent, 0.55 = glass
  const [opacityLevel, setOpacityLevel] = useState<number>(0.92);

  // Floating coordinates in pixels
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Separate Teacher from Students
  const teacher = participants.find(p => p.role === 'TEACHER') || participants[0];
  const students = participants.filter(p => p.id !== teacher?.id);
  const handsRaisedCount = students.filter(s => s.isHandRaised).length;

  // Student simulated photo avatars map
  const studentPhotoMap: Record<string, string> = {
    'student-1': africanStudentsImg,
    'student-2': africanStudentsImg,
    'student-3': africanCadLabImg,
    'student-4': africanStudentsImg
  };

  // Position presets helper
  const snapToCorner = (corner: PipCornerPosition) => {
    const margin = 16;
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const width = displayMode === 'COMPACT_FILMSTRIP' ? 480 : displayMode === 'MINIMIZED_PILL' ? 240 : 340;
    const height = displayMode === 'MINIMIZED_PILL' ? 48 : 360;

    switch (corner) {
      case 'TOP_RIGHT':
        setPosition({ x: windowW - width - margin, y: 70 });
        break;
      case 'TOP_LEFT':
        setPosition({ x: margin, y: 70 });
        break;
      case 'BOTTOM_RIGHT':
        setPosition({ x: windowW - width - margin, y: windowH - height - margin - 70 });
        break;
      case 'BOTTOM_LEFT':
        setPosition({ x: margin, y: windowH - height - margin - 70 });
        break;
    }
  };

  // Set initial position based on initialCorner
  useEffect(() => {
    snapToCorner(initialCorner);
  }, []);

  // Handle local video stream attachment
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Dragging event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag from header handle
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragOffsetRef.current.x;
      const newY = e.clientY - dragOffsetRef.current.y;

      // Bound within viewport boundaries
      const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 320) - 8;
      const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 100) - 8;

      setPosition({
        x: Math.max(8, Math.min(newX, maxX)),
        y: Math.max(50, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // If in Minimized Pill Mode, render ultra-compact floating widget
  if (displayMode === 'MINIMIZED_PILL') {
    return (
      <div
        ref={containerRef}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        onMouseDown={handleMouseDown}
        className="fixed z-50 flex items-center gap-2.5 px-3 py-2 bg-slate-900/95 border border-cyan-500/40 rounded-full shadow-2xl backdrop-blur-md cursor-grab active:cursor-grabbing select-none text-xs transition-shadow hover:border-cyan-400"
      >
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Users className="w-3.5 h-3.5" />
          <span>{students.length} Students</span>
        </div>

        {handsRaisedCount > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/40 animate-pulse">
            <Hand className="w-3 h-3" />
            <span>{handsRaisedCount}</span>
          </span>
        )}

        <div className="flex items-center gap-1 pl-1 border-l border-slate-700">
          <button
            type="button"
            onClick={() => setDisplayMode('EXPANDED_GRID')}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Expand Student Video Grid"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Close Floating PiP"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        backgroundColor: `rgba(15, 23, 42, ${opacityLevel})`
      }}
      className={`fixed z-50 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md flex flex-col select-none overflow-hidden transition-all duration-75 ${
        displayMode === 'COMPACT_FILMSTRIP' 
          ? 'w-[480px] max-w-[95vw]' 
          : 'w-[350px] max-w-[90vw]'
      }`}
    >
      {/* 1. DRAGGABLE WINDOW HEADER */}
      <div
        onMouseDown={handleMouseDown}
        className={`px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between cursor-grab active:cursor-grabbing text-xs ${
          isDragging ? 'cursor-grabbing bg-cyan-950/40' : ''
        }`}
      >
        {/* Left: Window Title & Status */}
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-slate-500 hover:text-cyan-400 transition-colors" />
          <div className="flex items-center gap-1.5 font-bold font-mono text-cyan-300">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            <span>STUDENT PiP</span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({students.length})
            </span>
          </div>
          {handsRaisedCount > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
              <Hand className="w-2.5 h-2.5" />
              <span>{handsRaisedCount}</span>
            </span>
          )}
        </div>

        {/* Right: Window Controls (Layout, Corner Snap, Opacity, Minimize, Close) */}
        <div className="flex items-center gap-1">
          {/* Transparency Toggle */}
          <button
            type="button"
            onClick={() => setOpacityLevel(prev => prev === 0.92 ? 0.65 : prev === 0.65 ? 1 : 0.92)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={`Toggle Window Opacity (Current: ${Math.round(opacityLevel * 100)}%)`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Quick Corner Snap Selector Dropdown */}
          <div className="flex items-center gap-0.5 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
            <button
              type="button"
              onClick={() => snapToCorner('TOP_LEFT')}
              className="text-[9px] font-mono text-slate-400 hover:text-cyan-300 px-1"
              title="Snap to Top-Left"
            >
              ↖
            </button>
            <button
              type="button"
              onClick={() => snapToCorner('TOP_RIGHT')}
              className="text-[9px] font-mono text-slate-400 hover:text-cyan-300 px-1"
              title="Snap to Top-Right"
            >
              ↗
            </button>
            <button
              type="button"
              onClick={() => snapToCorner('BOTTOM_RIGHT')}
              className="text-[9px] font-mono text-slate-400 hover:text-cyan-300 px-1"
              title="Snap to Bottom-Right"
            >
              ↘
            </button>
            <button
              type="button"
              onClick={() => snapToCorner('BOTTOM_LEFT')}
              className="text-[9px] font-mono text-slate-400 hover:text-cyan-300 px-1"
              title="Snap to Bottom-Left"
            >
              ↙
            </button>
          </div>

          {/* Switch Grid vs Filmstrip */}
          <button
            type="button"
            onClick={() => setDisplayMode(prev => prev === 'EXPANDED_GRID' ? 'COMPACT_FILMSTRIP' : 'EXPANDED_GRID')}
            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
            title={displayMode === 'EXPANDED_GRID' ? 'Switch to Horizontal Filmstrip' : 'Switch to 2-Column Grid'}
          >
            {displayMode === 'EXPANDED_GRID' ? <Film className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
          </button>

          {/* Minimize to Pill */}
          <button
            type="button"
            onClick={() => setDisplayMode('MINIMIZED_PILL')}
            className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
            title="Minimize to Floating Badge"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {/* Restore Full Split View */}
          {onRestoreSplitView && (
            <button
              type="button"
              onClick={onRestoreSplitView}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restore 50:50 Split View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Close PiP */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Hide Student Overlay"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. TEACHER QUICK CONTROL ACTIONS BAR */}
      {isTeacher && (
        <div className="px-3 py-1.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Class Monitoring:</span>
          <div className="flex items-center gap-1.5">
            {onMuteAllStudents && (
              <button
                type="button"
                onClick={onMuteAllStudents}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 flex items-center gap-1 transition-colors border border-slate-700"
                title="Mute all students"
              >
                <VolumeX className="w-3 h-3 text-red-400" />
                <span>Mute All</span>
              </button>
            )}
            {onLowerAllHands && handsRaisedCount > 0 && (
              <button
                type="button"
                onClick={onLowerAllHands}
                className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center gap-1 transition-colors border border-amber-500/40"
                title="Lower all hands"
              >
                <Hand className="w-3 h-3" />
                <span>Clear Hands</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. STUDENT VIDEO FEEDS VIEWPORT */}
      <div 
        className={`p-2 overflow-y-auto max-h-[50vh] custom-scrollbar ${
          displayMode === 'COMPACT_FILMSTRIP' 
            ? 'flex items-center gap-2 overflow-x-auto overflow-y-hidden max-h-none' 
            : 'grid grid-cols-2 gap-2'
        }`}
      >
        {students.map((student) => {
          const isLocal = student.id === localParticipantId;
          const photoUrl = studentPhotoMap[student.id] || africanStudentsImg;

          return (
            <div
              key={student.id}
              className={`relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-md transition-all ${
                displayMode === 'COMPACT_FILMSTRIP' ? 'w-36 h-28 shrink-0' : 'aspect-video'
              } ${student.isSpeaking ? 'ring-2 ring-emerald-500 shadow-emerald-950/50' : ''} ${
                student.isHandRaised ? 'ring-2 ring-amber-500 shadow-amber-950/50' : ''
              }`}
            >
              {/* Student Live Video or Fallback Avatar */}
              {(() => {
                const stream = isLocal ? localStream : remoteStreams[student.id];
                const hasLiveVideoTrack = Boolean(
                  stream && stream.getVideoTracks().some(track => track.enabled && track.readyState === 'live')
                );
                const shouldRenderVideo = !student.isVideoOff && hasLiveVideoTrack;

                if (shouldRenderVideo && stream) {
                  return (
                    <video
                      ref={el => {
                        if (el && el.srcObject !== stream) {
                          el.srcObject = stream;
                          el.play().catch(() => {});
                        }
                      }}
                      autoPlay
                      playsInline
                      muted={isLocal}
                      className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
                    />
                  );
                }

                if (!student.isVideoOff && photoUrl && !isLocal) {
                  return (
                    <div className="w-full h-full relative">
                      <img
                        src={photoUrl}
                        alt={student.name}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    </div>
                  );
                }

                return (
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-900"
                    style={{ backgroundColor: `${student.avatarBg}20` }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/20 ${
                        student.isSpeaking ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-950 animate-pulse' : ''
                      }`}
                      style={{ backgroundColor: student.avatarBg }}
                    >
                      {student.name.substring(0, 2).toUpperCase()}
                    </div>
                    {isLocal && mediaError ? (
                      <span className="text-[9px] text-red-400 mt-1 font-mono">Camera Blocked</span>
                    ) : (
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">
                        {student.isVideoOff ? 'Camera Off' : 'Audio Only'}
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Hand Raised Banner */}
              {student.isHandRaised && (
                <div className="absolute top-1 left-1 z-10 flex items-center gap-1 bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-md animate-bounce">
                  <Hand className="w-2.5 h-2.5" />
                  <span>Question</span>
                </div>
              )}

              {/* Drawing Permission Indicator */}
              {student.hasDrawingPermission && (
                <div className="absolute top-1 right-1 z-10 bg-cyan-500/90 text-slate-950 px-1 py-0.5 rounded text-[9px] font-bold shadow-md" title="Has permission to draw on board">
                  ✏️
                </div>
              )}

              {/* Bottom Identity & Audio Status Strip */}
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-slate-950/95 to-transparent flex items-center justify-between text-[10px] font-mono">
                <span className="text-white font-semibold truncate max-w-[85px]" title={student.name}>
                  {student.name}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  {student.isSpeaking ? (
                    <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                      <Mic className="w-2.5 h-2.5" />
                      <div className="flex items-end gap-0.5 h-2 w-2">
                        <span className="w-0.5 bg-emerald-400 h-full animate-pulse" />
                        <span className="w-0.5 bg-emerald-400 h-1/2" />
                      </div>
                    </div>
                  ) : student.isAudioMuted ? (
                    <div className="p-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/30">
                      <MicOff className="w-2.5 h-2.5" />
                    </div>
                  ) : null}

                  {/* Teacher Quick Audio Toggle */}
                  {isTeacher && onToggleParticipantAudio && (
                    <button
                      type="button"
                      onClick={() => onToggleParticipantAudio(student.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-opacity"
                      title={student.isAudioMuted ? "Unmute Student" : "Mute Student"}
                    >
                      {student.isAudioMuted ? <Mic className="w-2.5 h-2.5" /> : <MicOff className="w-2.5 h-2.5 text-red-400" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. FOOTER NOTE */}
      <div className="px-3 py-1 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Drag header to move anywhere</span>
        <span>PiP Overlay Active</span>
      </div>
    </div>
  );
};
