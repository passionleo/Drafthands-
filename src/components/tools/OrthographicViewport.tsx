import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Compass, 
  RotateCcw, 
  Eye, 
  Layers, 
  Maximize2, 
  Minimize2, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Sliders, 
  Box, 
  Play, 
  Pause,
  Grid,
  Info,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export type ProjectionAngle = 'FIRST_ANGLE' | 'THIRD_ANGLE';
export type PartModelId = 'L_BRACKET' | 'VEE_BLOCK' | 'BEARING_HOUSING' | 'DOVETAIL_GUIDE';

interface OrthographicViewportProps {
  initialAngle?: ProjectionAngle;
  initialPart?: PartModelId;
  isOpen?: boolean;
  onClose?: () => void;
  viewMode?: 'MODAL' | 'EMBEDDED' | 'FULLSCREEN';
  className?: string;
}

// 3D Point & Face Definitions
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  id: string;
  name: string;
  category: 'FRONT' | 'TOP' | 'SIDE' | 'FEATURE';
  vertices: Point3D[];
  normal: Point3D;
  color: string;
  highlightColor: string;
}

interface Edge3D {
  p1: Point3D;
  p2: Point3D;
  type: 'VISIBLE' | 'HIDDEN' | 'CENTERLINE';
  featureId?: string;
}

// Part Model Definition
interface PartModelData {
  id: PartModelId;
  name: string;
  subtitle: string;
  description: string;
  dimensions: { width: number; height: number; depth: number };
  faces: Face3D[];
  edges: Edge3D[];
  // 2D Orthographic Specifications (in local mm coordinates)
  ortho2D: {
    front: {
      outlines: string[];
      circles?: { cx: number; cy: number; r: number }[];
      hiddenLines: { x1: number; y1: number; x2: number; y2: number }[];
      centerlines: { x1: number; y1: number; x2: number; y2: number }[];
      dimensions: { x1: number; y1: number; x2: number; y2: number; text: string; offset: number }[];
      viewBox: string;
      label: string;
    };
    plan: {
      outlines: string[];
      circles?: { cx: number; cy: number; r: number }[];
      hiddenLines: { x1: number; y1: number; x2: number; y2: number }[];
      centerlines: { x1: number; y1: number; x2: number; y2: number }[];
      dimensions: { x1: number; y1: number; x2: number; y2: number; text: string; offset: number }[];
      viewBox: string;
      label: string;
    };
    end: {
      outlines: string[];
      circles?: { cx: number; cy: number; r: number }[];
      hiddenLines: { x1: number; y1: number; x2: number; y2: number }[];
      centerlines: { x1: number; y1: number; x2: number; y2: number }[];
      dimensions: { x1: number; y1: number; x2: number; y2: number; text: string; offset: number }[];
      viewBox: string;
      label: string;
    };
  };
}

// PARTS DATABASE
const PART_MODELS: Record<PartModelId, PartModelData> = {
  L_BRACKET: {
    id: 'L_BRACKET',
    name: 'Stepped L-Bracket with Through-Bore',
    subtitle: 'NERDC & WAEC Standard Reference Component (J.N. Green Fig 10.25)',
    description: 'An asymmetric engineering bracket with horizontal base flange, vertical upright, chamfered corner, and Ø24mm through-hole. Demonstrates hidden lines and circular plan projection.',
    dimensions: { width: 90, height: 80, depth: 60 },
    faces: [
      // Upright Front Face
      {
        id: 'front-upright',
        name: 'Upright Front Face',
        category: 'FRONT',
        vertices: [
          { x: 0, y: 20, z: 20 },
          { x: 25, y: 20, z: 20 },
          { x: 25, y: 20, z: 80 },
          { x: 0, y: 20, z: 80 }
        ],
        normal: { x: 0, y: -1, z: 0 },
        color: '#1e3a8a',
        highlightColor: '#38bdf8'
      },
      // Base Front Face
      {
        id: 'front-base',
        name: 'Base Front Face',
        category: 'FRONT',
        vertices: [
          { x: 0, y: 0, z: 0 },
          { x: 90, y: 0, z: 0 },
          { x: 90, y: 0, z: 20 },
          { x: 0, y: 0, z: 20 }
        ],
        normal: { x: 0, y: -1, z: 0 },
        color: '#1e40af',
        highlightColor: '#0ea5e9'
      },
      // Base Step Horizontal Face
      {
        id: 'top-base-step',
        name: 'Base Step Top Face',
        category: 'TOP',
        vertices: [
          { x: 25, y: 0, z: 20 },
          { x: 90, y: 0, z: 20 },
          { x: 90, y: 60, z: 20 },
          { x: 25, y: 60, z: 20 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#1d4ed8',
        highlightColor: '#38bdf8'
      },
      // Upright Top Face
      {
        id: 'top-upright',
        name: 'Upright Top Crest',
        category: 'TOP',
        vertices: [
          { x: 0, y: 20, z: 80 },
          { x: 25, y: 20, z: 80 },
          { x: 25, y: 60, z: 80 },
          { x: 0, y: 60, z: 80 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#2563eb',
        highlightColor: '#60a5fa'
      },
      // Right Side Face of Base
      {
        id: 'side-right-base',
        name: 'Base Right End Face',
        category: 'SIDE',
        vertices: [
          { x: 90, y: 0, z: 0 },
          { x: 90, y: 60, z: 0 },
          { x: 90, y: 60, z: 20 },
          { x: 90, y: 0, z: 20 }
        ],
        normal: { x: 1, y: 0, z: 0 },
        color: '#1e3a8a',
        highlightColor: '#38bdf8'
      },
      // Left End Profile (Full L-shape)
      {
        id: 'side-left-profile',
        name: 'Left End L-Profile',
        category: 'SIDE',
        vertices: [
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 0, z: 20 },
          { x: 0, y: 20, z: 20 },
          { x: 0, y: 20, z: 80 },
          { x: 0, y: 60, z: 80 },
          { x: 0, y: 60, z: 0 }
        ],
        normal: { x: -1, y: 0, z: 0 },
        color: '#172554',
        highlightColor: '#38bdf8'
      },
      // Back Face
      {
        id: 'back-face',
        name: 'Rear Vertical Plane',
        category: 'FRONT',
        vertices: [
          { x: 0, y: 60, z: 0 },
          { x: 0, y: 60, z: 80 },
          { x: 25, y: 60, z: 80 },
          { x: 25, y: 60, z: 20 },
          { x: 90, y: 60, z: 20 },
          { x: 90, y: 60, z: 0 }
        ],
        normal: { x: 0, y: 1, z: 0 },
        color: '#0f172a',
        highlightColor: '#0284c7'
      }
    ],
    edges: [
      // Visible Front Edges
      { p1: { x: 0, y: 0, z: 0 }, p2: { x: 90, y: 0, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 90, y: 0, z: 0 }, p2: { x: 90, y: 0, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 90, y: 0, z: 20 }, p2: { x: 25, y: 0, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 25, y: 0, z: 20 }, p2: { x: 25, y: 20, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 25, y: 20, z: 20 }, p2: { x: 25, y: 20, z: 80 }, type: 'VISIBLE' },
      { p1: { x: 25, y: 20, z: 80 }, p2: { x: 0, y: 20, z: 80 }, type: 'VISIBLE' },
      { p1: { x: 0, y: 20, z: 80 }, p2: { x: 0, y: 0, z: 80 }, type: 'VISIBLE' },
      { p1: { x: 0, y: 0, z: 80 }, p2: { x: 0, y: 0, z: 0 }, type: 'VISIBLE' },
      // Top Creases & Back
      { p1: { x: 25, y: 20, z: 80 }, p2: { x: 25, y: 60, z: 80 }, type: 'VISIBLE' },
      { p1: { x: 0, y: 20, z: 80 }, p2: { x: 0, y: 60, z: 80 }, type: 'VISIBLE' },
      { p1: { x: 0, y: 60, z: 80 }, p2: { x: 25, y: 60, z: 80 }, type: 'VISIBLE' },
      { p1: { x: 90, y: 0, z: 20 }, p2: { x: 90, y: 60, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 25, y: 60, z: 20 }, p2: { x: 90, y: 60, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 90, y: 60, z: 0 }, p2: { x: 90, y: 60, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 90, y: 0, z: 0 }, p2: { x: 90, y: 60, z: 0 }, type: 'VISIBLE' },
      // Cylindrical Hole Centerline & Hidden outlines in 3D
      { p1: { x: 58, y: 30, z: 0 }, p2: { x: 58, y: 30, z: 20 }, type: 'CENTERLINE' },
      { p1: { x: 46, y: 30, z: 0 }, p2: { x: 46, y: 30, z: 20 }, type: 'HIDDEN' },
      { p1: { x: 70, y: 30, z: 0 }, p2: { x: 70, y: 30, z: 20 }, type: 'HIDDEN' }
    ],
    ortho2D: {
      front: {
        outlines: [
          'M 20 120 L 110 120 L 110 100 L 45 100 L 45 40 L 20 40 Z'
        ],
        hiddenLines: [
          // Through-hole hidden edges in base: Ø24 centered at X=78 (58+20)
          { x1: 66, y1: 100, x2: 66, y2: 120 },
          { x1: 90, y1: 100, x2: 90, y2: 120 }
        ],
        centerlines: [
          // Hole centerline
          { x1: 78, y1: 95, x2: 78, y2: 125 }
        ],
        dimensions: [
          { x1: 20, y1: 120, x2: 110, y2: 120, text: '90', offset: 20 },
          { x1: 110, y1: 120, x2: 110, y2: 100, text: '20', offset: 15 },
          { x1: 20, y1: 120, x2: 20, y2: 40, text: '80', offset: -20 },
          { x1: 20, y1: 40, x2: 45, y2: 40, text: '25', offset: -15 }
        ],
        viewBox: '0 0 140 160',
        label: 'FRONT ELEVATION'
      },
      plan: {
        outlines: [
          'M 20 30 L 110 30 L 110 90 L 20 90 Z',
          'M 45 30 L 45 90' // Step dividing upright and base
        ],
        circles: [
          // Circular bore hole in base: Ø24, center (78, 60)
          { cx: 78, cy: 60, r: 12 }
        ],
        hiddenLines: [],
        centerlines: [
          { x1: 62, y1: 60, x2: 94, y2: 60 },
          { x1: 78, y1: 44, x2: 78, y2: 76 }
        ],
        dimensions: [
          { x1: 20, y1: 90, x2: 110, y2: 90, text: '90', offset: 20 },
          { x1: 110, y1: 30, x2: 110, y2: 90, text: '60', offset: 20 },
          { x1: 78, y1: 48, x2: 78, y2: 72, text: 'Ø24', offset: 18 }
        ],
        viewBox: '0 0 140 140',
        label: 'PLAN (TOP VIEW)'
      },
      end: {
        outlines: [
          // Left End Elevation: profile looking from left
          'M 20 120 L 80 120 L 80 40 L 40 40 L 40 100 L 20 100 Z'
        ],
        hiddenLines: [
          // Hole seen as hidden in End view: Ø24 at depth center 50
          { x1: 38, y1: 100, x2: 38, y2: 120 },
          { x1: 62, y1: 100, x2: 62, y2: 120 }
        ],
        centerlines: [
          { x1: 50, y1: 95, x2: 50, y2: 125 }
        ],
        dimensions: [
          { x1: 20, y1: 120, x2: 80, y2: 120, text: '60', offset: 20 },
          { x1: 80, y1: 120, x2: 80, y2: 40, text: '80', offset: 20 },
          { x1: 20, y1: 120, x2: 20, y2: 100, text: '20', offset: -15 }
        ],
        viewBox: '0 0 120 160',
        label: 'LEFT END ELEVATION'
      }
    }
  },

  VEE_BLOCK: {
    id: 'VEE_BLOCK',
    name: 'Slotted Precision Vee-Block',
    subtitle: 'Machinist Standard Workholding Fixture (ISO 5456-2)',
    description: 'Precision Vee-block with 90° symmetric V-groove, side clamping slots, and central relief hole. Illustrates sloped intersections and symmetrical centerline layout.',
    dimensions: { width: 100, height: 60, depth: 70 },
    faces: [
      // Front Profile Face
      {
        id: 'vee-front',
        name: 'Vee-Block Front Face',
        category: 'FRONT',
        vertices: [
          { x: 0, y: 0, z: 0 },
          { x: 100, y: 0, z: 0 },
          { x: 100, y: 0, z: 60 },
          { x: 75, y: 0, z: 60 },
          { x: 50, y: 0, z: 35 },
          { x: 25, y: 0, z: 60 },
          { x: 0, y: 0, z: 60 }
        ],
        normal: { x: 0, y: -1, z: 0 },
        color: '#1e40af',
        highlightColor: '#38bdf8'
      },
      // Left Top Flat
      {
        id: 'vee-top-left',
        name: 'Left Top Land',
        category: 'TOP',
        vertices: [
          { x: 0, y: 0, z: 60 },
          { x: 25, y: 0, z: 60 },
          { x: 25, y: 70, z: 60 },
          { x: 0, y: 70, z: 60 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#2563eb',
        highlightColor: '#60a5fa'
      },
      // Right Top Flat
      {
        id: 'vee-top-right',
        name: 'Right Top Land',
        category: 'TOP',
        vertices: [
          { x: 75, y: 0, z: 60 },
          { x: 100, y: 0, z: 60 },
          { x: 100, y: 70, z: 60 },
          { x: 75, y: 70, z: 60 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#2563eb',
        highlightColor: '#60a5fa'
      },
      // V-Groove Left Slope (45°)
      {
        id: 'vee-slope-left',
        name: 'V-Groove Left 45° Face',
        category: 'FEATURE',
        vertices: [
          { x: 25, y: 0, z: 60 },
          { x: 50, y: 0, z: 35 },
          { x: 50, y: 70, z: 35 },
          { x: 25, y: 70, z: 60 }
        ],
        normal: { x: 0.707, y: 0, z: 0.707 },
        color: '#1d4ed8',
        highlightColor: '#0ea5e9'
      },
      // V-Groove Right Slope (45°)
      {
        id: 'vee-slope-right',
        name: 'V-Groove Right 45° Face',
        category: 'FEATURE',
        vertices: [
          { x: 50, y: 0, z: 35 },
          { x: 75, y: 0, z: 60 },
          { x: 75, y: 70, z: 60 },
          { x: 50, y: 70, z: 35 }
        ],
        normal: { x: -0.707, y: 0, z: 0.707 },
        color: '#1e3a8a',
        highlightColor: '#38bdf8'
      },
      // Right End Face
      {
        id: 'vee-side-right',
        name: 'Vee-Block Right End',
        category: 'SIDE',
        vertices: [
          { x: 100, y: 0, z: 0 },
          { x: 100, y: 70, z: 0 },
          { x: 100, y: 70, z: 60 },
          { x: 100, y: 0, z: 60 }
        ],
        normal: { x: 1, y: 0, z: 0 },
        color: '#172554',
        highlightColor: '#38bdf8'
      }
    ],
    edges: [
      { p1: { x: 0, y: 0, z: 0 }, p2: { x: 100, y: 0, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 100, y: 0, z: 0 }, p2: { x: 100, y: 0, z: 60 }, type: 'VISIBLE' },
      { p1: { x: 100, y: 0, z: 60 }, p2: { x: 75, y: 0, z: 60 }, type: 'VISIBLE' },
      { p1: { x: 75, y: 0, z: 60 }, p2: { x: 50, y: 0, z: 35 }, type: 'VISIBLE' },
      { p1: { x: 50, y: 0, z: 35 }, p2: { x: 25, y: 0, z: 60 }, type: 'VISIBLE' },
      { p1: { x: 25, y: 0, z: 60 }, p2: { x: 0, y: 0, z: 60 }, type: 'VISIBLE' },
      { p1: { x: 0, y: 0, z: 60 }, p2: { x: 0, y: 0, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 50, y: 0, z: 35 }, p2: { x: 50, y: 70, z: 35 }, type: 'VISIBLE' },
      { p1: { x: 25, y: 0, z: 60 }, p2: { x: 25, y: 70, z: 60 }, type: 'VISIBLE' },
      { p1: { x: 75, y: 0, z: 60 }, p2: { x: 75, y: 70, z: 60 }, type: 'VISIBLE' },
      { p1: { x: 0, y: 0, z: 60 }, p2: { x: 0, y: 70, z: 60 }, type: 'VISIBLE' },
      { p1: { x: 100, y: 0, z: 60 }, p2: { x: 100, y: 70, z: 60 }, type: 'VISIBLE' },
      { p1: { x: 100, y: 0, z: 0 }, p2: { x: 100, y: 70, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 100, y: 70, z: 0 }, p2: { x: 100, y: 70, z: 60 }, type: 'VISIBLE' },
      // Symmetry Centerline
      { p1: { x: 50, y: 0, z: 0 }, p2: { x: 50, y: 70, z: 0 }, type: 'CENTERLINE' }
    ],
    ortho2D: {
      front: {
        outlines: [
          // Front: 100 wide x 60 high, with 90 deg V cut 25 deep in center
          'M 20 120 L 120 120 L 120 60 L 95 60 L 70 85 L 45 60 L 20 60 Z'
        ],
        hiddenLines: [
          // Side clamping slot hidden detail: 15mm from bottom, 12mm high
          { x1: 20, y1: 100, x2: 120, y2: 100 },
          { x1: 20, y1: 88, x2: 120, y2: 88 }
        ],
        centerlines: [
          { x1: 70, y1: 50, x2: 70, y2: 130 }
        ],
        dimensions: [
          { x1: 20, y1: 120, x2: 120, y2: 120, text: '100', offset: 20 },
          { x1: 120, y1: 120, x2: 120, y2: 60, text: '60', offset: 20 },
          { x1: 45, y1: 60, x2: 95, y2: 60, text: '50', offset: -15 },
          { x1: 70, y1: 60, x2: 70, y2: 85, text: '25 (90°)', offset: -25 }
        ],
        viewBox: '0 0 140 160',
        label: 'FRONT ELEVATION'
      },
      plan: {
        outlines: [
          'M 20 20 L 120 20 L 120 90 L 20 90 Z',
          'M 45 20 L 45 90',
          'M 70 20 L 70 90', // V bottom apex line
          'M 95 20 L 95 90'
        ],
        hiddenLines: [],
        centerlines: [
          { x1: 10, y1: 55, x2: 130, y2: 55 },
          { x1: 70, y1: 10, x2: 70, y2: 100 }
        ],
        dimensions: [
          { x1: 20, y1: 90, x2: 120, y2: 90, text: '100', offset: 20 },
          { x1: 120, y1: 20, x2: 120, y2: 90, text: '70', offset: 20 }
        ],
        viewBox: '0 0 140 130',
        label: 'PLAN (TOP VIEW)'
      },
      end: {
        outlines: [
          // End view: 70 wide x 60 high, with side slots visible
          'M 20 120 L 90 120 L 90 100 L 75 100 L 75 88 L 90 88 L 90 60 L 20 60 L 20 88 L 35 88 L 35 100 L 20 100 Z'
        ],
        hiddenLines: [
          // Bottom of V groove seen as hidden line across width
          { x1: 20, y1: 85, x2: 90, y2: 85 }
        ],
        centerlines: [
          { x1: 55, y1: 50, x2: 55, y2: 130 }
        ],
        dimensions: [
          { x1: 20, y1: 120, x2: 90, y2: 120, text: '70', offset: 20 },
          { x1: 90, y1: 120, x2: 90, y2: 60, text: '60', offset: 20 }
        ],
        viewBox: '0 0 120 160',
        label: 'END ELEVATION'
      }
    }
  },

  BEARING_HOUSING: {
    id: 'BEARING_HOUSING',
    name: 'Plummer Block Journal Housing',
    subtitle: 'WAEC Section B Machine Drawing Specification',
    description: 'Split bearing base with horizontal mounting flange, semicircular cap arch, Ø36mm shaft journal, and two Ø14mm bolt slots. Demonstrates complex concentric radial and hidden features.',
    dimensions: { width: 110, height: 75, depth: 50 },
    faces: [
      // Base Front Flange
      {
        id: 'bh-front-base',
        name: 'Mounting Base Front Face',
        category: 'FRONT',
        vertices: [
          { x: 0, y: 0, z: 0 },
          { x: 110, y: 0, z: 0 },
          { x: 110, y: 0, z: 20 },
          { x: 0, y: 0, z: 20 }
        ],
        normal: { x: 0, y: -1, z: 0 },
        color: '#1e40af',
        highlightColor: '#38bdf8'
      },
      // Central Upright Arch Face
      {
        id: 'bh-front-arch',
        name: 'Bearing Arch Front Face',
        category: 'FRONT',
        vertices: [
          { x: 25, y: 0, z: 20 },
          { x: 85, y: 0, z: 20 },
          { x: 85, y: 0, z: 65 },
          { x: 55, y: 0, z: 75 },
          { x: 25, y: 0, z: 65 }
        ],
        normal: { x: 0, y: -1, z: 0 },
        color: '#1d4ed8',
        highlightColor: '#60a5fa'
      },
      // Left Base Flange Top
      {
        id: 'bh-top-flange-left',
        name: 'Left Flange Top Face',
        category: 'TOP',
        vertices: [
          { x: 0, y: 0, z: 20 },
          { x: 25, y: 0, z: 20 },
          { x: 25, y: 50, z: 20 },
          { x: 0, y: 50, z: 20 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#2563eb',
        highlightColor: '#93c5fd'
      },
      // Right Base Flange Top
      {
        id: 'bh-top-flange-right',
        name: 'Right Flange Top Face',
        category: 'TOP',
        vertices: [
          { x: 85, y: 0, z: 20 },
          { x: 110, y: 0, z: 20 },
          { x: 110, y: 50, z: 20 },
          { x: 85, y: 50, z: 20 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#2563eb',
        highlightColor: '#93c5fd'
      },
      // Arch Cap Top Apex
      {
        id: 'bh-arch-top',
        name: 'Bearing Arch Crest',
        category: 'TOP',
        vertices: [
          { x: 25, y: 0, z: 65 },
          { x: 55, y: 0, z: 75 },
          { x: 85, y: 0, z: 65 },
          { x: 85, y: 50, z: 65 },
          { x: 55, y: 50, z: 75 },
          { x: 25, y: 50, z: 65 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#3b82f6',
        highlightColor: '#60a5fa'
      },
      // Right End Flange
      {
        id: 'bh-end-right',
        name: 'Right Flange End Face',
        category: 'SIDE',
        vertices: [
          { x: 110, y: 0, z: 0 },
          { x: 110, y: 50, z: 0 },
          { x: 110, y: 50, z: 20 },
          { x: 110, y: 0, z: 20 }
        ],
        normal: { x: 1, y: 0, z: 0 },
        color: '#172554',
        highlightColor: '#38bdf8'
      }
    ],
    edges: [
      { p1: { x: 0, y: 0, z: 0 }, p2: { x: 110, y: 0, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 110, y: 0, z: 0 }, p2: { x: 110, y: 0, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 110, y: 0, z: 20 }, p2: { x: 0, y: 0, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 0, y: 0, z: 20 }, p2: { x: 0, y: 0, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 25, y: 0, z: 20 }, p2: { x: 25, y: 0, z: 65 }, type: 'VISIBLE' },
      { p1: { x: 85, y: 0, z: 20 }, p2: { x: 85, y: 0, z: 65 }, type: 'VISIBLE' },
      { p1: { x: 25, y: 0, z: 65 }, p2: { x: 55, y: 0, z: 75 }, type: 'VISIBLE' },
      { p1: { x: 55, y: 0, z: 75 }, p2: { x: 85, y: 0, z: 65 }, type: 'VISIBLE' },
      // Flange depths
      { p1: { x: 110, y: 0, z: 20 }, p2: { x: 110, y: 50, z: 20 }, type: 'VISIBLE' },
      { p1: { x: 110, y: 0, z: 0 }, p2: { x: 110, y: 50, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 110, y: 50, z: 0 }, p2: { x: 110, y: 50, z: 20 }, type: 'VISIBLE' },
      // Shaft Bore Centerline in 3D
      { p1: { x: 55, y: -5, z: 45 }, p2: { x: 55, y: 55, z: 45 }, type: 'CENTERLINE' }
    ],
    ortho2D: {
      front: {
        outlines: [
          // Base flange 110 x 20 + upper semicircular journal
          'M 15 120 L 125 120 L 125 100 L 100 100 C 100 70 85 50 70 50 C 55 50 40 70 40 100 L 15 100 Z'
        ],
        circles: [
          // Central shaft bore: Ø36 -> r=18, center (70, 85)
          { cx: 70, cy: 85, r: 18 }
        ],
        hiddenLines: [
          // 2 bolt holes in base
          { x1: 28, y1: 100, x2: 28, y2: 120 },
          { x1: 42, y1: 100, x2: 42, y2: 120 },
          { x1: 98, y1: 100, x2: 98, y2: 120 },
          { x1: 112, y1: 100, x2: 112, y2: 120 }
        ],
        centerlines: [
          { x1: 70, y1: 40, x2: 70, y2: 130 },
          { x1: 45, y1: 85, x2: 95, y2: 85 },
          { x1: 35, y1: 95, x2: 35, y2: 125 },
          { x1: 105, y1: 95, x2: 105, y2: 125 }
        ],
        dimensions: [
          { x1: 15, y1: 120, x2: 125, y2: 120, text: '110', offset: 20 },
          { x1: 125, y1: 120, x2: 125, y2: 100, text: '20', offset: 15 },
          { x1: 70, y1: 85, x2: 70, y2: 50, text: 'R30', offset: -25 }
        ],
        viewBox: '0 0 140 160',
        label: 'FRONT ELEVATION'
      },
      plan: {
        outlines: [
          'M 15 30 L 125 30 L 125 80 L 15 80 Z',
          'M 40 30 L 40 80',
          'M 100 30 L 100 80'
        ],
        circles: [
          // Bolt holes in flange
          { cx: 35, cy: 55, r: 7 },
          { cx: 105, cy: 55, r: 7 }
        ],
        hiddenLines: [
          // Shaft bore running through depth 50: Ø36
          { x1: 40, y1: 37, x2: 100, y2: 37 },
          { x1: 40, y1: 73, x2: 100, y2: 73 }
        ],
        centerlines: [
          { x1: 10, y1: 55, x2: 130, y2: 55 },
          { x1: 35, y1: 20, x2: 35, y2: 90 },
          { x1: 70, y1: 20, x2: 70, y2: 90 },
          { x1: 105, y1: 20, x2: 105, y2: 90 }
        ],
        dimensions: [
          { x1: 15, y1: 80, x2: 125, y2: 80, text: '110', offset: 20 },
          { x1: 125, y1: 30, x2: 125, y2: 80, text: '50', offset: 20 },
          { x1: 35, y1: 80, x2: 105, y2: 80, text: '70 PCD', offset: 35 }
        ],
        viewBox: '0 0 140 130',
        label: 'PLAN (TOP VIEW)'
      },
      end: {
        outlines: [
          'M 20 120 L 70 120 L 70 50 L 20 50 Z'
        ],
        hiddenLines: [
          // Shaft bore through
          { x1: 20, y1: 67, x2: 70, y2: 67 },
          { x1: 20, y1: 103, x2: 70, y2: 103 }
        ],
        centerlines: [
          { x1: 45, y1: 40, x2: 45, y2: 130 },
          { x1: 10, y1: 85, x2: 80, y2: 85 }
        ],
        dimensions: [
          { x1: 20, y1: 120, x2: 70, y2: 120, text: '50', offset: 20 },
          { x1: 70, y1: 120, x2: 70, y2: 50, text: '75', offset: 20 }
        ],
        viewBox: '0 0 100 160',
        label: 'END ELEVATION'
      }
    }
  },

  DOVETAIL_GUIDE: {
    id: 'DOVETAIL_GUIDE',
    name: 'Machine Slide Dovetail Way',
    subtitle: 'Lathe Cross-Slide & Milling Table Guide (ISO 5456)',
    description: 'Precision trapezoidal dovetail slide with 60° angle, keeper gib clearance, and tapped oil lubrication hole. Teaches angled hidden lines and true orthographic foreshortening.',
    dimensions: { width: 95, height: 50, depth: 75 },
    faces: [
      // Front Face with Dovetail Profile
      {
        id: 'dt-front',
        name: 'Dovetail Slide Front Face',
        category: 'FRONT',
        vertices: [
          { x: 0, y: 0, z: 0 },
          { x: 95, y: 0, z: 0 },
          { x: 95, y: 0, z: 50 },
          { x: 65, y: 0, z: 50 },
          { x: 55, y: 0, z: 30 },
          { x: 40, y: 0, z: 30 },
          { x: 30, y: 0, z: 50 },
          { x: 0, y: 0, z: 50 }
        ],
        normal: { x: 0, y: -1, z: 0 },
        color: '#1e40af',
        highlightColor: '#38bdf8'
      },
      // Top Crest Left
      {
        id: 'dt-top-left',
        name: 'Left Guide Way Top',
        category: 'TOP',
        vertices: [
          { x: 0, y: 0, z: 50 },
          { x: 30, y: 0, z: 50 },
          { x: 30, y: 75, z: 50 },
          { x: 0, y: 75, z: 50 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#2563eb',
        highlightColor: '#60a5fa'
      },
      // Top Crest Right
      {
        id: 'dt-top-right',
        name: 'Right Guide Way Top',
        category: 'TOP',
        vertices: [
          { x: 65, y: 0, z: 50 },
          { x: 95, y: 0, z: 50 },
          { x: 95, y: 75, z: 50 },
          { x: 65, y: 75, z: 50 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#2563eb',
        highlightColor: '#60a5fa'
      },
      // Dovetail Slot Floor
      {
        id: 'dt-floor',
        name: 'Dovetail Recess Floor',
        category: 'FEATURE',
        vertices: [
          { x: 40, y: 0, z: 30 },
          { x: 55, y: 0, z: 30 },
          { x: 55, y: 75, z: 30 },
          { x: 40, y: 75, z: 30 }
        ],
        normal: { x: 0, y: 0, z: 1 },
        color: '#1d4ed8',
        highlightColor: '#38bdf8'
      },
      // Right End Profile
      {
        id: 'dt-side-right',
        name: 'Right Slide End Face',
        category: 'SIDE',
        vertices: [
          { x: 95, y: 0, z: 0 },
          { x: 95, y: 75, z: 0 },
          { x: 95, y: 75, z: 50 },
          { x: 95, y: 0, z: 50 }
        ],
        normal: { x: 1, y: 0, z: 0 },
        color: '#172554',
        highlightColor: '#38bdf8'
      }
    ],
    edges: [
      { p1: { x: 0, y: 0, z: 0 }, p2: { x: 95, y: 0, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 95, y: 0, z: 0 }, p2: { x: 95, y: 0, z: 50 }, type: 'VISIBLE' },
      { p1: { x: 95, y: 0, z: 50 }, p2: { x: 65, y: 0, z: 50 }, type: 'VISIBLE' },
      { p1: { x: 65, y: 0, z: 50 }, p2: { x: 55, y: 0, z: 30 }, type: 'VISIBLE' },
      { p1: { x: 55, y: 0, z: 30 }, p2: { x: 40, y: 0, z: 30 }, type: 'VISIBLE' },
      { p1: { x: 40, y: 0, z: 30 }, p2: { x: 30, y: 0, z: 50 }, type: 'VISIBLE' },
      { p1: { x: 30, y: 0, z: 50 }, p2: { x: 0, y: 0, z: 50 }, type: 'VISIBLE' },
      { p1: { x: 0, y: 0, z: 50 }, p2: { x: 0, y: 0, z: 0 }, type: 'VISIBLE' },
      // Longitudinal Dovetail Slot Edges
      { p1: { x: 65, y: 0, z: 50 }, p2: { x: 65, y: 75, z: 50 }, type: 'VISIBLE' },
      { p1: { x: 55, y: 0, z: 30 }, p2: { x: 55, y: 75, z: 30 }, type: 'VISIBLE' },
      { p1: { x: 40, y: 0, z: 30 }, p2: { x: 40, y: 75, z: 30 }, type: 'VISIBLE' },
      { p1: { x: 30, y: 0, z: 50 }, p2: { x: 30, y: 75, z: 50 }, type: 'VISIBLE' },
      { p1: { x: 95, y: 0, z: 50 }, p2: { x: 95, y: 75, z: 50 }, type: 'VISIBLE' },
      { p1: { x: 95, y: 0, z: 0 }, p2: { x: 95, y: 75, z: 0 }, type: 'VISIBLE' },
      { p1: { x: 95, y: 75, z: 0 }, p2: { x: 95, y: 75, z: 50 }, type: 'VISIBLE' },
      // Centerline
      { p1: { x: 47.5, y: 0, z: 0 }, p2: { x: 47.5, y: 75, z: 0 }, type: 'CENTERLINE' }
    ],
    ortho2D: {
      front: {
        outlines: [
          // Dovetail female slot in bottom or top: 95 wide x 50 high, dovetail slot 50 wide at bottom, 35 wide at top, depth 20
          'M 20 120 L 115 120 L 115 70 L 85 70 L 75 90 L 60 90 L 50 70 L 20 70 Z'
        ],
        hiddenLines: [],
        centerlines: [
          { x1: 67.5, y1: 60, x2: 67.5, y2: 130 }
        ],
        dimensions: [
          { x1: 20, y1: 120, x2: 115, y2: 120, text: '95', offset: 20 },
          { x1: 115, y1: 120, x2: 115, y2: 70, text: '50', offset: 20 },
          { x1: 50, y1: 70, x2: 85, y2: 70, text: '35 (60°)', offset: -15 }
        ],
        viewBox: '0 0 140 160',
        label: 'FRONT ELEVATION'
      },
      plan: {
        outlines: [
          'M 20 20 L 115 20 L 115 95 L 20 95 Z'
        ],
        hiddenLines: [
          // Dovetail internal undercut edges run straight through
          { x1: 50, y1: 20, x2: 50, y2: 95 },
          { x1: 60, y1: 20, x2: 60, y2: 95 },
          { x1: 75, y1: 20, x2: 75, y2: 95 },
          { x1: 85, y1: 20, x2: 85, y2: 95 }
        ],
        centerlines: [
          { x1: 67.5, y1: 10, x2: 67.5, y2: 105 }
        ],
        dimensions: [
          { x1: 20, y1: 95, x2: 115, y2: 95, text: '95', offset: 20 },
          { x1: 115, y1: 20, x2: 115, y2: 95, text: '75', offset: 20 }
        ],
        viewBox: '0 0 140 130',
        label: 'PLAN (TOP VIEW)'
      },
      end: {
        outlines: [
          'M 20 120 L 95 120 L 95 70 L 20 70 Z'
        ],
        hiddenLines: [
          // Slot depth line
          { x1: 20, y1: 90, x2: 95, y2: 90 }
        ],
        centerlines: [
          { x1: 57.5, y1: 60, x2: 57.5, y2: 130 }
        ],
        dimensions: [
          { x1: 20, y1: 120, x2: 95, y2: 120, text: '75', offset: 20 },
          { x1: 95, y1: 120, x2: 95, y2: 70, text: '50', offset: 20 }
        ],
        viewBox: '0 0 120 160',
        label: 'END ELEVATION'
      }
    }
  }
};

export const OrthographicViewport: React.FC<OrthographicViewportProps> = ({
  initialAngle = 'FIRST_ANGLE',
  initialPart = 'L_BRACKET',
  isOpen = true,
  onClose,
  viewMode = 'EMBEDDED',
  className = ''
}) => {
  // 1. STATE MANAGEMENT
  const [projectionAngle, setProjectionAngle] = useState<ProjectionAngle>(initialAngle);
  const [activePartId, setActivePartId] = useState<PartModelId>(initialPart);
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);
  const [selectedFace, setSelectedFace] = useState<string | null>(null);

  // 3D Camera & Orbit Controls
  const [yaw, setYaw] = useState<number>(35); // Azimuth in degrees
  const [pitch, setPitch] = useState<number>(30); // Elevation in degrees
  const [zoom, setZoom] = useState<number>(1.1);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Display Layers & ISO 128 Filter Flags
  const [showHiddenLines, setShowHiddenLines] = useState<boolean>(true);
  const [showCenterlines, setShowCenterlines] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showMitreRays, setShowMitreRays] = useState<boolean>(true);
  const [showGlassBox, setShowGlassBox] = useState<boolean>(false);
  const [unfoldAngle, setUnfoldAngle] = useState<number>(0); // 0 (folded 3D box) to 90 (flat 2D sheet)
  const [activeTheme, setActiveTheme] = useState<'CAD_DARK' | 'BLUEPRINT' | 'PAPER'>('CAD_DARK');

  const activePart = PART_MODELS[activePartId] || PART_MODELS.L_BRACKET;

  // Auto-Spin 3D Model Loop
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setYaw(prev => (prev + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  // Mouse drag handlers for 3D Orbiting
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setYaw(prev => (prev + dx * 0.7) % 360);
    setPitch(prev => Math.max(5, Math.min(85, prev - dy * 0.5)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Camera presets
  const setCameraPreset = (presetYaw: number, presetPitch: number) => {
    setYaw(presetYaw);
    setPitch(presetPitch);
  };

  // 3D Mathematical Projection Math
  // Projects (x, y, z) into 2D SVG canvas (cx, cy)
  const project3DTo2D = (p: Point3D, cx: number, cy: number, scale: number = 2.2) => {
    // Center the part around origin
    const ox = p.x - activePart.dimensions.width / 2;
    const oy = p.y - activePart.dimensions.depth / 2;
    const oz = p.z - activePart.dimensions.height / 2;

    const radYaw = (yaw * Math.PI) / 180;
    const radPitch = (pitch * Math.PI) / 180;

    // Yaw rotation around Z axis
    const x1 = ox * Math.cos(radYaw) - oy * Math.sin(radYaw);
    const y1 = ox * Math.sin(radYaw) + oy * Math.cos(radYaw);
    const z1 = oz;

    // Pitch rotation around horizontal X axis
    const x2 = x1;
    const y2 = y1 * Math.cos(radPitch) - z1 * Math.sin(radPitch);
    const z2 = y1 * Math.sin(radPitch) + z1 * Math.cos(radPitch);

    // Screen projection
    const screenX = cx + x2 * scale * zoom;
    const screenY = cy - z2 * scale * zoom;

    return { x: screenX, y: screenY, depth: y2 };
  };

  // Theme Styles
  const themeClasses = useMemo(() => {
    switch (activeTheme) {
      case 'BLUEPRINT':
        return {
          container: 'bg-[#0f284c] text-sky-100',
          panel: 'bg-[#153460] border-sky-600/40',
          canvasBg: '#091c36',
          gridStroke: 'rgba(56, 189, 248, 0.12)',
          thickLine: '#e0f2fe',
          dashedLine: '#38bdf8',
          chainLine: '#f43f5e',
          thinLine: '#7dd3fc',
          textColor: '#bae6fd'
        };
      case 'PAPER':
        return {
          container: 'bg-[#f8fafc] text-slate-900',
          panel: 'bg-white border-slate-300 shadow-sm',
          canvasBg: '#f1f5f9',
          gridStroke: 'rgba(148, 163, 184, 0.25)',
          thickLine: '#0f172a',
          dashedLine: '#475569',
          chainLine: '#e11d48',
          thinLine: '#64748b',
          textColor: '#0f172a'
        };
      case 'CAD_DARK':
      default:
        return {
          container: 'bg-slate-950 text-slate-100',
          panel: 'bg-slate-900 border-slate-800',
          canvasBg: '#020617',
          gridStroke: 'rgba(51, 65, 85, 0.3)',
          thickLine: '#ffffff',
          dashedLine: '#38bdf8',
          chainLine: '#f43f5e',
          thinLine: '#64748b',
          textColor: '#cbd5e1'
        };
    }
  }, [activeTheme]);

  // ISO 5456 Truncated Cone Projection Symbol SVG
  const renderIsoProjectionSymbol = () => {
    const isFirstAngle = projectionAngle === 'FIRST_ANGLE';
    return (
      <div 
        className="flex items-center gap-3 p-2.5 rounded-lg border bg-slate-950/80 border-cyan-500/30 shadow-inner"
        title={isFirstAngle ? 'ISO 5456-2 / NERDC First-Angle Symbol' : 'ANSI / ISO 5456-3 Third-Angle Symbol'}
      >
        <svg viewBox="0 0 120 48" className="w-28 h-11 shrink-0">
          {/* ISO 128 Centerline (Thin Chain Line) */}
          <line
            x1="4"
            y1="24"
            x2="116"
            y2="24"
            stroke="#f43f5e"
            strokeWidth="1.2"
            strokeDasharray="12 3 2 3"
          />

          {isFirstAngle ? (
            // FIRST ANGLE SYMBOL: Frustum Left -> Concentric Circles Right
            <g>
              {/* Frustum (Truncated Cone Side Elevation) */}
              <polygon
                points="16,33 46,38 46,10 16,15"
                fill="none"
                stroke={themeClasses.thickLine}
                strokeWidth="1.8"
              />
              <line x1="16" y1="15" x2="16" y2="33" stroke={themeClasses.thickLine} strokeWidth="1.8" />
              <line x1="46" y1="10" x2="46" y2="38" stroke={themeClasses.thickLine} strokeWidth="1.8" />

              {/* Concentric Circles (End View) on Right */}
              <circle cx="84" cy="24" r="14" fill="none" stroke={themeClasses.thickLine} strokeWidth="1.8" />
              <circle cx="84" cy="24" r="9" fill="none" stroke={themeClasses.thickLine} strokeWidth="1.8" />
              {/* Vertical Cross Centerline */}
              <line x1="84" y1="6" x2="84" y2="42" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="12 3 2 3" />
            </g>
          ) : (
            // THIRD ANGLE SYMBOL: Concentric Circles Left -> Frustum Right
            <g>
              {/* Concentric Circles on Left */}
              <circle cx="36" cy="24" r="14" fill="none" stroke={themeClasses.thickLine} strokeWidth="1.8" />
              <circle cx="36" cy="24" r="9" fill="none" stroke={themeClasses.thickLine} strokeWidth="1.8" />
              {/* Vertical Cross Centerline */}
              <line x1="36" y1="6" x2="36" y2="42" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="12 3 2 3" />

              {/* Frustum (Truncated Cone Side Elevation) on Right */}
              <polygon
                points="74,38 104,33 104,15 74,10"
                fill="none"
                stroke={themeClasses.thickLine}
                strokeWidth="1.8"
              />
              <line x1="74" y1="10" x2="74" y2="38" stroke={themeClasses.thickLine} strokeWidth="1.8" />
              <line x1="104" y1="15" x2="104" y2="33" stroke={themeClasses.thickLine} strokeWidth="1.8" />
            </g>
          )}
        </svg>

        <div className="text-[10px] font-mono leading-tight">
          <span className="block font-bold text-cyan-400">
            {isFirstAngle ? 'FIRST ANGLE (ISO 5456-2)' : 'THIRD ANGLE (ANSI)'}
          </span>
          <span className="text-slate-400">
            {isFirstAngle ? 'NERDC / WAEC Standard' : 'North American Standard'}
          </span>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      id="orthographic-viewport-container" 
      className={`flex flex-col w-full h-full rounded-2xl overflow-hidden border ${themeClasses.container} ${className}`}
    >
      {/* TOP WORKBENCH HEADER & CONTROLS */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Title & Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">
                ISO 5456 Orthographic Projection Viewport
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SS2 Term 2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              3D Isometric ⇄ Multi-View Orthographic Layout Dynamic Engine
            </p>
          </div>
        </div>

        {/* PRIMARY PROJECTION ANGLE TOGGLE (First vs Third Angle) */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
          <button
            id="toggle-first-angle-btn"
            onClick={() => setProjectionAngle('FIRST_ANGLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              projectionAngle === 'FIRST_ANGLE'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>First-Angle (ISO 5456-2 / NERDC)</span>
          </button>

          <button
            id="toggle-third-angle-btn"
            onClick={() => setProjectionAngle('THIRD_ANGLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              projectionAngle === 'THIRD_ANGLE'
                ? 'bg-purple-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Third-Angle (ANSI)</span>
          </button>
        </div>

        {/* Part Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-mono hidden sm:inline">Model:</label>
          <select
            id="select-ortho-part"
            value={activePartId}
            onChange={(e) => setActivePartId(e.target.value as PartModelId)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-500"
          >
            {Object.values(PART_MODELS).map(part => (
              <option key={part.id} value={part.id}>
                {part.name}
              </option>
            ))}
          </select>

          {/* Theme switcher */}
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
            <button
              onClick={() => setActiveTheme('CAD_DARK')}
              className={`px-2 py-1 text-[10px] font-mono rounded ${activeTheme === 'CAD_DARK' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400'}`}
              title="CAD Dark Theme"
            >
              CAD
            </button>
            <button
              onClick={() => setActiveTheme('BLUEPRINT')}
              className={`px-2 py-1 text-[10px] font-mono rounded ${activeTheme === 'BLUEPRINT' ? 'bg-sky-900 text-sky-200 font-bold' : 'text-slate-400'}`}
              title="Cyan Blueprint Theme"
            >
              Blueprint
            </button>
            <button
              onClick={() => setActiveTheme('PAPER')}
              className={`px-2 py-1 text-[10px] font-mono rounded ${activeTheme === 'PAPER' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-400'}`}
              title="Light Drafting Paper"
            >
              Paper
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Close Viewport"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SUB-HEADER: PROJECTION RULE BANNER */}
      <div className={`px-4 py-2 text-xs font-mono flex items-center justify-between border-b ${
        projectionAngle === 'FIRST_ANGLE'
          ? 'bg-cyan-950/40 text-cyan-200 border-cyan-800/40'
          : 'bg-purple-950/40 text-purple-200 border-purple-800/40'
      }`}>
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
          <span>
            {projectionAngle === 'FIRST_ANGLE' ? (
              <strong>Rule 1 (First-Angle): Object lies between Observer and Plane. Plan is placed BELOW Front Elevation. Left view on RIGHT.</strong>
            ) : (
              <strong>Rule 2 (Third-Angle): Plane lies between Observer and Object. Plan is placed ABOVE Front Elevation. Right view on RIGHT.</strong>
            )}
          </span>
        </div>

        {/* Dynamic Glass Box Unfold Angle Slider */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Glass Box Fold:</span>
          <input
            type="range"
            min={0}
            max={90}
            value={unfoldAngle}
            onChange={(e) => setUnfoldAngle(Number(e.target.value))}
            className="w-20 accent-cyan-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
            title="Unfold projection planes (0° 3D box to 90° flat 2D sheet)"
          />
          <span className="text-[10px] font-bold text-cyan-300 w-8">{unfoldAngle}°</span>
        </div>
      </div>

      {/* MAIN SPLIT VIEWPORT CONTENT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* =====================================================================
            LEFT SIDE (5 COLS): INTERACTIVE 3D ISOMETRIC REPRESENTATION
           ===================================================================== */}
        <div className="lg:col-span-5 border-r border-slate-800 flex flex-col bg-slate-950/60 relative overflow-hidden">
          {/* 3D Viewport Header */}
          <div className="p-3 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                3D Isometric Specimen
              </span>
            </div>
            
            {/* Camera View Presets */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCameraPreset(35, 30)}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Isometric (35°/30°)"
              >
                ISO
              </button>
              <button
                onClick={() => setCameraPreset(0, 5)}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Front View"
              >
                Front
              </button>
              <button
                onClick={() => setCameraPreset(0, 85)}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Plan View"
              >
                Plan
              </button>
              <button
                onClick={() => setCameraPreset(-90, 5)}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Left End"
              >
                Left
              </button>
              <button
                onClick={() => setIsAutoSpinning(prev => !prev)}
                className={`p-1 rounded ${isAutoSpinning ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                title={isAutoSpinning ? 'Pause Auto-Spin' : 'Auto-Spin 3D Specimen'}
              >
                {isAutoSpinning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* 3D Canvas Viewport with Drag-to-Orbit */}
          <div 
            className="flex-1 relative cursor-grab active:cursor-grabbing select-none flex items-center justify-center overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background Isometric Technical Grid */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, ${themeClasses.dashedLine} 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />

            {/* 3D SVG Geometry Canvas */}
            <svg
              viewBox="0 0 400 380"
              className="w-full h-full max-h-[460px] pointer-events-auto"
            >
              {/* Coordinate Reference Axes (X, Y, Z in mm) */}
              <g opacity="0.6">
                {/* Center of part in screen space */}
                {(() => {
                  const o = project3DTo2D({ x: 0, y: 0, z: 0 }, 200, 200);
                  const xA = project3DTo2D({ x: 50, y: 0, z: 0 }, 200, 200);
                  const yA = project3DTo2D({ x: 0, y: 50, z: 0 }, 200, 200);
                  const zA = project3DTo2D({ x: 0, y: 0, z: 50 }, 200, 200);
                  return (
                    <g>
                      {/* X axis (Red) */}
                      <line x1={o.x} y1={o.y} x2={xA.x} y2={xA.y} stroke="#ef4444" strokeWidth="1.5" />
                      <text x={xA.x + 5} y={xA.y} fill="#ef4444" fontSize="10" fontFamily="monospace">X (W)</text>
                      {/* Y axis (Green - Depth) */}
                      <line x1={o.x} y1={o.y} x2={yA.x} y2={yA.y} stroke="#22c55e" strokeWidth="1.5" />
                      <text x={yA.x + 5} y={yA.y} fill="#22c55e" fontSize="10" fontFamily="monospace">Y (D)</text>
                      {/* Z axis (Blue - Height) */}
                      <line x1={o.x} y1={o.y} x2={zA.x} y2={zA.y} stroke="#3b82f6" strokeWidth="1.5" />
                      <text x={zA.x} y={zA.y - 5} fill="#3b82f6" fontSize="10" fontFamily="monospace">Z (H)</text>
                    </g>
                  );
                })()}
              </g>

              {/* 3D Part Faces (Sorted by depth) */}
              {activePart.faces.length > 0 ? (
                activePart.faces
                  .map(face => {
                    const projected = face.vertices.map(v => project3DTo2D(v, 200, 200));
                    const avgDepth = projected.reduce((acc, p) => acc + p.depth, 0) / projected.length;
                    const pathD = `M ${projected.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')} Z`;
                    const isHovered = hoveredFace === face.id || selectedFace === face.id;

                    return {
                      face,
                      avgDepth,
                      pathD,
                      isHovered
                    };
                  })
                  .sort((a, b) => b.avgDepth - a.avgDepth)
                  .map(({ face, pathD, isHovered }) => (
                    <path
                      key={face.id}
                      d={pathD}
                      fill={isHovered ? face.highlightColor : face.color}
                      fillOpacity={isHovered ? 0.85 : 0.65}
                      stroke={themeClasses.thickLine}
                      strokeWidth={isHovered ? '2.5' : '1.8'}
                      strokeLinejoin="round"
                      className="transition-colors duration-150 cursor-pointer"
                      onMouseEnter={() => setHoveredFace(face.id)}
                      onMouseLeave={() => setHoveredFace(null)}
                      onClick={() => setSelectedFace(face.id === selectedFace ? null : face.id)}
                    >
                      <title>{face.name} ({face.category})</title>
                    </path>
                  ))
              ) : (
                // Procedural Isometric wireframe block for fallback
                <g>
                  {(() => {
                    const w = activePart.dimensions.width;
                    const d = activePart.dimensions.depth;
                    const h = activePart.dimensions.height;
                    const p000 = project3DTo2D({ x: 0, y: 0, z: 0 }, 200, 200);
                    const p100 = project3DTo2D({ x: w, y: 0, z: 0 }, 200, 200);
                    const p110 = project3DTo2D({ x: w, y: d, z: 0 }, 200, 200);
                    const p010 = project3DTo2D({ x: 0, y: d, z: 0 }, 200, 200);
                    const p001 = project3DTo2D({ x: 0, y: 0, z: h }, 200, 200);
                    const p101 = project3DTo2D({ x: w, y: 0, z: h }, 200, 200);
                    const p111 = project3DTo2D({ x: w, y: d, z: h }, 200, 200);
                    const p011 = project3DTo2D({ x: 0, y: d, z: h }, 200, 200);

                    return (
                      <g>
                        {/* Top Face */}
                        <polygon
                          points={`${p001.x},${p001.y} ${p101.x},${p101.y} ${p111.x},${p111.y} ${p011.x},${p011.y}`}
                          fill="#1e3a8a"
                          fillOpacity="0.5"
                          stroke={themeClasses.thickLine}
                          strokeWidth="2"
                        />
                        {/* Front Face */}
                        <polygon
                          points={`${p000.x},${p000.y} ${p100.x},${p100.y} ${p101.x},${p101.y} ${p001.x},${p001.y}`}
                          fill="#172554"
                          fillOpacity="0.6"
                          stroke={themeClasses.thickLine}
                          strokeWidth="2"
                        />
                        {/* Side Face */}
                        <polygon
                          points={`${p100.x},${p100.y} ${p110.x},${p110.y} ${p111.x},${p111.y} ${p101.x},${p101.y}`}
                          fill="#0f172a"
                          fillOpacity="0.7"
                          stroke={themeClasses.thickLine}
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })()}
                </g>
              )}

              {/* 3D Hidden & Centerline Overlays */}
              {showHiddenLines && activePart.edges.map((edge, idx) => {
                if (edge.type === 'HIDDEN') {
                  const p1 = project3DTo2D(edge.p1, 200, 200);
                  const p2 = project3DTo2D(edge.p2, 200, 200);
                  return (
                    <line
                      key={`edge-hid-${idx}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={themeClasses.dashedLine}
                      strokeWidth="1.3"
                      strokeDasharray="5 3"
                    />
                  );
                }
                return null;
              })}

              {/* Centerlines in 3D */}
              {showCenterlines && activePart.edges.map((edge, idx) => {
                if (edge.type === 'CENTERLINE') {
                  const p1 = project3DTo2D(edge.p1, 200, 200);
                  const p2 = project3DTo2D(edge.p2, 200, 200);
                  return (
                    <line
                      key={`edge-cen-${idx}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={themeClasses.chainLine}
                      strokeWidth="1.2"
                      strokeDasharray="12 3 2 3"
                    />
                  );
                }
                return null;
              })}

              {/* 3D Viewing Direction Arrows */}
              <g opacity="0.85">
                {/* Front Viewing Direction Vector */}
                {(() => {
                  const tip = project3DTo2D({ x: activePart.dimensions.width / 2, y: -20, z: activePart.dimensions.height / 2 }, 200, 200);
                  const tail = project3DTo2D({ x: activePart.dimensions.width / 2, y: -65, z: activePart.dimensions.height / 2 }, 200, 200);
                  return (
                    <g>
                      <line x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} stroke="#0ea5e9" strokeWidth="2.5" markerEnd="url(#arrow-front)" />
                      <circle cx={tip.x} cy={tip.y} r="3" fill="#0ea5e9" />
                      <text x={tail.x - 20} y={tail.y} fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">FRONT (F)</text>
                    </g>
                  );
                })()}
                {/* Plan (Top) Viewing Direction Vector */}
                {(() => {
                  const tip = project3DTo2D({ x: activePart.dimensions.width / 2, y: activePart.dimensions.depth / 2, z: activePart.dimensions.height + 15 }, 200, 200);
                  const tail = project3DTo2D({ x: activePart.dimensions.width / 2, y: activePart.dimensions.depth / 2, z: activePart.dimensions.height + 55 }, 200, 200);
                  return (
                    <g>
                      <line x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx={tip.x} cy={tip.y} r="3" fill="#a855f7" />
                      <text x={tail.x} y={tail.y - 6} fill="#c084fc" fontSize="10" fontWeight="bold" fontFamily="monospace">PLAN (P)</text>
                    </g>
                  );
                })()}
              </g>
            </svg>

            {/* Orbit HUD Guide */}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
              Drag to Orbit • Yaw: {yaw.toFixed(0)}° • Pitch: {pitch.toFixed(0)}°
            </div>

            {/* Quick Zoom Buttons */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded p-1">
              <button
                onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
                className="px-1.5 py-0.5 text-xs text-slate-300 hover:text-white font-mono"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-[10px] font-mono text-cyan-400 w-9 text-center">{(zoom * 100).toFixed(0)}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(2.0, prev + 0.1))}
                className="px-1.5 py-0.5 text-xs text-slate-300 hover:text-white font-mono"
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>

          {/* Model Dimension Info & Legend */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-200">{activePart.name}</span>
              <span className="text-[10px] font-mono text-cyan-400">
                {activePart.dimensions.width} × {activePart.dimensions.depth} × {activePart.dimensions.height} mm
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              {activePart.description}
            </p>
          </div>
        </div>

        {/* =====================================================================
            RIGHT SIDE (7 COLS): DYNAMIC MULTI-VIEW ORTHOGRAPHIC GRID (2x2)
           ===================================================================== */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 p-3 overflow-y-auto custom-scrollbar">
          
          {/* Top Bar: View Layout Description & ISO Projection Symbol */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase text-slate-200">
                  {projectionAngle === 'FIRST_ANGLE' 
                    ? 'First-Angle Orthographic Layout (ISO 5456-2)' 
                    : 'Third-Angle Orthographic Layout (ANSI / ISO 5456-3)'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  1:1 Engineering Scale
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {projectionAngle === 'FIRST_ANGLE' 
                  ? 'Front Elevation (Top-Left), Left End Elevation (Top-Right), Plan (Bottom-Left)' 
                  : 'Plan (Top-Left), 45° Mitre (Top-Right), Front Elevation (Bottom-Left), Right End (Bottom-Right)'}
              </p>
            </div>

            {/* Official ISO Projection Symbol */}
            {renderIsoProjectionSymbol()}
          </div>

          {/* DYNAMIC 2x2 ORTHOGRAPHIC VIEW GRID */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            
            {/* ===================================================================
                QUADRANT 1: TOP-LEFT
                First-Angle: FRONT ELEVATION
                Third-Angle: PLAN (TOP VIEW)
               =================================================================== */}
            <div className={`rounded-xl border p-2.5 flex flex-col relative overflow-hidden transition-all ${
              projectionAngle === 'FIRST_ANGLE'
                ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg'
                : 'bg-slate-900/70 border-purple-500/40'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {projectionAngle === 'FIRST_ANGLE' ? 'FRONT ELEVATION' : 'PLAN (TOP VIEW)'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {projectionAngle === 'FIRST_ANGLE' ? 'Viewed from Front' : 'Viewed from Above'}
                </span>
              </div>

              {/* View Vector Canvas */}
              <div className="flex-1 flex items-center justify-center min-h-[160px] bg-slate-950/80 rounded-lg p-2 border border-slate-800/80 relative">
                {projectionAngle === 'FIRST_ANGLE' ? (
                  // Front Elevation Vector Drawing
                  <svg viewBox={activePart.ortho2D.front.viewBox} className="w-full h-full max-h-[180px]">
                    {/* Continuous Thick Outlines (ISO 128 - 0.50mm) */}
                    {activePart.ortho2D.front.outlines.map((d, i) => (
                      <path
                        key={`front-out-${i}`}
                        d={d}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                    ))}

                    {/* Circular features if any */}
                    {activePart.ortho2D.front.circles?.map((c, i) => (
                      <circle
                        key={`front-cir-${i}`}
                        cx={c.cx}
                        cy={c.cy}
                        r={c.r}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                      />
                    ))}

                    {/* Dashed Thin Hidden Details (ISO 128 - 0.25mm) */}
                    {showHiddenLines && activePart.ortho2D.front.hiddenLines.map((hl, i) => (
                      <line
                        key={`front-hid-${i}`}
                        x1={hl.x1}
                        y1={hl.y1}
                        x2={hl.x2}
                        y2={hl.y2}
                        stroke={themeClasses.dashedLine}
                        strokeWidth="1.4"
                        strokeDasharray="6 3"
                      />
                    ))}

                    {/* Chain Thin Centerlines (ISO 128 - 0.25mm) */}
                    {showCenterlines && activePart.ortho2D.front.centerlines.map((cl, i) => (
                      <line
                        key={`front-cen-${i}`}
                        x1={cl.x1}
                        y1={cl.y1}
                        x2={cl.x2}
                        y2={cl.y2}
                        stroke={themeClasses.chainLine}
                        strokeWidth="1.2"
                        strokeDasharray="14 3 2 3"
                      />
                    ))}

                    {/* Dimensions (ISO 129) */}
                    {showDimensions && activePart.ortho2D.front.dimensions.map((dim, i) => (
                      <g key={`front-dim-${i}`}>
                        <line
                          x1={dim.x1}
                          y1={dim.y1 + dim.offset}
                          x2={dim.x2}
                          y2={dim.y2 + dim.offset}
                          stroke={themeClasses.thinLine}
                          strokeWidth="1.0"
                        />
                        <text
                          x={(dim.x1 + dim.x2) / 2}
                          y={dim.y1 + dim.offset - 3}
                          fill={themeClasses.textColor}
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {dim.text}
                        </text>
                      </g>
                    ))}
                  </svg>
                ) : (
                  // Plan (Top View) in Top-Left for Third-Angle
                  <svg viewBox={activePart.ortho2D.plan.viewBox} className="w-full h-full max-h-[180px]">
                    {activePart.ortho2D.plan.outlines.map((d, i) => (
                      <path
                        key={`plan-out-${i}`}
                        d={d}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                    ))}
                    {activePart.ortho2D.plan.circles?.map((c, i) => (
                      <circle
                        key={`plan-cir-${i}`}
                        cx={c.cx}
                        cy={c.cy}
                        r={c.r}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                      />
                    ))}
                    {showHiddenLines && activePart.ortho2D.plan.hiddenLines.map((hl, i) => (
                      <line
                        key={`plan-hid-${i}`}
                        x1={hl.x1}
                        y1={hl.y1}
                        x2={hl.x2}
                        y2={hl.y2}
                        stroke={themeClasses.dashedLine}
                        strokeWidth="1.4"
                        strokeDasharray="6 3"
                      />
                    ))}
                    {showCenterlines && activePart.ortho2D.plan.centerlines.map((cl, i) => (
                      <line
                        key={`plan-cen-${i}`}
                        x1={cl.x1}
                        y1={cl.y1}
                        x2={cl.x2}
                        y2={cl.y2}
                        stroke={themeClasses.chainLine}
                        strokeWidth="1.2"
                        strokeDasharray="14 3 2 3"
                      />
                    ))}
                  </svg>
                )}
              </div>
            </div>

            {/* ===================================================================
                QUADRANT 2: TOP-RIGHT
                First-Angle: LEFT END ELEVATION (Projected onto Right profile plane)
                Third-Angle: 45° MITRE LINE BOX (Depth transfer rays)
               =================================================================== */}
            <div className={`rounded-xl border p-2.5 flex flex-col relative overflow-hidden transition-all ${
              projectionAngle === 'FIRST_ANGLE'
                ? 'bg-slate-900/80 border-cyan-500/30'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {projectionAngle === 'FIRST_ANGLE' ? 'LEFT END ELEVATION' : '45° MITRE TRANSFER BOX'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {projectionAngle === 'FIRST_ANGLE' ? 'Projected on Right' : 'Depth Ray Reflector'}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-[160px] bg-slate-950/80 rounded-lg p-2 border border-slate-800/80">
                {projectionAngle === 'FIRST_ANGLE' ? (
                  // Left End Elevation
                  <svg viewBox={activePart.ortho2D.end.viewBox} className="w-full h-full max-h-[180px]">
                    {activePart.ortho2D.end.outlines.map((d, i) => (
                      <path
                        key={`end-out-${i}`}
                        d={d}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                    ))}
                    {showHiddenLines && activePart.ortho2D.end.hiddenLines.map((hl, i) => (
                      <line
                        key={`end-hid-${i}`}
                        x1={hl.x1}
                        y1={hl.y1}
                        x2={hl.x2}
                        y2={hl.y2}
                        stroke={themeClasses.dashedLine}
                        strokeWidth="1.4"
                        strokeDasharray="6 3"
                      />
                    ))}
                    {showCenterlines && activePart.ortho2D.end.centerlines.map((cl, i) => (
                      <line
                        key={`end-cen-${i}`}
                        x1={cl.x1}
                        y1={cl.y1}
                        x2={cl.x2}
                        y2={cl.y2}
                        stroke={themeClasses.chainLine}
                        strokeWidth="1.2"
                        strokeDasharray="14 3 2 3"
                      />
                    ))}
                  </svg>
                ) : (
                  // 45° Mitre Line Box for Third Angle
                  <svg viewBox="0 0 140 140" className="w-full h-full max-h-[180px]">
                    {/* 45 Degree Line (Continuous Thin 0.25mm) */}
                    <line x1="20" y1="120" x2="120" y2="20" stroke="#f59e0b" strokeWidth="1.8" />
                    <text x="85" y="60" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">45° MITRE</text>

                    {/* Sample Transfer Rays */}
                    {showMitreRays && (
                      <g stroke="#64748b" strokeWidth="1" strokeDasharray="3 3">
                        <line x1="20" y1="40" x2="100" y2="40" />
                        <line x1="100" y1="40" x2="100" y2="120" />
                        <line x1="20" y1="80" x2="60" y2="80" />
                        <line x1="60" y1="80" x2="60" y2="120" />
                      </g>
                    )}
                  </svg>
                )}
              </div>
            </div>

            {/* ===================================================================
                QUADRANT 3: BOTTOM-LEFT
                First-Angle: PLAN (TOP VIEW) [Projected BELOW Front Elevation]
                Third-Angle: FRONT ELEVATION [Placed BELOW Plan]
               =================================================================== */}
            <div className={`rounded-xl border p-2.5 flex flex-col relative overflow-hidden transition-all ${
              projectionAngle === 'FIRST_ANGLE'
                ? 'bg-slate-900/80 border-cyan-500/30'
                : 'bg-slate-900/90 border-purple-500/40 shadow-lg'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  {projectionAngle === 'FIRST_ANGLE' ? 'PLAN (TOP VIEW)' : 'FRONT ELEVATION'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {projectionAngle === 'FIRST_ANGLE' ? 'Placed BELOW Front' : 'Placed BELOW Plan'}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-[160px] bg-slate-950/80 rounded-lg p-2 border border-slate-800/80">
                {projectionAngle === 'FIRST_ANGLE' ? (
                  // Plan View below Front
                  <svg viewBox={activePart.ortho2D.plan.viewBox} className="w-full h-full max-h-[180px]">
                    {activePart.ortho2D.plan.outlines.map((d, i) => (
                      <path
                        key={`plan-out-${i}`}
                        d={d}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                    ))}
                    {activePart.ortho2D.plan.circles?.map((c, i) => (
                      <circle
                        key={`plan-cir-${i}`}
                        cx={c.cx}
                        cy={c.cy}
                        r={c.r}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                      />
                    ))}
                    {showHiddenLines && activePart.ortho2D.plan.hiddenLines.map((hl, i) => (
                      <line
                        key={`plan-hid-${i}`}
                        x1={hl.x1}
                        y1={hl.y1}
                        x2={hl.x2}
                        y2={hl.y2}
                        stroke={themeClasses.dashedLine}
                        strokeWidth="1.4"
                        strokeDasharray="6 3"
                      />
                    ))}
                    {showCenterlines && activePart.ortho2D.plan.centerlines.map((cl, i) => (
                      <line
                        key={`plan-cen-${i}`}
                        x1={cl.x1}
                        y1={cl.y1}
                        x2={cl.x2}
                        y2={cl.y2}
                        stroke={themeClasses.chainLine}
                        strokeWidth="1.2"
                        strokeDasharray="14 3 2 3"
                      />
                    ))}
                  </svg>
                ) : (
                  // Front Elevation for Third-Angle
                  <svg viewBox={activePart.ortho2D.front.viewBox} className="w-full h-full max-h-[180px]">
                    {activePart.ortho2D.front.outlines.map((d, i) => (
                      <path
                        key={`front-out-3rd-${i}`}
                        d={d}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                    ))}
                    {showHiddenLines && activePart.ortho2D.front.hiddenLines.map((hl, i) => (
                      <line
                        key={`front-hid-3rd-${i}`}
                        x1={hl.x1}
                        y1={hl.y1}
                        x2={hl.x2}
                        y2={hl.y2}
                        stroke={themeClasses.dashedLine}
                        strokeWidth="1.4"
                        strokeDasharray="6 3"
                      />
                    ))}
                    {showCenterlines && activePart.ortho2D.front.centerlines.map((cl, i) => (
                      <line
                        key={`front-cen-3rd-${i}`}
                        x1={cl.x1}
                        y1={cl.y1}
                        x2={cl.x2}
                        y2={cl.y2}
                        stroke={themeClasses.chainLine}
                        strokeWidth="1.2"
                        strokeDasharray="14 3 2 3"
                      />
                    ))}
                  </svg>
                )}
              </div>
            </div>

            {/* ===================================================================
                QUADRANT 4: BOTTOM-RIGHT
                First-Angle: 45° MITRE LINE TRANSFER BOX
                Third-Angle: RIGHT END ELEVATION (Placed to the right of Front)
               =================================================================== */}
            <div className={`rounded-xl border p-2.5 flex flex-col relative overflow-hidden transition-all ${
              projectionAngle === 'FIRST_ANGLE'
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-slate-900/80 border-purple-500/30'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {projectionAngle === 'FIRST_ANGLE' ? '45° MITRE TRANSFER BOX' : 'RIGHT END ELEVATION'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {projectionAngle === 'FIRST_ANGLE' ? 'Depth Ray Reflector' : 'Placed to the RIGHT of Front'}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-[160px] bg-slate-950/80 rounded-lg p-2 border border-slate-800/80">
                {projectionAngle === 'FIRST_ANGLE' ? (
                  // 45° Mitre Line Box for First Angle
                  <svg viewBox="0 0 140 140" className="w-full h-full max-h-[180px]">
                    <line x1="20" y1="20" x2="120" y2="120" stroke="#f59e0b" strokeWidth="1.8" />
                    <text x="35" y="85" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">45° MITRE</text>
                    {showMitreRays && (
                      <g stroke="#64748b" strokeWidth="1" strokeDasharray="3 3">
                        <line x1="20" y1="50" x2="50" y2="50" />
                        <line x1="50" y1="20" x2="50" y2="50" />
                        <line x1="20" y1="90" x2="90" y2="90" />
                        <line x1="90" y1="20" x2="90" y2="90" />
                      </g>
                    )}
                  </svg>
                ) : (
                  // Right End Elevation for Third Angle
                  <svg viewBox={activePart.ortho2D.end.viewBox} className="w-full h-full max-h-[180px]">
                    {activePart.ortho2D.end.outlines.map((d, i) => (
                      <path
                        key={`end-out-3rd-${i}`}
                        d={d}
                        fill="none"
                        stroke={themeClasses.thickLine}
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                    ))}
                    {showHiddenLines && activePart.ortho2D.end.hiddenLines.map((hl, i) => (
                      <line
                        key={`end-hid-3rd-${i}`}
                        x1={hl.x1}
                        y1={hl.y1}
                        x2={hl.x2}
                        y2={hl.y2}
                        stroke={themeClasses.dashedLine}
                        strokeWidth="1.4"
                        strokeDasharray="6 3"
                      />
                    ))}
                    {showCenterlines && activePart.ortho2D.end.centerlines.map((cl, i) => (
                      <line
                        key={`end-cen-3rd-${i}`}
                        x1={cl.x1}
                        y1={cl.y1}
                        x2={cl.x2}
                        y2={cl.y2}
                        stroke={themeClasses.chainLine}
                        strokeWidth="1.2"
                        strokeDasharray="14 3 2 3"
                      />
                    ))}
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM ISO 128 LINE STANDARDS LEGEND & TOGGLE DOCK */}
          <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* ISO 128 Standards Checklist */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ISO 128 Line Styles:
              </span>
              
              {/* Type A: Continuous Thick 0.50mm */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-white inline-block rounded" />
                <span className="text-slate-200">Continuous Thick (0.5mm HB)</span>
              </div>

              {/* Type F: Dashed Thin 0.25mm */}
              <button
                onClick={() => setShowHiddenLines(prev => !prev)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors ${
                  showHiddenLines
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
                title="Toggle Hidden Feature Lines"
              >
                <span className="w-5 h-0.5 border-b-2 border-dashed border-sky-400 inline-block" />
                <span>Dashed Thin (0.25mm 2H)</span>
              </button>

              {/* Type G: Chain Thin 0.25mm */}
              <button
                onClick={() => setShowCenterlines(prev => !prev)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors ${
                  showCenterlines
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
                title="Toggle Symmetry Centerlines"
              >
                <span className="w-5 h-0.5 border-b-2 border-dotted border-rose-400 inline-block" />
                <span>Chain Thin (Centerlines)</span>
              </button>

              {/* Type B: Continuous Thin 0.25mm */}
              <button
                onClick={() => setShowDimensions(prev => !prev)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors ${
                  showDimensions
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
                title="Toggle ISO 129 Dimensions"
              >
                <span className="w-5 h-0.5 bg-slate-400 inline-block" />
                <span>Dimensions (ISO 129)</span>
              </button>
            </div>

            {/* WAEC Examination Tip */}
            <div className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              WAEC TD Section B: Always draw the ISO truncated cone projection symbol in the title block!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
