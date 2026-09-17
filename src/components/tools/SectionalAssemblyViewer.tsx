import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  Layers,
  Box,
  Eye,
  RotateCcw,
  Sliders,
  Check,
  Info,
  Maximize2,
  Minimize2,
  X,
  FileDown,
  Printer,
  ChevronRight,
  Shield,
  Scissors,
  Wrench,
  Cog,
  CheckCircle2,
  HelpCircle,
  Hash,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export type SectionType = 'FULL_SECTION' | 'HALF_SECTION' | 'UNSECTIONED';
export type AssemblyModelId = 'NUT_AND_BOLT' | 'FLANGED_COUPLING' | 'PLUMMER_BLOCK';

export interface SectionalAssemblyViewerProps {
  initialAssembly?: AssemblyModelId;
  initialSectionType?: SectionType;
  isOpen?: boolean;
  onClose?: () => void;
  viewMode?: 'MODAL' | 'EMBEDDED' | 'FULLSCREEN';
  className?: string;
}

interface PartBOMItem {
  itemNo: number;
  name: string;
  qty: number;
  material: string;
  standard: string;
  description: string;
  color: string;
  hatchPattern?: string;
  hatchAngle?: number;
  hatchPitch?: number;
  isUnsectionedShaftOrFastener?: boolean;
}

export const SectionalAssemblyViewer: React.FC<SectionalAssemblyViewerProps> = ({
  initialAssembly = 'NUT_AND_BOLT',
  initialSectionType = 'FULL_SECTION',
  isOpen = true,
  onClose,
  viewMode = 'MODAL',
  className = ''
}) => {
  // Main state
  const [selectedAssembly, setSelectedAssembly] = useState<AssemblyModelId>(initialAssembly);
  const [sectionType, setSectionType] = useState<SectionType>(initialSectionType);
  const [explodeDistance, setExplodeDistance] = useState<number>(0); // 0 to 100
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [showCenterlines, setShowCenterlines] = useState<boolean>(true);
  const [showHiddenDetails, setShowHiddenDetails] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showCuttingPlane, setShowCuttingPlane] = useState<boolean>(true);
  const [showBOMBalloons, setShowBOMBalloons] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(viewMode === 'FULLSCREEN');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // SVG Container reference
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Bill of Materials definitions per assembly
  const bomData: Record<AssemblyModelId, PartBOMItem[]> = useMemo(() => ({
    NUT_AND_BOLT: [
      {
        itemNo: 1,
        name: 'Hexagonal Head Bolt (M24 x 100)',
        qty: 1,
        material: 'High Tensile Steel (Grade 8.8)',
        standard: 'ISO 4014 / BS 3692',
        description: 'Nominal diameter D = 24mm. Across flats W = 36mm, across corners C = 48mm. Solid bolt shaft and head remain strictly UNSECTIONED along axis per ISO 128-40.',
        color: '#38bdf8',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 2,
        name: 'Upper Structural Joint Plate (20mm)',
        qty: 1,
        material: 'Structural Steel S275',
        standard: 'BS EN 10025',
        description: '20mm thick joint plate with 26mm clearance hole. Section hatched at +45° with 3mm pitch thin continuous lines (0.25mm).',
        color: '#f59e0b',
        hatchPattern: 'hatch-plate1',
        hatchAngle: 45,
        hatchPitch: 6
      },
      {
        itemNo: 3,
        name: 'Lower Structural Joint Plate (20mm)',
        qty: 1,
        material: 'Structural Steel S275',
        standard: 'BS EN 10025',
        description: '20mm thick joint plate. In contact with Upper Plate, so hatching direction is strictly reversed to -45° (135°) to distinguish boundary.',
        color: '#fbbf24',
        hatchPattern: 'hatch-plate2',
        hatchAngle: -45,
        hatchPitch: 6
      },
      {
        itemNo: 4,
        name: 'Plain Washer (Form A)',
        qty: 1,
        material: 'Mild Steel (200 HV)',
        standard: 'ISO 7089 / BS 4320',
        description: 'Outer diameter Dw = 50mm (2D + 2), thickness Tw = 4mm (0.15D). Sectioned or unsectioned, solid boundary.',
        color: '#94a3b8',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 5,
        name: 'Single Coil Spring Lock Washer',
        qty: 1,
        material: 'Spring Steel (En 42)',
        standard: 'DIN 127 Type B',
        description: 'Split helical lock washer providing anti-vibration tension under nut head.',
        color: '#cbd5e1',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 6,
        name: 'Hexagonal Nut (M24 Style 1)',
        qty: 1,
        material: 'Steel Grade 8',
        standard: 'ISO 4032 / BS 3692',
        description: 'Nominal thickness T = 19mm (0.8D), across flats W = 36mm. In longitudinal elevation/section, the nut profile remains unsectioned per ISO 128-40.',
        color: '#0ea5e9',
        isUnsectionedShaftOrFastener: true
      }
    ],
    FLANGED_COUPLING: [
      {
        itemNo: 1,
        name: 'Driving Shaft (Ø40mm)',
        qty: 1,
        material: 'Forged Mild Steel',
        standard: 'BS 970 (080M40)',
        description: 'Solid transmission shaft. Never sectioned longitudinally along its axis. Features keyway seat for sunk key.',
        color: '#38bdf8',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 2,
        name: 'Driven Shaft (Ø40mm)',
        qty: 1,
        material: 'Forged Mild Steel',
        standard: 'BS 970 (080M40)',
        description: 'Coaxial transmission shaft. Left unsectioned per ISO 128-40 sectioning convention.',
        color: '#60a5fa',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 3,
        name: 'Left Flange Hub with Spigot (Male)',
        qty: 1,
        material: 'Cast Iron (Grade 220)',
        standard: 'ISO 185 / BS 1452',
        description: 'Hub diameter = 80mm (2D), flange diameter = 160mm (4D). Section hatched at +45°. Features projecting cylindrical spigot for exact coaxial alignment.',
        color: '#10b981',
        hatchPattern: 'hatch-flange-l',
        hatchAngle: 45,
        hatchPitch: 7
      },
      {
        itemNo: 4,
        name: 'Right Flange Hub with Recess (Female)',
        qty: 1,
        material: 'Cast Iron (Grade 220)',
        standard: 'ISO 185 / BS 1452',
        description: 'Mates with left flange via precision matching recess. Hatching strictly reversed to -45° to highlight joint interface.',
        color: '#059669',
        hatchPattern: 'hatch-flange-r',
        hatchAngle: -45,
        hatchPitch: 7
      },
      {
        itemNo: 5,
        name: 'Gib-Head / Sunk Keys (12 x 8 x 60mm)',
        qty: 2,
        material: 'Bright Drawn Steel',
        standard: 'ISO 773 / BS 4235',
        description: 'Parallel driving keys torque transmitting. Left unsectioned when cut longitudinally.',
        color: '#f97316',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 6,
        name: 'Fitted Coupling Bolts & Nuts (4-Off M16)',
        qty: 4,
        material: 'High Tensile Steel',
        standard: 'ISO 4014 (Fitted Shank)',
        description: 'Mounted on Pitch Circle Diameter (PCD = 120mm). Reamed precision fit. Kept unsectioned inside bolt clearance holes.',
        color: '#eab308',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 7,
        name: 'Protective Safety Shroud Rim',
        qty: 2,
        material: 'Cast Iron (Integral with flange)',
        standard: 'ISO 128-40 Safety Regulations',
        description: 'Annular cylindrical shroud enclosing bolt heads and nuts to prevent catching clothing or operating personnel.',
        color: '#34d399',
        hatchPattern: 'hatch-flange-l',
        hatchAngle: 45,
        hatchPitch: 7
      }
    ],
    PLUMMER_BLOCK: [
      {
        itemNo: 1,
        name: 'Cast Iron Base Pedestal (Soleplate)',
        qty: 1,
        material: 'Grey Cast Iron (Grade 250)',
        standard: 'ISO 185 / BS 1452',
        description: 'Cast iron foundation body with hold-down slotted holes and oil well. Section hatched at +45° with 6mm pitch.',
        color: '#64748b',
        hatchPattern: 'hatch-base',
        hatchAngle: 45,
        hatchPitch: 6
      },
      {
        itemNo: 2,
        name: 'Split Bush Bottom Brass (Lower Half)',
        qty: 1,
        material: 'Phosphor Bronze / Gunmetal',
        standard: 'BS 1400 (LG2 Gunmetal)',
        description: 'Removable journal bearing bush with anti-rotation snug. Fine-pitch hatching at 60° (representing non-ferrous brass/bronze per ISO 128).',
        color: '#f59e0b',
        hatchPattern: 'hatch-bush-bot',
        hatchAngle: 60,
        hatchPitch: 3.5
      },
      {
        itemNo: 3,
        name: 'Split Bush Top Brass (Upper Half)',
        qty: 1,
        material: 'Phosphor Bronze / Gunmetal',
        standard: 'BS 1400 (LG2 Gunmetal)',
        description: 'Upper half bush with oil lubrication passage hole. Fine-pitch hatching at -60° opposite to lower brass.',
        color: '#d97706',
        hatchPattern: 'hatch-bush-top',
        hatchAngle: -60,
        hatchPitch: 3.5
      },
      {
        itemNo: 4,
        name: 'Cast Iron Bearing Cap',
        qty: 1,
        material: 'Grey Cast Iron (Grade 250)',
        standard: 'ISO 185 / BS 1452',
        description: 'Clamping cap with grease cup thread. Reverses hatching to -45° to contrast with the base.',
        color: '#475569',
        hatchPattern: 'hatch-cap',
        hatchAngle: -45,
        hatchPitch: 6
      },
      {
        itemNo: 5,
        name: 'Square Head Holding Down Bolts (2-Off M16)',
        qty: 2,
        material: 'Medium Carbon Steel',
        standard: 'BS 916',
        description: 'Square head prevents rotation inside base recess. Kept unsectioned along axis.',
        color: '#38bdf8',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 6,
        name: 'Hexagonal Lock Nuts (Thin Check Nuts)',
        qty: 4,
        material: 'Steel Grade 6',
        standard: 'ISO 4035 / BS 3692',
        description: 'Primary clamping nut plus secondary lock nut to resist mechanical machine vibration.',
        color: '#0284c7',
        isUnsectionedShaftOrFastener: true
      },
      {
        itemNo: 7,
        name: 'Journal Shaft (Ø50mm)',
        qty: 1,
        material: 'Carbon Steel (C45)',
        standard: 'ISO 683-1',
        description: 'Shaft rotating inside split bush. Unsectioned solid steel per ISO 128-40.',
        color: '#0ea5e9',
        isUnsectionedShaftOrFastener: true
      }
    ]
  }), []);

  // Current parts for selected assembly
  const currentParts = bomData[selectedAssembly];

  // SVG Download handler
  const handleExportSVG = useCallback(() => {
    if (!svgRef.current) return;
    setIsExporting(true);
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ISO-128-Sectional-Assembly-${selectedAssembly}-${sectionType}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  }, [selectedAssembly, sectionType]);

  // Print sheet handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Zoom and pan helpers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.2));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.6, z - 0.2));
  const handleResetView = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setExplodeDistance(0);
  };

  if (!isOpen) return null;

  return (
    <div
      id="sectional-assembly-viewer"
      className={`flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden h-full w-full ${
        isFullscreen ? 'fixed inset-0 z-50' : 'relative'
      } ${className}`}
    >
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="h-14 px-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-sm">
            <Cog className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">Sectional Assembly Engineering Viewer</h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                ISO 128-40 / BS 8888
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Mechanical Assembly Sectioning • Full, Half & Outside Elevations • WAEC SS3 Term 2 & 3
            </p>
          </div>
        </div>

        {/* Center: Assembly Selection Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            id="tab-assembly-nut-bolt"
            onClick={() => {
              setSelectedAssembly('NUT_AND_BOLT');
              setSelectedPartId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedAssembly === 'NUT_AND_BOLT'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Nut & Bolt Assembly
          </button>
          <button
            id="tab-assembly-flanged-coupling"
            onClick={() => {
              setSelectedAssembly('FLANGED_COUPLING');
              setSelectedPartId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedAssembly === 'FLANGED_COUPLING'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Flanged Coupling
          </button>
          <button
            id="tab-assembly-plummer-block"
            onClick={() => {
              setSelectedAssembly('PLUMMER_BLOCK');
              setSelectedPartId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedAssembly === 'PLUMMER_BLOCK'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Plummer Block
          </button>
        </div>

        {/* Right actions: Export SVG, Print, Fullscreen, Close */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-sectional-svg"
            onClick={handleExportSVG}
            disabled={isExporting}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Download ISO 5457 A3 Drawing Sheet (SVG)"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Download SVG</span>
          </button>

          <button
            id="btn-print-sectional-sheet"
            onClick={handlePrint}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Print ISO Drawing Sheet for Drafting Board Practice"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            id="btn-toggle-fullscreen"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              id="btn-close-sectional-viewer"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 transition-colors ml-1"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. SUB-TOOLBAR: SECTION VIEW TOGGLES & DISPLAY OPTIONS */}
      <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Section Mode Toggle Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Cutting View:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              id="btn-view-full-section"
              onClick={() => setSectionType('FULL_SECTION')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                sectionType === 'FULL_SECTION'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scissors className="w-3 h-3 text-blue-300" />
              <span>Full Section (A-A)</span>
            </button>

            <button
              id="btn-view-half-section"
              onClick={() => setSectionType('HALF_SECTION')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                sectionType === 'HALF_SECTION'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="w-3 h-3 rounded-full border border-current flex overflow-hidden">
                <div className="w-1/2 h-full bg-current opacity-70" />
              </div>
              <span>Half Section</span>
            </button>

            <button
              id="btn-view-unsectioned"
              onClick={() => setSectionType('UNSECTIONED')}
              className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                sectionType === 'UNSECTIONED'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3 text-slate-300" />
              <span>Unsectioned Outside</span>
            </button>
          </div>
        </div>

        {/* Exploded View Slider */}
        <div className="flex items-center gap-2 min-w-[210px]">
          <span className="text-slate-400 font-medium whitespace-nowrap">Explode:</span>
          <input
            id="slider-explode-distance"
            type="range"
            min="0"
            max="100"
            value={explodeDistance}
            onChange={(e) => setExplodeDistance(parseInt(e.target.value))}
            className="w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="font-mono text-[11px] text-blue-300 w-8 text-right">{explodeDistance}%</span>
        </div>

        {/* Visibility Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCenterlines(!showCenterlines)}
            className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
              showCenterlines
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle ISO Thin Chain Centerlines (0.25mm)"
          >
            Centerlines
          </button>
          <button
            onClick={() => setShowHiddenDetails(!showHiddenDetails)}
            className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
              showHiddenDetails
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle ISO Dashed Thin Hidden Lines (0.25mm)"
          >
            Hidden Lines
          </button>
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
              showDimensions
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Engineering Dimensions"
          >
            Dimensions
          </button>
          <button
            onClick={() => setShowBOMBalloons(!showBOMBalloons)}
            className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
              showBOMBalloons
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Part Balloon Callouts (1, 2, 3...)"
          >
            BOM Balloons
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-slate-300 px-1">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            title="Reset Zoom & Pan"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. ISO 128-40 SECTIONING RULES COMPLIANCE BANNER */}
      <div className="px-4 py-1.5 bg-blue-950/40 border-b border-blue-900/40 flex items-center justify-between text-xs text-blue-300">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>
            <strong className="text-white">ISO 128-40 Section Rule:</strong> Solid shafts, bolts, nuts, washers, studs, and keys are{' '}
            <span className="underline font-bold text-amber-300">never sectioned along their longitudinal axis</span>.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 hidden lg:flex">
          <span>Hatching: 45° Continuous Thin (0.25mm)</span>
          <span>Pitch: 2–3mm (finer for small parts)</span>
          <span>Reversed direction on mating parts</span>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE: LEFT VECTOR CAD STAGE + RIGHT BOM/RULES PANEL */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
        {/* 4A. MAIN VECTOR CAD CANVAS */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center p-2">
          <svg
            ref={svgRef}
            id="iso-assembly-svg-canvas"
            viewBox="0 0 900 600"
            className="w-full h-full max-h-[780px] object-contain drop-shadow-xl"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transition: 'transform 0.15s ease-out'
            }}
          >
            <defs>
              {/* Hatching patterns for adjacent parts with reversing directions per ISO 128-40 */}
              {/* Pattern 1: +45 deg (Plate 1, Left Flange, Plummer Block Base) */}
              <pattern
                id="hatch-45-pos"
                width="8"
                height="8"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" strokeWidth="0.75" />
              </pattern>

              {/* Pattern 2: -45 deg (Plate 2, Right Flange, Plummer Block Cap) */}
              <pattern
                id="hatch-45-neg"
                width="8"
                height="8"
                patternTransform="rotate(-45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" strokeWidth="0.75" />
              </pattern>

              {/* Pattern 3: +60 deg fine pitch (Gunmetal Split Bush Lower) */}
              <pattern
                id="hatch-60-bronze"
                width="4.5"
                height="4.5"
                patternTransform="rotate(60 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="4.5" stroke="#ec4899" strokeWidth="0.6" />
              </pattern>

              {/* Pattern 4: -60 deg fine pitch (Gunmetal Split Bush Upper) */}
              <pattern
                id="hatch-neg60-bronze"
                width="4.5"
                height="4.5"
                patternTransform="rotate(-60 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="4.5" stroke="#a855f7" strokeWidth="0.6" />
              </pattern>

              {/* Arrowhead marker for dimensions */}
              <marker
                id="dim-arrow-start"
                viewBox="0 0 10 10"
                refX="0"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 5 L 10 2 L 10 8 z" fill="#38bdf8" />
              </marker>
              <marker
                id="dim-arrow-end"
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 2 L 10 5 L 0 8 z" fill="#38bdf8" />
              </marker>

              {/* Direction arrow for Section plane A-A */}
              <marker
                id="section-arrow"
                viewBox="0 0 12 12"
                refX="6"
                refY="6"
                markerWidth="8"
                markerHeight="8"
                orient="auto"
              >
                <path d="M 2 2 L 10 6 L 2 10 z" fill="#ef4444" />
              </marker>
            </defs>

            {/* A3 Engineering Drawing Border (ISO 5457) */}
            <rect
              x="15"
              y="15"
              width="870"
              height="570"
              fill="#090d16"
              stroke="#1e293b"
              strokeWidth="2"
              rx="4"
            />
            <rect
              x="25"
              y="25"
              width="850"
              height="550"
              fill="#030712"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Background Datum Coordinate Grid (10mm spacing) */}
            <g opacity="0.15">
              {Array.from({ length: 17 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={50 + i * 50}
                  y1="25"
                  x2={50 + i * 50}
                  y2="575"
                  stroke="#64748b"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="25"
                  y1={50 + i * 50}
                  x2="875"
                  y2={50 + i * 50}
                  stroke="#64748b"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
            </g>

            {/* ISO 7200 Standard Title Block in bottom right */}
            <g id="iso-title-block" transform="translate(565, 475)">
              <rect x="0" y="0" width="300" height="90" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <line x1="0" y1="26" x2="300" y2="26" stroke="#334155" strokeWidth="0.8" />
              <line x1="0" y1="52" x2="300" y2="52" stroke="#334155" strokeWidth="0.8" />
              <line x1="150" y1="26" x2="150" y2="90" stroke="#334155" strokeWidth="0.8" />

              <text x="10" y="18" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                DRAFTHANDS ENGINEERING ACADEMY
              </text>
              <text x="10" y="42" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                {selectedAssembly === 'NUT_AND_BOLT' && 'M24 HEX BOLT & NUT JOINT'}
                {selectedAssembly === 'FLANGED_COUPLING' && 'PROTECTED FLANGED COUPLING'}
                {selectedAssembly === 'PLUMMER_BLOCK' && 'PEDESTAL BEARING ASSEMBLY'}
              </text>
              <text x="10" y="70" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                VIEW: {sectionType.replace('_', ' ')}
              </text>
              <text x="10" y="82" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                STANDARD: ISO 128-40 / BS 8888
              </text>

              <text x="160" y="42" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                SCALE: 1:1 FULL SIZE
              </text>
              <text x="160" y="62" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                PROJECTION: 1ST ANGLE
              </text>
              <text x="160" y="82" fill="#38bdf8" fontSize="8" fontFamily="sans-serif">
                WAEC SS3 TERM 2/3
              </text>

              {/* Truncated Cone Projection Symbol */}
              <g transform="translate(250, 60) scale(0.5)">
                <polygon points="5,15 25,22 25,8 5,15" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <circle cx="45" cy="15" r="10" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <circle cx="45" cy="15" r="5" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="0" y1="15" x2="60" y2="15" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="4,2" />
              </g>
            </g>

            {/* ========================================================================= */}
            {/* ASSEMBLY 1: M24 HEX BOLT & NUT WITH TWO JOINED PLATES                     */}
            {/* ========================================================================= */}
            {selectedAssembly === 'NUT_AND_BOLT' && (
              <g id="assembly-nut-and-bolt" transform="translate(340, 260)">
                {/* Cutting Plane Line A-A (shown when in Section Mode) */}
                {showCuttingPlane && sectionType !== 'UNSECTIONED' && (
                  <g id="cutting-plane-aa" opacity="0.9">
                    <line x1="-240" y1="0" x2="240" y2="0" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="14,3,3,3" />
                    {/* Heavy ends per ISO 128-40 */}
                    <line x1="-240" y1="0" x2="-210" y2="0" stroke="#ef4444" strokeWidth="3.5" />
                    <line x1="210" y1="0" x2="240" y2="0" stroke="#ef4444" strokeWidth="3.5" />
                    {/* View Arrows */}
                    <line x1="-230" y1="0" x2="-230" y2="-25" stroke="#ef4444" strokeWidth="2" markerEnd="url(#section-arrow)" />
                    <line x1="230" y1="0" x2="230" y2="-25" stroke="#ef4444" strokeWidth="2" markerEnd="url(#section-arrow)" />
                    <text x="-245" y="-12" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="sans-serif">A</text>
                    <text x="240" y="-12" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="sans-serif">A</text>
                    <text x="0" y="-195" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      SECTION A-A (ELEVATION)
                    </text>
                  </g>
                )}

                {/* Main Axis Centerline (Chain Thin ISO 128) */}
                {showCenterlines && (
                  <line
                    x1="0"
                    y1="-200"
                    x2="0"
                    y2="200"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                    strokeDasharray="16,3,4,3"
                  />
                )}

                {/* 1. UPPER JOINT PLATE (20mm thick) */}
                {/* Exploded offset shifts plate upwards */}
                <g
                  id="part-upper-plate"
                  transform={`translate(0, ${-explodeDistance * 0.4})`}
                  onClick={() => setSelectedPartId(2)}
                  className="cursor-pointer transition-transform"
                >
                  {/* Left half of upper plate */}
                  <rect
                    x="-180"
                    y="-25"
                    width="167"
                    height="25"
                    fill={
                      sectionType === 'FULL_SECTION' || sectionType === 'HALF_SECTION'
                        ? 'url(#hatch-45-pos)'
                        : '#1e293b'
                    }
                    stroke={selectedPartId === 2 ? '#38bdf8' : '#e2e8f0'}
                    strokeWidth={selectedPartId === 2 ? '2.5' : '1.5'}
                  />
                  {/* Right half of upper plate */}
                  <rect
                    x="13"
                    y="-25"
                    width="167"
                    height="25"
                    fill={sectionType === 'FULL_SECTION' ? 'url(#hatch-45-pos)' : '#1e293b'}
                    stroke={selectedPartId === 2 ? '#38bdf8' : '#e2e8f0'}
                    strokeWidth={selectedPartId === 2 ? '2.5' : '1.5'}
                  />
                  {/* Clearance hole (Ø26mm) outline */}
                  <line x1="-13" y1="-25" x2="-13" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="13" y1="-25" x2="13" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Label & Material Callout */}
                  <text x="-120" y="-10" fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    PLATE 1 (20mm) [+45° HATCH]
                  </text>
                </g>

                {/* 2. LOWER JOINT PLATE (20mm thick) */}
                {/* Exploded offset shifts plate downwards */}
                <g
                  id="part-lower-plate"
                  transform={`translate(0, ${explodeDistance * 0.4})`}
                  onClick={() => setSelectedPartId(3)}
                  className="cursor-pointer transition-transform"
                >
                  {/* Left half of lower plate (Hatched in opposite direction -45 deg per ISO 128) */}
                  <rect
                    x="-180"
                    y="0"
                    width="167"
                    height="25"
                    fill={
                      sectionType === 'FULL_SECTION' || sectionType === 'HALF_SECTION'
                        ? 'url(#hatch-45-neg)'
                        : '#1e293b'
                    }
                    stroke={selectedPartId === 3 ? '#38bdf8' : '#e2e8f0'}
                    strokeWidth={selectedPartId === 3 ? '2.5' : '1.5'}
                  />
                  {/* Right half of lower plate */}
                  <rect
                    x="13"
                    y="0"
                    width="167"
                    height="25"
                    fill={sectionType === 'FULL_SECTION' ? 'url(#hatch-45-neg)' : '#1e293b'}
                    stroke={selectedPartId === 3 ? '#38bdf8' : '#e2e8f0'}
                    strokeWidth={selectedPartId === 3 ? '2.5' : '1.5'}
                  />
                  {/* Clearance hole (Ø26mm) outline */}
                  <line x1="-13" y1="0" x2="-13" y2="25" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="13" y1="0" x2="13" y2="25" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />

                  <text x="-120" y="16" fill="#fbbf24" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    PLATE 2 (20mm) [-45° HATCH]
                  </text>
                </g>

                {/* 3. SOLID HEXAGONAL HEAD BOLT (M24) */}
                {/* CRITICAL ISO RULE: Solid bolt shank and head are strictly UNSECTIONED */}
                <g
                  id="part-bolt"
                  transform={`translate(0, ${-explodeDistance * 0.9})`}
                  onClick={() => setSelectedPartId(1)}
                  className="cursor-pointer"
                >
                  {/* Bolt Head (H = 0.7D = 17mm, Across corners C = 2D = 48mm) */}
                  <g id="bolt-head">
                    <path
                      d="M -24 -25 L -24 -42 L 24 -42 L 24 -25 Z"
                      fill="#0f172a"
                      stroke={selectedPartId === 1 ? '#38bdf8' : '#38bdf8'}
                      strokeWidth="2"
                    />
                    {/* 30 degree Chamfer Arcs on Bolt Head Faces */}
                    <path d="M -24 -42 Q -12 -38 0 -42 Q 12 -38 24 -42" fill="none" stroke="#38bdf8" strokeWidth="1" />
                    {/* Center chamfer facet lines */}
                    <line x1="-12" y1="-42" x2="-12" y2="-25" stroke="#38bdf8" strokeWidth="1" />
                    <line x1="12" y1="-42" x2="12" y2="-25" stroke="#38bdf8" strokeWidth="1" />
                  </g>

                  {/* Bolt Solid Plain Shank (Ø24mm, Length = 50mm unthreaded) */}
                  {/* Drawn in solid elevation outline - NO CROSS HATCHING */}
                  <rect
                    x="-12"
                    y="-25"
                    width="24"
                    height="50"
                    fill="#1e293b"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />

                  {/* Threaded Section (Length = 50mm) */}
                  {/* Crest of thread = Thick (0.5mm), Root = Thin (0.25mm) at 0.85D = 20.4mm */}
                  <g id="bolt-thread">
                    <rect
                      x="-12"
                      y="25"
                      width="24"
                      height="55"
                      fill="#1e293b"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    {/* Thread root lines (Thin continuous 0.25mm per ISO) */}
                    <line x1="-10.2" y1="25" x2="-10.2" y2="76" stroke="#94a3b8" strokeWidth="0.8" />
                    <line x1="10.2" y1="25" x2="10.2" y2="76" stroke="#94a3b8" strokeWidth="0.8" />
                    {/* Thread runout and chamfer at tip */}
                    <line x1="-10.2" y1="76" x2="-12" y2="80" stroke="#38bdf8" strokeWidth="1" />
                    <line x1="10.2" y1="76" x2="12" y2="80" stroke="#38bdf8" strokeWidth="1" />
                    <line x1="-12" y1="80" x2="12" y2="80" stroke="#38bdf8" strokeWidth="2" />
                  </g>

                  {/* ISO Unsectioned Compliance Tag */}
                  <g transform="translate(28, 5)">
                    <rect x="0" y="0" width="135" height="18" rx="3" fill="#0284c7" fillOpacity="0.2" stroke="#0284c7" strokeWidth="0.8" />
                    <text x="6" y="12" fill="#7dd3fc" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      SOLID BOLT: UNSECTIONED
                    </text>
                  </g>
                </g>

                {/* 4. PLAIN WASHER (Dw = 50mm, Tw = 4mm) */}
                <g
                  id="part-plain-washer"
                  transform={`translate(0, ${explodeDistance * 0.55})`}
                  onClick={() => setSelectedPartId(4)}
                  className="cursor-pointer"
                >
                  <rect
                    x="-25"
                    y="25"
                    width="50"
                    height="4"
                    fill="#334155"
                    stroke={selectedPartId === 4 ? '#38bdf8' : '#e2e8f0'}
                    strokeWidth="1.5"
                  />
                </g>

                {/* 5. SPRING LOCK WASHER (Helical Split) */}
                <g
                  id="part-spring-washer"
                  transform={`translate(0, ${explodeDistance * 0.7})`}
                  onClick={() => setSelectedPartId(5)}
                  className="cursor-pointer"
                >
                  <rect
                    x="-24"
                    y="30"
                    width="48"
                    height="5"
                    fill="#475569"
                    stroke={selectedPartId === 5 ? '#38bdf8' : '#cbd5e1'}
                    strokeWidth="1.5"
                  />
                  <line x1="0" y1="30" x2="4" y2="35" stroke="#030712" strokeWidth="1.5" />
                </g>

                {/* 6. HEXAGONAL NUT (T = 0.8D = 19mm, Across corners C = 48mm) */}
                {/* Also left unsectioned in longitudinal elevation per ISO 128 */}
                <g
                  id="part-hex-nut"
                  transform={`translate(0, ${explodeDistance * 0.85})`}
                  onClick={() => setSelectedPartId(6)}
                  className="cursor-pointer"
                >
                  <path
                    d="M -24 36 L -24 55 L 24 55 L 24 36 Z"
                    fill="#0f172a"
                    stroke={selectedPartId === 6 ? '#38bdf8' : '#38bdf8'}
                    strokeWidth="2"
                  />
                  {/* 30-deg Chamfer Arcs */}
                  <path d="M -24 36 Q -12 40 0 36 Q 12 40 24 36" fill="none" stroke="#38bdf8" strokeWidth="1" />
                  <path d="M -24 55 Q -12 51 0 55 Q 12 51 24 55" fill="none" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="-12" y1="36" x2="-12" y2="55" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="12" y1="36" x2="12" y2="55" stroke="#38bdf8" strokeWidth="1" />
                </g>

                {/* 7. BOM BALLOON CALLOUTS (1 to 6) */}
                {showBOMBalloons && (
                  <g id="bom-balloons" opacity="0.95">
                    {/* Balloon 1: Bolt Head */}
                    <g transform="translate(-80, -70)">
                      <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                      <line x1="0" y1="10" x2="56" y2="35" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
                    </g>

                    {/* Balloon 2: Upper Plate */}
                    <g transform="translate(-140, -45)">
                      <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
                      <line x1="0" y1="10" x2="40" y2="30" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                    </g>

                    {/* Balloon 3: Lower Plate */}
                    <g transform="translate(-140, 45)">
                      <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">3</text>
                      <line x1="0" y1="-10" x2="40" y2="-30" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
                    </g>

                    {/* Balloon 4: Plain Washer */}
                    <g transform="translate(80, 27)">
                      <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">4</text>
                      <line x1="-10" y1="0" x2="-55" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                    </g>

                    {/* Balloon 5: Spring Washer */}
                    <g transform="translate(90, 50)">
                      <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">5</text>
                      <line x1="-10" y1="0" x2="-65" y2="-17" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
                    </g>

                    {/* Balloon 6: Hex Nut */}
                    <g transform="translate(80, 80)">
                      <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#0ea5e9" fontSize="10" fontWeight="bold" textAnchor="middle">6</text>
                      <line x1="-10" y1="-5" x2="-55" y2="-34" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2,2" />
                    </g>
                  </g>
                )}

                {/* 8. ENGINEERING DIMENSIONS */}
                {showDimensions && (
                  <g id="engineering-dimensions" opacity="0.85">
                    {/* Grip Length Dimension: 20 + 20 = 40mm */}
                    <line x1="-200" y1="-25" x2="-200" y2="25" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#dim-arrow-start)" markerEnd="url(#dim-arrow-end)" />
                    <line x1="-180" y1="-25" x2="-205" y2="-25" stroke="#64748b" strokeWidth="0.6" />
                    <line x1="-180" y1="25" x2="-205" y2="25" stroke="#64748b" strokeWidth="0.6" />
                    <text x="-210" y="4" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="end">Grip 40</text>

                    {/* Across Corners Dimension: C = 48mm */}
                    <line x1="-24" y1="-55" x2="24" y2="-55" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#dim-arrow-start)" markerEnd="url(#dim-arrow-end)" />
                    <line x1="-24" y1="-42" x2="-24" y2="-60" stroke="#64748b" strokeWidth="0.6" />
                    <line x1="24" y1="-42" x2="24" y2="-60" stroke="#64748b" strokeWidth="0.6" />
                    <text x="0" y="-60" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">C = 2D (48)</text>

                    {/* Nominal Diameter Dimension: Ø24 */}
                    <text x="0" y="96" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      NOMINAL Ø24 (M24 x 100)
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* ========================================================================= */}
            {/* ASSEMBLY 2: PROTECTED FLANGED SHAFT COUPLING WITH GIB-HEAD KEYS            */}
            {/* ========================================================================= */}
            {selectedAssembly === 'FLANGED_COUPLING' && (
              <g id="assembly-flanged-coupling" transform="translate(350, 260)">
                {/* Horizontal Centerline Axis */}
                {showCenterlines && (
                  <line
                    x1="-260"
                    y1="0"
                    x2="260"
                    y2="0"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                    strokeDasharray="16,3,4,3"
                  />
                )}
                {/* Vertical Centerline Mating Interface */}
                {showCenterlines && (
                  <line
                    x1="0"
                    y1="-180"
                    x2="0"
                    y2="180"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                    strokeDasharray="16,3,4,3"
                  />
                )}

                {/* Pitch Circle Diameter PCD = 120mm (Thin Chain Line) */}
                <line x1="-120" y1="-60" x2="120" y2="-60" stroke="#eab308" strokeWidth="0.75" strokeDasharray="8,2,2,2" />
                <line x1="-120" y1="60" x2="120" y2="60" stroke="#eab308" strokeWidth="0.75" strokeDasharray="8,2,2,2" />

                {/* LEFT FLANGE HUB (Male Spigot) */}
                <g
                  id="part-left-flange"
                  transform={`translate(${-explodeDistance * 0.5}, 0)`}
                  onClick={() => setSelectedPartId(3)}
                  className="cursor-pointer"
                >
                  {/* Upper Half: Sectioned or Unsectioned */}
                  <path
                    d="M -75 -20 L -25 -20 L -25 -65 L -25 -85 L 0 -85 L 0 -65 L 0 -40 L 4 -40 L 4 -20 L -75 -20 Z"
                    fill={sectionType === 'FULL_SECTION' || sectionType === 'HALF_SECTION' ? 'url(#hatch-45-pos)' : '#1e293b'}
                    stroke={selectedPartId === 3 ? '#38bdf8' : '#10b981'}
                    strokeWidth="2"
                  />
                  {/* Lower Half: Sectioned in FULL_SECTION, Exterior in HALF_SECTION */}
                  <path
                    d="M -75 20 L -25 20 L -25 65 L -25 85 L 0 85 L 0 65 L 0 40 L 4 40 L 4 20 L -75 20 Z"
                    fill={sectionType === 'FULL_SECTION' ? 'url(#hatch-45-pos)' : '#1e293b'}
                    stroke={selectedPartId === 3 ? '#38bdf8' : '#10b981'}
                    strokeWidth="2"
                  />

                  {/* Bolt clearance hole (Ø17.5mm) */}
                  <rect x="-25" y="-68" width="25" height="16" fill="none" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2,2" />
                  <rect x="-25" y="52" width="25" height="16" fill="none" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2,2" />

                  {/* Label */}
                  <text x="-65" y="-95" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    LEFT FLANGE [+45°]
                  </text>
                </g>

                {/* RIGHT FLANGE HUB (Female Recess) */}
                <g
                  id="part-right-flange"
                  transform={`translate(${explodeDistance * 0.5}, 0)`}
                  onClick={() => setSelectedPartId(4)}
                  className="cursor-pointer"
                >
                  {/* Upper Half: Hatched at -45 deg */}
                  <path
                    d="M 75 -20 L 25 -20 L 25 -65 L 25 -85 L 0 -85 L 0 -65 L 0 -40 L 4 -40 L 4 -20 L 75 -20 Z"
                    fill={sectionType === 'FULL_SECTION' || sectionType === 'HALF_SECTION' ? 'url(#hatch-45-neg)' : '#1e293b'}
                    stroke={selectedPartId === 4 ? '#38bdf8' : '#059669'}
                    strokeWidth="2"
                  />
                  {/* Lower Half */}
                  <path
                    d="M 75 20 L 25 20 L 25 65 L 25 85 L 0 85 L 0 65 L 0 40 L 4 40 L 4 20 L 75 20 Z"
                    fill={sectionType === 'FULL_SECTION' ? 'url(#hatch-45-neg)' : '#1e293b'}
                    stroke={selectedPartId === 4 ? '#38bdf8' : '#059669'}
                    strokeWidth="2"
                  />

                  {/* Bolt clearance hole */}
                  <rect x="0" y="-68" width="25" height="16" fill="none" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2,2" />
                  <rect x="0" y="52" width="25" height="16" fill="none" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2,2" />

                  <text x="35" y="-95" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    RIGHT FLANGE [-45°]
                  </text>
                </g>

                {/* LEFT DRIVING SHAFT (Ø40mm, unsectioned) */}
                <g id="part-shaft-left" onClick={() => setSelectedPartId(1)} className="cursor-pointer">
                  <rect x="-170" y="-20" width="170" height="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  {/* Keyway */}
                  <line x1="-70" y1="-14" x2="-5" y2="-14" stroke="#f97316" strokeWidth="1.5" />
                  <line x1="-70" y1="-20" x2="-70" y2="-14" stroke="#f97316" strokeWidth="1.5" />
                  <line x1="-5" y1="-20" x2="-5" y2="-14" stroke="#f97316" strokeWidth="1.5" />
                </g>

                {/* RIGHT DRIVEN SHAFT (Ø40mm, unsectioned) */}
                <g id="part-shaft-right" onClick={() => setSelectedPartId(2)} className="cursor-pointer">
                  <rect x="0" y="-20" width="170" height="40" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
                  {/* Keyway */}
                  <line x1="5" y1="-14" x2="70" y2="-14" stroke="#f97316" strokeWidth="1.5" />
                  <line x1="5" y1="-20" x2="5" y2="-14" stroke="#f97316" strokeWidth="1.5" />
                  <line x1="70" y1="-20" x2="70" y2="-14" stroke="#f97316" strokeWidth="1.5" />
                </g>

                {/* GIB-HEAD SUNK KEYS (Unsectioned) */}
                <g id="part-keys" onClick={() => setSelectedPartId(5)}>
                  <rect x="-65" y="-23" width="55" height="6" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
                  <rect x="10" y="-23" width="55" height="6" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
                </g>

                {/* FITTED COUPLING BOLT & NUT (Upper PCD - unsectioned per ISO 128) */}
                <g id="part-coupling-bolt-top" onClick={() => setSelectedPartId(6)}>
                  {/* Hex Bolt Shank through flanges */}
                  <rect x="-35" y="-68" width="65" height="16" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                  {/* Bolt Head left */}
                  <rect x="-47" y="-72" width="12" height="24" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                  {/* Nut right */}
                  <rect x="30" y="-72" width="14" height="24" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                </g>

                {/* Lower Coupling Bolt (Lower PCD) */}
                <g id="part-coupling-bolt-bottom" onClick={() => setSelectedPartId(6)}>
                  <rect x="-35" y="52" width="65" height="16" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                  <rect x="-47" y="48" width="12" height="24" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                  <rect x="30" y="48" width="14" height="24" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                </g>

                {/* Dimensions */}
                {showDimensions && (
                  <g id="flange-dimensions" opacity="0.85">
                    <line x1="-120" y1="-85" x2="-120" y2="85" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#dim-arrow-start)" markerEnd="url(#dim-arrow-end)" />
                    <text x="-130" y="4" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="end">Flange Ø170</text>
                    <text x="0" y="115" fill="#eab308" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      PCD Ø120 (4 x M16 FITTED BOLTS)
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* ========================================================================= */}
            {/* ASSEMBLY 3: SPLIT PLUMMER BLOCK (PEDESTAL BEARING)                        */}
            {/* ========================================================================= */}
            {selectedAssembly === 'PLUMMER_BLOCK' && (
              <g id="assembly-plummer-block" transform="translate(340, 260)">
                {/* Horizontal Centerline */}
                {showCenterlines && (
                  <line x1="-240" y1="0" x2="240" y2="0" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="16,3,4,3" />
                )}
                {/* Vertical Centerline */}
                {showCenterlines && (
                  <line x1="0" y1="-180" x2="0" y2="180" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="16,3,4,3" />
                )}

                {/* 1. CAST IRON BASE (Hatched at +45 deg) */}
                <g
                  id="part-pb-base"
                  transform={`translate(0, ${explodeDistance * 0.4})`}
                  onClick={() => setSelectedPartId(1)}
                  className="cursor-pointer"
                >
                  <path
                    d="M -160 90 L 160 90 L 160 70 L 65 70 L 50 35 L 35 35 L 35 0 L -35 0 L -35 35 L -50 35 L -65 70 L -160 70 Z"
                    fill={sectionType !== 'UNSECTIONED' ? 'url(#hatch-45-pos)' : '#1e293b'}
                    stroke={selectedPartId === 1 ? '#38bdf8' : '#94a3b8'}
                    strokeWidth="2"
                  />
                  {/* Hold down bolt slots */}
                  <rect x="-135" y="70" width="20" height="20" fill="#030712" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
                  <rect x="115" y="70" width="20" height="20" fill="#030712" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="-150" y="110" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    CAST IRON BASE [+45°]
                  </text>
                </g>

                {/* 2. SPLIT BUSH BOTTOM BRASS (Gunmetal 60 deg fine hatch) */}
                <g
                  id="part-pb-bush-bot"
                  transform={`translate(0, ${explodeDistance * 0.2})`}
                  onClick={() => setSelectedPartId(2)}
                  className="cursor-pointer"
                >
                  <path
                    d="M -30 0 A 30 30 0 0 0 30 0 L 25 0 A 25 25 0 0 1 -25 0 Z"
                    fill={sectionType !== 'UNSECTIONED' ? 'url(#hatch-60-bronze)' : '#f59e0b'}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                </g>

                {/* 3. SPLIT BUSH TOP BRASS (Gunmetal -60 deg fine hatch) */}
                <g
                  id="part-pb-bush-top"
                  transform={`translate(0, ${-explodeDistance * 0.2})`}
                  onClick={() => setSelectedPartId(3)}
                  className="cursor-pointer"
                >
                  <path
                    d="M -30 0 A 30 30 0 0 1 30 0 L 25 0 A 25 25 0 0 0 -25 0 Z"
                    fill={sectionType !== 'UNSECTIONED' ? 'url(#hatch-neg60-bronze)' : '#d97706'}
                    stroke="#d97706"
                    strokeWidth="1.5"
                  />
                  {/* Lubrication oil hole */}
                  <rect x="-3" y="-30" width="6" height="8" fill="#030712" stroke="#d97706" strokeWidth="1" />
                </g>

                {/* 4. SOLID SHAFT (Ø50mm - strictly UNSECTIONED) */}
                <g id="part-pb-shaft" onClick={() => setSelectedPartId(7)} className="cursor-pointer">
                  <circle cx="0" cy="0" r="25" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                  <text x="0" y="4" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Ø50 SHAFT
                  </text>
                </g>

                {/* 5. CAST IRON BEARING CAP (Hatched at -45 deg) */}
                <g
                  id="part-pb-cap"
                  transform={`translate(0, ${-explodeDistance * 0.5})`}
                  onClick={() => setSelectedPartId(4)}
                  className="cursor-pointer"
                >
                  <path
                    d="M -65 0 L -65 -25 L -45 -55 L 45 -55 L 65 -25 L 65 0 L 35 0 L 35 -32 L -35 -32 L -35 0 Z"
                    fill={sectionType !== 'UNSECTIONED' ? 'url(#hatch-45-neg)' : '#1e293b'}
                    stroke={selectedPartId === 4 ? '#38bdf8' : '#cbd5e1'}
                    strokeWidth="2"
                  />
                  {/* Central oil cup boss */}
                  <rect x="-12" y="-68" width="24" height="13" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
                  <circle cx="0" cy="-62" r="3" fill="#030712" stroke="#38bdf8" strokeWidth="1" />
                  <text x="0" y="-76" fill="#cbd5e1" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                    CAST IRON CAP [-45°]
                  </text>
                </g>

                {/* 6. HOLDING DOWN STUDS & NUTS (Left & Right - Unsectioned) */}
                <g id="part-pb-studs" onClick={() => setSelectedPartId(5)}>
                  {/* Left Stud & Lock Nuts */}
                  <rect x="-55" y="-60" width="12" height="100" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="-59" y="-62" width="20" height="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="-59" y="-75" width="20" height="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Right Stud & Lock Nuts */}
                  <rect x="43" y="-60" width="12" height="100" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="39" y="-62" width="20" height="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="39" y="-75" width="20" height="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* 4B. RIGHT SIDEBAR: BILL OF MATERIALS (BOM) & ISO 128 TECHNICAL RULES */}
        <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bill of Materials (BOM)</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              ISO 7573
            </span>
          </div>

          {/* Parts List */}
          <div className="p-3 space-y-2">
            {currentParts.map((part) => {
              const isSelected = selectedPartId === part.itemNo;
              return (
                <div
                  key={part.itemNo}
                  onClick={() => setSelectedPartId(isSelected ? null : part.itemNo)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-950/40 ring-1 ring-blue-500'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold font-mono shrink-0"
                        style={{ backgroundColor: `${part.color}20`, color: part.color, border: `1px solid ${part.color}60` }}
                      >
                        {part.itemNo}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{part.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{part.standard}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      QTY: {part.qty}
                    </span>
                  </div>

                  {/* Section status pill */}
                  <div className="mt-2 flex items-center justify-between gap-2 text-[10px]">
                    <span className="text-slate-400 font-medium">Material: <strong className="text-slate-200">{part.material}</strong></span>
                    {part.isUnsectionedShaftOrFastener ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                        Unsectioned (ISO 128)
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                        {part.hatchAngle}° Hatch ({part.hatchPitch}mm)
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed space-y-1">
                      <p>{part.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* WAEC & NERDC Examination Rubric Card */}
          <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-800/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>WAEC / NERDC Marking Rubric</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
              <li>
                <strong>Shafts/Bolts Left Unsectioned (5 Marks):</strong> Penalized heavily if solid shafts or bolts are hatched.
              </li>
              <li>
                <strong>Reversed Hatching (4 Marks):</strong> Adjacent components in contact must reverse hatching angle (45° vs 135°).
              </li>
              <li>
                <strong>Hatching Line Weights (3 Marks):</strong> Continuous Thin lines (0.25mm) with consistent spacing.
              </li>
              <li>
                <strong>Centerlines (3 Marks):</strong> Chain Thin (long-short dash) extending 10mm beyond part boundaries.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
