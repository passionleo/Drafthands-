import { LineWeightType } from './curriculum';

export type WorkspaceMode = 'TRADITIONAL_BOARD' | 'CAD_WORKSTATION';

export type WhiteboardTool =
  // Universal Tools
  | 'SELECT'
  | 'PAN'
  | 'PEN'
  | 'LINE'
  | 'RECTANGLE'
  | 'CIRCLE'
  | 'ARC'
  | 'POLYGON'
  | 'SPLINE'            // French curve / smooth Bezier spline
  | 'ELLIPSE'
  | 'DIMENSION_LINEAR'
  | 'DIMENSION_RADIUS'
  | 'DIMENSION_ANGULAR'
  | 'TEXT'
  | 'ERASER'
  // CAD Modify Tools
  | 'CAD_TRIM'
  | 'CAD_EXTEND'
  | 'CAD_OFFSET'
  | 'CAD_MIRROR'
  | 'CAD_FILLET'
  | 'CAD_ROTATE'
  | 'CAD_SCALE'
  // Traditional Physical Instruments
  | 'INSTRUMENT_RULER'
  | 'INSTRUMENT_SCALE_RULE'
  | 'INSTRUMENT_SETSQUARE_30_60'
  | 'INSTRUMENT_SETSQUARE_45'
  | 'INSTRUMENT_COMPASS'
  | 'INSTRUMENT_PROTRACTOR'
  | 'INSTRUMENT_FRENCH_CURVE'
  | 'INSTRUMENT_TEE_SQUARE';

export type WhiteboardLayer =
  | 'CONSTRUCTION_2H'
  | 'OUTLINE_HB'
  | 'BORDER_2B'
  | 'HIDDEN_DASHED'
  | 'CENTERLINE_CHAIN'
  | 'DIMENSIONS'
  | 'ANNOTATIONS'
  | 'REDLINE_TEACHER_MARKUP';

export interface FreehandPoint {
  x: number;
  y: number;
  pressure?: number;
  time?: number;
}

export interface WhiteboardElement {
  id: string;
  type: 
    | 'PEN_STROKE' 
    | 'LINE' 
    | 'RECTANGLE' 
    | 'CIRCLE' 
    | 'ARC' 
    | 'POLYGON' 
    | 'SPLINE' 
    | 'ELLIPSE' 
    | 'DIMENSION' 
    | 'TEXT'
    | 'REDLINE_ANNOTATION';
  layer: WhiteboardLayer;
  lineWeight: LineWeightType;
  color: string;
  points?: FreehandPoint[]; // For pen strokes & splines
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  rx?: number; // For ellipse
  ry?: number; // For ellipse
  startAngle?: number;
  endAngle?: number;
  width?: number;
  height?: number;
  polygonPoints?: [number, number][];
  svgPath?: string;
  dimensionText?: string;
  dimensionType?: 'linear' | 'radius' | 'diameter' | 'angle';
  text?: string;
  fontSize?: number;
  locked?: boolean;
}

export interface OnScreenInstrument {
  id: string;
  type: 
    | 'RULER' 
    | 'SCALE_RULE'
    | 'SETSQUARE_30_60' 
    | 'SETSQUARE_45' 
    | 'COMPASS' 
    | 'PROTRACTOR' 
    | 'TEE_SQUARE'
    | 'FRENCH_CURVE';
  x: number;
  y: number;
  rotation: number; // degrees
  scale: number;
  visible: boolean;
  length?: number;
  radius?: number;
  scaleRatio?: '1:1' | '1:2' | '1:5' | '1:10' | '1:50' | '1:100';
  frenchCurveVariant?: 'BURMESTER_1' | 'BURMESTER_2' | 'BURMESTER_3';
}

export interface CadCommandHistoryEntry {
  command: string;
  timestamp: string;
  status: 'SUCCESS' | 'ERROR' | 'PROMPT';
  message: string;
}
