import React from 'react';
import { 
  Video, 
  Tv, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  Layers, 
  Compass, 
  PenTool, 
  MonitorPlay,
  Share2,
  Mic,
  Camera
} from 'lucide-react';

interface LiveClassroomSpotlightProps {
  onOpenLiveClass: () => void;
  onOpenVideoTour: () => void;
}

export const LiveClassroomSpotlight: React.FC<LiveClassroomSpotlightProps> = ({
  onOpenLiveClass,
  onOpenVideoTour
}) => {
  return (
    <section id="live-class" className="py-16 sm:py-24 bg-slate-900/40 relative overflow-hidden border-t border-slate-800/80">
      {/* Glow Effects */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Interactive Simulated Live Classroom Stage */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl bg-slate-950 border border-slate-700/80 overflow-hidden shadow-2xl shadow-purple-950/40">
              
              {/* Virtual Classroom Bar */}
              <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <div className="text-xs font-bold text-white">
                    Room: <span className="font-mono text-cyan-400">TD-SS2-8821</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    • 34 Students Connected
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-950/80 border border-purple-500/40 text-purple-300 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold">
                  <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span>LIVE BROADCAST</span>
                </div>
              </div>

              {/* Classroom Drawing Canvas & Video Feeds */}
              <div className="relative aspect-[16/10] bg-slate-950 p-4 flex flex-col justify-between overflow-hidden">
                {/* Simulated Technical Vector Grid with T-Square and Set Square in action */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
                
                {/* Vector Geometry Canvas Simulation */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <svg className="w-full h-full text-cyan-400 opacity-90" viewBox="0 0 500 300" fill="none">
                    {/* Isometric Cube and Construction Rays */}
                    <path d="M 250 80 L 360 140 L 360 240 L 250 180 Z" stroke="#38bdf8" strokeWidth="2" fill="#0284c7" fillOpacity="0.1" />
                    <path d="M 250 80 L 140 140 L 140 240 L 250 180 Z" stroke="#38bdf8" strokeWidth="2" fill="#0369a1" fillOpacity="0.15" />
                    <path d="M 250 80 L 360 140 L 250 200 L 140 140 Z" stroke="#38bdf8" strokeWidth="2" fill="#0284c7" fillOpacity="0.25" />
                    
                    {/* 30-degree isometric projection rays (2H Lead) */}
                    <line x1="140" y1="240" x2="360" y2="240" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="250" y1="30" x2="250" y2="280" stroke="#ef4444" strokeWidth="1" strokeDasharray="8 4" />
                    
                    {/* Teacher Laser Pointer Spotlight */}
                    <circle cx="250" cy="180" r="16" fill="#ec4899" fillOpacity="0.2" className="animate-ping" style={{ animationDuration: '3s' }} />
                    <circle cx="250" cy="180" r="4" fill="#f43f5e" />
                    <text x="260" y="175" fill="#f43f5e" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      Engr. Adebayo: "Vertex (0,0,0)"
                    </text>
                  </svg>
                </div>

                {/* Floating Teacher & Student WebRTC Video Feeds */}
                <div className="relative z-10 flex items-start justify-between">
                  {/* Teacher Video PIP */}
                  <div className="w-32 sm:w-36 rounded-xl bg-slate-900/90 border border-purple-500/50 p-1.5 shadow-xl backdrop-blur-sm">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-800">
                      <img
                        src="/assets/african_higher_inst_cad_lab.jpg"
                        alt="Instructor presenting technical drawing lesson"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white font-bold">
                        Engr. Adebayo
                      </span>
                    </div>
                  </div>

                  {/* Smart Board Projection Button */}
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 font-mono flex items-center gap-2">
                    <Tv className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Projector Mode Active</span>
                  </div>
                </div>

                {/* Bottom Canvas Controls Strip */}
                <div className="relative z-10 p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Multi-Student Collaboration: Read/Write Permission Enabled</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Latency: 32ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Educational Value Details */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold">
              <Video className="w-4 h-4 text-purple-400" />
              <span>Real-Time Virtual Drawing Classroom</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Teach Complex Drafting in Real-Time to Any Classroom or Device
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Empower technical drawing instructors to demonstrate intricate geometric constructions live on classroom smart boards, beamers, or remote mobile screens with zero lag.
              </p>
            </div>

            <div className="space-y-3.5 pt-1 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <Tv className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Smart Board Classroom Projection Mode
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    High-contrast millimeter grid with magnified cursor and teacher laser spotlight optimized for physical school projectors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <Users className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    2-Way Synchronized Vector Whiteboard
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Invite students to the board to demonstrate their compass arcs and bisections while the whole class observes and learns.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Instant Assignment Dispatch & Evaluation
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Send practical drawing worksheets directly to student tablets with automated marking rubrics and instant feedback.
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenLiveClass}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Video className="w-4 h-4" />
                <span>Join or Host Live Classroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVideoTour}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-all"
              >
                <span>Watch Video Tour</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
