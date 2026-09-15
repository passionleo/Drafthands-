// Drafthands Interactive Drafting Instrument Engine
import React, { useState } from 'react';

export function InteractiveDraftingBoard() {
  const [activeTool, setActiveTool] = useState<'t-square' | 'set-square' | 'pencil'>('t-square');
  
  // Instrument Transformation States
  const [tSquarePos, setTSquarePos] = useState({ x: 50, y: 100, rotation: 0 });
  const [setSquarePos, setSetSquarePos] = useState({ x: 250, y: 150, rotation: 0 });
  
  // Drawing Canvas State
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [currentLine, setCurrentLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // Handle Dragging / Sliding Instruments
  const handleDragInstrument = (instrument: 't-square' | 'set-square', e: React.PointerEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (instrument === 't-square') {
        setTSquarePos(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      } else {
        setSetSquarePos(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Handle Rotation (e.g., sliding and angling set-squares)
  const rotateInstrument = (instrument: 't-square' | 'set-square', angleDelta: number) => {
    if (instrument === 't-square') {
      setTSquarePos(prev => ({ ...prev, rotation: (prev.rotation + angleDelta) % 360 }));
    } else {
      setSetSquarePos(prev => ({ ...prev, rotation: (prev.rotation + angleDelta) % 360 }));
    }
  };

  // Handle Board Drawing along Instrument Edges
  const startDrawingLine = (e: React.PointerEvent) => {
    if (activeTool !== 'pencil') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setCurrentLine({ x1: x, y1: y, x2: x, y2: y });
  };

  const drawLineMove = (e: React.PointerEvent) => {
    if (!isDrawing || !currentLine) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine(prev => prev ? { ...prev, x2: x, y2: y } : null);
  };

  const endDrawingLine = () => {
    if (isDrawing && currentLine) {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
      setIsDrawing(false);
    }
  };

  return (
    <div className="relative w-full h-[650px] bg-slate-900 border border-slate-700 rounded-xl overflow-hidden select-none flex">
      {/* Workspace Drawing Board */}
      <div 
        className="flex-1 relative cursor-crosshair bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]"
        onPointerDown={startDrawingLine}
        onPointerMove={drawLineMove}
        onPointerUp={endDrawingLine}
      >
        {/* Rendered Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {lines.map((l, idx) => (
            <line key={idx} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          ))}
          {currentLine && (
            <line x1={currentLine.x1} y1={currentLine.y1} x2={currentLine.x2} y2={currentLine.y2} stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
          )}
        </svg>

        {/* Interactive T-Square */}
        <div
          className="absolute cursor-grab active:cursor-grabbing group"
          style={{ transform: `translate(${tSquarePos.x}px, ${tSquarePos.y}px) rotate(${tSquarePos.rotation}deg)` }}
          onPointerDown={(e) => handleDragInstrument('t-square', e)}
        >
          <div className="w-16 h-48 bg-slate-800 border-2 border-slate-600 rounded-l flex items-center justify-center text-xs text-slate-400 font-mono">Stock</div>
          <div className="absolute top-4 left-16 w-[400px] h-10 bg-amber-100/10 border border-amber-200/40 backdrop-blur-sm shadow-xl flex items-center px-4">
            <span className="text-[10px] text-amber-300 font-mono">T-Square Blade (Slide & Align)</span>
          </div>
        </div>

        {/* Interactive Set-Square */}
        <div
          className="absolute cursor-grab active:cursor-grabbing"
          style={{ transform: `translate(${setSquarePos.x}px, ${setSquarePos.y}px) rotate(${setSquarePos.rotation}deg)` }}
          onPointerDown={(e) => handleDragInstrument('set-square', e)}
        >
          <div className="w-48 h-48 border-2 border-cyan-500/40 bg-cyan-500/5 backdrop-blur-[2px] [clip-path:polygon(0_100%,100%_100%,0_0)] flex items-end p-2">
            <span className="text-[10px] text-cyan-300 font-mono">45° Set-Square</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar for Rotation & Tools */}
      <div className="w-64 bg-slate-950 border-l border-slate-800 p-4 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-200">Drafting Instruments</h3>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTool('pencil')}
            className={`px-3 py-2 text-xs rounded font-medium text-left transition-colors ${activeTool === 'pencil' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            ✏️ Drafting Pencil / Pen
          </button>
        </div>

        <hr className="border-slate-800" />

        <div className="flex flex-col gap-3">
          <span className="text-xs text-slate-400 font-mono">T-Square Controls</span>
          <div className="flex gap-2">
            <button onClick={() => rotateInstrument('t-square', -15)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-1.5 rounded">↺ -15°</button>
            <button onClick={() => rotateInstrument('t-square', 15)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-1.5 rounded">↻ +15°</button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs text-slate-400 font-mono">Set-Square Controls</span>
          <div className="flex gap-2">
            <button onClick={() => rotateInstrument('set-square', -30)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-1.5 rounded">↺ -30°</button>
            <button onClick={() => rotateInstrument('set-square', 30)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-1.5 rounded">↻ +30°</button>
          </div>
        </div>
      </div>
    </div>
  );
}
