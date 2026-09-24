import React, { useState } from 'react';
import LandingPage from './components/landing/LandingPage';
import Studio from './components/practice/Studio';
import TeacherPortalView from './components/teacher/TeacherPortalView';
import ParentPortalView from './components/parent/ParentPortalView';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO' | 'TEACHER' | 'PARENT'>('LANDING');

  return (
    <div className="min-h-screen bg-slate-950 text-white w-full overflow-x-hidden">
      {currentView === 'STUDIO' ? (
        <Studio onReturnHome={() => setCurrentView('LANDING')} />
      ) : currentView === 'TEACHER' ? (
        <TeacherPortalView onReturnHome={() => setCurrentView('LANDING')} />
      ) : currentView === 'PARENT' ? (
        <ParentPortalView onReturnHome={() => setCurrentView('LANDING')} />
      ) : (
        <LandingPage
          onEnterStudio={() => setCurrentView('STUDIO')}
          onOpenTeacher={() => setCurrentView('TEACHER')}
          onOpenParent={() => setCurrentView('PARENT')}
        />
      )}
    </div>
  );
}
