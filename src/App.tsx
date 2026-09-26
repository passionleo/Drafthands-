import React, { useState, Component, ErrorInfo, ReactNode, useRef, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProcedurePanel } from './components/curriculum/ProcedurePanel';
import { DrawingCanvas } from './components/drafting/DrawingCanvas';
import { LandingPage } from './components/landing/LandingPage';
import { TeacherPortalView } from './components/teacher/TeacherPortalView';
import { ParentPortalView } from './components/parent/ParentPortalView';
import { PastQuestionsHub } from './components/pastquestions/PastQuestionsHub';
import { OwnerControlCenterView } from './components/owner/OwnerControlCenterView';
import { PaywallModal } from './components/subscription/PaywallModal';

// Modals & Viewers
import { TheoryModal } from './components/theory/TheoryModal';
import { PracticeModal } from './components/practice/PracticeModal';
import { StudentAssignmentsModal } from './components/student/StudentAssignmentsModal';
import { AdminConsoleModal } from './components/admin/AdminConsoleModal';
import { IsoDiagramViewer } from './components/common/IsoDiagramViewer';
import { OrthographicViewport } from './components/tools/OrthographicViewport';
import { SurfaceDevelopmentViewer } from './components/tools/SurfaceDevelopmentViewer';
import { SectionalAssemblyViewer } from './components/tools/SectionalAssemblyViewer';
import { ArchitecturalPlanViewer } from './components/tools/ArchitecturalPlanViewer';
import { LiveProjectionMode } from './components/projection/LiveProjectionMode';
import { WhiteboardStudio } from './components/whiteboard/WhiteboardStudio';
import { LiveClassroomModal } from './components/live/LiveClassroomModal';

import { allCurriculumTopics, getTopicById, getTopicsByTier } from './data/curriculumData';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { CurriculumTier, DrawingTopic, InstrumentState, ProceduralStep } from './types/curriculum';
import { GridMode } from './components/drafting/ToolDock';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/50 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-red-400 mb-2">Application Notice</h2>
            <p className="text-sm text-slate-300 mb-4">
              An unexpected render interruption occurred. Please return to home to restore normal session state.
            </p>
            <pre className="bg-black/50 p-3 rounded text-xs text-red-300 overflow-x-auto text-left font-mono mb-6 max-h-32">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset();
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-500/25"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function GlobalPaywallWrapper() {
  const { isPaywallOpen, closePaywall, paywallTargetTopic } = useSubscription();
  return <PaywallModal isOpen={isPaywallOpen} onClose={closePaywall} targetTopic={paywallTargetTopic} />;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO' | 'TEACHER' | 'PARENT' | 'PAST_QUESTIONS' | 'OWNER'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('owner') || hash.includes('admin')) return 'OWNER';
      if (hash.includes('teacher')) return 'TEACHER';
      if (hash.includes('parent')) return 'PARENT';
      if (hash.includes('past')) return 'PAST_QUESTIONS';
      if (hash.includes('studio') || hash.includes('student')) return 'STUDIO';
    }
    return 'LANDING';
  });
  
  const [selectedTier, setSelectedTier] = useState<CurriculumTier>('SS1');
  const [currentTopic, setCurrentTopic] = useState<DrawingTopic>(allCurriculumTopics[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [gridMode, setGridMode] = useState<GridMode>('ISOMETRIC');
  const [paramValues, setParamValues] = useState<Record<string, number>>({});

  // Feature modals & viewers state
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState<boolean>(false);
  const [isIsoDiagramOpen, setIsIsoDiagramOpen] = useState<boolean>(false);
  const [isOrthoViewportOpen, setIsOrthoViewportOpen] = useState<boolean>(false);
  const [isSurfaceDevOpen, setIsSurfaceDevOpen] = useState<boolean>(false);
  const [isSectionalOpen, setIsSectionalOpen] = useState<boolean>(false);
  const [isArchPlanOpen, setIsArchPlanOpen] = useState<boolean>(false);
  const [isProjectionOpen, setIsProjectionOpen] = useState<boolean>(false);
  const [isLiveClassOpen, setIsLiveClassOpen] = useState<boolean>(false);
  const [isStudentAssignmentsOpen, setIsStudentAssignmentsOpen] = useState<boolean>(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Preloader removal & Hash routing synchronization
  useEffect(() => {
    try {
      const loader = document.getElementById('dh-pre-loader');
      if (loader) loader.remove();
      if (typeof window !== 'undefined') {
        (window as any).__drafthandsMounted = true;
      }
    } catch (e) {
      console.warn(e);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('owner') || hash.includes('admin')) {
        setCurrentView('OWNER');
      } else if (hash.includes('teacher')) {
        setCurrentView('TEACHER');
      } else if (hash.includes('parent')) {
        setCurrentView('PARENT');
      } else if (hash.includes('past')) {
        setCurrentView('PAST_QUESTIONS');
      } else if (hash.includes('studio') || hash.includes('student')) {
        setCurrentView('STUDIO');
      } else if (hash.includes('landing') || hash === '' || hash === '#') {
        setCurrentView('LANDING');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeView = (view: 'LANDING' | 'STUDIO' | 'TEACHER' | 'PARENT' | 'PAST_QUESTIONS' | 'OWNER') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      if (view === 'OWNER') window.location.hash = '#owner';
      else if (view === 'TEACHER') window.location.hash = '#teacher';
      else if (view === 'PARENT') window.location.hash = '#parent';
      else if (view === 'PAST_QUESTIONS') window.location.hash = '#past-questions';
      else if (view === 'STUDIO') window.location.hash = '#studio';
      else window.location.hash = '#landing';
    }
  };

  useEffect(() => {
    if (currentTopic && currentTopic.parameters) {
      const defaults: Record<string, number> = {};
      currentTopic.parameters.forEach(p => {
        defaults[p.id] = p.defaultValue;
      });
      setParamValues(defaults);
    }
    setCurrentStepIndex(0);
  }, [currentTopic]);

  const handleReturnHome = () => changeView('LANDING');

  const tierTopics = getTopicsByTier(selectedTier);
  const steps: ProceduralStep[] = currentTopic && typeof currentTopic.generateSteps === 'function'
    ? currentTopic.generateSteps(paramValues)
    : [];
  
  const activeStep = steps[currentStepIndex] || {
    stepIndex: 0,
    title: currentTopic?.title || 'Drafting Step',
    instruction: currentTopic?.shortDescription || '',
    detailedNotes: '',
    technicalPrinciple: '',
    activeInstrument: { toolType: 'RULER', x: 100, y: 100, visible: true },
    elements: []
  };

  const totalSteps = steps.length > 0 ? steps.length : 1;
  const canvasElements = activeStep.elements || [];
  const defaultInstrument: InstrumentState = activeStep.activeInstrument || {
    toolType: 'RULER',
    x: 100,
    y: 100,
    visible: true
  };

  return (
    <SubscriptionProvider>
      <ErrorBoundary onReset={handleReturnHome}>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
          {/* 1. LANDING VIEW */}
          {currentView === 'LANDING' && (
            <LandingPage
              onEnterStudio={(options) => {
                if (options?.tier) setSelectedTier(options.tier);
                if (options?.topicId) {
                  const t = getTopicById(options.topicId);
                  if (t) setCurrentTopic(t);
                }
                if (options?.openTeacher || options?.portal === 'TEACHER') {
                  changeView('TEACHER');
                } else if (options?.openParent || options?.portal === 'PARENT') {
                  changeView('PARENT');
                } else if (options?.openPastQuestions) {
                  changeView('PAST_QUESTIONS');
                } else {
                  changeView('STUDIO');
                }
              }}
              onOpenTeacherPortal={() => changeView('TEACHER')}
              onOpenParentPortal={() => changeView('PARENT')}
              onOpenStudentPortal={() => changeView('STUDIO')}
              onOpenPastQuestions={() => changeView('PAST_QUESTIONS')}
              onOpenOwnerPortal={() => changeView('OWNER')}
            />
          )}

          {/* 2. CAD STUDIO VIEW */}
          {currentView === 'STUDIO' && (
            <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900">
              <Header
                activeTier={selectedTier}
                onSelectTier={(tier) => {
                  setSelectedTier(tier);
                  const topicsInTier = getTopicsByTier(tier);
                  if (topicsInTier.length > 0) {
                    setCurrentTopic(topicsInTier[0]);
                    setCurrentStepIndex(0);
                  }
                }}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentStepIndex={currentStepIndex}
                totalSteps={totalSteps}
                onOpenTheory={() => setIsTheoryOpen(true)}
                onOpenPractice={() => setIsPracticeOpen(true)}
                onOpenIsoDiagram={() => setIsIsoDiagramOpen(true)}
                onOpenOrthographicViewport={() => setIsOrthoViewportOpen(true)}
                onOpenSurfaceDevelopment={() => setIsSurfaceDevOpen(true)}
                onOpenSectionalAssembly={() => setIsSectionalOpen(true)}
                onOpenArchitecturalPlan={() => setIsArchPlanOpen(true)}
                onOpenTeacherPortal={() => changeView('TEACHER')}
                onOpenParentPortal={() => changeView('PARENT')}
                onOpenProjectionMode={() => setIsProjectionOpen(true)}
                onOpenTeacherAssignments={() => changeView('TEACHER')}
                onOpenStudentAssignments={() => setIsStudentAssignmentsOpen(true)}
                onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
                onOpenLiveClass={() => setIsLiveClassOpen(true)}
                onToggleWhiteboardStudio={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
                isWhiteboardOpen={isWhiteboardOpen}
                onResetView={() => setCurrentStepIndex(0)}
                onExportSvg={() => {
                  if (svgRef.current) {
                    const svgData = new XMLSerializer().serializeToString(svgRef.current);
                    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${currentTopic?.title || 'drawing'}_drafting.svg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                currentTopicTitle={currentTopic?.title || 'Drafting Board'}
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                onReturnToLanding={handleReturnHome}
                onOpenPastQuestions={() => changeView('PAST_QUESTIONS')}
                onOpenOwnerPortal={() => changeView('OWNER')}
              />
              <div className="flex flex-1 overflow-hidden relative">
                {!isSidebarCollapsed && (
                  <Sidebar
                    topics={tierTopics}
                    activeTopicId={currentTopic?.id || ''}
                    onSelectTopic={(id) => {
                      const t = getTopicById(id);
                      if (t) {
                        setCurrentTopic(t);
                        setCurrentStepIndex(0);
                      }
                    }}
                    activeTier={selectedTier}
                    onSelectTier={(tier) => {
                      setSelectedTier(tier);
                      const t = getTopicsByTier(tier);
                      if (t.length > 0) {
                        setCurrentTopic(t[0]);
                        setCurrentStepIndex(0);
                      }
                    }}
                    searchQuery={searchQuery}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  />
                )}
                <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
                  <DrawingCanvas
                    topic={currentTopic}
                    elements={canvasElements}
                    instrument={defaultInstrument}
                    activeStep={currentStepIndex}
                    totalSteps={totalSteps}
                    gridMode={gridMode}
                    onSelectGridMode={setGridMode}
                    svgRef={svgRef}
                    onOpenWhiteboard={() => setIsWhiteboardOpen(true)}
                  />
                  {currentTopic && (
                    <ProcedurePanel
                      topic={currentTopic}
                      step={activeStep}
                      currentStepIndex={currentStepIndex}
                      totalSteps={totalSteps}
                      parameters={paramValues}
                      onParamChange={(paramId, value) => {
                        setParamValues(prev => ({ ...prev, [paramId]: value }));
                      }}
                      onOpenTheory={() => setIsTheoryOpen(true)}
                      onOpenTraditionalBoard={() => setIsWhiteboardOpen(true)}
                      onOpenCadWorkstation={() => setIsWhiteboardOpen(true)}
                      onOpenLiveClass={() => setIsLiveClassOpen(true)}
                    />
                  )}
                </main>
              </div>
            </div>
          )}

          {/* 3. TEACHER DESK VIEW */}
          {currentView === 'TEACHER' && (
            <TeacherPortalView
              topics={allCurriculumTopics}
              activeTopic={currentTopic}
              onSelectTopic={(topicId) => {
                const t = getTopicById(topicId);
                if (t) setCurrentTopic(t);
              }}
              onReturnToHome={handleReturnHome}
              onSwitchToStudentView={() => changeView('STUDIO')}
            />
          )}

          {/* 4. PARENT PORTAL VIEW */}
          {currentView === 'PARENT' && (
            <ParentPortalView
              onReturnToHome={handleReturnHome}
              onSwitchToStudentView={() => changeView('STUDIO')}
              onSelectTopic={(topicId) => {
                const t = getTopicById(topicId);
                if (t) {
                  setCurrentTopic(t);
                  changeView('STUDIO');
                }
              }}
            />
          )}

          {/* 5. PAST QUESTIONS VIEW */}
          {currentView === 'PAST_QUESTIONS' && (
            <PastQuestionsHub
              onBackToStudio={() => changeView('STUDIO')}
              onReturnToLanding={handleReturnHome}
            />
          )}

          {/* 6. OWNER CONTROL CENTER VIEW */}
          {currentView === 'OWNER' && (
            <OwnerControlCenterView
              onReturnToHome={handleReturnHome}
              onLaunchStudio={(tier, topicId) => {
                if (tier) setSelectedTier(tier);
                if (topicId) {
                  const t = getTopicById(topicId);
                  if (t) setCurrentTopic(t);
                }
                changeView('STUDIO');
              }}
              onOpenTeacherPortal={() => changeView('TEACHER')}
              onOpenParentPortal={() => changeView('PARENT')}
              onOpenPastQuestions={() => changeView('PAST_QUESTIONS')}
              onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
              topics={allCurriculumTopics}
            />
          )}

          {/* Feature Modals & Viewers */}
          {isTheoryOpen && currentTopic && (
            <TheoryModal
              isOpen={isTheoryOpen}
              onClose={() => setIsTheoryOpen(false)}
              topic={currentTopic}
            />
          )}

          {isPracticeOpen && currentTopic && (
            <PracticeModal
              isOpen={isPracticeOpen}
              onClose={() => setIsPracticeOpen(false)}
              topic={currentTopic}
            />
          )}

          {isIsoDiagramOpen && (
            <IsoDiagramViewer
              topic={currentTopic}
              isOpen={isIsoDiagramOpen}
              onClose={() => setIsIsoDiagramOpen(false)}
              viewMode="MODAL"
            />
          )}

          {isOrthoViewportOpen && (
            <OrthographicViewport
              isOpen={isOrthoViewportOpen}
              onClose={() => setIsOrthoViewportOpen(false)}
              viewMode="MODAL"
            />
          )}

          {isSurfaceDevOpen && (
            <SurfaceDevelopmentViewer
              isOpen={isSurfaceDevOpen}
              onClose={() => setIsSurfaceDevOpen(false)}
              viewMode="MODAL"
            />
          )}

          {isSectionalOpen && (
            <SectionalAssemblyViewer
              isOpen={isSectionalOpen}
              onClose={() => setIsSectionalOpen(false)}
              viewMode="MODAL"
            />
          )}

          {isArchPlanOpen && (
            <ArchitecturalPlanViewer
              isOpen={isArchPlanOpen}
              onClose={() => setIsArchPlanOpen(false)}
              viewMode="MODAL"
            />
          )}

          {isProjectionOpen && currentTopic && (
            <LiveProjectionMode
              isOpen={isProjectionOpen}
              onClose={() => setIsProjectionOpen(false)}
              topic={currentTopic}
              currentStepIndex={currentStepIndex}
              onStepChange={setCurrentStepIndex}
              parameters={paramValues}
            />
          )}

          {isLiveClassOpen && currentTopic && (
            <LiveClassroomModal
              isOpen={isLiveClassOpen}
              onClose={() => setIsLiveClassOpen(false)}
              topic={currentTopic}
              initialRole="STUDENT"
            />
          )}

          {isStudentAssignmentsOpen && (
            <StudentAssignmentsModal
              isOpen={isStudentAssignmentsOpen}
              onClose={() => setIsStudentAssignmentsOpen(false)}
              topics={allCurriculumTopics}
              onOpenWhiteboardForAssignment={(_assignment) => {
                setIsStudentAssignmentsOpen(false);
                setIsWhiteboardOpen(true);
              }}
            />
          )}

          {isAdminConsoleOpen && (
            <AdminConsoleModal
              isOpen={isAdminConsoleOpen}
              onClose={() => setIsAdminConsoleOpen(false)}
            />
          )}

          {isWhiteboardOpen && (
            <WhiteboardStudio
              topic={currentTopic}
              onClose={() => setIsWhiteboardOpen(false)}
              initialMode="TRADITIONAL_BOARD"
            />
          )}

          {/* Global Paywall Modal */}
          <GlobalPaywallWrapper />
        </div>
      </ErrorBoundary>
    </SubscriptionProvider>
  );
}
