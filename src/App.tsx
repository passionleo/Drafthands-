import React from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { SubscriptionProvider } from './context/SubscriptionContext';

export default function App() {
  return (
    <SubscriptionProvider>
      <main className="min-h-screen bg-slate-950 text-white w-full overflow-x-hidden relative">
        <LandingPage
          onEnterStudio={() => console.log('Studio trigger')}
          onOpenStudentPortal={() => console.log('Student portal trigger')}
          onOpenTeacherPortal={() => console.log('Teacher portal trigger')}
          onOpenParentPortal={() => console.log('Parent portal trigger')}
          onOpenPastQuestions={() => console.log('Past questions trigger')}
          onOpenOwnerPortal={() => console.log('Owner portal trigger')}
        />
      </main>
    </SubscriptionProvider>
  );
}
