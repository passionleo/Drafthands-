import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProcedurePanel } from './components/curriculum/ProcedurePanel';
import { DrawingCanvas } from './components/drafting/DrawingCanvas';
import { allCurriculumTopics } from './data/curriculumData';

export default function App() {
  const [currentTopic, setCurrentTopic] = useState<any>(
    allCurriculumTopics && allCurriculumTopics.length > 0 ? allCurriculumTopics[0] : null
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedTier, setSelectedTier] = useState<any>('JSS1');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      <Header onReturnHome={() => window.location.reload()} />
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
  );
}
