import React from 'react';
import { LiveReactionEvent } from '../../types/liveClass';

interface LiveReactionsOverlayProps {
  reactions: LiveReactionEvent[];
}

export const LiveReactionsOverlay: React.FC<LiveReactionsOverlayProps> = ({ reactions }) => {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {reactions.map((reaction, index) => {
        // Distribute bubbles across screen horizontally with pseudo-random offset
        const leftPercent = 20 + ((index * 17 + (reaction.timestamp % 50)) % 60);

        return (
          <div
            key={reaction.id}
            className="absolute bottom-16 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-white shadow-2xl backdrop-blur-md animate-float-up"
            style={{
              left: `${leftPercent}%`,
              animation: 'floatAndFade 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
            }}
          >
            <span className="text-2xl animate-bounce">{reaction.emoji}</span>
            <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
              {reaction.senderName}
            </span>
          </div>
        );
      })}

      <style>{`
        @keyframes floatAndFade {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.7);
          }
          15% {
            opacity: 1;
            transform: translateY(-20px) scale(1.05);
          }
          30% {
            transform: translateY(-60px) scale(1);
          }
          75% {
            opacity: 0.9;
            transform: translateY(-160px) scale(0.95);
          }
          100% {
            opacity: 0;
            transform: translateY(-260px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};
