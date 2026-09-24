import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProcedurePanel } from './components/curriculum/ProcedurePanel';
import { DrawingCanvas } from './components/drafting/DrawingCanvas';
import { allCurriculumTopics } from './data/curriculumData';
import { CurriculumTier, DrawingTopic } from './types/curriculum';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO' | 'TEACHER' | 'PARENT'>('LANDING');
  const [currentTopic, setCurrentTopic] = useState<DrawingTopic>(allCurriculumTopics[0] || null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedTier, setSelectedTier] = useState<CurriculumTier>(CurriculumTier.JSS1);

  const handleReturnHome = () => setCurrentView('LANDING');

  return (
    <SubscriptionProvider>
      <main className="min-h-screen bg-slate-950 text-white w-full overflow-x-hidden relative">
        {/* LANDING VIEW */}
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

        {/* CAD STUDIO WORKSPACE (STUDENT & GENERAL ACCESS) */}
        {currentView === 'STUDIO' && (
          <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900">
            <Header onReturnHome={handleReturnHome} />
            <div className="flex flex-1 overflow-hidden relative">
              <Sidebar
                selectedTier={selectedTier}
                onSelectTier={setSelectedTier}
                currentTopic={currentTopic}
                onSelectTopic={(topic) => {
                  setCurrentTopic(topic);
                  setCurrentStepIndex(0);
                }}
              />
              <div className="flex-1 flex flex-col relative overflow-hidden">
                <DrawingCanvas topic={currentTopic} stepIndex={currentStepIndex} />
                {currentTopic && (
                  <ProcedurePanel
                    topic={currentTopic}
                    currentStepIndex={currentStepIndex}
                    onStepChange={setCurrentStepIndex}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* TEACHER MANAGEMENT DESK */}
        {currentView === 'TEACHER' && (
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold tracking-tight text-emerald-400">Teacher Management Desk</span>
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded">Facilitator</span>
              </div>
              <button
                onClick={handleReturnHome}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                Exit to Home
              </button>
            </header>

            <div className="max-w-6xl mx-auto w-full p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <h3 className="text-slate-400 text-sm">Classroom Curriculum</h3>
                  <p className="text-2xl font-bold mt-1 text-white">SS1 – SS3 & JSS</p>
                  <p className="text-xs text-slate-400 mt-2">NERDC Alignment active</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <h3 className="text-slate-400 text-sm">Interactive Studio</h3>
                  <p className="text-2xl font-bold mt-1 text-emerald-400">CAD Ready</p>
                  <button 
                    onClick={() => setCurrentView('STUDIO')}
                    className="text-xs text-emerald-400 underline mt-2 block hover:text-emerald-300"
                  >
                    Open drafting board &rarr;
                  </button>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <h3 className="text-slate-400 text-sm">Lesson Delivery</h3>
                  <p className="text-2xl font-bold mt-1 text-white">Step-by-Step</p>
                  <p className="text-xs text-slate-400 mt-2">Geometric & mechanical drafting</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-3">Quick Classroom Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setCurrentView('STUDIO')} 
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    Launch Projection & Demonstration Board
                  </button>
                  <button 
                    onClick={handleReturnHome}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors"
                  >
                    Return to Landing Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PARENT / SPONSOR MONITORING PORTAL */}
        {currentView === 'PARENT' && (
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold tracking-tight text-blue-400">Parent & Sponsor Portal</span>
                <span className="text-xs bg-blue-950 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded">Ward Monitoring</span>
              </div>
              <button
                onClick={handleReturnHome}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                Exit to Home
              </button>
            </header>

            <div className="max-w-4xl mx-auto w-full p-6 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h2 className="text-lg font-semibold text-white mb-2">Ward Progress & Performance Overview</h2>
                <p className="text-sm text-slate-400 mb-6">
                  Monitor your student's mastery in Technical Drawing, CAD geometry construction, and WAEC/NECO examination readiness.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-xs text-slate-400 uppercase tracking-wide">Practical Submissions</span>
                    <p className="text-xl font-bold text-white mt-1">Verified Accurate</p>
                    <p className="text-xs text-slate-400 mt-1">Geometric constructions and isometric views</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-xs text-slate-400 uppercase tracking-wide">Sponsorship Status</span>
                    <p className="text-xl font-bold text-emerald-400 mt-1">Active Term Access</p>
                    <p className="text-xs text-slate-400 mt-1">Standard student tier enabled</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 flex gap-3">
                  <button
                    onClick={() => setCurrentView('STUDIO')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Practical Studio Exercises
                  </button>
                  <button
                    onClick={handleReturnHome}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </SubscriptionProvider>
  );
}
