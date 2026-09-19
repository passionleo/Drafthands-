import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CurriculumTier, PracticalDrawingTask, DrawingTopic } from './types/curriculum';
import { allCurriculumTopics, getTopicById, getTopicsByTier } from './data/curriculumData';
import { recordPracticalSubmission } from './services/assessmentStorage';
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
import { PastQuestionsHub } from './components/pastquestions/PastQuestionsHub';
import { AdminConsoleModal } from './components/admin/AdminConsoleModal';
import { Mail, CheckCircle2 } from 'lucide-react';

function AppContent() {
  // Master View: Landing Page (Public / Pre-Auth) vs Studio Workspace vs Past Questions Hub
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO' | 'PAST_QUESTIONS'>('LANDING');

  // URL Hash Listener for dedicated routing (#past-questions, #studio, #landing)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#past-questions' || hash === '#pastquestions' || hash === '#archive') {
        setCurrentView('PAST_QUESTIONS');
      } else if (hash === '#studio') {
        setCurrentView('STUDIO');
      } else if (hash === '#landing') {
        setCurrentView('LANDING');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
  const [isSurfaceDevelopmentViewerOpen, setIsSurfaceDevelopmentViewerOpen] = useState<boolean>(false);
  const [isSectionalAssemblyViewerOpen, setIsSectionalAssemblyViewerOpen] = useState<boolean>(false);
  const [isArchitecturalPlanViewerOpen, setIsArchitecturalPlanViewerOpen] = useState<boolean>(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState<boolean>(false);
  const [isParentPortalOpen, setIsParentPortalOpen] = useState<boolean>(false);
  const [isProjectionModeOpen, setIsProjectionModeOpen] = useState<boolean>(false);
  const [isWhiteboardStudioOpen, setIsWhiteboardStudioOpen] = useState<boolean>(false);
  const [isTeacherAssignmentsOpen, setIsTeacherAssignmentsOpen] = useState<boolean>(false);
  const [isStudentAssignmentsOpen, setIsStudentAssignmentsOpen] = useState<boolean>(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);
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

  const {
    isPaywallOpen,
    closePaywall,
    paywallTargetTopic,
    checkTopicAccess,
    openPaywall,
    userRole,
    userProfile,
    isSubscribed,
    isEmailVerified,
    setUserRole,
    verifyEmail
  } = useSubscription();

  // Code entry state for verification modal if unverified student is active
  const [verificationCodeInput, setVerificationCodeInput] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');

  // Active topic object
  const activeTopic = useMemo(() => {
    return getTopicById(activeTopicId) || allCurriculumTopics[0];
  }, [activeTopicId]);

  // Initial shape for surface development viewer based on topic
  const surfaceDevInitialShape: SolidShapeType = useMemo(() => {
    if (activeTopicId.includes('radial') || activeTopicId.includes('cone')) return 'CONE_FRUSTUM';
    if (activeTopicId.includes('interpenetration') || activeTopicId.includes('tee')) return 'PIPE_TEE_JUNCTION';
    return 'TRUNCATED_CYLINDER';
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

  // RBAC & Subscription guarded open handlers
  const handleOpenTheory = useCallback(() => {
    setIsTheoryOpen(true);
  }, []);

  const handleOpenPractice = useCallback(() => {
    setIsPracticeOpen(true);
  }, []);

  const handleOpenStudioTask = useCallback((task: PracticalDrawingTask, topic: DrawingTopic) => {
    const practicalAssignment: TeacherAssignment = {
      id: task.id,
      topicId: topic.id,
      moduleCode: topic.moduleCode,
      title: `[Self-Assessment Task ${task.taskNumber}] ${task.taskTitle}`,
      tier: topic.tier,
      targetClass: `${topic.tier} Technical Assessment`,
      assignedDate: new Date().toLocaleDateString('en-GB'),
      dueDate: 'Continuous Assessment',
      instructions: `${task.taskPrompt}\n\nTechnical Specifications:\n${task.specifications.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nExpected Outcome:\n${task.expectedOutcome}`,
      maxScore: task.rubricMarks || 20,
      rubric: {
        constructionAccuracy: 10,
        lineWeightDifferentiation: 5,
        dimensioningAndLettering: 3,
        neatnessAndLayout: 2
      }
    };
    setActiveAssignmentForStudio(practicalAssignment);
    setStudioInitialMode(task.suggestedMode === 'CAD_WORKSTATION' ? 'CAD_WORKSTATION' : 'TRADITIONAL_BOARD');
    setIsPracticeOpen(false);
    setIsWhiteboardStudioOpen(true);
  }, []);

  const handleOpenIsoDiagram = useCallback(() => {
    if (!isSubscribed) {
      openPaywall();
      return;
    }
    setIsIsoDiagramOpen(true);
  }, [isSubscribed, openPaywall]);

  const handleOpenOrthographicViewport = useCallback(() => {
    if (!isSubscribed) {
      openPaywall();
      return;
    }
    setIsOrthographicViewportOpen(true);
  }, [isSubscribed, openPaywall]);

  const handleOpenSurfaceDevelopment = useCallback(() => {
    if (!isSubscribed) {
      openPaywall();
      return;
    }
    setIsSurfaceDevelopmentViewerOpen(true);
  }, [isSubscribed, openPaywall]);

  const handleOpenSectionalAssembly = useCallback(() => {
    if (!isSubscribed) {
      openPaywall();
      return;
    }
    setIsSectionalAssemblyViewerOpen(true);
  }, [isSubscribed, openPaywall]);

  const handleOpenArchitecturalPlan = useCallback(() => {
    if (!isSubscribed) {
      openPaywall();
      return;
    }
    setIsArchitecturalPlanViewerOpen(true);
  }, [isSubscribed, openPaywall]);

  const handleOpenProjectionMode = useCallback(() => {
    // Hide and restrict educator tools when in Student role
    if (userRole === 'STUDENT') return;
    if (!isSubscribed) {
      openPaywall();
      return;
    }
    setIsProjectionModeOpen(true);
  }, [userRole, isSubscribed, openPaywall]);

  const handleOpenTeacherPortal = useCallback(() => {
    if (userRole === 'STUDENT') return;
    setIsTeacherPortalOpen(true);
  }, [userRole]);

  const handleOpenTeacherAssignments = useCallback(() => {
    if (userRole === 'STUDENT') return;
    setIsTeacherAssignmentsOpen(true);
  }, [userRole]);

  const handleOpenParentPortal = useCallback(() => {
    if (userRole === 'STUDENT') return;
    setIsParentPortalOpen(true);
  }, [userRole]);

  const handleOpenAdminConsole = useCallback(() => {
    if (userRole !== 'ADMIN') return;
    setIsAdminConsoleOpen(true);
  }, [userRole]);

  // Transition from Public Landing Page into Active Studio Workspace or Past Questions
  const handleEnterStudioFromLanding = useCallback((options?: {
    tier?: CurriculumTier;
    topicId?: string;
    role?: UserRoleType;
    openTeacher?: boolean;
    openParent?: boolean;
    openLive?: boolean;
    openPastQuestions?: boolean;
  }) => {
    if (options?.role) {
      setUserRole(options.role);
    }
    const activeRole = options?.role || userRole;

    if (options?.openPastQuestions) {
      window.location.hash = '#past-questions';
      setCurrentView('PAST_QUESTIONS');
      return;
    }
    if (options?.tier) {
      handleSelectTier(options.tier);
    }
    if (options?.topicId) {
      handleSelectTopic(options.topicId);
    }
    // Only open educator tools if role is educator/admin
    if (options?.openTeacher && activeRole !== 'STUDENT') {
      setIsTeacherPortalOpen(true);
    }
    if (options?.openParent && activeRole !== 'STUDENT') {
      setIsParentPortalOpen(true);
    }
    if (options?.openLive) {
      setIsJoinClassOpen(true);
    }
    window.location.hash = '#studio';
    setCurrentView('STUDIO');
  }, [handleSelectTier, handleSelectTopic, setUserRole, userRole]);

  // Dedicated Past Questions & Step-by-Step Solutions Hub Route View
  if (currentView === 'PAST_QUESTIONS') {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
        <PastQuestionsHub
          onBackToStudio={() => {
            window.location.hash = '#studio';
            setCurrentView('STUDIO');
          }}
          onReturnToLanding={() => {
            window.location.hash = '';
            setCurrentView('LANDING');
          }}
        />
        <PaywallModal
          isOpen={isPaywallOpen}
          onClose={closePaywall}
          targetTopic={paywallTargetTopic}
        />
      </div>
    );
  }

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
        onOpenTheory={handleOpenTheory}
        onOpenPractice={handleOpenPractice}
        onOpenIsoDiagram={handleOpenIsoDiagram}
        onOpenOrthographicViewport={handleOpenOrthographicViewport}
        onOpenSurfaceDevelopment={handleOpenSurfaceDevelopment}
        onOpenSectionalAssembly={handleOpenSectionalAssembly}
        onOpenArchitecturalPlan={handleOpenArchitecturalPlan}
        onOpenTeacherPortal={handleOpenTeacherPortal}
        onOpenParentPortal={handleOpenParentPortal}
        onOpenProjectionMode={handleOpenProjectionMode}
        onOpenTeacherAssignments={handleOpenTeacherAssignments}
        onOpenStudentAssignments={() => setIsStudentAssignmentsOpen(true)}
        onOpenAdminConsole={handleOpenAdminConsole}
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
        onOpenPastQuestions={() => {
          window.location.hash = '#past-questions';
          setCurrentView('PAST_QUESTIONS');
        }}
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
                if (activeAssignmentForStudio) {
                  recordPracticalSubmission(
                    activeAssignmentForStudio.topicId,
                    activeAssignmentForStudio.title,
                    activeAssignmentForStudio.tier,
                    {
                      taskId: activeAssignmentForStudio.id,
                      taskTitle: activeAssignmentForStudio.title,
                      submittedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
                      elementCount: elements.length,
                      notes: notes || 'Submitted from Interactive Drawing Studio viewport',
                      status: 'COMPLETED',
                      marksAwarded: 18,
                      maxMarks: activeAssignmentForStudio.maxScore || 20
                    }
                  );
                }
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
              onOpenTheory={handleOpenTheory}
              onOpenPractice={handleOpenPractice}
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
              onOpenIsoDiagram={handleOpenIsoDiagram}
              onOpenOrthographicViewport={handleOpenOrthographicViewport}
              onOpenSurfaceDevelopment={handleOpenSurfaceDevelopment}
              onOpenSectionalAssembly={handleOpenSectionalAssembly}
              onOpenArchitecturalPlan={handleOpenArchitecturalPlan}
              onOpenPastQuestions={() => {
                window.location.hash = '#past-questions';
                setCurrentView('PAST_QUESTIONS');
              }}
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
                  onOpenProjection={handleOpenProjectionMode}
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
                onOpenSelfAssessment={handleOpenPractice}
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

      {/* 8D. ISO 128 SURFACE DEVELOPMENT & INTERPENETRATION 3D VIEWER MODAL */}
      {isSurfaceDevelopmentViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-6xl h-[92vh] max-h-[880px] shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-700">
            <SurfaceDevelopmentViewer
              viewMode="MODAL"
              isOpen={isSurfaceDevelopmentViewerOpen}
              initialShape={surfaceDevInitialShape}
              onClose={() => setIsSurfaceDevelopmentViewerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 8E. ISO 128-40 SECTIONAL ASSEMBLY VIEWER MODAL */}
      {isSectionalAssemblyViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-6xl h-[92vh] max-h-[880px] shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-700">
            <SectionalAssemblyViewer
              viewMode="MODAL"
              isOpen={isSectionalAssemblyViewerOpen}
              onClose={() => setIsSectionalAssemblyViewerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 8F. ISO 4157 ARCHITECTURAL PLAN & WALL SECTION VIEWER MODAL */}
      {isArchitecturalPlanViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-6xl h-[92vh] max-h-[880px] shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-700">
            <ArchitecturalPlanViewer
              viewMode="MODAL"
              isOpen={isArchitecturalPlanViewerOpen}
              onClose={() => setIsArchitecturalPlanViewerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 9. PRACTICE & EXAM CHALLENGE MODAL */}
      <PracticeModal
        topic={activeTopic}
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
        onOpenStudioTask={handleOpenStudioTask}
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
      {/* 13. INSTITUTIONAL ADMINISTRATOR CONSOLE (ADMIN ONLY) */}
      <AdminConsoleModal
        isOpen={isAdminConsoleOpen}
        onClose={() => setIsAdminConsoleOpen(false)}
      />

      {/* 14. MANDATORY STUDENT EMAIL VERIFICATION ENFORCEMENT */}
      {userRole === 'STUDENT' && !isEmailVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
              <Mail className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                Security & Academic Compliance
              </span>
              <h3 className="text-lg font-bold text-white mt-2">
                Verify Your Student Email
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Before accessing the NERDC syllabus, interactive drawing studio, and WAEC archives, please enter the 6-digit confirmation code dispatched to{' '}
                <strong className="text-cyan-300 font-mono">{userProfile?.email || 'your email'}</strong>.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (verificationCodeInput.trim().length === 6) {
                  verifyEmail(verificationCodeInput.trim());
                  setVerificationError('');
                } else {
                  setVerificationError('Please enter a valid 6-digit verification code.');
                }
              }}
              className="space-y-3"
            >
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCodeInput}
                  onChange={(e) => {
                    setVerificationCodeInput(e.target.value.replace(/\D/g, ''));
                    setVerificationError('');
                  }}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
                {verificationError && (
                  <p className="text-[11px] text-red-400 mt-1.5">{verificationError}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationCodeInput('849201');
                    setVerificationError('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  Quick-Fill Demo Code (849201)
                </button>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('LANDING')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Return to Home
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all"
                >
                  Verify & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
