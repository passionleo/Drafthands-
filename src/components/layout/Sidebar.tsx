import React, { useState } from 'react';
import { 
  BookMarked, 
  ChevronRight, 
  GraduationCap, 
  Shapes, 
  CircleDot, 
  Box, 
  Maximize2, 
  Cpu, 
  Sparkles,
  SlidersHorizontal,
  Compass,
  Wrench,
  Home,
  Cog,
  Monitor,
  PenTool,
  Lock,
  Unlock,
  Zap,
  CheckCircle2,
  ChevronLeft,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar
} from 'lucide-react';
import { CurriculumTier, CurriculumTerm, DrawingTopic, TopicCategory } from '../../types/curriculum';
import { TIER_CONFIG, TERM_CONFIG, getTopicsByTier } from '../../data/curriculumData';
import { useSubscription } from '../../context/SubscriptionContext';
import { FREE_TOPICS_PER_TIER } from '../../types/subscription';

interface SidebarProps {
  topics: DrawingTopic[];
  activeTopicId: string;
  onSelectTopic: (id: string) => void;
  activeTier: CurriculumTier;
  onSelectTier: (tier: CurriculumTier) => void;
  searchQuery: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CATEGORY_ICONS: Record<TopicCategory, React.ReactNode> = {
  TECHNICAL_FOUNDATIONS: <BookMarked className="w-3.5 h-3.5" />,
  GEOMETRIC_CONSTRUCTION: <Shapes className="w-3.5 h-3.5" />,
  TANGENCY_AND_CURVES: <CircleDot className="w-3.5 h-3.5" />,
  CONIC_SECTIONS: <Compass className="w-3.5 h-3.5" />,
  ORTHOGRAPHIC_PROJECTION: <Maximize2 className="w-3.5 h-3.5" />,
  ISOMETRIC_AND_PICTORIAL: <Box className="w-3.5 h-3.5" />,
  DEVELOPMENTS_AND_INTERPENETRATION: <LayersIcon />,
  MACHINE_AND_BUILDING_DRAFTING: <Cpu className="w-3.5 h-3.5" />,
  FASTENERS_AND_ASSEMBLY: <Wrench className="w-3.5 h-3.5" />,
  BUILDING_AND_ARCHITECTURAL: <Home className="w-3.5 h-3.5" />,
  MACHINE_DRAWING_AND_ASSEMBLY: <Cog className="w-3.5 h-3.5" />,
  COMPUTER_AIDED_DESIGN: <Monitor className="w-3.5 h-3.5" />,
  DIGITAL_GRAPHICS_ILLUSTRATION: <PenTool className="w-3.5 h-3.5" />
};

function LayersIcon() {
  return <SlidersHorizontal className="w-3.5 h-3.5" />;
}

export const Sidebar: React.FC<SidebarProps> = ({
  topics,
  activeTopicId,
  onSelectTopic,
  activeTier,
  onSelectTier,
  searchQuery,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { isSubscribed, checkTopicAccess, openPaywall, userRole, subscription, isMasterAdmin } = useSubscription();
  const [selectedTerm, setSelectedTerm] = useState<CurriculumTerm | 'ALL'>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const userRoleVal = subscription?.userProfile?.role || userRole || 'STUDENT';
  const isStudent = userRoleVal === 'STUDENT';
  const isInstructorOrAdmin = userRoleVal === 'TEACHER' || userRoleVal === 'ADMIN' || isMasterAdmin || (userRoleVal as string) === 'INSTRUCTOR';

  const currentTierConfig = TIER_CONFIG[activeTier];
  const topicsInCurrentTier = getTopicsByTier(activeTier);

  const filteredTopics = topics.filter(t => {
    const matchesTier = t.tier === activeTier;
    const matchesTerm = selectedTerm === 'ALL' || t.term === selectedTerm;
    
    if (searchQuery.trim() === '') return matchesTier && matchesTerm;
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      t.title.toLowerCase().includes(q) ||
      t.moduleCode.toLowerCase().includes(q) ||
      t.standards.waecRef.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.termLabel && t.termLabel.toLowerCase().includes(q))
    );
    return matchesTier && matchesTerm && matchesSearch;
  });

  const handleTopicClick = (topic: DrawingTopic, idx: number = 0) => {
    // Keep Week 1 (index 0) unlocked, lock subsequent weeks for student unless instructor/admin
    const isLockedForStudent = isStudent && idx > 0 && !isInstructorOrAdmin;
    if (isLockedForStudent) {
      setToastMsg("Complete preceding exercises to unlock this module.");
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    const tierTopics = getTopicsByTier(topic.tier);
    const access = checkTopicAccess(topic, tierTopics);

    if (access.isAllowed) {
      onSelectTopic(topic.id);
    } else {
      // Trigger Paywall Modal with targeted topic
      openPaywall(topic);
    }
  };

  if (isCollapsed) {
    return (
      <aside className="w-14 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 select-none overflow-hidden items-center py-3">
        {/* Expand Toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mb-3"
          title="Expand Curriculum Syllabus"
        >
          <PanelLeftOpen className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Tier Badges Mini Rail */}
        <div className="flex flex-col gap-1.5 w-full px-1.5 border-b border-slate-800 pb-3">
          {(['SS1', 'SS2', 'SS3', 'HIGHER_INSTITUTION'] as CurriculumTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => onSelectTier(tier)}
              className={`w-full py-1 text-[9px] font-mono font-bold rounded text-center transition-colors ${
                activeTier === tier
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
              title={TIER_CONFIG[tier].label}
            >
              {tier === 'HIGHER_INSTITUTION' ? 'HI' : tier}
            </button>
          ))}
        </div>

        {/* Mini Topics List */}
        <div className="flex-1 overflow-y-auto w-full px-1.5 py-2 space-y-2 custom-scrollbar">
          {topicsInCurrentTier.map((topic, idx) => {
            const isActive = topic.id === activeTopicId;
            const access = checkTopicAccess(topic, topicsInCurrentTier);
            const isLocked = !access.isAllowed;

            return (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className={`w-full p-2 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : isLocked
                    ? 'bg-slate-950/40 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-950/30 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`${topic.moduleCode}: ${topic.title} ${isLocked ? '(Pro Tier)' : '(Free)'}`}
              >
                <span className="text-[9px] font-mono font-bold">W{idx + 1}</span>
                {isLocked ? (
                  <Lock className="w-2.5 h-2.5 text-amber-400 mt-0.5" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Tier Info Box */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">
              Curriculum Standard
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${currentTierConfig.colorClass}`}>
              {currentTierConfig.badge}
            </span>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {currentTierConfig.description}
        </p>

        {/* Mobile Tier Pills */}
        <div className="grid grid-cols-4 gap-1 mt-2.5 lg:hidden">
          {(['SS1', 'SS2', 'SS3', 'HIGHER_INSTITUTION'] as CurriculumTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => onSelectTier(tier)}
              className={`py-1 text-[10px] font-semibold rounded text-center transition-colors ${
                activeTier === tier
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tier === 'HIGHER_INSTITUTION' ? 'Higher' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Freemium Policy Alert Header */}
      {!isSubscribed && (
        <div className="px-3 py-2 bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-emerald-950/40 border-b border-emerald-800/30 flex items-center justify-between text-[10px]">
          <span className="text-emerald-300 font-medium flex items-center gap-1">
            <Unlock className="w-3 h-3 text-emerald-400" />
            <span>First {FREE_TOPICS_PER_TIER} Topics Free / Tier</span>
          </span>
          <button
            onClick={() => openPaywall()}
            className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-0.5"
          >
            <Zap className="w-2.5 h-2.5" />
            <span>Unlock All</span>
          </button>
        </div>
      )}

      {/* Term Selector Strip */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-1">
        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-cyan-400" />
          <span>Term:</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedTerm('ALL')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
              selectedTerm === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All
          </button>
          {(['TERM_1', 'TERM_2', 'TERM_3'] as CurriculumTerm[]).map((tKey, idx) => {
            const count = topicsInCurrentTier.filter(t => t.term === tKey).length;
            const isSel = selectedTerm === tKey;
            return (
              <button
                key={tKey}
                onClick={() => setSelectedTerm(tKey)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all flex items-center gap-1 ${
                  isSel
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={TERM_CONFIG[tKey]?.label}
              >
                <span>T{idx + 1}</span>
                <span className="text-[9px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Topic Header */}
      <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Curriculum Modules ({filteredTopics.length})
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          ISO 128 / WAEC / NERDC
        </span>
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar relative">
        {toastMsg && (
          <div className="sticky top-0 z-20 mb-2 p-2.5 bg-amber-950/95 border border-amber-500/80 rounded-xl text-amber-200 text-xs flex items-center justify-between shadow-2xl animate-in fade-in">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="text-amber-400 hover:text-white font-bold px-1">×</button>
          </div>
        )}

        {filteredTopics.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No matching curriculum modules found for &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredTopics.map((topic, idx) => {
            const isActive = topic.id === activeTopicId;
            const isLockedForStudent = isStudent && idx > 0 && !isInstructorOrAdmin;
            const tierTopics = getTopicsByTier(topic.tier);
            const access = checkTopicAccess(topic, tierTopics);
            const isLocked = isLockedForStudent || !access.isAllowed;

            return (
              <button
                key={topic.id}
                id={`topic-item-${topic.id}`}
                onClick={() => handleTopicClick(topic, idx)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-150 relative border ${
                  isActive
                    ? 'bg-slate-800/90 text-white border-cyan-500/50 shadow-md shadow-cyan-950/30'
                    : isLocked
                    ? 'bg-slate-950/20 text-slate-400 border-slate-800/40 hover:bg-slate-900/50 hover:border-amber-700/50'
                    : 'bg-slate-950/40 text-slate-300 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                {/* Active Indicator Accent */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full" />
                )}

                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700/80">
                      {topic.moduleCode}
                    </span>

                    {/* Term Badge */}
                    {topic.term && (
                      <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                        topic.term === 'TERM_1' 
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40' 
                          : topic.term === 'TERM_2'
                          ? 'bg-blue-950/70 text-blue-300 border-blue-800/40'
                          : 'bg-purple-950/70 text-purple-300 border-purple-800/40'
                      }`}>
                        {topic.term === 'TERM_1' ? 'T1' : topic.term === 'TERM_2' ? 'T2' : 'T3'}{topic.week ? ` • W${topic.week}` : ''}
                      </span>
                    )}

                    {/* Free vs Pro Badge */}
                    {access.isFreeTier && !isSubscribed ? (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/60">
                        FREE
                      </span>
                    ) : isLocked ? (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        PRO
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    {CATEGORY_ICONS[topic.category]}
                    <span className="capitalize text-[10px] text-slate-400">
                      {topic.tier}
                    </span>
                  </div>
                </div>

                <h3 className={`text-xs font-semibold leading-snug line-clamp-2 ${
                  isActive ? 'text-cyan-200' : isLocked ? 'text-slate-300' : 'text-slate-200'
                }`}>
                  {topic.title}
                </h3>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {topic.shortDescription}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[170px] text-slate-500">
                    {topic.standards.waecRef}
                  </span>
                  <div className="flex items-center gap-1">
                    {isLocked ? (
                      <span className="text-amber-400 font-medium text-[10px] flex items-center gap-0.5">
                        <Lock className="w-3 h-3" />
                        <span>Unlock</span>
                      </span>
                    ) : (
                      <span className="font-mono text-cyan-400/80 font-medium">
                        {topic.generateSteps({}).length} Steps
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
          <span>WAEC Standard Syllabus</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40">
          Accredited
        </span>
      </div>
    </aside>
  );
};

