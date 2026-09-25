import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProcedurePanel } from './components/curriculum/ProcedurePanel';
import { DrawingCanvas } from './components/drafting/DrawingCanvas';
import { allCurriculumTopics } from './data/curriculumData';
import { SubscriptionProvider } from './context/SubscriptionContext';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

class StudioErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Studio render crash:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col justify-center items-center">
          <div className="max-w-lg w-full bg-red-950/90 border border-red-500 rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-red-400 mb-2">Studio Component Check</h2>
            <p className="text-xs text-slate-300 mb-3">Here is the exact missing hook or property:</p>
            <pre className="bg-black/70 p-3 rounded text-xs text-red-300 overflow-x-auto whitespace-pre-wrap font-mono mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold"
            >
              Reset to Landing
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO' | 'TEACHER' | 'PARENT'>('LANDING');
  const [currentTopic, setCurrentTopic] = useState<any>(allCurriculumTopics?.[0] || null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedTier, setSelectedTier] = useState<any>('JSS1');

  return (
    <SubscriptionProvider>
      <StudioErrorBoundary>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
          {currentView === 'LANDING' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-4xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/80 mb-6">
                NERDC Curriculum Aligned &bull; Technical Drawing & Basic Tech
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Master Technical Drawing & CAD Step-by-Step
              </h1>
              <p className="text-slate-400 text-base max-w-2xl mb-8">
                Interactive geometric constructions, orthographic projections, isometric drafting, and examination modules.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentView('STUDIO')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl"
                >
                  Launch Interactive Studio
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900">
              <Header onReturnHome={() => setCurrentView('LANDING')} />
              <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                  selectedTier={selectedTier}
                  onSelectTier={setSelectedTier}
                  currentTopic={currentTopic}
                  onSelectTopic={(topic: any) => {
                    setCurrentTopic(topic);
                    setCurrentStepIndex(0);
                  }}
                />
                <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
                  <DrawingCanvas topic={currentTopic} stepIndex={currentStepIndex} />
                  {currentTopic && (
                    <ProcedurePanel
                      topic={currentTopic}
                      currentStepIndex={currentStepIndex}
                      onStepChange={setCurrentStepIndex}
                    />
                  )}
                </main>
              </div>
            </div>
          )}
        </div>
      </StudioErrorBoundary>
    </SubscriptionProvider>
  );
}
