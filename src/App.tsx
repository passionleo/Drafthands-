import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CurriculumTier } from './types/curriculum';
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
import { TeacherPortalModal } from './components/teacher/TeacherPortalModal';
import { WhiteboardStudio } from './components/whiteboard/WhiteboardStudio';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { PaywallModal } from './components/subscription/PaywallModal';
import { ParentPortalModal } from './components/parent/ParentPortalModal';
import { LiveProjectionMode } from './components/projection/LiveProjectionMode';
import { AssignmentManagementModal } from './components/teacher/AssignmentManagementModal';
import { StudentAssignmentsModal } from './components/student/StudentAssignmentsModal';
import { TeacherAssignment } from './types/assignments';
import { WorkspaceMode } from './types/whiteboard';
import { LiveClassroomModal } from './components/live/LiveClassroomModal';
import { JoinClassModal } from './components/live/JoinClassModal';
import { ParticipantRole } from './types/liveClass';
import { LandingPage } from './components/landing/LandingPage';
import { UserRoleType } from './components/landing/AuthModal';

function AppContent() {
  // Master View: Landing Page (Public / Pre-Auth) vs Studio Workspace
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO'>('LANDING');

  // Navigation & Tier state (Default to official SS1 start: Week 1 Intro to Technical Drawing)
  const [activeTier, setActiveTier] = useState<CurriculumTier>('SS1');
  const [activeTopicId, setActiveTopicId] = useState<string>('ss1-intro-technical-drawing');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modals & View Modes state
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState<boolean>(false);
  const [isIsoDiagramOpen, setIsIsoDiagramOpen] = useState<boolean>(false);
  const [isOrthographicViewportOpen, setIsOrthographicViewportOpen] = useState<boolean>(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState<boolean>(false);
  const [isParentPortalOpen, setIsParentPortalOpen] = useState<boolean>(false);
  const [isProjectionModeOpen, setIsProjectionModeOpen] = useState<boolean>(false);
  const [isWhiteboardStudioOpen, setIsWhiteboardStudioOpen] = useState<boolean>(false);
  const [isTeacherAssignmentsOpen, setIsTeacherAssignmentsOpen] = useState<boolean>(false);
  const [isStudentAssignmentsOpen, setIsStudentAssignmentsOpen] = useState<boolean>(false);
  const [activeAssignmentForStudio, setActiveAssignmentForStudio] = useState<TeacherAssignment | undefined>(undefined);
  const [studioInitialMode, setStudioInitialMode] = useState<WorkspaceMode>('TRADITIONAL_BOARD');

  // Live Virtual Classroom state
  const [isJoinClassOpen, setIsJoinClassOpen] = useState<boolean>(false);
  const [isLiveClassroomOpen, setIsLiveClassroomOpen] = useState<boolean>(false);
  const [liveClassConfig, setLiveClassConfig] = useState<{
    roomCode: string;
    topicId: string;
    userName: string;
    role: ParticipantRole;
    gradeOrClass: string;
    initialAudioMuted: boolean;
    initialVideoOff: boolean;
  }>({
    roomCode: 'TD-SS2-8821',
    topicId: 'ss1-intro-technical-drawing',
    userName: 'Engr. D. Adebayo',
    role: 'TEACHER',
    gradeOrClass: 'Technical Instructor',
    initialAudioMuted: false,
    initialVideoOff: false
  });

  const { isPaywallOpen, closePaywall, paywallTargetTopic, checkTopicAccess, openPaywall } = useSubscription();

  // Active topic object
  const activeTopic = useMemo(() => {
    return getTopicById(activeTopicId) || allCurriculumTopics[0];
  }, [activeTopicId]);

  // Topic parameter values state
  const [parameters, setParameters] = useState<Record<string, number>>(() => {
    const initParams: Record<string, number> = {};
    activeTopic.parameters.forEach(p => {
      initParams[p.id] = p.defaultValue;
    });
    return initParams;
  });

  // Re-initialize parameters when switching topics
  useEffect(() => {
    const initParams: Record<string, number> = {};
    activeTopic.parameters.forEach(p => {
      initParams[p.id] = p.defaultValue;
    });
    setParameters(initParams);
    setCurrentStep(1);
    setIsPlaying(false);
  }, [activeTopicId, activeTopic]);

  // Step player state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Canvas Viewport & Grid state
  const [gridMode, setGridMode] = useState<GridMode>(() => activeTopic.defaultViewBox.defaultGrid || 'MILLIMETER');
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Compute all steps dynamically based on current geometric parameters
  const steps = useMemo(() => {
    return activeTopic.generateSteps(parameters);
  }, [activeTopic, parameters]);

  const totalSteps = steps.length;
  const currentStepData = steps[Math.min(currentStep - 1, totalSteps - 1)] || steps[0];

  // Auto-play timer effect
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 2800 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= totalSteps) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalSteps]);

  // Step Controls Handlers
  const handleNextStep = useCallback(() => {
    setCurrentStep(s => Math.min(totalSteps, s + 1));
  }, [totalSteps]);

  const handlePrevStep = useCallback(() => {
    setCurrentStep(s => Math.max(1, s - 1));
  }, []);

  const handleGoToStep = useCallback((stepNum: number) => {
    setCurrentStep(Math.max(1, Math.min(totalSteps, stepNum)));
  }, [totalSteps]);

  const handleResetSteps = useCallback(() => {
    setCurrentStep(1);
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(p => !p);
  }, []);

  // Topic parameter update handler
  const handleParamChange = useCallback((paramId: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  }, []);

  // Navigation handlers with Freemium paywall check
  const handleSelectTopic = useCallback((topicId: string) => {
    const target = getTopicById(topicId);
    if (!target) return;

    // Check if topic requires premium subscription (Topics 4 and above)
    const tierTopics = getTopicsByTier(target.tier);
    const access = checkTopicAccess(target, tierTopics);

    if (!access.isAllowed) {
      openPaywall(target);
      return;
    }

    setActiveTopicId(topicId);
    setActiveTier(target.tier);
  }, [checkTopicAccess, openPaywall]);

  const handleSelectTier = useCallback((tier: CurriculumTier) => {
    setActiveTier(tier);
    const topicsInTier = getTopicsByTier(tier);
    if (topicsInTier.length > 0) {
      setActiveTopicId(topicsInTier[0].id);
    }
  }, []);

  const handleOpenWhiteboardForAssignment = useCallback((asg: TeacherAssignment, mode: WorkspaceMode) => {
    setActiveAssignmentForStudio(asg);
    setStudioInitialMode(mode);
    const targetTopic = getTopicById(asg.topicId);
    if (targetTopic) {
      setActiveTopicId(targetTopic.id);
      setActiveTier(targetTopic.tier);
    }
    setIsStudentAssignmentsOpen(false);
    setIsTeacherAssignmentsOpen(false);
    setIsWhiteboardStudioOpen(true);
  }, []);

  const handleOpenWhiteboardForTopic = useCallback((topicId: string) => {
    const target = getTopicById(topicId);
    if (target) {
      setActiveTopicId(topicId);
      setActiveTier(target.tier);
      setActiveAssignmentForStudio(undefined);
      setStudioInitialMode('TRADITIONAL_BOARD');
      setIsTeacherPortalOpen(false);
      setIsWhiteboardStudioOpen(true);
    }
  }, []);

  // Export SVG as technical vector file
  const handleExportSvg = useCallback(() => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${activeTopic.id}-step-${currentStep}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  }, [activeTopic.id, currentStep]);

  // Reset View handler
  const handleResetView = useCallback(() => {
    setGridMode(activeTopic.defaultViewBox.defaultGrid || 'MILLIMETER');
    const initParams: Record<string, number> = {};
    activeTopic.parameters.forEach(p => {
      initParams[p.id] = p.defaultValue;
    });
    setParameters(initParams);
    setCurrentStep(1);
    setIsPlaying(false);
  }, [activeTopic]);

  // Transition from Public Landing Page into Active Studio Workspace
  const handleEnterStudioFromLanding = useCallback((options?: {
    tier?: CurriculumTier;
    topicId?: string;
    role?: UserRoleType;
    openTeacher?: boolean;
    openParent?: boolean;
    openLive?: boolean;
  }) => {
    if (options?.tier) {
      handleSelectTier(options.tier);
    }
    if (options?.topicId) {
      handleSelectTopic(options.topicId);
    }
    if (options?.openTeacher) {
      setIsTeacherPortalOpen(true);
    }
    if (options?.openParent) {
      setIsParentPortalOpen(true);
    }
    if (options?.openLive) {
      setIsJoinClassOpen(true);
    }
    setCurrentView('STUDIO');
  }, [handleSelectTier, handleSelectTopic]);

  // If on public landing page view, render high-impact landing page
  if (currentView === 'LANDING') {
    return (
      <LandingPage onEnterStudio={handleEnterStudioFromLanding} />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. TOP ACADEMY HEADER */}
      <Header
        activeTier={activeTier}
        onSelectTier={handleSelectTier}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenPractice={() => setIsPracticeOpen(true)}
        onOpenIsoDiagram={() => setIsIsoDiagramOpen(true)}
        onOpenOrthographicViewport={() => setIsOrthographicViewportOpen(true)}
        onOpenTeacherPortal={() => setIsTeacherPortalOpen(true)}
        onOpenParentPortal={() => setIsParentPortalOpen(true)}
        onOpenProjectionMode={() => setIsProjectionModeOpen(true)}
        onOpenTeacherAssignments={() => setIsTeacherAssignmentsOpen(true)}
        onOpenStudentAssignments={() => setIsStudentAssignmentsOpen(true)}
        onOpenLiveClass={() => setIsJoinClassOpen(true)}
        onToggleWhiteboardStudio={() => {
          setActiveAssignmentForStudio(undefined);
          setIsWhiteboardStudioOpen(prev => !prev);
        }}
        isWhiteboardOpen={isWhiteboardStudioOpen}
        onResetView={handleResetView}
        onExportSvg={handleExportSvg}
        currentTopicTitle={activeTopic.title}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        onReturnToLanding={() => setCurrentView('LANDING')}
      />

      {/* 2. BODY CONTENT: SIDEBAR + WORKSPACE */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* A. CURRICULUM SYLLABUS SIDEBAR */}
        <Sidebar
          topics={allCurriculumTopics}
          activeTopicId={activeTopicId}
          onSelectTopic={handleSelectTopic}
          activeTier={activeTier}
          onSelectTier={handleSelectTier}
          searchQuery={searchQuery}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* B. MAIN WORKSPACE: PROCEDURAL SIMULATION OR INTERACTIVE WHITEBOARD STUDIO */}
        {isWhiteboardStudioOpen ? (
          <main className="flex flex-1 flex-col min-w-0 min-h-0 relative bg-slate-950">
            <WhiteboardStudio
              topic={activeTopic}
              onClose={() => setIsWhiteboardStudioOpen(false)}
              initialTemplateElements={currentStepData.elements}
              assignment={activeAssignmentForStudio}
              initialMode={studioInitialMode}
              onSubmitAssignment={(elements, notes) => {
                console.log('Submitted Assignment', elements, notes);
              }}
            />
          </main>
        ) : (
          <main className="flex flex-1 flex-col lg:flex-row min-w-0 overflow-hidden">
            {/* B1. PROCEDURAL INSTRUCTIONS & PARAMETER TUNER */}
            <ProcedurePanel
              topic={activeTopic}
              step={currentStepData}
              currentStepIndex={currentStep}
              totalSteps={totalSteps}
              parameters={parameters}
              onParamChange={handleParamChange}
              onOpenTheory={() => setIsTheoryOpen(true)}
              onOpenTraditionalBoard={() => {
                setActiveAssignmentForStudio(undefined);
                setStudioInitialMode('TRADITIONAL_BOARD');
                setIsWhiteboardStudioOpen(true);
              }}
              onOpenCadWorkstation={() => {
                setActiveAssignmentForStudio(undefined);
                setStudioInitialMode('CAD_WORKSTATION');
                setIsWhiteboardStudioOpen(true);
              }}
              onOpenLiveClass={() => setIsJoinClassOpen(true)}
              onOpenIsoDiagram={() => setIsIsoDiagramOpen(true)}
              onOpenOrthographicViewport={() => setIsOrthographicViewportOpen(true)}
            />

            {/* B2. INTERACTIVE DRAWING CANVAS VIEWPORT & STEP CONTROLS */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0 relative bg-slate-950 border-l border-slate-800">
              {/* Interactive Vector Canvas Stage */}
              <div className="flex-1 min-h-0 relative">
                <DrawingCanvas
                  topic={activeTopic}
                  elements={currentStepData.elements}
                  instrument={currentStepData.activeInstrument}
                  activeStep={currentStep}
                  totalSteps={totalSteps}
                  gridMode={gridMode}
                  onSelectGridMode={setGridMode}
                  svgRef={svgRef}
                  onOpenProjection={() => setIsProjectionModeOpen(true)}
                />
              </div>

              {/* Bottom Step Simulation Playback Controls */}
              <StepPlayerControls
                currentStep={currentStep}
                totalSteps={totalSteps}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                onGoToStep={handleGoToStep}
                onReset={handleResetSteps}
                speed={playbackSpeed}
                onChangeSpeed={setPlaybackSpeed}
              />
            </div>
          </main>
        )}
      </div>

      {/* 3. TEACHER LESSON NOTE GENERATOR MODAL */}
      <TeacherPortalModal
        topics={allCurriculumTopics}
        activeTopic={activeTopic}
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
        onSelectTopic={handleSelectTopic}
        onOpenWhiteboardForTopic={handleOpenWhiteboardForTopic}
      />

      {/* 4. TEACHER ASSIGNMENT & EVALUATION CONSOLE */}
      <AssignmentManagementModal
        topics={allCurriculumTopics}
        isOpen={isTeacherAssignmentsOpen}
        onClose={() => setIsTeacherAssignmentsOpen(false)}
      />

      {/* 5. STUDENT PRACTICAL ASSIGNMENTS & WORKSPACE LAUNCHER */}
      <StudentAssignmentsModal
        isOpen={isStudentAssignmentsOpen}
        onClose={() => setIsStudentAssignmentsOpen(false)}
        topics={allCurriculumTopics}
        onOpenWhiteboardForAssignment={handleOpenWhiteboardForAssignment}
      />

      {/* 6. PARENT MONITORING & FEEDBACK PORTAL */}
      <ParentPortalModal
        isOpen={isParentPortalOpen}
        onClose={() => setIsParentPortalOpen(false)}
        onSelectTopic={handleSelectTopic}
      />

      {/* 7. TEACHER LIVE-CLASS PROJECTION MODE (SMART BOARD PRO) */}
      <LiveProjectionMode
        isOpen={isProjectionModeOpen}
        onClose={() => setIsProjectionModeOpen(false)}
        topic={activeTopic}
        currentStepIndex={currentStep}
        onStepChange={handleGoToStep}
        parameters={parameters}
      />

      {/* 8. THEORY & STANDARDS MODAL */}
      <TheoryModal
        topic={activeTopic}
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      {/* 8B. ISO 128 TECHNICAL VECTOR BLUEPRINT VIEWER MODAL */}
      <IsoDiagramViewer
        topic={activeTopic}
        isOpen={isIsoDiagramOpen}
        onClose={() => setIsIsoDiagramOpen(false)}
        viewMode="MODAL"
      />

      {/* 8C. ISO 5456 ORTHOGRAPHIC PROJECTION VIEWPORT MODAL */}
      {isOrthographicViewportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-6xl h-[92vh] max-h-[860px] shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-700">
            <OrthographicViewport
              viewMode="MODAL"
              isOpen={isOrthographicViewportOpen}
              onClose={() => setIsOrthographicViewportOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 9. PRACTICE & EXAM CHALLENGE MODAL */}
      <PracticeModal
        topic={activeTopic}
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
      />

      {/* 10. FREEMIUM ACCESS & PAYSTACK PAYWALL MODAL */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={closePaywall}
        targetTopic={paywallTargetTopic}
      />

      {/* 11. LIVE CLASSROOM HARDWARE CHECK & JOIN/HOST MODAL */}
      <JoinClassModal
        isOpen={isJoinClassOpen}
        onClose={() => setIsJoinClassOpen(false)}
        topics={allCurriculumTopics}
        activeTopic={activeTopic}
        onJoinSession={(config) => {
          setLiveClassConfig(config);
          setIsJoinClassOpen(false);
          setIsLiveClassroomOpen(true);
        }}
      />

      {/* 12. DRAFTHANDS LIVE VIRTUAL CLASSROOM (2-WAY VIDEO + REAL-TIME WHITEBOARD) */}
      <LiveClassroomModal
        isOpen={isLiveClassroomOpen}
        onClose={() => setIsLiveClassroomOpen(false)}
        topic={allCurriculumTopics.find(t => t.id === liveClassConfig.topicId) || activeTopic}
        initialRole={liveClassConfig.role}
        initialRoomCode={liveClassConfig.roomCode}
        initialUserName={liveClassConfig.userName}
        initialGradeClass={liveClassConfig.gradeOrClass}
        onNavigateToAppPart={(partName) => {
          if (partName === 'TEACHER_ASSIGNMENTS') setIsTeacherAssignmentsOpen(true);
          else if (partName === 'STUDENT_ASSIGNMENTS') setIsStudentAssignmentsOpen(true);
          else if (partName === 'PARENT_PORTAL') setIsParentPortalOpen(true);
          else if (partName === 'PRACTICE_EXAM') setIsPracticeOpen(true);
          else if (partName === 'THEORY_STANDARDS') setIsTheoryOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  );
}
