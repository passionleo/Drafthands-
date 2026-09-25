import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProcedurePanel } from './components/curriculum/ProcedurePanel';
import { DrawingCanvas } from './components/drafting/DrawingCanvas';
import { allCurriculumTopics } from './data/curriculumData';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'STUDIO' | 'TEACHER' | 'PARENT'>('LANDING');
  const [currentTopic, setCurrentTopic] = useState<any>(allCurriculumTopics?.[0] || null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedTier, setSelectedTier] = useState<any>('JSS1');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. STANDALONE LANDING VIEW */}
      {currentView === 'LANDING' && (
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60 backdrop-blur sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-lg">
                D
              </div>
              <span className="font-bold text-lg tracking-wide text-white">DraftHands</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('TEACHER')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                Teacher Desk
              </button>
              <button
                onClick={() => setCurrentView('PARENT')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                Parent Portal
              </button>
              <button
                onClick={() => setCurrentView('STUDIO')}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition"
              >
                Launch Studio
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-4xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/80 mb-6">
              NERDC Curriculum Aligned &bull; Technical Drawing & Basic Tech
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Master Technical Drawing & CAD Step-by-Step
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
              Interactive geometric constructions, orthographic projections, isometric drafting, and WAEC/NECO examination modules built for Nigerian secondary schools.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setCurrentView('STUDIO')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition transform active:scale-95"
              >
                Launch Interactive Studio
              </button>
              <button
                onClick={() => setCurrentView('TEACHER')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
              >
                Access Teacher Desk
              </button>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-16 text-left">
              <div
                onClick={() => setCurrentView('STUDIO')}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition"
              >
                <div className="text-blue-400 font-bold text-sm mb-1">Student CAD Board</div>
                <p className="text-xs text-slate-400">Step-by-step drafting procedures with compass, rules, and isometric guides.</p>
              </div>
              <div
                onClick={() => setCurrentView('TEACHER')}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition"
              >
                <div className="text-emerald-400 font-bold text-sm mb-1">Teacher Management Desk</div>
                <p className="text-xs text-slate-400">Curriculum-aligned lesson projections and classroom drafting demonstrations.</p>
              </div>
              <div
                onClick={() => setCurrentView('PARENT')}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition"
              >
                <div className="text-indigo-400 font-bold text-sm mb-1">Parent & Sponsor Portal</div>
                <p className="text-xs text-slate-400">Track student progress, topic mastery, and practical drawing submissions.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CAD STUDIO VIEW */}
      {currentView === 'STUDIO' && (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900">
          <Header onReturnHome={() => setCurrentView('LANDING')} />
          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
              currentTopic={currentTopic}
              onSelectTopic={(topic: any) => {
                setCurrentTopic(topic);
                setCurrentStepIndex(0);
              }}
            />
            <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
              <DrawingCanvas topic={currentTopic} stepIndex={currentStepIndex} />
              {currentTopic && (
                <ProcedurePanel
                  topic={currentTopic}
                  currentStepIndex={currentStepIndex}
                  onStepChange={setCurrentStepIndex}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* 3. TEACHER DESK VIEW */}
      {currentView === 'TEACHER' && (
        <div className="min-h-screen bg-slate-950 p-6 flex flex-col">
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-emerald-400">Teacher Management Desk</h1>
                <p className="text-xs text-slate-400">Curriculum Facilitator & Classroom Control</p>
              </div>
              <button
                onClick={() => setCurrentView('LANDING')}
                className="px-3.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-200"
              >
                Exit to Home
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Classroom Projection Mode</h3>
                <p className="text-xs text-slate-400 mb-4">Project interactive drafting steps to projectors or large displays for classroom instruction.</p>
                <button
                  onClick={() => setCurrentView('STUDIO')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white"
                >
                  Open Board For Presentation
                </button>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Curriculum Standards</h3>
                <p className="text-xs text-slate-400 mb-2">Active Syllabus: NERDC Basic Technology & SS1-SS3 Technical Drawing.</p>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">Verified WAEC/NECO Alignment</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PARENT PORTAL VIEW */}
      {currentView === 'PARENT' && (
        <div className="min-h-screen bg-slate-950 p-6 flex flex-col">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-indigo-400">Parent & Sponsor Portal</h1>
                <p className="text-xs text-slate-400">Ward Academic Progress Monitoring</p>
              </div>
              <button
                onClick={() => setCurrentView('LANDING')}
                className="px-3.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-200"
              >
                Exit to Home
              </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
              <h3 className="font-semibold text-white">Student Learning Status</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your ward has full access to guided drafting tools, construction steps for geometric problems, and past WAEC questions.
              </p>
              <button
                onClick={() => setCurrentView('STUDIO')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white"
              >
                Inspect Student Studio Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
    }
