import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CurriculumTier, DrawingTopic, ProceduralStep } from './types/curriculum';
import { allCurriculumTopics, getTopicById, getTopicsByTier } from './data/curriculumData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProcedurePanel } from './components/curriculum/ProcedurePanel';
import { StepPlayerControls } from './components/curriculum/StepPlayerControls';
import { DrawingCanvas } from './components/drafting/DrawingCanvas';
import { GridMode } from './components/drafting/ToolDock';
import { TheoryModal } from './components/theory/TheoryModal';
import { PracticeModal } from './components/practice/PracticeModal';
import { IsoDiagramViewer } from './components/common/IsoDiagramViewer';
import { OrthographicViewport } from './components/tools/OrthographicViewport';
import { SurfaceDevelopmentViewer, SolidShapeType } from './components/tools/SurfaceDevelopmentViewer';
import { SectionalAssemblyViewer } from './components/tools/SectionalAssemblyViewer';
import { ArchitecturalPlanViewer } from './components/tools/ArchitecturalPlanViewer';
import { TeacherPortalView } from './components/teacher/TeacherPortalView';
import { ParentPortalView } from './components/parent/ParentPortalView';
import { WhiteboardStudio } from './components/whiteboard/WhiteboardStudio';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { PaywallModal } from './components/subscription/PaywallModal';
import { LandingPage } from './components/landing/LandingPage';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

// 1. React ErrorBoundary around the app
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('DraftHands ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/50 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-white">Academy Application Recovery</h2>
            <p className="text-xs text-slate-300 font-mono">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                window.location.hash = '#landing';
                window.location.reload();
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Studio Component Wrapper
const Studio: React.FC<{ onReturnHome: () => void }> = ({ onReturnHome }) => {
  const [activeTier, setActiveTier] = useState<CurriculumTier>('SS1');
  const [activeTopicId, setActiveTopicId] = useState<string>('ss1-intro-technical-drawing');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState<boolean>(false);
  const [isIsoDiagramOpen, setIsIsoDiagramOpen] = useState<boolean>(false);
  const [isOrthographicViewportOpen, setIsOrthographicViewportOpen] = useState<boolean>(false);
  const [isSurfaceDevelopmentViewerOpen, setIsSurfaceDevelopmentViewerOpen] = useState<boolean>(false);
  const [isSectionalAssemblyViewerOpen, setIsSectionalAssemblyViewerOpen] = useState<boolean>(false);
  const [isArchitecturalPlanViewerOpen, setIsArchitecturalPlanViewerOpen] = useState<boolean>(false);
  const [isWhiteboardStudioOpen, setIsWhiteboardStudioOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [gridMode, setGridMode] = useState<GridMode>('MILLIMETER');
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeTopic = useMemo(() => getTopicById(activeTopicId) || allCurriculumTopics[0], [activeTopicId]);
  const steps = useMemo(() => activeTopic?.generateSteps ? activeTopic.generateSteps({}) : [], [activeTopic]);
  const totalSteps = steps.length || 1;

  const currentStepData = steps[Math.min(currentStep - 1, totalSteps - 1)] || {
    stepIndex: 1,
    title: activeTopic.title,
    instruction: 'Set up drawing sheet and title block according to ISO standards.',
    detailedNotes: 'Draft initial layout with 2H pencil.',
    technicalPrinciple: 'Standard ISO 128 layout and line weight hierarchy.',
    elements: [],
    activeInstrument: {
      toolType: 'TEE_SQUARE',
      x: 100,
      y: 100,
      visible: true,
      actionText: 'Align T-Square'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <Header
        activeTier={activeTier}
        onSelectTier={(tier) => {
          setActiveTier(tier);
          const topics = getTopicsByTier(tier);
          if (topics.length) setActiveTopicId(topics[0].id);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenPractice={() => setIsPracticeOpen(true)}
        onOpenIsoDiagram={() => setIsIsoDiagramOpen(true)}
        onOpenOrthographicViewport={() => setIsOrthographicViewportOpen(true)}
        onOpenSurfaceDevelopment={() => setIsSurfaceDevelopmentViewerOpen(true)}
        onOpenSectionalAssembly={() => setIsSectionalAssemblyViewerOpen(true)}
        onOpenArchitecturalPlan={() => setIsArchitecturalPlanViewerOpen(true)}
        onToggleWhiteboardStudio={() => setIsWhiteboardStudioOpen(prev => !prev)}
        isWhiteboardOpen={isWhiteboardStudioOpen}
        onResetView={() => setCurrentStep(1)}
        onExportSvg={() => {}}
        currentTopicTitle={activeTopic.title}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        onReturnToLanding={onReturnHome}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          topics={getTopicsByTier(activeTier)}
          activeTier={activeTier}
          onSelectTier={setActiveTier}
          activeTopicId={activeTopicId}
          onSelectTopic={setActiveTopicId}
          searchQuery={searchQuery}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />
        <main className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-slate-950 relative">
          {isWhiteboardStudioOpen ? (
            <div className="flex-1 h-full w-full">
              <WhiteboardStudio
                topic={activeTopic}
                onClose={() => setIsWhiteboardStudioOpen(false)}
              />
            </div>
          ) : (
            <>
              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
                  <DrawingCanvas
                    topic={activeTopic}
                    elements={currentStepData.elements || []}
                    instrument={currentStepData.activeInstrument || { toolType: 'TEE_SQUARE', x: 0, y: 0, visible: false }}
                    activeStep={currentStep}
                    totalSteps={totalSteps}
                    gridMode={gridMode}
                    onSelectGridMode={setGridMode}
                    svgRef={svgRef}
                  />
                </div>
                <StepPlayerControls
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  isPlaying={isPlaying}
                  speed={playbackSpeed}
                  onNextStep={() => setCurrentStep(s => Math.min(totalSteps, s + 1))}
                  onPrevStep={() => setCurrentStep(s => Math.max(1, s - 1))}
                  onGoToStep={setCurrentStep}
                  onReset={() => setCurrentStep(1)}
                  onTogglePlay={() => setIsPlaying(p => !p)}
                  onChangeSpeed={setPlaybackSpeed}
                />
              </div>
              <div className="w-full xl:w-[420px] shrink-0 h-full border-l border-slate-800 bg-slate-900/90 overflow-y-auto">
                <ProcedurePanel
                  step={currentStepData}
                  topic={activeTopic}
                  currentStepIndex={currentStep}
                  totalSteps={totalSteps}
                  parameters={{}}
                  onParamChange={() => {}}
                  onOpenTheory={() => setIsTheoryOpen(true)}
                  onOpenIsoDiagram={() => setIsIsoDiagramOpen(true)}
                />
              </div>
            </>
          )}
        </main>
      </div>

      <TheoryModal
        topic={activeTopic}
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />
      <PracticeModal
        topic={activeTopic}
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
      />
      {isIsoDiagramOpen && (
        <IsoDiagramViewer isOpen={isIsoDiagramOpen} onClose={() => setIsIsoDiagramOpen(false)} />
      )}
      {isOrthographicViewportOpen && (
        <OrthographicViewport isOpen={isOrthographicViewportOpen} onClose={() => setIsOrthographicViewportOpen(false)} />
      )}
      {isSurfaceDevelopmentViewerOpen && (
        <SurfaceDevelopmentViewer isOpen={isSurfaceDevelopmentViewerOpen} onClose={() => setIsSurfaceDevelopmentViewerOpen(false)} />
      )}
      {isSectionalAssemblyViewerOpen && (
        <SectionalAssemblyViewer isOpen={isSectionalAssemblyViewerOpen} onClose={() => setIsSectionalAssemblyViewerOpen(false)} />
      )}
      {isArchitecturalPlanViewerOpen && (
        <ArchitecturalPlanViewer isOpen={isArchitecturalPlanViewerOpen} onClose={() => setIsArchitecturalPlanViewerOpen(false)} />
      )}
      <OfflineIndicator />
    </div>
  );
};

function AppContent() {
  // 2. Force the initial state
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO' | 'PAST_QUESTIONS' | 'TEACHER' | 'PARENT'>('LANDING');

  // 4. In the main return, unconditionally render with zero null/undefined
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {currentView === 'STUDIO' ? (
        <Studio onReturnHome={() => setCurrentView('LANDING')} />
      ) : currentView === 'TEACHER' ? (
        <TeacherPortalView 
          topics={allCurriculumTopics}
          activeTopic={allCurriculumTopics[0]}
          onSelectTopic={() => {}}
          onReturnToHome={() => setCurrentView('LANDING')} 
          onSwitchToStudentView={() => setCurrentView('LANDING')}
        />
      ) : currentView === 'PARENT' ? (
        <ParentPortalView 
          onReturnToHome={() => setCurrentView('LANDING')} 
          onSwitchToStudentView={() => setCurrentView('LANDING')}
        />
      ) : (
        <LandingPage 
          onEnterStudio={() => setCurrentView('STUDIO')} 
          onOpenTeacherPortal={() => setCurrentView('TEACHER')}
          onOpenParentPortal={() => setCurrentView('PARENT')}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </ErrorBoundary>
  );
}
