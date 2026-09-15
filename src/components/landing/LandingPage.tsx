import React, { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ValuePropositionGrid } from './ValuePropositionGrid';
import { CurriculumPreviewSection } from './CurriculumPreviewSection';
import { ExamArchiveSection } from './ExamArchiveSection';
import { LiveClassroomSpotlight } from './LiveClassroomSpotlight';
import { TestimonialsSection } from './TestimonialsSection';
import { LandingFooter } from './LandingFooter';
import { NavigationVideoModal } from './NavigationVideoModal';
import { AuthModal, UserRoleType } from './AuthModal';
import { CurriculumTier } from '../../types/curriculum';

interface LandingPageProps {
  onEnterStudio: (options?: { tier?: CurriculumTier; topicId?: string; role?: UserRoleType; openTeacher?: boolean; openParent?: boolean; openLive?: boolean }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterStudio }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'REGISTER'>('SIGN_IN');

  const handleOpenAuth = (mode: 'SIGN_IN' | 'REGISTER' = 'SIGN_IN') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenVideoTour = () => {
    setIsVideoModalOpen(true);
  };

  const handleLaunchStudio = (tier?: CurriculumTier) => {
    onEnterStudio({ tier: tier || 'SS1' });
  };

  const handleLaunchTopic = (topicId: string) => {
    onEnterStudio({ topicId });
  };

  const handleAuthSuccess = (role: UserRoleType, userDetails: { name: string; email: string; institution?: string }) => {
    if (role === 'TEACHER') {
      onEnterStudio({ tier: 'SS1', role, openTeacher: true });
    } else if (role === 'PARENT') {
      onEnterStudio({ tier: 'SS1', role, openParent: true });
    } else {
      onEnterStudio({ tier: 'SS1', role });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Header */}
      <LandingHeader
        onOpenAuth={handleOpenAuth}
        onOpenVideoTour={handleOpenVideoTour}
        onLaunchStudio={handleLaunchStudio}
        onNavigateSection={handleNavigateSection}
      />

      {/* 2. Hero Section */}
      <div id="hero">
        <HeroSection
          onOpenAuth={handleOpenAuth}
          onOpenVideoTour={handleOpenVideoTour}
          onLaunchStudio={handleLaunchStudio}
        />
      </div>

      {/* 3. Value Proposition Grid */}
      <ValuePropositionGrid
        onLaunchStudio={handleLaunchStudio}
        onOpenVideoTour={handleOpenVideoTour}
        onOpenAuth={handleOpenAuth}
      />

      {/* 4. Interactive Curriculum Catalog */}
      <CurriculumPreviewSection
        onSelectTopicToLaunch={handleLaunchTopic}
      />

      {/* 5. WAEC/NECO/NABTEB 10-Year Exam Archive */}
      <ExamArchiveSection
        onLaunchTopic={handleLaunchTopic}
        onOpenAuth={handleOpenAuth}
      />

      {/* 6. Real-Time Virtual Classroom Spotlight */}
      <LiveClassroomSpotlight
        onOpenLiveClass={() => onEnterStudio({ openLive: true })}
        onOpenVideoTour={handleOpenVideoTour}
      />

      {/* 7. Testimonials & Accreditations */}
      <TestimonialsSection />

      {/* 8. Footer */}
      <LandingFooter
        onLaunchStudio={handleLaunchStudio}
        onOpenAuth={handleOpenAuth}
        onOpenVideoTour={handleOpenVideoTour}
      />

      {/* Modals */}
      <NavigationVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onLaunchTopic={handleLaunchTopic}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};
