import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { SubscriptionProvider } from './context/SubscriptionContext';

export default function App() {
  const [, setView] = useState('LANDING');

  return (
    <SubscriptionProvider>
      <main className="min-h-screen bg-slate-950 text-white w-full overflow-x-hidden">
        <LandingPage
          onEnterStudio={() => setView('STUDIO')}
          onOpenTeacher={() => {}}
          onOpenParent={() => {}}
        />
      </main>
    </SubscriptionProvider>
  );
}
