import React, { useState } from 'react';
import { Tv, Play, Monitor, X } from 'lucide-react';

interface SmartBoardStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchSession: (config: { roomCode: string; displayMode: string; laserPointer: boolean }) => void;
}

export const SmartBoardStartupModal: React.FC<SmartBoardStartupModalProps> = ({
  isOpen,
  onClose,
  onLaunchSession
}) => {
  const [roomCode, setRoomCode] = useState<string>(() => `SB-${Math.floor(1000 + Math.random() * 9000)}`);
  const [displayMode, setDisplayMode] = useState<string>('FULLSCREEN_PROJECTOR');
  const [laserPointer, setLaserPointer] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Smart Board & Projector Mode</h3>
              <p className="text-[11px] text-slate-400">Wireless classroom display & interactive projection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Projector Session Code / ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="SB-8821"
              />
              <button
                onClick={() => setRoomCode(`SB-${Math.floor(1000 + Math.random() * 9000)}`)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Display Profile</label>
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="FULLSCREEN_PROJECTOR">Full-Screen Interactive Projector (16:9)</option>
              <option value="DUAL_SCREEN_MIRROR">Dual-Screen Tablet & Smart Board Mirror</option>
              <option value="WHITEBOARD_STREAM">Interactive Whiteboard Cast Mode</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">Enable Laser Pointer & Annotation Tool</span>
            </div>
            <input
              type="checkbox"
              checked={laserPointer}
              onChange={(e) => setLaserPointer(e.target.checked)}
              className="w-4 h-4 accent-cyan-600 rounded cursor-pointer"
            />
          </div>

          <button
            onClick={() => onLaunchSession({ roomCode, displayMode, laserPointer })}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Launch Smart Board Session
          </button>
        </div>
      </div>
    </div>
  );
};
