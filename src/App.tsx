import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import Studio from './components/practice/Studio';
import TeacherPortalView from './components/teacher/TeacherPortalView';
import ParentPortalView from './components/parent/ParentPortalView';
import { SubscriptionProvider } from './context/SubscriptionContext';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO' | 'TEACHER' | 'PARENT'>('LANDING');

  const handleReturnHome = () => setCurrentView('LANDING');

  return (
    <SubscriptionProvider>
      <main className="min-h-screen bg-slate-950 text-white w-full overflow-x-hidden relative">
        {currentView === 'STUDIO' && (
          <Studio onReturnHome={handleReturnHome} />
        )}

        {currentView === 'TEACHER' && (
          <TeacherPortalView onReturnHome={handleReturnHome} />
        )}

        {currentView === 'PARENT' && (
          <ParentPortalView onReturnHome={handleReturnHome} />
        )}

        {currentView === 'LANDING' && (
          <LandingPage
            onEnterStudio={() => setCurrentView('STUDIO')}
            onOpenStudentPortal={() => setCurrentView('STUDIO')}
            onOpenTeacherPortal={() => setCurrentView('TEACHER')}
            onOpenParentPortal={() => setCurrentView('PARENT')}
            onOpenPastQuestions={() => setCurrentView('STUDIO')}
            onOpenOwnerPortal={() => setCurrentView('TEACHER')}
          />
        )}
      </main>
    </SubscriptionProvider>
  );
}
