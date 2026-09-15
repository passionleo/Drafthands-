import { DrawingTopic, CurriculumTier, CurriculumTerm } from '../types/curriculum';
import { ss1Topics } from './topics/ss1';
import { ss2Topics } from './topics/ss2';
import { ss3Topics } from './topics/ss3';
import { higherTopics } from './topics/higher';
import { buildingTopics } from './topics/building';
import { machineTopics } from './topics/machine';
import { cadTopics } from './topics/cad';
import { digitalGraphicsTopics } from './topics/digitalGraphics';

export const allCurriculumTopics: DrawingTopic[] = [
  ...ss1Topics,
  ...ss2Topics,
  ...ss3Topics,
  ...higherTopics,
  ...buildingTopics,
  ...machineTopics,
  ...cadTopics,
  ...digitalGraphicsTopics
];

export const TERM_CONFIG: Record<CurriculumTerm, {
  id: CurriculumTerm;
  label: string;
  shortLabel: string;
  badge: string;
  colorClass: string;
  description: string;
}> = {
  TERM_1: {
    id: 'TERM_1',
    label: 'First Term (Weeks 1 - 12)',
    shortLabel: 'Term 1',
    badge: '1st Term',
    colorClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    description: 'Foundational theory, instrument mastery, core geometric constructions and projections.'
  },
  TERM_2: {
    id: 'TERM_2',
    label: 'Second Term (Weeks 1 - 12)',
    shortLabel: 'Term 2',
    badge: '2nd Term',
    colorClass: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    description: 'Intermediate constructions, scales, conic sections, architectural plans, and mechanical fasteners.'
  },
  TERM_3: {
    id: 'TERM_3',
    label: 'Third Term (Weeks 1 - 12)',
    shortLabel: 'Term 3',
    badge: '3rd Term',
    colorClass: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    description: 'Advanced surface developments, auxiliary projections, interpenetration of solids, and CAD applications.'
  }
};

export const TIER_CONFIG: Record<CurriculumTier, {
  label: string;
  badge: string;
  colorClass: string;
  description: string;
}> = {
  SS1: {
    label: 'Senior Secondary 1 (SS1)',
    badge: 'SS1 Foundation',
    colorClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    description: 'Foundations of Technical Drawing: Lines, Angles, Bisection, Triangles, Polygons, Tangents, and Introductory Orthographic.'
  },
  SS2: {
    label: 'Senior Secondary 2 (SS2)',
    badge: 'SS2 Intermediate',
    colorClass: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    description: 'Tangency & Belt Drives, Inscribed Circles, Plain/Diagonal Scales, Conics (Ellipse, Parabola), Loci of Linkages, and Auxiliary Views.'
  },
  SS3: {
    label: 'Senior Secondary 3 (SS3)',
    badge: 'SS3 Advanced / WAEC',
    colorClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    description: '1st & 3rd Angle Orthographic, Isometric & Oblique, Building Plans & Roof Trusses, Surface Developments, Interpenetration, and CAD.'
  },
  HIGHER_INSTITUTION: {
    label: 'Higher Institution (Polytechnic & University)',
    badge: 'Higher Institution Eng CAD',
    colorClass: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    description: 'Advanced Engineering Graphics: Kinematic Cam Profiles, Interpenetration of Solids, Screw Threads, Machine & Architectural Detailing.'
  }
};

export function getTopicsByTier(tier: CurriculumTier): DrawingTopic[] {
  return allCurriculumTopics.filter(topic => topic.tier === tier);
}

export function getTopicsByTierAndTerm(tier: CurriculumTier, term?: CurriculumTerm): DrawingTopic[] {
  const topics = getTopicsByTier(tier);
  if (!term) return topics;
  return topics.filter(topic => topic.term === term);
}

export function getTopicById(id: string): DrawingTopic | undefined {
  return allCurriculumTopics.find(topic => topic.id === id) || allCurriculumTopics[0];
}
