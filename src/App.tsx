import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  BookOpen, 
  Tv, 
  Users, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Play, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Download,
  Smartphone,
  Laptop,
  GraduationCap,
  FileText,
  Clock,
  ExternalLink,
  Lock,
  UserCheck,
  Building,
  Wrench,
  Radio,
  X
} from 'lucide-react';
import { CurriculumTier, DrawingTopic } from '../../types/curriculum';
import { allCurriculumTopics, getTopicsByTier } from '../../data/curriculumData';
import { useSubscription } from '../../context/SubscriptionContext';
import { AuthModal } from './AuthModal';
import { NavigationVideoModal } from './NavigationVideoModal';
import { LandingPWAInstallModal } from '../pwa/LandingPWAInstallModal';

interface LandingPageProps {
  onEnterStudio?: (options?: { tier?: CurriculumTier; topicId?: string; openTeacher?: boolean; openParent?: boolean; openPastQuestions?: boolean; portal?: 'TEACHER' | 'PARENT' }) => void;
  onOpenTeacherPortal?: () => void;
  onOpenParentPortal?: () => void;
  onOpenStudentPortal?: () => void;
  onOpenPastQuestions?: () => void;
  onOpenOwnerPortal?: () => void;
}

class LandingErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error("LandingPage Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-cyan-400">DraftHands Academy</h2>
            <p className="text-sm text-slate-300">The landing view recovered from a minor render interruption.</p>
            <button
              onClick={() => {
                try { localStorage.clear(); sessionStorage.clear(); } catch {}
                window.location.hash = '#landing';
                window.location.reload();
              }}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-sm text-white cursor-pointer shadow-lg shadow-cyan-600/30"
            >
              Reload Landing Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const LandingPageInner: React.FC<LandingPageProps> = ({ 
  onEnterStudio = () => {},
  onOpenTeacherPortal,
  onOpenParentPortal,
  onOpenStudentPortal,
  onOpenPastQuestions,
  onOpenOwnerPortal
}) => {
  // Landing Page implementation...
  // ...
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden select-none">
      {/* Landing Header, Hero Section, Curriculum Preview, Features, Footer */}
      {/* ... */}
      <LandingPWAInstallModal autoPromptDelay={1200} />
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = (props) => (
  <LandingErrorBoundary>
    <LandingPageInner {...props} />
  </LandingErrorBoundary>
);
