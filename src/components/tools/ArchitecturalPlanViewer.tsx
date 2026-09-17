import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  Home,
  Layers,
  Ruler,
  Zap,
  Droplets,
  Eye,
  FileDown,
  Printer,
  Maximize2,
  Minimize2,
  X,
  RotateCcw,
  CheckCircle2,
  Shield,
  Info,
  ChevronRight,
  Split,
  ZoomIn,
  ZoomOut,
  Sliders,
  HelpCircle,
  Building,
  Check
} from 'lucide-react';

export type ArchitecturalViewMode = 'FLOOR_PLAN' | 'WALL_SECTION' | 'SPLIT_VIEW';
export type DraftingTheme = 'DARK_CAD' | 'BLUEPRINT' | 'LIGHT_SHEET';

export interface ArchitecturalPlanViewerProps {
  initialView?: ArchitecturalViewMode;
  isOpen?: boolean;
  onClose?: () => void;
  viewMode?: 'MODAL' | 'EMBEDDED' | 'FULLSCREEN';
  className?: string;
}

interface WallSectionElement {
  id: string;
  name: string;
  dimension: string;
  material: string;
  mixRatio?: string;
  examNote: string;
  isoLineWeight: string;
  yRange: [number, number]; // approx canvas y coord
}

export const ArchitecturalPlanViewer: React.FC<ArchitecturalPlanViewerProps> = ({
  initialView = 'SPLIT_VIEW',
  isOpen = true,
  onClose,
  viewMode = 'MODAL',
  className = ''
}) => {
  // Main view state
  const [activeView, setActiveView] = useState<ArchitecturalViewMode>(initialView);
  const [theme, setTheme] = useState<DraftingTheme>('DARK_CAD');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(viewMode === 'FULLSCREEN');
  const [selectedSectionElement, setSelectedSectionElement] = useState<string | null>('dpc');

  // Toggleable Layer States for Floor Plan
  const [layerDimensions, setLayerDimensions] = useState<boolean>(true);
  const [layerWallTypes, setLayerWallTypes] = useState<boolean>(true);
  const [layerElectrical, setLayerElectrical] = useState<boolean>(true);
  const [layerPlumbing, setLayerPlumbing] = useState<boolean>(true);
  const [layerGridAxes, setLayerGridAxes] = useState<boolean>(true);
  const [layerRoomLabels, setLayerRoomLabels] = useState<boolean>(true);

  // SVG references
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Wall Section Technical Specifications to WAEC/NERDC Standards
  const wallElements: Record<string, WallSectionElement> = useMemo(() => ({
    footing: {
      id: 'footing',
      name: 'Concrete Strip Foundation Footing',
      dimension: '675mm Wide x 225mm Deep (3T x T)',
      material: 'Plain Mass Concrete',
      mixRatio: '1:3:6 (1 Cement : 3 Sand : 6 Coarse Aggregate)',
      examNote: 'Compulsory WAEC foundation calculation: Width = 3 x wall thickness = 3 x 225 = 675mm. Projection from wall = T = 225mm. Depth = T = 225mm. Render with coarse stone and sand stipple hatch.',
      isoLineWeight: 'Continuous Thick (0.6mm) profile, Continuous Thin (0.25mm) hatch',
      yRange: [460, 520]
    },
    hardcore: {
      id: 'hardcore',
      name: 'Compacted Hardcore Bed',
      dimension: '200mm – 300mm Thick',
      material: 'Well-compacted broken stones / bricks / gravel',
      mixRatio: 'Clean aggregate free from clay and loam',
      examNote: 'Provides solid unyielding base for oversite concrete and prevents capillary rise of groundwater. Drawn using irregular polygonal stone shapes tightly nested together.',
      isoLineWeight: 'Continuous Thin (0.25mm) irregular outlines',
      yRange: [380, 440]
    },
    blinding: {
      id: 'blinding',
      name: 'Sand / Lean Concrete Blinding',
      dimension: '50mm Thick',
      material: 'Coarse sand or 1:4:8 lean concrete',
      mixRatio: '1:4:8 Lean Mix',
      examNote: 'Smooths the rough hardcore surface to prevent sharp aggregate stones from puncturing the polythene Damp Proof Membrane (DPM).',
      isoLineWeight: 'Continuous Thin (0.25mm)',
      yRange: [365, 380]
    },
    dpm: {
      id: 'dpm',
      name: 'Damp Proof Membrane (DPM)',
      dimension: '1000 Gauge (0.25mm polythene sheet)',
      material: 'Heavy-duty Polyethylene sheeting',
      mixRatio: 'Continuous impervious membrane with 150mm taped laps',
      examNote: 'Laid over sand blinding bed, continuous under the concrete floor slab and linked directly with the wall DPC to form a watertight barrier.',
      isoLineWeight: 'Continuous Thick (0.7mm) prominent dashed line',
      yRange: [360, 365]
    },
    slab: {
      id: 'slab',
      name: 'Oversite Concrete Floor Slab',
      dimension: '150mm Depth',
      material: 'Reinforced Concrete with BRC steel mesh fabric',
      mixRatio: '1:2:4 (1 Cement : 2 Sand : 4 Granite Aggregate)',
      examNote: 'Provides structural floor platform. Spanned across foundation sleeper walls. Rendered with triangle aggregates and fine sand dots.',
      isoLineWeight: 'Continuous Thick (0.6mm) cut outline',
      yRange: [320, 360]
    },
    screed: {
      id: 'screed',
      name: 'Cement-Sand Floor Screed & Tile Finish',
      dimension: '25mm – 32mm Thick',
      material: 'Cement mortar with vitrified ceramic floor tiles',
      mixRatio: '1:3 (1 Cement : 3 Sharp Sand)',
      examNote: 'Finished Floor Level (FFL) datum marked here. Provides smooth horizontal walking surface.',
      isoLineWeight: 'Continuous Medium (0.35mm)',
      yRange: [310, 320]
    },
    dpc: {
      id: 'dpc',
      name: 'Damp Proof Course (DPC)',
      dimension: '225mm Width (Full wall thickness)',
      material: 'Bituminous felt / Bitumen polymer membrane',
      mixRatio: 'Class A impervious bituminous membrane (BS 743)',
      examNote: 'CRITICAL WAEC MARK: Must be situated at minimum 150mm ABOVE the Finished Ground Level (GL). Drawn as a thick, solid black line across the entire 225mm wall.',
      isoLineWeight: 'Extra Thick Solid (1.0mm) Solid Filled',
      yRange: [290, 300]
    },
    wall_masonry: {
      id: 'wall_masonry',
      name: 'External Load-Bearing Sandcrete Wall',
      dimension: '225mm Thick (9 inches)',
      material: 'Hollow/solid sandcrete blockwork with 15mm cement-sand render',
      mixRatio: '1:6 (1 Cement : 6 Sharp Sand for blocks)',
      examNote: 'Load-bearing superstructure masonry wall. Shown cut in section with standard diagonal hatch lines at 45° spaced 3mm apart.',
      isoLineWeight: 'Continuous Thick (0.6mm) edges, Continuous Thin (0.25mm) hatching',
      yRange: [160, 290]
    },
    cill: {
      id: 'cill',
      name: 'Precast Weathered Concrete Window Cill',
      dimension: '150mm High x 300mm Wide with 50mm overhang',
      material: 'Precast concrete with continuous throat/drip groove',
      mixRatio: '1:2:4 Concrete',
      examNote: 'Weathered top surface slopes outward to shed rainwater. Underside features a drip groove to prevent water tracking back into the wall.',
      isoLineWeight: 'Continuous Thick (0.6mm)',
      yRange: [220, 240]
    },
    lintel: {
      id: 'lintel',
      name: 'Reinforced Concrete Lintel',
      dimension: '225mm Wide x 150mm Deep (225mm bearing length)',
      material: 'Reinforced Concrete (Grade 25) with high yield steel rebars',
      mixRatio: '1:2:4 Concrete with 2x Y12 tension bars and R6 shear links',
      examNote: 'Spans across door and window openings to support the masonry load above. Minimum bearing length onto wall is 150mm – 225mm.',
      isoLineWeight: 'Continuous Thick (0.6mm) with solid rebar circles',
      yRange: [130, 160]
    },
    ring_beam: {
      id: 'ring_beam',
      name: 'Reinforced Concrete Ring Beam / Tie Beam',
      dimension: '225mm Wide x 225mm Deep',
      material: 'Reinforced Concrete Grade 25',
      mixRatio: '1:2:4 Concrete with 4x Y12 longitudinal bars and R6 links',
      examNote: 'Continuous horizontal perimeter beam tying all walls together at roof level to resist lateral wind thrust and seismic vibrations.',
      isoLineWeight: 'Continuous Thick (0.6mm) cut outline',
      yRange: [100, 130]
    },
    wall_plate: {
      id: 'wall_plate',
      name: 'Timber Wall Plate with Holding Down Ragbolt',
      dimension: '100mm x 75mm (4" x 3")',
      material: 'Treated Hardwood (Iroko / Mahogany / Obeche)',
      mixRatio: 'Treated with solignum / creosote wood preservative',
      examNote: 'Anchored to ring beam using M12 steel holding down ragbolts embedded 150mm into concrete. Timber cross-section indicated with diagonal cross stitch.',
      isoLineWeight: 'Continuous Medium (0.35mm) with diagonal cross lines',
      yRange: [75, 100]
    },
    roof_truss: {
      id: 'roof_truss',
      name: 'Timber King Post Roof Truss & Eaves',
      dimension: 'Rafter: 100x50mm, Tie Beam: 100x50mm, Purlins: 75x50mm',
      material: 'Structural Softwood / Hardwood with corrugated aluminium roofing sheets',
      mixRatio: 'Purlin spacing 900mm c/c with 0.55mm long-span aluminium sheets',
      examNote: 'Shows 600mm eaves overhang, 250x25mm painted timber fascia board, aluminium roof sheets, and 12.5mm ceiling board nailed to brandering strips.',
      isoLineWeight: 'Continuous Thick (0.6mm) roof profile, Continuous Thin (0.25mm) timber members',
      yRange: [20, 75]
    }
  }), []);

  // Selected element object
  const currentElement = selectedSectionElement ? wallElements[selectedSectionElement] : null;

  // Export SVG handler
  const handleExportSVG = useCallback(() => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ISO-4157-Architectural-Plan-${activeView}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [activeView]);

  // Print sheet handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      id="architectural-plan-viewer"
      className={`flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden h-full w-full ${
        isFullscreen ? 'fixed inset-0 z-50' : 'relative'
      } ${className}`}
    >
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="h-14 px-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-sm">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">Architectural Working Drawings & Plan Viewer</h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                ISO 4157 / NERDC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Residential Floor Plan Layers & Detailed Foundation-to-Eaves Wall Section • WAEC SS3 Term 2 & 3
            </p>
          </div>
        </div>

        {/* Center: View Mode Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            id="tab-view-floor-plan"
            onClick={() => setActiveView('FLOOR_PLAN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'FLOOR_PLAN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Floor Plan (1:50)</span>
          </button>
          <button
            id="tab-view-wall-section"
            onClick={() => setActiveView('WALL_SECTION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'WALL_SECTION'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wall Section (1:20)</span>
          </button>
          <button
            id="tab-view-split"
            onClick={() => setActiveView('SPLIT_VIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'SPLIT_VIEW'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Split Screen</span>
          </button>
        </div>

        {/* Right Actions: SVG Download, Print, Fullscreen, Close */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-arch-svg"
            onClick={handleExportSVG}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Download ISO 5457 A3 Architectural Sheet (SVG)"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Download SVG</span>
          </button>

          <button
            id="btn-print-arch-sheet"
            onClick={handlePrint}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Print Drawing Sheet for Board Practice"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            id="btn-toggle-arch-fullscreen"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              id="btn-close-arch-viewer"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 transition-colors ml-1"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. LAYER TOGGLE SUB-TOOLBAR */}
      <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Plan Layers:</span>
          </span>

          <button
            id="toggle-layer-dimensions"
            onClick={() => setLayerDimensions(!layerDimensions)}
            className={`px-2.5 py-1 rounded-md font-medium text-[11px] flex items-center gap-1.5 border transition-all ${
              layerDimensions
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <Ruler className="w-3 h-3" />
            <span>Dimensions & Axes</span>
          </button>

          <button
            id="toggle-layer-walltypes"
            onClick={() => setLayerWallTypes(!layerWallTypes)}
            className={`px-2.5 py-1 rounded-md font-medium text-[11px] flex items-center gap-1.5 border transition-all ${
              layerWallTypes
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <div className="w-2.5 h-2.5 bg-amber-400/80 rounded-sm" />
            <span>Wall Types (225/150mm)</span>
          </button>

          <button
            id="toggle-layer-electrical"
            onClick={() => setLayerElectrical(!layerElectrical)}
            className={`px-2.5 py-1 rounded-md font-medium text-[11px] flex items-center gap-1.5 border transition-all ${
              layerElectrical
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>Electrical (ISO 60617)</span>
          </button>

          <button
            id="toggle-layer-plumbing"
            onClick={() => setLayerPlumbing(!layerPlumbing)}
            className={`px-2.5 py-1 rounded-md font-medium text-[11px] flex items-center gap-1.5 border transition-all ${
              layerPlumbing
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span>Plumbing & Drainage</span>
          </button>
        </div>

        {/* Theme and Scale Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setTheme('DARK_CAD')}
              className={`px-2 py-0.5 rounded ${theme === 'DARK_CAD' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
            >
              Dark CAD
            </button>
            <button
              onClick={() => setTheme('BLUEPRINT')}
              className={`px-2 py-0.5 rounded ${theme === 'BLUEPRINT' ? 'bg-blue-900 text-cyan-200 font-bold' : 'text-slate-400'}`}
            >
              Blueprint
            </button>
            <button
              onClick={() => setTheme('LIGHT_SHEET')}
              className={`px-2 py-0.5 rounded ${theme === 'LIGHT_SHEET' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-400'}`}
            >
              White Sheet
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] text-slate-300 px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1.0)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. COMPLIANCE & SYMBOL BAR */}
      <div className="px-4 py-1.5 bg-emerald-950/30 border-b border-emerald-900/30 flex items-center justify-between text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">NERDC / WAEC Building Standards:</strong> Foundation Strip Footing (3T x T) • DPC ≥ 150mm above GL • Ring Beam at Eaves • Scale 1:50 & 1:20
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 hidden lg:flex">
          <span>X-X: Section Cutting Plane</span>
          <span>Walls: 225mm External, 150mm Internal</span>
          <span>DPC: Bituminous Felt Impenetrable Barrier</span>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE: CANVAS + RIGHT DETAIL INSPECTOR */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
        {/* 4A. MAIN VECTOR CAD CANVAS */}
        <div
          className={`flex-1 relative overflow-hidden flex items-center justify-center p-2 transition-colors ${
            theme === 'DARK_CAD'
              ? 'bg-slate-950'
              : theme === 'BLUEPRINT'
              ? 'bg-[#002244]'
              : 'bg-slate-100'
          }`}
        >
          <svg
            ref={svgRef}
            id="iso-architectural-svg-canvas"
            viewBox="0 0 1000 650"
            className="w-full h-full max-h-[820px] object-contain drop-shadow-xl"
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.15s ease-out'
            }}
          >
            <defs>
              {/* Hatch for Hardcore (Broken stone polygon hatch) */}
              <pattern id="hatch-hardcore-stones" width="30" height="24" patternUnits="userSpaceOnUse">
                <polygon points="2,2 12,5 10,14 2,12" fill="none" stroke="#64748b" strokeWidth="0.8" />
                <polygon points="14,3 26,2 24,11 16,10" fill="none" stroke="#64748b" strokeWidth="0.8" />
                <polygon points="5,15 15,16 12,23 3,21" fill="none" stroke="#64748b" strokeWidth="0.8" />
                <polygon points="18,13 28,15 25,23 16,21" fill="none" stroke="#64748b" strokeWidth="0.8" />
              </pattern>

              {/* Concrete Stipple & Triangular Aggregates */}
              <pattern id="hatch-concrete-mix" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="4,4 8,4 6,8" fill="#94a3b8" />
                <polygon points="14,12 17,12 15,16" fill="#94a3b8" />
                <circle cx="12" cy="5" r="0.8" fill="#cbd5e1" />
                <circle cx="3" cy="15" r="0.8" fill="#cbd5e1" />
                <circle cx="17" cy="18" r="0.8" fill="#cbd5e1" />
              </pattern>

              {/* Sandcrete Block Hatch (45 deg lines) */}
              <pattern id="hatch-masonry" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" strokeWidth="0.75" />
              </pattern>

              {/* Earth Hatch (Three short lines and blank space) */}
              <pattern id="hatch-earth-ground" width="16" height="16" patternUnits="userSpaceOnUse">
                <line x1="0" y1="4" x2="6" y2="4" stroke="#78716c" strokeWidth="0.8" />
                <line x1="1" y1="7" x2="5" y2="7" stroke="#78716c" strokeWidth="0.8" />
                <line x1="8" y1="12" x2="14" y2="12" stroke="#78716c" strokeWidth="0.8" />
                <line x1="9" y1="15" x2="13" y2="15" stroke="#78716c" strokeWidth="0.8" />
              </pattern>

              {/* Timber End Grain Hatch (Diagonal Cross) */}
              <pattern id="hatch-timber-cross" width="12" height="12" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="12" y2="12" stroke="#f59e0b" strokeWidth="0.8" />
                <line x1="0" y1="12" x2="12" y2="0" stroke="#f59e0b" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* A3 Engineering Drawing Border */}
            <rect
              x="15"
              y="15"
              width="970"
              height="620"
              fill={theme === 'DARK_CAD' ? '#090d16' : theme === 'BLUEPRINT' ? '#001a35' : '#ffffff'}
              stroke={theme === 'LIGHT_SHEET' ? '#94a3b8' : '#334155'}
              strokeWidth="2"
              rx="4"
            />
            <rect
              x="25"
              y="25"
              width="950"
              height="600"
              fill={theme === 'DARK_CAD' ? '#030712' : theme === 'BLUEPRINT' ? '#001428' : '#f8fafc'}
              stroke={theme === 'LIGHT_SHEET' ? '#cbd5e1' : '#1e293b'}
              strokeWidth="1"
            />

            {/* ISO 7200 Title Block */}
            <g id="arch-title-block" transform="translate(680, 525)">
              <rect x="0" y="0" width="280" height="90" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
              <line x1="0" y1="26" x2="280" y2="26" stroke="#334155" strokeWidth="0.8" />
              <line x1="0" y1="52" x2="280" y2="52" stroke="#334155" strokeWidth="0.8" />
              <line x1="140" y1="26" x2="140" y2="90" stroke="#334155" strokeWidth="0.8" />

              <text x="10" y="18" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">
                DRAFTHANDS ARCHITECTURAL ACADEMY
              </text>
              <text x="10" y="42" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                2-BEDROOM RESIDENTIAL BUNGALOW
              </text>
              <text x="10" y="70" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                {activeView === 'FLOOR_PLAN' ? 'FLOOR PLAN (SCALE 1:50)' : activeView === 'WALL_SECTION' ? 'WALL SECTION (SCALE 1:20)' : 'SPLIT WORKING DRAWING'}
              </text>
              <text x="10" y="82" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                STANDARD: ISO 4157 / NERDC
              </text>

              <text x="150" y="42" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                CLIENT: WAEC TECH DRAWING
              </text>
              <text x="150" y="62" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                DRAWN BY: SS3 DRAFTHAND
              </text>
              <text x="150" y="82" fill="#10b981" fontSize="8" fontFamily="sans-serif">
                PASSED: NERDC UNIT 2
              </text>
            </g>

            {/* ========================================================================= */}
            {/* VIEW A: RESIDENTIAL FLOOR PLAN (ISO 4157)                                  */}
            {/* Displayed in FLOOR_PLAN mode or SPLIT_VIEW (Left side)                    */}
            {/* ========================================================================= */}
            {(activeView === 'FLOOR_PLAN' || activeView === 'SPLIT_VIEW') && (
              <g
                id="arch-floor-plan-group"
                transform={activeView === 'SPLIT_VIEW' ? 'translate(40, 45) scale(0.92)' : 'translate(140, 45) scale(1.18)'}
              >
                {/* Title */}
                <text x="240" y="25" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                  GROUND FLOOR PLAN (SCALE 1:50)
                </text>

                {/* Grid Axes: Vertical (1, 2, 3) and Horizontal (A, B, C) */}
                {layerGridAxes && (
                  <g id="grid-axes" opacity="0.6">
                    {/* Axis 1 */}
                    <line x1="50" y1="40" x2="50" y2="480" stroke="#64748b" strokeWidth="0.6" strokeDasharray="6,2,2,2" />
                    <circle cx="50" cy="35" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                    <text x="50" y="38" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">1</text>

                    {/* Axis 2 */}
                    <line x1="260" y1="40" x2="260" y2="480" stroke="#64748b" strokeWidth="0.6" strokeDasharray="6,2,2,2" />
                    <circle cx="260" cy="35" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                    <text x="260" y="38" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">2</text>

                    {/* Axis 3 */}
                    <line x1="430" y1="40" x2="430" y2="480" stroke="#64748b" strokeWidth="0.6" strokeDasharray="6,2,2,2" />
                    <circle cx="430" cy="35" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                    <text x="430" y="38" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">3</text>

                    {/* Axis A */}
                    <line x1="40" y1="60" x2="440" y2="60" stroke="#64748b" strokeWidth="0.6" strokeDasharray="6,2,2,2" />
                    <circle cx="30" cy="60" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                    <text x="30" y="63" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">A</text>

                    {/* Axis B */}
                    <line x1="40" y1="260" x2="440" y2="260" stroke="#64748b" strokeWidth="0.6" strokeDasharray="6,2,2,2" />
                    <circle cx="30" cy="260" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                    <text x="30" y="263" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">B</text>

                    {/* Axis C */}
                    <line x1="40" y1="460" x2="440" y2="460" stroke="#64748b" strokeWidth="0.6" strokeDasharray="6,2,2,2" />
                    <circle cx="30" cy="460" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                    <text x="30" y="463" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">C</text>
                  </g>
                )}

                {/* 1. LOAD-BEARING EXTERNAL WALLS (225mm) & PARTITION WALLS (150mm) */}
                <g id="walls-structure">
                  {/* Outer boundary 225mm wall */}
                  <rect
                    x="50"
                    y="60"
                    width="380"
                    height="400"
                    fill={layerWallTypes ? '#0f172a' : '#1e293b'}
                    stroke="#10b981"
                    strokeWidth="3.5"
                  />
                  {/* Interior cutouts for rooms */}
                  {/* Living / Dining Room */}
                  <rect x="65" y="75" width="180" height="230" fill="#030712" stroke="#10b981" strokeWidth="2" />
                  {/* Master Bedroom */}
                  <rect x="260" y="75" width="155" height="190" fill="#030712" stroke="#10b981" strokeWidth="2" />
                  {/* Master En-suite Bath */}
                  <rect x="330" y="275" width="85" height="90" fill="#030712" stroke="#10b981" strokeWidth="1.5" />
                  {/* Bedroom 2 */}
                  <rect x="260" y="375" width="155" height="70" fill="#030712" stroke="#10b981" strokeWidth="2" />
                  {/* Kitchen & Store */}
                  <rect x="65" y="320" width="180" height="125" fill="#030712" stroke="#10b981" strokeWidth="2" />
                </g>

                {/* 2. DOORS & WINDOWS (ISO 4157 Conventions) */}
                <g id="doors-and-windows">
                  {/* Main Entrance Door D1 (900mm swing arc) */}
                  <line x1="120" y1="60" x2="120" y2="85" stroke="#f59e0b" strokeWidth="2" />
                  <path d="M 120 60 A 25 25 0 0 1 145 85" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="130" y="55" fill="#f59e0b" fontSize="8" fontWeight="bold">D1</text>

                  {/* Master Bedroom Door D2 (800mm) */}
                  <line x1="260" y1="180" x2="282" y2="180" stroke="#f59e0b" strokeWidth="2" />
                  <path d="M 260 180 A 22 22 0 0 1 282 202" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="270" y="175" fill="#f59e0b" fontSize="8" fontWeight="bold">D2</text>

                  {/* Kitchen Back Door D3 */}
                  <line x1="50" y1="360" x2="72" y2="360" stroke="#f59e0b" strokeWidth="2" />
                  <path d="M 50 360 A 22 22 0 0 1 72 382" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="35" y="365" fill="#f59e0b" fontSize="8" fontWeight="bold">D3</text>

                  {/* Windows: Double continuous thin line with sill */}
                  {/* Living Room Window W1 (1800 x 1200mm) */}
                  <rect x="80" y="56" width="50" height="8" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1" />
                  <text x="100" y="50" fill="#38bdf8" fontSize="8" fontWeight="bold">W1</text>

                  {/* Master Bed Window W1 */}
                  <rect x="310" y="56" width="50" height="8" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1" />
                  <text x="330" y="50" fill="#38bdf8" fontSize="8" fontWeight="bold">W1</text>

                  {/* Bedroom 2 Window W2 (1200 x 1200mm) */}
                  <rect x="426" y="390" width="8" height="40" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1" />
                  <text x="438" y="415" fill="#38bdf8" fontSize="8" fontWeight="bold">W2</text>

                  {/* Kitchen Window W2 */}
                  <rect x="46" y="390" width="8" height="40" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1" />
                  <text x="30" y="415" fill="#38bdf8" fontSize="8" fontWeight="bold">W2</text>
                </g>

                {/* 3. ROOM LABELS & AREAS */}
                {layerRoomLabels && (
                  <g id="room-labels" opacity="0.9">
                    {/* Living Room */}
                    <text x="155" y="160" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      LIVING / DINING
                    </text>
                    <text x="155" y="176" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      5400 x 3600 (19.4 m²)
                    </text>
                    <text x="155" y="188" fill="#64748b" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
                      FFL +0.150 [TILES]
                    </text>

                    {/* Master Bedroom */}
                    <text x="335" y="150" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      MASTER BEDROOM
                    </text>
                    <text x="335" y="164" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      4200 x 3600 (15.1 m²)
                    </text>

                    {/* Master Bath */}
                    <text x="372" y="315" fill="#e2e8f0" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      EN-SUITE
                    </text>
                    <text x="372" y="326" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                      2.4 m²
                    </text>

                    {/* Kitchen */}
                    <text x="155" y="380" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      KITCHEN
                    </text>
                    <text x="155" y="394" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      3600 x 2700 (9.7 m²)
                    </text>

                    {/* Bedroom 2 */}
                    <text x="335" y="415" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      BEDROOM 2
                    </text>
                  </g>
                )}

                {/* 4. ELECTRICAL LAYER (ISO 60617 / BS 3939) */}
                {layerElectrical && (
                  <g id="layer-electrical" opacity="0.95">
                    {/* Living Room Center Light Point (Circle with Cross) */}
                    <g transform="translate(155, 125)">
                      <circle cx="0" cy="0" r="5" fill="none" stroke="#eab308" strokeWidth="1.2" />
                      <line x1="-5" y1="-5" x2="5" y2="5" stroke="#eab308" strokeWidth="1.2" />
                      <line x1="-5" y1="5" x2="5" y2="-5" stroke="#eab308" strokeWidth="1.2" />
                    </g>
                    {/* Ceiling Fan Symbol */}
                    <g transform="translate(155, 220)">
                      <circle cx="0" cy="0" r="3" fill="#eab308" />
                      <line x1="-12" y1="0" x2="12" y2="0" stroke="#eab308" strokeWidth="1" />
                      <line x1="0" y1="-12" x2="0" y2="12" stroke="#eab308" strokeWidth="1" />
                    </g>
                    {/* Master Bedroom Light */}
                    <g transform="translate(335, 125)">
                      <circle cx="0" cy="0" r="5" fill="none" stroke="#eab308" strokeWidth="1.2" />
                      <line x1="-5" y1="-5" x2="5" y2="5" stroke="#eab308" strokeWidth="1.2" />
                      <line x1="-5" y1="5" x2="5" y2="-5" stroke="#eab308" strokeWidth="1.2" />
                    </g>
                    {/* 1-Way Switch at Entrance (S1) */}
                    <circle cx="110" cy="85" r="2.5" fill="#eab308" />
                    <line x1="110" y1="85" x2="116" y2="80" stroke="#eab308" strokeWidth="1" />
                    <text x="100" y="95" fill="#eab308" fontSize="7" fontWeight="bold">S1</text>
                    {/* Curved Switch Wiring Line */}
                    <path d="M 112 85 Q 130 100 150 120" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3,2" />

                    {/* 13A Socket Outlets (Semicircle on wall) */}
                    <path d="M 65 150 A 6 6 0 0 1 65 162" fill="none" stroke="#eab308" strokeWidth="1.2" />
                    <line x1="65" y1="156" x2="70" y2="156" stroke="#eab308" strokeWidth="1.2" />

                    {/* Consumer Unit / Distribution Board (DB) in Kitchen */}
                    <rect x="67" y="325" width="14" height="6" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
                    <text x="85" y="331" fill="#ef4444" fontSize="7" fontWeight="bold">DB</text>
                  </g>
                )}

                {/* 5. PLUMBING & DRAINAGE LAYER */}
                {layerPlumbing && (
                  <g id="layer-plumbing" opacity="0.95">
                    {/* En-suite WC (Water Closet with cistern) */}
                    <g transform="translate(390, 290)">
                      <rect x="0" y="0" width="14" height="8" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <ellipse cx="7" cy="16" rx="6" ry="8" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <text x="20" y="15" fill="#06b6d4" fontSize="7" fontWeight="bold">WC</text>
                    </g>
                    {/* Wash Hand Basin (WHB) */}
                    <g transform="translate(340, 280)">
                      <rect x="0" y="0" width="18" height="12" rx="3" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <circle cx="9" cy="6" r="1.5" fill="#06b6d4" />
                      <text x="0" y="-3" fill="#06b6d4" fontSize="7" fontWeight="bold">WHB</text>
                    </g>
                    {/* Kitchen Double Sink with Drainer */}
                    <g transform="translate(70, 420)">
                      <rect x="0" y="0" width="36" height="16" fill="none" stroke="#06b6d4" strokeWidth="1.2" />
                      <rect x="2" y="2" width="14" height="12" fill="none" stroke="#06b6d4" strokeWidth="0.8" />
                      <line x1="20" y1="4" x2="32" y2="4" stroke="#06b6d4" strokeWidth="0.8" />
                      <line x1="20" y1="8" x2="32" y2="8" stroke="#06b6d4" strokeWidth="0.8" />
                      <line x1="20" y1="12" x2="32" y2="12" stroke="#06b6d4" strokeWidth="0.8" />
                      <text x="40" y="12" fill="#06b6d4" fontSize="7" fontWeight="bold">SINK</text>
                    </g>
                    {/* External Inspection Chamber (IC) & 100mm Soil Waste Pipe */}
                    <rect x="440" y="295" width="16" height="16" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <text x="443" y="306" fill="#06b6d4" fontSize="7" fontWeight="bold">IC</text>
                    <line x1="404" y1="305" x2="440" y2="305" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,2" />
                  </g>
                )}

                {/* 6. DIMENSION LINES & OVERALL LABELS */}
                {layerDimensions && (
                  <g id="layer-dimensions" opacity="0.85">
                    {/* Overall Width (9600mm) */}
                    <line x1="50" y1="475" x2="430" y2="475" stroke="#38bdf8" strokeWidth="0.8" />
                    <line x1="50" y1="465" x2="50" y2="485" stroke="#64748b" strokeWidth="0.8" />
                    <line x1="430" y1="465" x2="430" y2="485" stroke="#64748b" strokeWidth="0.8" />
                    <text x="240" y="490" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      OVERALL WIDTH: 9600 mm
                    </text>
                  </g>
                )}

                {/* 7. SECTION CUTTING PLANE LINE X-X */}
                {/* Passes through external wall and window to generate Wall Section View */}
                <g id="cutting-plane-xx">
                  <line x1="25" y1="200" x2="455" y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="14,3,3,3" />
                  {/* Heavy ends */}
                  <line x1="25" y1="200" x2="55" y2="200" stroke="#ef4444" strokeWidth="3.5" />
                  <line x1="425" y1="200" x2="455" y2="200" stroke="#ef4444" strokeWidth="3.5" />
                  {/* View Direction Arrows pointing up towards North/Section */}
                  <line x1="35" y1="200" x2="35" y2="180" stroke="#ef4444" strokeWidth="2" />
                  <polygon points="32,180 38,180 35,172" fill="#ef4444" />
                  <text x="25" y="175" fill="#ef4444" fontSize="12" fontWeight="bold">X</text>

                  <line x1="445" y1="200" x2="445" y2="180" stroke="#ef4444" strokeWidth="2" />
                  <polygon points="442,180 448,180 445,172" fill="#ef4444" />
                  <text x="440" y="175" fill="#ef4444" fontSize="12" fontWeight="bold">X</text>

                  <text x="240" y="215" fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                    SECTION CUTTING PLANE X-X
                  </text>
                </g>
              </g>
            )}

            {/* ========================================================================= */}
            {/* VIEW B: DETAILED WALL SECTION (SCALE 1:20)                                 */}
            {/* Foundation Strip Footing to Roof Eaves Overhang                           */}
            {/* ========================================================================= */}
            {(activeView === 'WALL_SECTION' || activeView === 'SPLIT_VIEW') && (
              <g
                id="arch-wall-section-group"
                transform={activeView === 'SPLIT_VIEW' ? 'translate(510, 45) scale(0.95)' : 'translate(260, 45) scale(1.1)'}
              >
                {/* Title */}
                <text x="180" y="25" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                  SECTION X-X THROUGH EXTERNAL WALL (SCALE 1:20)
                </text>

                {/* 1. TIMBER KING POST ROOF TRUSS & EAVES OVERHANG */}
                <g
                  id="section-roof-truss"
                  onClick={() => setSelectedSectionElement('roof_truss')}
                  className="cursor-pointer"
                >
                  {/* Corrugated Roof Sheet (30 deg pitch) */}
                  <line x1="20" y1="35" x2="280" y2="-30" stroke="#38bdf8" strokeWidth="3" />
                  {/* Timber Rafter (100 x 50mm) */}
                  <line x1="30" y1="42" x2="275" y2="-22" stroke="#f59e0b" strokeWidth="4" />
                  {/* Timber Purlins (75 x 50mm) */}
                  <rect x="70" y="25" width="10" height="7" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
                  <rect x="150" y="5" width="10" height="7" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
                  <rect x="230" y="-15" width="10" height="7" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
                  {/* Tie Beam / Ceiling Joist (100 x 50mm) */}
                  <rect x="80" y="65" width="220" height="8" fill="#f59e0b" stroke="#000" strokeWidth="0.8" />
                  {/* Ceiling Board (12.5mm) */}
                  <line x1="80" y1="75" x2="300" y2="75" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Fascia Board (250 x 25mm) */}
                  <rect x="18" y="25" width="5" height="40" fill="#94a3b8" stroke="#000" strokeWidth="1" />

                  {/* Callout Indicator */}
                  <circle cx="40" cy="45" r="4" fill="#10b981" />
                  <line x1="40" y1="45" x2="-20" y2="45" stroke="#10b981" strokeWidth="0.8" />
                  <text x="-25" y="48" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="end">
                    600mm EAVES OVERHANG
                  </text>
                </g>

                {/* 2. TIMBER WALL PLATE (100 x 75mm) */}
                <g
                  id="section-wall-plate"
                  onClick={() => setSelectedSectionElement('wall_plate')}
                  className="cursor-pointer"
                >
                  <rect
                    x="115"
                    y="75"
                    width="25"
                    height="18"
                    fill="url(#hatch-timber-cross)"
                    stroke={selectedSectionElement === 'wall_plate' ? '#38bdf8' : '#f59e0b'}
                    strokeWidth="1.5"
                  />
                  {/* Holding down ragbolt anchor */}
                  <line x1="127" y1="75" x2="127" y2="115" stroke="#ef4444" strokeWidth="1.2" />
                  <circle cx="127" cy="115" r="2" fill="#ef4444" />
                </g>

                {/* 3. REINFORCED CONCRETE RING BEAM (225 x 225mm) */}
                <g
                  id="section-ring-beam"
                  onClick={() => setSelectedSectionElement('ring_beam')}
                  className="cursor-pointer"
                >
                  <rect
                    x="100"
                    y="93"
                    width="55"
                    height="45"
                    fill="url(#hatch-concrete-mix)"
                    stroke={selectedSectionElement === 'ring_beam' ? '#38bdf8' : '#10b981'}
                    strokeWidth="2"
                  />
                  {/* Longitudinal rebar dots */}
                  <circle cx="110" cy="103" r="2" fill="#ef4444" />
                  <circle cx="145" cy="103" r="2" fill="#ef4444" />
                  <circle cx="110" cy="128" r="2" fill="#ef4444" />
                  <circle cx="145" cy="128" r="2" fill="#ef4444" />
                  {/* Stirrup link */}
                  <rect x="108" y="101" width="39" height="29" fill="none" stroke="#ef4444" strokeWidth="0.8" />
                </g>

                {/* 4. REINFORCED CONCRETE LINTEL (225 x 150mm) */}
                <g
                  id="section-lintel"
                  onClick={() => setSelectedSectionElement('lintel')}
                  className="cursor-pointer"
                >
                  <rect
                    x="100"
                    y="138"
                    width="55"
                    height="32"
                    fill="url(#hatch-concrete-mix)"
                    stroke={selectedSectionElement === 'lintel' ? '#38bdf8' : '#10b981'}
                    strokeWidth="2"
                  />
                  {/* 2x Tension rebars */}
                  <circle cx="112" cy="162" r="2.2" fill="#ef4444" />
                  <circle cx="143" cy="162" r="2.2" fill="#ef4444" />
                </g>

                {/* 5. WINDOW OPENING & PRECAST WEATHERED CILL */}
                <g id="section-window-opening">
                  <rect x="100" y="170" width="55" height="40" fill="#030712" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
                  {/* Precast concrete cill with weathered slope & drip groove */}
                  <g
                    id="section-cill"
                    onClick={() => setSelectedSectionElement('cill')}
                    className="cursor-pointer"
                  >
                    <polygon
                      points="92,210 160,210 155,225 88,225"
                      fill="url(#hatch-concrete-mix)"
                      stroke={selectedSectionElement === 'cill' ? '#38bdf8' : '#10b981'}
                      strokeWidth="1.5"
                    />
                    {/* Drip groove */}
                    <circle cx="92" cy="222" r="1.5" fill="#030712" />
                  </g>
                </g>

                {/* 6. EXTERNAL SANDCRETE BLOCK WALL (225mm) */}
                <g
                  id="section-wall-masonry"
                  onClick={() => setSelectedSectionElement('wall_masonry')}
                  className="cursor-pointer"
                >
                  <rect
                    x="100"
                    y="225"
                    width="55"
                    height="75"
                    fill="url(#hatch-masonry)"
                    stroke={selectedSectionElement === 'wall_masonry' ? '#38bdf8' : '#10b981'}
                    strokeWidth="2"
                  />
                </g>

                {/* 7. DAMP PROOF COURSE (DPC) - CRITICAL WAEC ELEMENT */}
                {/* Rendered as prominent solid black impervious layer */}
                <g
                  id="section-dpc"
                  onClick={() => setSelectedSectionElement('dpc')}
                  className="cursor-pointer"
                >
                  <rect
                    x="98"
                    y="300"
                    width="59"
                    height="6"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1"
                  />
                  {/* Callout Indicator */}
                  <circle cx="127" cy="303" r="4" fill="#38bdf8" />
                  <line x1="131" y1="303" x2="220" y2="303" stroke="#38bdf8" strokeWidth="1" />
                  <text x="225" y="306" fill="#38bdf8" fontSize="10" fontWeight="bold">
                    DPC (≥ 150mm ABOVE GL)
                  </text>
                </g>

                {/* 8. FINISHED GROUND LEVEL (GL) & FLOOR LEVEL (FFL) */}
                <g id="ground-and-floor-levels">
                  {/* Ground Level GL Line & Earth Hatching (Left of wall) */}
                  <line x1="10" y1="340" x2="100" y2="340" stroke="#78716c" strokeWidth="2.5" />
                  <rect x="10" y="342" width="90" height="40" fill="url(#hatch-earth-ground)" />
                  {/* GL Inverted Triangle Datum */}
                  <polygon points="40,340 50,340 45,348" fill="#78716c" />
                  <text x="35" y="334" fill="#a8a29e" fontSize="9" fontWeight="bold">GL ±0.000</text>

                  {/* 150mm Minimum Rule Dimension between GL and DPC */}
                  <line x1="75" y1="340" x2="75" y2="303" stroke="#ef4444" strokeWidth="1" />
                  <line x1="70" y1="340" x2="80" y2="340" stroke="#ef4444" strokeWidth="1" />
                  <line x1="70" y1="303" x2="80" y2="303" stroke="#ef4444" strokeWidth="1" />
                  <text x="70" y="325" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="end">≥150</text>

                  {/* Finished Floor Level FFL Line (Right of wall) */}
                  <line x1="155" y1="306" x2="310" y2="306" stroke="#10b981" strokeWidth="2" />
                  <polygon points="200,306 210,306 205,298" fill="#10b981" />
                  <text x="200" y="294" fill="#10b981" fontSize="9" fontWeight="bold">FFL +0.150</text>
                </g>

                {/* 9. FLOOR SLAB, SCREED, DPM, BLINDING & HARDCORE BED */}
                <g id="section-floor-layers">
                  {/* Screed (25mm) */}
                  <g onClick={() => setSelectedSectionElement('screed')} className="cursor-pointer">
                    <rect x="155" y="306" width="155" height="8" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
                  </g>

                  {/* Concrete Floor Slab (150mm) */}
                  <g onClick={() => setSelectedSectionElement('slab')} className="cursor-pointer">
                    <rect
                      x="155"
                      y="314"
                      width="155"
                      height="35"
                      fill="url(#hatch-concrete-mix)"
                      stroke={selectedSectionElement === 'slab' ? '#38bdf8' : '#10b981'}
                      strokeWidth="1.8"
                    />
                  </g>

                  {/* DPM Polythene (Continuous under slab & turns up into DPC) */}
                  <g onClick={() => setSelectedSectionElement('dpm')} className="cursor-pointer">
                    <line x1="155" y1="349" x2="310" y2="349" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="6,2" />
                  </g>

                  {/* Sand Blinding (50mm) */}
                  <g onClick={() => setSelectedSectionElement('blinding')} className="cursor-pointer">
                    <rect x="155" y="350" width="155" height="15" fill="#334155" stroke="#475569" strokeWidth="0.8" />
                  </g>

                  {/* Hardcore Bed (300mm Compacted broken stone) */}
                  <g onClick={() => setSelectedSectionElement('hardcore')} className="cursor-pointer">
                    <rect
                      x="155"
                      y="365"
                      width="155"
                      height="75"
                      fill="url(#hatch-hardcore-stones)"
                      stroke={selectedSectionElement === 'hardcore' ? '#38bdf8' : '#64748b'}
                      strokeWidth="1.5"
                    />
                  </g>
                </g>

                {/* 10. SUBSTRUCTURE FOUNDATION WALL (225mm) */}
                <g id="section-foundation-wall">
                  <rect
                    x="100"
                    y="306"
                    width="55"
                    height="140"
                    fill="url(#hatch-masonry)"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  {/* Backfilled earth outside foundation wall */}
                  <rect x="10" y="380" width="90" height="66" fill="url(#hatch-earth-ground)" stroke="#78716c" strokeWidth="0.8" />
                </g>

                {/* 11. CONCRETE STRIP FOUNDATION FOOTING (675 x 225mm) */}
                {/* 3T x T proportion per WAEC/NERDC syllabus */}
                <g
                  id="section-footing"
                  onClick={() => setSelectedSectionElement('footing')}
                  className="cursor-pointer"
                >
                  <rect
                    x="45"
                    y="446"
                    width="165"
                    height="55"
                    fill="url(#hatch-concrete-mix)"
                    stroke={selectedSectionElement === 'footing' ? '#38bdf8' : '#10b981'}
                    strokeWidth="2.5"
                  />
                  {/* Footing dimension lines */}
                  <line x1="45" y1="510" x2="210" y2="510" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="45" y1="503" x2="45" y2="517" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="210" y1="503" x2="210" y2="517" stroke="#38bdf8" strokeWidth="1" />
                  <text x="127" y="525" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    WIDTH = 3T = 675 mm
                  </text>

                  {/* Footing Depth: T = 225mm */}
                  <line x1="220" y1="446" x2="220" y2="501" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="213" y1="446" x2="227" y2="446" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="213" y1="501" x2="227" y2="501" stroke="#38bdf8" strokeWidth="1" />
                  <text x="232" y="478" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    DEPTH = T = 225 mm
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* 4B. RIGHT SIDEBAR: TECHNICAL SPECIFICATIONS & EXAM RUBRICS */}
        <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {activeView === 'FLOOR_PLAN' ? 'Plan Specifications' : 'Wall Section Details'}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              WAEC COMPLIANT
            </span>
          </div>

          {/* Detailed Inspector for Selected Wall Section Element */}
          {currentElement && (
            <div className="p-3 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white leading-tight">{currentElement.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
                    {currentElement.dimension}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-medium">Material: </span>
                    <strong className="text-slate-200">{currentElement.material}</strong>
                  </div>
                  {currentElement.mixRatio && (
                    <div>
                      <span className="text-slate-400 font-medium">Standard Mix: </span>
                      <strong className="text-amber-300 font-mono">{currentElement.mixRatio}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 font-medium">ISO Line Weight: </span>
                    <span className="text-slate-300">{currentElement.isoLineWeight}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-emerald-300 block mb-1">WAEC Marking Guideline:</strong>
                  <p>{currentElement.examNote}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Select Buttons for Wall Section Components */}
          <div className="px-3 py-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">Interactive Section Elements:</span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {Object.entries(wallElements).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSectionElement(key)}
                  className={`p-1.5 rounded text-left truncate transition-colors ${
                    selectedSectionElement === key
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compulsory WAEC Exam Rubric Summary */}
          <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Compulsory WAEC 25-Mark Rubric</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
              <li>
                <strong>DPC Height (4 Marks):</strong> Must be at least 150mm above Ground Level (GL).
              </li>
              <li>
                <strong>Footing Proportion (5 Marks):</strong> Footing Width = 3 x wall thickness (3T = 675mm).
              </li>
              <li>
                <strong>Hatching Conventions (5 Marks):</strong> Correct symbols for concrete, hardcore, screed, and earth.
              </li>
              <li>
                <strong>Roof Connection (4 Marks):</strong> Wall plate anchored with ragbolts to ring beam/lintel.
              </li>
              <li>
                <strong>Line Weight Hierarchy (4 Marks):</strong> Thick profiles (0.6mm) vs thin hatch/dimension lines (0.25mm).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
