export type CurriculumTier = 'SS1' | 'SS2' | 'SS3' | 'HIGHER_INSTITUTION';

export type CurriculumTerm = 'TERM_1' | 'TERM_2' | 'TERM_3';

export type TopicCategory =
  | 'TECHNICAL_FOUNDATIONS'
  | 'GEOMETRIC_CONSTRUCTION'
  | 'TANGENCY_AND_CURVES'
  | 'CONIC_SECTIONS'
  | 'ORTHOGRAPHIC_PROJECTION'
  | 'ISOMETRIC_AND_PICTORIAL'
  | 'DEVELOPMENTS_AND_INTERPENETRATION'
  | 'MACHINE_AND_BUILDING_DRAFTING'
  | 'FASTENERS_AND_ASSEMBLY'
  | 'BUILDING_AND_ARCHITECTURAL'
  | 'MACHINE_DRAWING_AND_ASSEMBLY'
  | 'COMPUTER_AIDED_DESIGN'
  | 'DIGITAL_GRAPHICS_ILLUSTRATION';

export type LineWeightType =
  | 'THICK_CONTINUOUS'   // Visible outlines, finished geometry (0.5 - 0.7mm)
  | 'THIN_CONTINUOUS'    // Construction lines, projection lines, hatch (0.25mm)
  | 'THIN_DASHED'        // Hidden outlines / hidden details (0.25mm)
  | 'THIN_CHAIN'         // Centerlines, axes of symmetry, path of loci (0.25mm)
  | 'DIMENSION_LINE'     // Dimension lines, extension lines, leaders (0.25mm)
  | 'LOCUS_TRACE'        // Highlighted loci curves
  | 'OUTLINE_HB'
  | 'CONSTRUCTION_2H'
  | 'CONSTRUCTION_4H'
  | 'HIDDEN_DETAIL'
  | 'CENTER_LINE';

export type ElementType =
  | 'POINT'
  | 'LINE'
  | 'SEGMENT'
  | 'CIRCLE'
  | 'ARC'
  | 'POLYGON'
  | 'RECTANGLE'
  | 'TANGENT'
  | 'TEXT_LABEL'
  | 'TEXT'
  | 'DIMENSION'
  | 'HATCH';

export type InstrumentType =
  | 'NONE'
  | 'COMPASS'
  | 'SET_SQUARE_45'
  | 'SET_SQUARE_30_60'
  | 'TEE_SQUARE'
  | 'RULER'
  | 'DIVIDER'
  | 'PROTRACTOR'
  | 'PENCIL_2H'
  | 'PENCIL_HB'
  | 'FRENCH_CURVE';

export interface ConstructionElement {
  id: string;
  type: ElementType;
  lineWeight: LineWeightType;
  color?: string;
  isNew?: boolean;
  isFinalResult?: boolean;
  // Geometry parameters
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  startAngle?: number; // In degrees
  endAngle?: number;   // In degrees
  anticlockwise?: boolean;
  points?: [number, number][]; // for polygons / loci
  // Rectangle parameters
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  labelOffset?: [number, number];
  dimensionText?: string;
  dimensionType?: 'linear' | 'radius' | 'diameter' | 'angle';
  hatchAngle?: number;
}

export interface InstrumentState {
  toolType: InstrumentType;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  radius?: number;
  angleDeg?: number;
  actionText?: string;
  visible: boolean;
}

export interface ProceduralStep {
  stepIndex: number;
  title: string;
  instruction: string;
  detailedNotes: string;
  technicalPrinciple: string;
  activeInstrument: InstrumentState;
  elements: ConstructionElement[];
  highlightElementIds?: string[];
}

export type StepDefinition = ProceduralStep;

export interface TopicParameter {
  id: string;
  label: string;
  symbol?: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
}

export interface TheoryPrinciple {
  title: string;
  description: string;
  keyRule?: string;
}

export interface TopicTheory {
  overview: string;
  historyAndApplication: string;
  waecAndNERDCNotes: string;
  keyPrinciples: TheoryPrinciple[];
  formulas?: {
    latex: string;
    description: string;
  }[];
  standardConventions: {
    lineName: string;
    weightMm: string;
    pencilGrade: string;
    application: string;
  }[];
}

export interface DrawingTopic {
  id: string;
  tier: CurriculumTier;
  term?: CurriculumTerm;
  termLabel?: string; // e.g. "First Term", "Second Term", "Third Term"
  week?: number;      // e.g. 1 to 12
  moduleCode: string;
  title: string;
  shortDescription: string;
  category: TopicCategory;
  standards: {
    nerdcRef: string;
    waecRef: string;
    isoRef: string;
  };
  theory: TopicTheory;
  parameters: TopicParameter[];
  defaultViewBox: {
    width: number;
    height: number;
    defaultGrid: 'MILLIMETER' | 'ISOMETRIC' | 'POLAR' | 'ENGINEERING_5MM';
  };
  generateSteps: (params: Record<string, number>) => ProceduralStep[];
}

export type CurriculumTopic = DrawingTopic;

