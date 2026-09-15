import { LineWeightType, ConstructionElement } from './curriculum';

export type GeometryElement = ConstructionElement;

export interface TextbookFigure {
  figureNumber: string; // e.g. "Fig. 1.1", "Fig. 2.1"
  title: string;
  caption: string;
  technicalNotes: string[];
  dimensions?: string[];
  svgType?: string;
  imageUrl?: string;
  elements?: GeometryElement[];
  viewBox?: { width: number; height: number };
  constructionGrade?: '2H Construction' | 'HB Final Outline' | 'ISO Dimensioned' | 'Axonometric Blueprint' | string;
  textbookSource?: string; // e.g. "J.N. Green Fig. 2.14" or "Pickup & Parker Vol. 1, Ex. 4"
}

export interface TextbookPrinciple {
  title: string;
  paragraphs: string[];
  mathematicalFormulation?: string;
  engineeringImportance: string;
  realWorldApplications?: string[];
  figureRef?: string; // e.g. "Fig. 1.1"
  figure?: TextbookFigure;
}

export interface ProceduralMethodStep {
  stepNumber: number;
  heading: string;
  detailedDescription: string;
  instrumentAction: string;
  lineSpecification: string;
  pencilGrade: '2H' | '3H' | '4H' | 'H' | 'HB' | 'B';
  qualityCheck: string;
  figureRef?: string; // e.g. "Fig. 1.2"
  figure?: TextbookFigure;
}

export interface ExaminerTrap {
  trap: string;
  penalty: string;
  avoidance: string;
}

export interface LineWeightConvention {
  type: string;
  isoCode: string;
  thickness: string;
  pencilGrade: string;
  ruleDescription: string;
}

export interface PracticeProblem {
  questionNumber: number;
  problemText: string;
  specifications: string;
  marks: number;
}

export interface TextbookReference {
  bookTitle: string;
  author: 'J.N. Green' | 'F. Pickup & M.A. Parker' | string;
  edition: string;
  chapter: string;
  pages?: string;
  figureRefs?: string[];
  syllabusRelevance: string;
}

export interface WorkedExample {
  exampleNumber: string; // e.g. "Worked Example 1 (Pickup & Parker Ex. 4)"
  title: string;
  givenData: string | string[];
  constructionTheorem?: string;
  steps: string[];
  waecExaminerTip?: string;
  keyExaminerTip?: string;
  figureRef?: string;
  source?: string;
  problemStatement?: string;
  solutionNotes?: string;
}

export interface TextbookChapter {
  topicId: string;
  moduleCode: string;
  title: string;
  tier: string;
  historicalContext: string;
  textbookReferences?: TextbookReference[];
  workedExamples?: WorkedExample[];
  figures: TextbookFigure[]; // All linked textbook figures for this chapter
  theoreticalPrinciples: TextbookPrinciple[];
  examinerTraps?: ExaminerTrap[];
  proceduralMethodology: {
    prerequisites: string[];
    instrumentSetup: string[];
    numberedMethod: ProceduralMethodStep[];
    examinerTraps: ExaminerTrap[];
  };
  standardConventions: {
    isoStandardNumber: string;
    nerdcCurriculumClause: string;
    waecMarkingKey: string;
    lineWeightTable: LineWeightConvention[];
    dimensioningRules: string[];
    sheetLayoutRules: string[];
  };
  vectorDiagramType: 
    | 'BORDER_AND_TITLE_BLOCK'
    | 'LINE_TYPES_SPECIMEN'
    | 'BISECTION_LINE'
    | 'BISECTION_ANGLE'
    | 'REGULAR_POLYGON'
    | 'TANGENCY_EXTERNAL_INTERNAL'
    | 'CONIC_ELLIPSE_CONCENTRIC'
    | 'CONIC_PARABOLA'
    | 'ORTHOGRAPHIC_FIRST_ANGLE'
    | 'ORTHOGRAPHIC_THIRD_ANGLE'
    | 'ISOMETRIC_BOX_AND_CIRCLE'
    | 'SURFACE_DEVELOPMENT'
    | 'SECTIONING_AND_HATCH'
    | 'FASTENERS_HEX_BOLT'
    | 'BUILDING_FOUNDATION_WALL'
    | 'CAD_COORDINATE_SYSTEM'
    | 'DIGITAL_BEZIER_CURVE'
    | 'GENERIC_ENGINEERING';
  caption: string;
  technicalNotes: string[];
  practiceProblems: PracticeProblem[];
}
