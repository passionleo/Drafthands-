import React from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  FastForward,
  CheckCircle2,
  Award
} from 'lucide-react';

interface StepPlayerControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onGoToStep: (step: number) => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (s: number) => void;
  onOpenSelfAssessment?: () => void;
}

export const StepPlayerControls: React.FC<StepPlayerControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onGoToStep,
  onReset,
  speed,
  onChangeSpeed,
  onOpenSelfAssessment
}) => {
  const isLastStep = currentStep >= totalSteps;
  const isFirstStep = currentStep <= 1;

  const toggleSpeed = () => {
    if (speed === 1) onChangeSpeed(1.5);
    else if (speed === 1.5) onChangeSpeed(2);
    else if (speed === 2) onChangeSpeed(0.75);
    else onChangeSpeed(1);
  };

  return (
    <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-col gap-2.5 shrink-0 select-none">
      {/* Scrubber dots / Step tabs */}
      <div className="flex items-center gap-1.5 w-full">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <button
              key={stepNum}
              id={`scrubber-step-${stepNum}`}
              onClick={() => onGoToStep(stepNum)}
              className={`flex-1 h-2 rounded-full transition-all duration-200 relative group ${
                isCurrent
                  ? 'bg-cyan-400 ring-2 ring-cyan-400/40 ring-offset-1 ring-offset-slate-900'
                  : isCompleted
                  ? 'bg-cyan-700 hover:bg-cyan-600'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Jump to Step ${stepNum}`}
            >
              {/* Tooltip on hover */}
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap z-30 shadow-lg">
                Step {stepNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Playback Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Step indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-200">
            Step <span className="text-cyan-400 text-sm">{currentStep}</span> of {totalSteps}
          </span>
          {isLastStep && (
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
              {onOpenSelfAssessment && (
                <button
                  id="btn-take-self-assessment"
                  onClick={onOpenSelfAssessment}
                  className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white text-[10px] font-bold font-mono flex items-center gap-1 shadow-md shadow-emerald-950 transition-all cursor-pointer"
                  title="Take mandatory 5-question self-assessment for this topic"
                >
                  <Award className="w-3 h-3" />
                  <span>5-Q Assessment</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Center: Play, Prev, Next */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-prev-step"
            onClick={onPrevStep}
            disabled={isFirstStep}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="btn-play-pause"
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
            }`}
            title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play Step Simulation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Auto-Draw</span>
              </>
            )}
          </button>

          <button
            id="btn-next-step"
            onClick={onNextStep}
            disabled={isLastStep}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speed & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-speed"
            onClick={toggleSpeed}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
            title="Toggle Playback Speed"
          >
            <FastForward className="w-3 h-3 text-cyan-400" />
            <span>{speed}x</span>
          </button>

          <button
            id="btn-reset-steps"
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
