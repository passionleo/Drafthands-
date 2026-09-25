import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PenTool, 
  Slash, 
  Square, 
  Circle, 
  Compass, 
  Type, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff, 
  Grid3X3, 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Layers, 
  Sliders, 
  Ruler, 
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Move,
  Tv,
  Send,
  CheckCircle2,
  Spline as SplineIcon,
  ChevronDown
} from 'lucide-react';
import { DrawingTopic, LineWeightType } from '../../types/curriculum';
import { 
  WhiteboardTool, 
  WhiteboardLayer, 
  WhiteboardElement, 
  FreehandPoint, 
  OnScreenInstrument,
  WorkspaceMode,
  CadCommandHistoryEntry
} from '../../types/whiteboard';
import { TeacherAssignment } from '../../types/assignments';
import { DraftingInstrumentsOverlay } from './DraftingInstrumentsOverlay';
import { CadRibbon } from './CadRibbon';
import { CadCommandLine } from './CadCommandLine';
import { CadDynamicInputHud, DynamicDimensionValues } from './CadDynamicInputHud';
import { CadOnCanvasDynamicInput } from './CadOnCanvasDynamicInput';
import { AiPromptToCadBar } from '../drafting/AiPromptToCadBar';
import { CadErrorBoundary } from '../common/CadErrorBoundary';
import { ParsedCadResult } from '../../utils/aiCadPromptParser';
import { getTopicById, allCurriculumTopics } from '../../data/curriculumData';
import { ConstructionElement } from '../../types/curriculum';
import { AudioCadVoiceBar } from './AudioCadVoiceBar';

interface WhiteboardStudioProps {
  topic?: DrawingTopic;
  onClose?: () => void;
  initialTemplateElements?: any[];
  assignment?: TeacherAssignment;
  initialMode?: WorkspaceMode;
  onSubmitAssignment?: (elements: WhiteboardElement[], notes: string) => void;
  isEmbedded?: boolean;
  syncElements?: WhiteboardElement[];
  onElementsChange?: (elements: WhiteboardElement[]) => void;
  readOnly?: boolean;
}

export const WhiteboardStudio: React.FC<WhiteboardStudioProps> = ({
  topic,
  onClose,
  initialTemplateElements,
  assignment,
  initialMode = 'TRADITIONAL_BOARD',
  onSubmitAssignment,
  isEmbedded = false,
  syncElements,
  onElementsChange,
  readOnly = false
}) => {
  // Dual Workspace Mode State
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(initialMode);

  // Canvas Transform State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Tool & Layer State
  const [activeTool, setActiveTool] = useState<WhiteboardTool>('LINE');
  const [activeLayer, setActiveLayer] = useState<WhiteboardLayer>('CONSTRUCTION_2H');
  const [gridMode, setGridMode] = useState<'MILLIMETER' | 'ISOMETRIC' | 'POLAR' | 'NONE'>('MILLIMETER');
  const [snapGrid, setSnapGrid] = useState<boolean>(true);
  const [orthoLock, setOrthoLock] = useState<boolean>(false);
  const [showTraceTemplate, setShowTraceTemplate] = useState<boolean>(true);
  const [isAiPromptBarOpen, setIsAiPromptBarOpen] = useState<boolean>(true);

  // AutoCAD Dynamic Input State (DYN / F12)
  const [dynamicInputEnabled, setDynamicInputEnabled] = useState<boolean>(true);
  const [isAudioVoiceBarOpen, setIsAudioVoiceBarOpen] = useState<boolean>(false);

  const handleExecuteVoiceInstruction = (instruction: string) => {
    const lower = instruction.toLowerCase();
    setHistory(prev => [...(Array.isArray(prev) ? prev : []), [...elements]]);
    setRedoStack([]);

    let newEl: WhiteboardElement | null = null;
    const center = { x: 350 + Math.random() * 100, y: 250 + Math.random() * 100 };

    if (lower.includes('circle') || lower.includes('radius')) {
      newEl = {
        id: `voice-circle-${Date.now()}`,
        type: 'CIRCLE',
        layer: activeLayer,
        lineWeight: 'THIN_CONTINUOUS',
        color: getLayerColor(activeLayer),
        cx: center.x,
        cy: center.y,
        r: 65
      };
    } else if (lower.includes('rectangle') || lower.includes('box') || lower.includes('square')) {
      newEl = {
        id: `voice-rect-${Date.now()}`,
        type: 'RECTANGLE',
        layer: activeLayer,
        lineWeight: 'THIN_CONTINUOUS',
        color: getLayerColor(activeLayer),
        x1: center.x - 70,
        y1: center.y - 45,
        width: 140,
        height: 90
      };
    } else {
      newEl = {
        id: `voice-line-${Date.now()}`,
        type: 'LINE',
        layer: activeLayer,
        lineWeight: 'THIN_CONTINUOUS',
        color: getLayerColor(activeLayer),
        x1: center.x - 90,
        y1: center.y,
        x2: center.x + 90,
        y2: center.y
      };
    }

    if (newEl) {
      setElements(prev => [...prev, newEl]);
      setCadHistory(prev => [
        ...prev,
        {
          command: 'VOICE_TRANSCRIPTION',
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          status: 'SUCCESS',
          message: `Transcribed & constructed: "${instruction}"`
        }
      ]);
    }
  };
  const [dynamicValues, setDynamicValues] = useState<DynamicDimensionValues>({
    length: 100,
    angle: 0,
    radius: 50,
    diameter: 100,
    useDiameter: false,
    width: 100,
    height: 60,
    sides: 6,
    polygonRadius: 50,
    arcRadius: 60,
    arcStartAngle: 0,
    arcEndAngle: 180,
    ellipseRx: 80,
    ellipseRy: 40,
    offsetDistance: 15,
    autoAnnotateDimension: true
  });

  // Drawing Elements Stack
  const [elements, setElements] = useState<WhiteboardElement[]>(() => (syncElements && Array.isArray(syncElements) ? syncElements : []));
  const [history, setHistory] = useState<WhiteboardElement[][]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([]);
  const isRemoteSyncRef = useRef<boolean>(false);
  const lastEmittedJsonRef = useRef<string>('');

  // Synchronize when remote elements arrive from teacher or live session
  useEffect(() => {
    if (syncElements && Array.isArray(syncElements)) {
      const serialized = JSON.stringify(syncElements);
      if (serialized !== lastEmittedJsonRef.current) {
        isRemoteSyncRef.current = true;
        lastEmittedJsonRef.current = serialized;
        setElements(syncElements);
      }
    }
  }, [syncElements]);

  // When elements change locally, notify live classroom parent to broadcast
  useEffect(() => {
    if (isRemoteSyncRef.current) {
      isRemoteSyncRef.current = false;
      return;
    }
    const serialized = JSON.stringify(elements);
    if (serialized !== lastEmittedJsonRef.current) {
      lastEmittedJsonRef.current = serialized;
      if (onElementsChange) {
        onElementsChange(elements);
      }
    }
  }, [elements, onElementsChange]);

  // Active in-progress drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [freehandPoints, setFreehandPoints] = useState<FreehandPoint[]>([]);

  // Coordinate display
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activePressure, setActivePressure] = useState<number>(1);

  // Physical Drafting Instruments Suite
  const [instruments, setInstruments] = useState<OnScreenInstrument[]>([
    { id: 't-square', type: 'TEE_SQUARE', x: 80, y: 350, rotation: 0, scale: 1, visible: false },
    { id: 'set-square-30-60', type: 'SETSQUARE_30_60', x: 220, y: 220, rotation: 0, scale: 1, visible: false },
    { id: 'set-square-45', type: 'SETSQUARE_45', x: 420, y: 220, rotation: 0, scale: 1, visible: false },
    { id: 'scale-rule', type: 'SCALE_RULE', x: 180, y: 480, rotation: 0, scale: 1, scaleRatio: '1:1', visible: false },
    { id: 'french-curve', type: 'FRENCH_CURVE', x: 300, y: 250, rotation: 0, scale: 1, visible: false },
    { id: 'compass', type: 'COMPASS', x: 380, y: 300, rotation: 0, scale: 1, radius: 60, visible: false },
    { id: 'protractor', type: 'PROTRACTOR', x: 350, y: 350, rotation: 0, scale: 1, visible: false }
  ]);

  // Active Selected Drafting Instrument for Keyboard/HUD Movement
  const [activeInstrumentId, setActiveInstrumentId] = useState<string>('t-square');

  // Instrument Drawer Dropdown
  const [showInstrumentDrawer, setShowInstrumentDrawer] = useState<boolean>(false);

  // CAD Command Line State
  const [cadHistory, setCadHistory] = useState<CadCommandHistoryEntry[]>([
    { command: 'INIT_CAD', timestamp: '00:00', status: 'SUCCESS', message: 'Drafthands CAD Model Space Initialized.' }
  ]);

  // Assignment Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [studentSubmissionNotes, setStudentSubmissionNotes] = useState<string>('');
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeAiStepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any running AI step timer on unmount
  useEffect(() => {
    return () => {
      if (activeAiStepTimerRef.current) {
        clearInterval(activeAiStepTimerRef.current);
        activeAiStepTimerRef.current = null;
      }
    };
  }, []);

  // Initialize initial template elements if provided
  useEffect(() => {
    if (initialTemplateElements && initialTemplateElements.length > 0) {
      const converted: WhiteboardElement[] = initialTemplateElements.map((el, i) => ({
        id: `tpl-${i}-${Date.now()}`,
        type: el.type === 'SEGMENT' || el.type === 'LINE' ? 'LINE' : el.type === 'CIRCLE' ? 'CIRCLE' : el.type === 'ARC' ? 'ARC' : 'LINE',
        layer: el.isFinalResult ? 'OUTLINE_HB' : 'CONSTRUCTION_2H',
        lineWeight: el.lineWeight || 'THIN_CONTINUOUS',
        color: el.isFinalResult ? '#f8fafc' : '#22d3ee',
        x1: el.x1,
        y1: el.y1,
        x2: el.x2,
        y2: el.y2,
        cx: el.cx,
        cy: el.cy,
        r: el.r,
        startAngle: el.startAngle,
        endAngle: el.endAngle,
        locked: true
      }));
      setElements(converted);
    }
  }, [initialTemplateElements]);

  // Convert screen coordinates to canvas coordinate space with robust null and NaN safety
  const screenToCanvasCoords = useCallback((screenX: number, screenY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    try {
      const rect = svgRef.current.getBoundingClientRect();
      const safeZoom = Number.isFinite(zoom) && zoom > 0.05 ? zoom : 1;
      const safePanX = Number.isFinite(pan?.x) ? pan.x : 0;
      const safePanY = Number.isFinite(pan?.y) ? pan.y : 0;
      const rawX = (screenX - (rect?.left ?? 0) - safePanX) / safeZoom;
      const rawY = (screenY - (rect?.top ?? 0) - safePanY) / safeZoom;

      if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) {
        return { x: 0, y: 0 };
      }

      if (!snapGrid) return { x: rawX, y: rawY };

      // Snap to 10mm grid
      const snapSize = 10;
      return {
        x: Math.round(rawX / snapSize) * snapSize,
        y: Math.round(rawY / snapSize) * snapSize
      };
    } catch {
      return { x: 0, y: 0 };
    }
  }, [pan, zoom, snapGrid]);

  // Color & Stroke mapping per layer
  const getLayerColor = (layer: WhiteboardLayer) => {
    switch (layer) {
      case 'CONSTRUCTION_2H': return '#22d3ee'; // Cyan (2H Construction)
      case 'OUTLINE_HB': return '#f8fafc';       // Bright White (HB Outline)
      case 'BORDER_2B': return '#38bdf8';        // Thick Sky Blue Border
      case 'HIDDEN_DASHED': return '#94a3b8';    // Slate Dashed
      case 'CENTERLINE_CHAIN': return '#f59e0b'; // Amber Chain Line
      case 'DIMENSIONS': return '#10b981';       // Emerald Dimension
      case 'ANNOTATIONS': return '#a855f7';      // Purple Notes
      case 'REDLINE_TEACHER_MARKUP': return '#ef4444'; // Redline Markup
      default: return '#f8fafc';
    }
  };

  const getLayerStrokeWidth = (layer: WhiteboardLayer, pressure = 1) => {
    switch (layer) {
      case 'OUTLINE_HB': return 2.4 * Math.max(0.6, pressure);
      case 'BORDER_2B': return 3.2;
      case 'CONSTRUCTION_2H': return 0.9;
      case 'HIDDEN_DASHED': return 1.2;
      case 'CENTERLINE_CHAIN': return 1.0;
      case 'DIMENSIONS': return 1.1;
      case 'REDLINE_TEACHER_MARKUP': return 2.0;
      default: return 1.5;
    }
  };

  // Toggle Physical Instrument on Canvas
  const toggleInstrument = (instType: OnScreenInstrument['type']) => {
    setInstruments(prev => {
      const target = prev.find(i => i.type === instType);
      if (target && !target.visible) {
        setActiveInstrumentId(target.id);
      }
      return prev.map(inst => {
        if (inst.type === instType) {
          return { ...inst, visible: !inst.visible };
        }
        return inst;
      });
    });
    setShowInstrumentDrawer(false);
  };

  const updateInstrument = (id: string, updates: Partial<OnScreenInstrument>) => {
    setInstruments(prev => prev.map(inst => inst.id === id ? { ...inst, ...updates } : inst));
  };

  const removeInstrument = (id: string) => {
    setInstruments(prev => prev.map(inst => inst.id === id ? { ...inst, visible: false } : inst));
  };

  // Keyboard arrow key listener for active instrument (Up/Down/Left/Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as any).isContentEditable)) {
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const visibleInsts = instruments.filter(i => i.visible);
        if (visibleInsts.length === 0) return;

        const targetInst = visibleInsts.find(i => i.id === activeInstrumentId) || visibleInsts[0];
        if (!targetInst) return;

        e.preventDefault();
        const step = e.shiftKey ? 50 : 15;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;

        updateInstrument(targetInst.id, {
          x: Math.round(targetInst.x + dx),
          y: Math.round(targetInst.y + dy)
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [instruments, activeInstrumentId]);

  // Helper to project point to line segment
  const projectToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return { x: x1, y: y1, dist: Math.hypot(px - x1, py - y1) };
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
    const qx = x1 + t * dx;
    const qy = y1 + t * dy;
    return { x: qx, y: qy, dist: Math.hypot(px - qx, py - qy) };
  };

  // Find nearest visible instrument edge within snap threshold
  const snapPointToInstrumentEdges = (px: number, py: number, insts: OnScreenInstrument[], threshold = 16) => {
    let closest = { x: px, y: py, snapped: false, edgeLabel: undefined as string | undefined, dist: threshold };

    const transform = (lx: number, ly: number, inst: OnScreenInstrument) => {
      const rad = ((inst.rotation || 0) * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return {
        x: inst.x + lx * cos - ly * sin,
        y: inst.y + lx * sin + ly * cos
      };
    };

    for (const inst of insts) {
      if (!inst.visible) continue;

      if (inst.type === 'TEE_SQUARE') {
        const p1 = transform(0, -20, inst);
        const p2 = transform(640, -20, inst);
        const proj = projectToSegment(px, py, p1.x, p1.y, p2.x, p2.y);
        if (proj.dist < closest.dist) {
          closest = { x: Math.round(proj.x), y: Math.round(proj.y), snapped: true, edgeLabel: 'T-Square Blade Edge', dist: proj.dist };
        }
      } else if (inst.type === 'SETSQUARE_30_60') {
        const edges = [
          { p1: transform(0, -161.6, inst), p2: transform(280, 0, inst), label: '30°/60° Hypotenuse' },
          { p1: transform(0, 0, inst), p2: transform(0, -161.6, inst), label: '90° Vertical' },
          { p1: transform(0, 0, inst), p2: transform(280, 0, inst), label: 'Base' }
        ];
        for (const e of edges) {
          const proj = projectToSegment(px, py, e.p1.x, e.p1.y, e.p2.x, e.p2.y);
          if (proj.dist < closest.dist) {
            closest = { x: Math.round(proj.x), y: Math.round(proj.y), snapped: true, edgeLabel: `Set Square ${e.label}`, dist: proj.dist };
          }
        }
      } else if (inst.type === 'SETSQUARE_45') {
        const edges = [
          { p1: transform(0, -220, inst), p2: transform(220, 0, inst), label: '45° Hypotenuse' },
          { p1: transform(0, 0, inst), p2: transform(0, -220, inst), label: '90° Vertical' },
          { p1: transform(0, 0, inst), p2: transform(220, 0, inst), label: 'Base' }
        ];
        for (const e of edges) {
          const proj = projectToSegment(px, py, e.p1.x, e.p1.y, e.p2.x, e.p2.y);
          if (proj.dist < closest.dist) {
            closest = { x: Math.round(proj.x), y: Math.round(proj.y), snapped: true, edgeLabel: `45° Set Square ${e.label}`, dist: proj.dist };
          }
        }
      } else if (inst.type === 'SCALE_RULE') {
        const p1 = transform(0, -18, inst);
        const p2 = transform(400, -18, inst);
        const proj = projectToSegment(px, py, p1.x, p1.y, p2.x, p2.y);
        if (proj.dist < closest.dist) {
          closest = { x: Math.round(proj.x), y: Math.round(proj.y), snapped: true, edgeLabel: 'Scale Rule Edge', dist: proj.dist };
        }
      }
    }

    return closest;
  };

  // Draw straight line along physical instrument edge
  const drawStraightEdgeFromInstrument = (x1: number, y1: number, x2: number, y2: number, label?: string) => {
    setHistory(prev => [...prev, [...elements]]);
    setRedoStack([]);
    const length = Math.hypot(x2 - x1, y2 - y1);
    const newElement: WhiteboardElement = {
      id: `ruled-edge-${Date.now()}`,
      type: 'LINE',
      layer: activeLayer,
      lineWeight: activeLayer === 'OUTLINE_HB' ? 'THICK_CONTINUOUS' : 'THIN_CONTINUOUS',
      color: getLayerColor(activeLayer),
      x1: Math.round(x1),
      y1: Math.round(y1),
      x2: Math.round(x2),
      y2: Math.round(y2)
    };
    setElements(prev => [...prev, newElement]);
    setCadHistory(prev => [
      ...prev,
      {
        command: 'RULE_EDGE',
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        status: 'SUCCESS',
        message: `${label || 'Line along edge'} (${Math.round(length)}mm) on [${activeLayer}]`
      }
    ]);
  };

  // Draw smooth curve along French Curve profile
  const drawCurvePathFromInstrument = (svgPath: string, points?: FreehandPoint[], label?: string) => {
    setHistory(prev => [...prev, [...elements]]);
    setRedoStack([]);
    const newElement: WhiteboardElement = {
      id: `french-curve-${Date.now()}`,
      type: 'SPLINE',
      layer: activeLayer,
      lineWeight: activeLayer === 'OUTLINE_HB' ? 'THICK_CONTINUOUS' : 'THIN_CONTINUOUS',
      color: getLayerColor(activeLayer),
      svgPath,
      points: points || []
    };
    setElements(prev => [...prev, newElement]);
    setCadHistory(prev => [
      ...prev,
      {
        command: 'RULE_CURVE',
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        status: 'SUCCESS',
        message: `${label || 'Burmester curve'} drawn on [${activeLayer}]`
      }
    ]);
  };

  const strikeCompassArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number, label?: string) => {
    setHistory(prev => [...prev, [...elements]]);
    setRedoStack([]);
    const newElement: WhiteboardElement = {
      id: `compass-arc-${Date.now()}`,
      type: 'ARC',
      layer: activeLayer,
      lineWeight: activeLayer === 'OUTLINE_HB' ? 'THICK_CONTINUOUS' : 'THIN_CONTINUOUS',
      color: getLayerColor(activeLayer),
      cx: Math.round(cx),
      cy: Math.round(cy),
      r: Math.round(r),
      startAngle,
      endAngle
    };
    setElements(prev => [...prev, newElement]);
    setCadHistory(prev => [
      ...prev,
      {
        command: 'STRIKE_ARC',
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        status: 'SUCCESS',
        message: `${label || 'Compass Arc'} R=${r}mm (${startAngle}°-${endAngle}°) on [${activeLayer}]`
      }
    ]);
  };

  // AutoCAD Automatic Drawing Engine from Dimensions
  const commitAutoDraw = useCallback((explicitOverrides?: Partial<DynamicDimensionValues>, explicitOrigin?: { x: number; y: number }) => {
    const values = { ...dynamicValues, ...explicitOverrides };
    const origin = explicitOrigin || startPoint || (cursorCoords.x !== 0 || cursorCoords.y !== 0 ? cursorCoords : { x: 250, y: 250 });

    const newElementsToAdd: WhiteboardElement[] = [];
    const baseId = Date.now();
    const color = getLayerColor(activeLayer);
    const lineWeight: LineWeightType = activeLayer === 'OUTLINE_HB' ? 'THICK_CONTINUOUS' : 'THIN_CONTINUOUS';

    let successMsg = '';

    if (activeTool === 'LINE') {
      const len = Math.max(1, values.length);
      const angRad = ((values.angle || 0) * Math.PI) / 180;
      const x2 = origin.x + len * Math.cos(angRad);
      const y2 = origin.y + len * Math.sin(angRad);

      newElementsToAdd.push({
        id: `cad-line-${baseId}`,
        type: 'LINE',
        layer: activeLayer,
        lineWeight,
        color,
        x1: origin.x,
        y1: origin.y,
        x2,
        y2
      });
      successMsg = `AutoCAD LINE: L=${len.toFixed(1)}mm @ ${values.angle || 0}°`;

      if (values.autoAnnotateDimension) {
        const nx = -Math.sin(angRad) * 16;
        const ny = Math.cos(angRad) * 16;
        newElementsToAdd.push({
          id: `cad-dim-${baseId}`,
          type: 'DIMENSION',
          layer: 'DIMENSIONS',
          lineWeight: 'DIMENSION_LINE',
          color: '#10b981',
          x1: origin.x + nx,
          y1: origin.y + ny,
          x2: x2 + nx,
          y2: y2 + ny,
          dimensionText: `${len.toFixed(0)} mm`
        });
      }
    } else if (activeTool === 'CIRCLE') {
      const r = values.useDiameter ? Math.max(1, values.diameter / 2) : Math.max(1, values.radius);
      newElementsToAdd.push({
        id: `cad-circle-${baseId}`,
        type: 'CIRCLE',
        layer: activeLayer,
        lineWeight,
        color,
        cx: origin.x,
        cy: origin.y,
        r
      });
      successMsg = `AutoCAD CIRCLE: ${values.useDiameter ? `Ø=${(r * 2).toFixed(1)}mm` : `R=${r.toFixed(1)}mm`} at (${origin.x.toFixed(0)}, ${origin.y.toFixed(0)})`;

      if (values.autoAnnotateDimension) {
        newElementsToAdd.push({
          id: `cad-dim-${baseId}`,
          type: 'DIMENSION',
          layer: 'DIMENSIONS',
          lineWeight: 'DIMENSION_LINE',
          color: '#10b981',
          x1: origin.x,
          y1: origin.y,
          x2: origin.x + r * 0.7071,
          y2: origin.y - r * 0.7071,
          dimensionText: values.useDiameter ? `Ø ${(r * 2).toFixed(0)} mm` : `R ${r.toFixed(0)} mm`
        });
      }
    } else if (activeTool === 'RECTANGLE') {
      const w = Math.max(1, values.width);
      const h = Math.max(1, values.height);
      newElementsToAdd.push({
        id: `cad-rect-${baseId}`,
        type: 'RECTANGLE',
        layer: activeLayer,
        lineWeight,
        color,
        x1: origin.x,
        y1: origin.y,
        width: w,
        height: h
      });
      successMsg = `AutoCAD RECTANG: ${w.toFixed(1)} x ${h.toFixed(1)} mm at (${origin.x.toFixed(0)}, ${origin.y.toFixed(0)})`;

      if (values.autoAnnotateDimension) {
        newElementsToAdd.push({
          id: `cad-dim-w-${baseId}`,
          type: 'DIMENSION',
          layer: 'DIMENSIONS',
          lineWeight: 'DIMENSION_LINE',
          color: '#10b981',
          x1: origin.x,
          y1: origin.y - 14,
          x2: origin.x + w,
          y2: origin.y - 14,
          dimensionText: `${w.toFixed(0)} mm`
        });
        newElementsToAdd.push({
          id: `cad-dim-h-${baseId}`,
          type: 'DIMENSION',
          layer: 'DIMENSIONS',
          lineWeight: 'DIMENSION_LINE',
          color: '#10b981',
          x1: origin.x + w + 14,
          y1: origin.y,
          x2: origin.x + w + 14,
          y2: origin.y + h,
          dimensionText: `${h.toFixed(0)} mm`
        });
      }
    } else if (activeTool === 'POLYGON') {
      const n = Math.max(3, values.sides || 6);
      const r = Math.max(5, values.polygonRadius || 50);
      const pts: [number, number][] = Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return [origin.x + r * Math.cos(a), origin.y + r * Math.sin(a)];
      });
      newElementsToAdd.push({
        id: `cad-poly-${baseId}`,
        type: 'POLYGON',
        layer: activeLayer,
        lineWeight,
        color,
        polygonPoints: pts,
        cx: origin.x,
        cy: origin.y,
        r
      });
      successMsg = `AutoCAD POLYGON: N=${n} sides, Radius=${r.toFixed(1)}mm`;

      if (values.autoAnnotateDimension) {
        newElementsToAdd.push({
          id: `cad-dim-${baseId}`,
          type: 'DIMENSION',
          layer: 'DIMENSIONS',
          lineWeight: 'DIMENSION_LINE',
          color: '#10b981',
          x1: origin.x,
          y1: origin.y,
          x2: origin.x + r,
          y2: origin.y,
          dimensionText: `R ${r.toFixed(0)} mm`
        });
      }
    } else if (activeTool === 'ARC') {
      const r = Math.max(5, values.arcRadius || 60);
      newElementsToAdd.push({
        id: `cad-arc-${baseId}`,
        type: 'ARC',
        layer: activeLayer,
        lineWeight,
        color,
        cx: origin.x,
        cy: origin.y,
        r,
        startAngle: values.arcStartAngle || 0,
        endAngle: values.arcEndAngle || 180
      });
      successMsg = `AutoCAD ARC: R=${r.toFixed(1)}mm (${values.arcStartAngle || 0}° to ${values.arcEndAngle || 180}°)`;
    } else if (activeTool === 'ELLIPSE') {
      const rx = Math.max(5, values.ellipseRx || 80);
      const ry = Math.max(5, values.ellipseRy || 40);
      newElementsToAdd.push({
        id: `cad-ellipse-${baseId}`,
        type: 'ELLIPSE',
        layer: activeLayer,
        lineWeight,
        color,
        cx: origin.x,
        cy: origin.y,
        rx,
        ry
      });
      successMsg = `AutoCAD ELLIPSE: Rx=${rx.toFixed(1)}mm, Ry=${ry.toFixed(1)}mm`;

      if (values.autoAnnotateDimension) {
        newElementsToAdd.push({
          id: `cad-dim-rx-${baseId}`,
          type: 'DIMENSION',
          layer: 'DIMENSIONS',
          lineWeight: 'DIMENSION_LINE',
          color: '#10b981',
          x1: origin.x - rx,
          y1: origin.y - ry - 14,
          x2: origin.x + rx,
          y2: origin.y - ry - 14,
          dimensionText: `2a = ${(rx * 2).toFixed(0)} mm`
        });
      }
    } else if (activeTool === 'CAD_OFFSET') {
      const lastEl = [...elements].reverse().find(el => el.type === 'LINE' || el.type === 'CIRCLE' || el.type === 'RECTANGLE');
      const d = values.offsetDistance || 15;
      if (lastEl) {
        if (lastEl.type === 'LINE' && lastEl.x1 !== undefined && lastEl.y1 !== undefined && lastEl.x2 !== undefined && lastEl.y2 !== undefined) {
          const dx = lastEl.x2 - lastEl.x1;
          const dy = lastEl.y2 - lastEl.y1;
          const len = Math.hypot(dx, dy);
          const nx = (-dy / len) * d;
          const ny = (dx / len) * d;
          newElementsToAdd.push({
            id: `cad-offset-${baseId}`,
            type: 'LINE',
            layer: activeLayer,
            lineWeight: 'THICK_CONTINUOUS',
            color,
            x1: lastEl.x1 + nx,
            y1: lastEl.y1 + ny,
            x2: lastEl.x2 + nx,
            y2: lastEl.y2 + ny
          });
          successMsg = `AutoCAD OFFSET: Line offset by ${d}mm`;
        } else if (lastEl.type === 'CIRCLE' && lastEl.cx !== undefined && lastEl.cy !== undefined && lastEl.r !== undefined) {
          newElementsToAdd.push({
            id: `cad-offset-${baseId}`,
            type: 'CIRCLE',
            layer: activeLayer,
            lineWeight: 'THICK_CONTINUOUS',
            color,
            cx: lastEl.cx,
            cy: lastEl.cy,
            r: lastEl.r + d
          });
          successMsg = `AutoCAD OFFSET: Concentric circle offset by ${d}mm`;
        } else if (lastEl.type === 'RECTANGLE' && lastEl.x1 !== undefined && lastEl.y1 !== undefined && lastEl.width !== undefined && lastEl.height !== undefined) {
          newElementsToAdd.push({
            id: `cad-offset-${baseId}`,
            type: 'RECTANGLE',
            layer: activeLayer,
            lineWeight: 'THICK_CONTINUOUS',
            color,
            x1: lastEl.x1 - d,
            y1: lastEl.y1 - d,
            width: lastEl.width + 2 * d,
            height: lastEl.height + 2 * d
          });
          successMsg = `AutoCAD OFFSET: Rectangle offset by ${d}mm`;
        }
      } else {
        successMsg = 'AutoCAD OFFSET: No preceding element found to offset.';
      }
    }

    if (newElementsToAdd.length > 0) {
      setHistory(prev => [...prev, [...elements]]);
      setElements(prev => [...prev, ...newElementsToAdd]);
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);

      setCadHistory(prev => [
        ...prev,
        {
          command: `AUTODRAW ${activeTool}`,
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          status: 'SUCCESS',
          message: successMsg
        }
      ]);
    }
  }, [dynamicValues, startPoint, cursorCoords, activeTool, activeLayer, elements]);

  // Convert WAEC curriculum construction vector elements to native WhiteboardElement format
  const convertConstructionElementsToWhiteboard = useCallback((
    constructionElements: ConstructionElement[], 
    prefix: string = 'ai-cad'
  ): WhiteboardElement[] => {
    if (!Array.isArray(constructionElements)) return [];
    const converted: WhiteboardElement[] = [];
    const now = Date.now();

    constructionElements.forEach((el, idx) => {
      if (!el || typeof el !== 'object' || !el.type) return;
      const baseId = `${prefix}-${idx}-${now}`;
      const isFinal = Boolean(el.isFinalResult);
      
      const layer: WhiteboardLayer = isFinal
        ? 'OUTLINE_HB'
        : el.lineWeight === 'CENTER_LINE' || el.lineWeight === 'THIN_CHAIN'
        ? 'CENTERLINE_CHAIN'
        : el.lineWeight === 'HIDDEN_DETAIL' || el.lineWeight === 'THIN_DASHED'
        ? 'HIDDEN_DASHED'
        : el.type === 'DIMENSION'
        ? 'DIMENSIONS'
        : el.type === 'TEXT' || el.type === 'TEXT_LABEL'
        ? 'ANNOTATIONS'
        : 'CONSTRUCTION_2H';

      const color = isFinal
        ? '#f8fafc'
        : layer === 'CENTERLINE_CHAIN'
        ? '#f59e0b'
        : layer === 'HIDDEN_DASHED'
        ? '#94a3b8'
        : layer === 'DIMENSIONS'
        ? '#10b981'
        : layer === 'ANNOTATIONS'
        ? '#38bdf8'
        : '#22d3ee';

      const lineWeight: LineWeightType = el.lineWeight || (isFinal ? 'THICK_CONTINUOUS' : 'THIN_CONTINUOUS');

      if (el.type === 'LINE' || el.type === 'SEGMENT') {
        if (
          el.x1 !== undefined && el.y1 !== undefined && el.x2 !== undefined && el.y2 !== undefined &&
          Number.isFinite(el.x1) && Number.isFinite(el.y1) && Number.isFinite(el.x2) && Number.isFinite(el.y2)
        ) {
          converted.push({
            id: baseId,
            type: 'LINE',
            layer,
            lineWeight,
            color,
            x1: Math.round(el.x1),
            y1: Math.round(el.y1),
            x2: Math.round(el.x2),
            y2: Math.round(el.y2),
            locked: false
          });
        }
      } else if (el.type === 'CIRCLE') {
        if (
          el.cx !== undefined && el.cy !== undefined && el.r !== undefined &&
          Number.isFinite(el.cx) && Number.isFinite(el.cy) && Number.isFinite(el.r) && el.r > 0
        ) {
          converted.push({
            id: baseId,
            type: 'CIRCLE',
            layer,
            lineWeight,
            color,
            cx: Math.round(el.cx),
            cy: Math.round(el.cy),
            r: Math.round(el.r),
            locked: false
          });
        }
      } else if (el.type === 'ARC') {
        if (
          el.cx !== undefined && el.cy !== undefined && el.r !== undefined &&
          Number.isFinite(el.cx) && Number.isFinite(el.cy) && Number.isFinite(el.r) && el.r > 0
        ) {
          converted.push({
            id: baseId,
            type: 'ARC',
            layer,
            lineWeight,
            color,
            cx: Math.round(el.cx),
            cy: Math.round(el.cy),
            r: Math.round(el.r),
            startAngle: Number.isFinite(el.startAngle) ? el.startAngle : 0,
            endAngle: Number.isFinite(el.endAngle) ? el.endAngle : 180,
            locked: false
          });
        }
      } else if (el.type === 'POLYGON' && Array.isArray(el.points) && el.points.length > 2) {
        const validPts = el.points.filter(pt => Array.isArray(pt) && pt.length >= 2 && Number.isFinite(pt[0]) && Number.isFinite(pt[1]));
        if (validPts.length > 2) {
          converted.push({
            id: baseId,
            type: 'POLYGON',
            layer,
            lineWeight,
            color,
            polygonPoints: validPts as [number, number][],
            locked: false
          });
        }
      } else if (el.type === 'RECTANGLE') {
        const rx = Number.isFinite(el.x) ? el.x! : (Number.isFinite(el.x1) ? el.x1! : 200);
        const ry = Number.isFinite(el.y) ? el.y! : (Number.isFinite(el.y1) ? el.y1! : 150);
        const rw = Number.isFinite(el.width) ? el.width! : (Number.isFinite(el.x2) ? Math.abs(el.x2! - rx) : 200);
        const rh = Number.isFinite(el.height) ? el.height! : (Number.isFinite(el.y2) ? Math.abs(el.y2! - ry) : 120);
        if (Number.isFinite(rx) && Number.isFinite(ry) && rw > 0 && rh > 0) {
          converted.push({
            id: baseId,
            type: 'RECTANGLE',
            layer,
            lineWeight,
            color,
            x1: Math.round(rx),
            y1: Math.round(ry),
            width: Math.round(rw),
            height: Math.round(rh),
            locked: false
          });
        }
      } else if (el.type === 'DIMENSION') {
        if (
          el.x1 !== undefined && el.y1 !== undefined && el.x2 !== undefined && el.y2 !== undefined &&
          Number.isFinite(el.x1) && Number.isFinite(el.y1) && Number.isFinite(el.x2) && Number.isFinite(el.y2)
        ) {
          converted.push({
            id: baseId,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: Math.round(el.x1),
            y1: Math.round(el.y1),
            x2: Math.round(el.x2),
            y2: Math.round(el.y2),
            dimensionText: el.dimensionText || `${Math.round(Math.hypot(el.x2 - el.x1, el.y2 - el.y1))} mm`,
            dimensionType: el.dimensionType || 'linear',
            locked: false
          });
        }
      } else if (el.type === 'TEXT' || el.type === 'TEXT_LABEL' || el.type === 'POINT') {
        const tx = Number.isFinite(el.cx) ? el.cx! : (Number.isFinite(el.x1) ? el.x1! : 400);
        const ty = Number.isFinite(el.cy) ? el.cy! : (Number.isFinite(el.y1) ? el.y1! : 300);
        const labelText = el.label || el.dimensionText || '';
        if (labelText) {
          converted.push({
            id: baseId,
            type: 'TEXT',
            layer: 'ANNOTATIONS',
            lineWeight: 'THIN_CONTINUOUS',
            color: '#38bdf8',
            x1: Math.round(tx),
            y1: Math.round(ty),
            text: labelText,
            fontSize: 12,
            locked: false
          });
        }
      }
    });

    return converted;
  }, []);

  // AI Prompt-to-CAD Instruction Handler for CAD Workstation with complete null safety
  const handleAiCadCommandInStudio = useCallback((
    result: ParsedCadResult, 
    mode: 'RENDER_FINAL' | 'SIMULATE_STEPS' = 'RENDER_FINAL'
  ) => {
    if (!result || typeof result !== 'object' || !result.matched) return;

    try {
      // Clear any active simulated step interval from prior command
      if (activeAiStepTimerRef.current) {
        clearInterval(activeAiStepTimerRef.current);
        activeAiStepTimerRef.current = null;
      }

      const targetTopic = (result.topicId ? getTopicById(result.topicId) : null) || topic || allCurriculumTopics[0];
      const safeParams: Record<string, number> = {};
      if (result.parameters && typeof result.parameters === 'object') {
        Object.entries(result.parameters).forEach(([k, v]) => {
          if (typeof v === 'number' && Number.isFinite(v)) {
            safeParams[k] = v;
          }
        });
      }

      let steps: any[] = [];
      if (targetTopic && typeof targetTopic.generateSteps === 'function') {
        try {
          const generated = targetTopic.generateSteps(safeParams);
          if (Array.isArray(generated)) {
            steps = generated.filter(Boolean);
          }
        } catch (stepGenErr) {
          console.warn('[AI CAD Steps Generator Safe Recover]', stepGenErr);
        }
      }

      // Convert final step or all elements
      let newElements: WhiteboardElement[] = [];

      if (steps.length > 0) {
        const finalStep = steps[steps.length - 1];
        if (finalStep && Array.isArray(finalStep.elements)) {
          newElements = convertConstructionElementsToWhiteboard(
            finalStep.elements, 
            `ai-${result.geometryType?.toLowerCase() || 'cad'}`
          );
        }
      }

      // Fallback geometric synthesis if no curriculum elements generated
      if (newElements.length === 0) {
        const center = { x: 500, y: 350 };
        const gType = (result.geometryType || '').toUpperCase();
        const p = safeParams;
        const now = Date.now();

        if (gType === 'ARCHITECTURAL_PLAN' || gType === 'BUILDING' || gType === 'FLOOR_PLAN') {
          const l = p.length || 12000;
          const w = p.width || 8000;
          const scale = 0.035;
          const bw = l * scale;
          const bh = w * scale;
          const bx = center.x - bw / 2;
          const by = center.y - bh / 2;

          newElements.push({
            id: `ai-arch-wall-${now}`,
            type: 'RECTANGLE',
            layer: 'OUTLINE_HB',
            lineWeight: 'THICK_CONTINUOUS',
            color: '#f8fafc',
            x1: bx,
            y1: by,
            width: bw,
            height: bh
          });

          newElements.push({
            id: `ai-arch-partition-${now}`,
            type: 'LINE',
            layer: 'CONSTRUCTION_2H',
            lineWeight: 'THIN_CONTINUOUS',
            color: '#94a3b8',
            x1: bx + bw * 0.4,
            y1: by,
            x2: bx + bw * 0.4,
            y2: by + bh
          });

          newElements.push({
            id: `ai-arch-dim-l-${now}`,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: bx,
            y1: by + bh + 30,
            x2: bx + bw,
            y2: by + bh + 30,
            dimensionText: `Building Length: ${l} mm (ISO 4157)`
          });
        } else if (gType === 'MECHANICAL_PART' || gType === 'ASSEMBLY' || gType === 'BRACKET') {
          const size = p.size || 200;
          const s = size * 1.2;
          newElements.push({
            id: `ai-mech-rect-${now}`,
            type: 'RECTANGLE',
            layer: 'OUTLINE_HB',
            lineWeight: 'THICK_CONTINUOUS',
            color: '#f8fafc',
            x1: center.x - s / 2,
            y1: center.y - s / 2,
            width: s,
            height: s * 0.7
          });
          newElements.push({
            id: `ai-mech-hole-${now}`,
            type: 'CIRCLE',
            layer: 'OUTLINE_HB',
            lineWeight: 'THICK_CONTINUOUS',
            color: '#f8fafc',
            cx: center.x,
            cy: center.y,
            r: s * 0.2
          });
          newElements.push({
            id: `ai-mech-dim-${now}`,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: center.x - s / 2,
            y1: center.y + s * 0.35 + 25,
            x2: center.x + s / 2,
            y2: center.y + s * 0.35 + 25,
            dimensionText: `Component Nominal Size: ${size} mm (ISO 128)`
          });
        } else if (gType === 'ISOMETRIC_BLOCK' || gType === '3D_BLOCK' || gType === 'CUBOID') {
          const l = p.length || p.l || 600;
          const w = p.width || p.w || 400;
          const h = p.height || p.h || 300;
          
          const scale = 0.35;
          const scL = l * scale;
          const scW = w * scale;
          const scH = h * scale;

          const origin = { x: center.x - (scL - scW) / 2, y: center.y + scH / 2 };
          const cos30 = 0.866;
          const sin30 = 0.5;

          const pBottomFront = { x: origin.x, y: origin.y };
          const pBottomLeft = { x: origin.x - scL * cos30, y: origin.y + scL * sin30 };
          const pBottomRight = { x: origin.x + scW * cos30, y: origin.y + scW * sin30 };
          const pBottomBack = { x: origin.x - scL * cos30 + scW * cos30, y: origin.y + scL * sin30 + scW * sin30 };

          const pTopFront = { x: pBottomFront.x, y: pBottomFront.y - scH };
          const pTopLeft = { x: pBottomLeft.x, y: pBottomLeft.y - scH };
          const pTopRight = { x: pBottomRight.x, y: pBottomRight.y - scH };
          const pTopBack = { x: pBottomBack.x, y: pBottomBack.y - scH };

          const edges = [
            [pBottomFront, pTopFront],
            [pBottomLeft, pTopLeft],
            [pBottomRight, pTopRight],
            [pTopFront, pTopLeft],
            [pTopFront, pTopRight],
            [pTopLeft, pTopBack],
            [pTopRight, pTopBack],
            [pBottomFront, pBottomLeft],
            [pBottomFront, pBottomRight]
          ];

          edges.forEach((edge, idx) => {
            newElements.push({
              id: `ai-iso-edge-${now}-${idx}`,
              type: 'LINE',
              layer: 'OUTLINE_HB',
              lineWeight: 'THICK_CONTINUOUS',
              color: '#f8fafc',
              x1: Math.round(edge[0].x),
              y1: Math.round(edge[0].y),
              x2: Math.round(edge[1].x),
              y2: Math.round(edge[1].y)
            });
          });

          newElements.push({
            id: `ai-dim-l-${now}`,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: Math.round(pBottomLeft.x),
            y1: Math.round(pBottomLeft.y + 25),
            x2: Math.round(pBottomFront.x),
            y2: Math.round(pBottomFront.y + 25),
            dimensionText: `Length: ${l} mm`
          });

          newElements.push({
            id: `ai-dim-w-${now}`,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: Math.round(pBottomFront.x),
            y1: Math.round(pBottomFront.y + 25),
            x2: Math.round(pBottomRight.x),
            y2: Math.round(pBottomRight.y + 25),
            dimensionText: `Width: ${w} mm`
          });

          newElements.push({
            id: `ai-dim-h-${now}`,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: Math.round(pTopRight.x + 25),
            y1: Math.round(pTopRight.y),
            x2: Math.round(pBottomRight.x + 25),
            y2: Math.round(pBottomRight.y),
            dimensionText: `Height: ${h} mm`
          });
        } else if (gType === 'CIRCLE') {
          const r = Math.max(10, p.radius || (p.diameter ? p.diameter / 2 : undefined) || 60);
          newElements.push({
            id: `ai-direct-circle-${now}`,
            type: 'CIRCLE',
            layer: 'OUTLINE_HB',
            lineWeight: 'THICK_CONTINUOUS',
            color: '#f8fafc',
            cx: center.x,
            cy: center.y,
            r
          });
          newElements.push({
            id: `ai-direct-dim-${now}`,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: center.x - r,
            y1: center.y,
            x2: center.x + r,
            y2: center.y,
            dimensionText: `Ø ${r * 2} mm`
          });
        } else if (gType === 'RECTANGLE' || gType === 'SQUARE') {
          const w = Math.max(10, p.width || p.length || p.span || 140);
          const h = Math.max(10, p.height || p.rise || p.width || 90);
          newElements.push({
            id: `ai-direct-rect-${now}`,
            type: 'RECTANGLE',
            layer: 'OUTLINE_HB',
            lineWeight: 'THICK_CONTINUOUS',
            color: '#f8fafc',
            x1: center.x - w / 2,
            y1: center.y - h / 2,
            width: w,
            height: h
          });
          newElements.push({
            id: `ai-direct-dim-w-${now}`,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: center.x - w / 2,
            y1: center.y + h / 2 + 25,
            x2: center.x + w / 2,
            y2: center.y + h / 2 + 25,
            dimensionText: `${w} mm`
          });
        } else if (gType === 'HEXAGON' || gType === 'POLYGON') {
          const sides = Math.max(3, Math.min(24, p.sides || 6));
          const r = Math.max(10, p.side || p.radius || 60);
          const polyPts: [number, number][] = [];
          for (let i = 0; i < sides; i++) {
            const ang = (i * 2 * Math.PI) / sides - Math.PI / 2;
            polyPts.push([
              Math.round(center.x + r * Math.cos(ang)), 
              Math.round(center.y + r * Math.sin(ang))
            ]);
          }
          newElements.push({
            id: `ai-direct-poly-${now}`,
            type: 'POLYGON',
            layer: 'OUTLINE_HB',
            lineWeight: 'THICK_CONTINUOUS',
            color: '#f8fafc',
            polygonPoints: polyPts
          });
        } else if (gType === 'ELLIPSE') {
          const rx = Math.max(10, (p.major || p.span || 160) / 2);
          const ry = Math.max(10, (p.minor || p.rise || 100) / 2);
          newElements.push({
            id: `ai-direct-ellipse-${now}`,
            type: 'ELLIPSE',
            layer: 'OUTLINE_HB',
            lineWeight: 'THICK_CONTINUOUS',
            color: '#f8fafc',
            cx: center.x,
            cy: center.y,
            rx,
            ry
          });
        } else if (gType === 'LINE') {
          const len = Math.max(10, p.length || p.span || 150);
          const ang = ((p.angle || 0) * Math.PI) / 180;
          newElements.push({
            id: `ai-direct-line-${now}`,
            type: 'LINE',
            layer: 'OUTLINE_HB',
            lineWeight: 'THICK_CONTINUOUS',
            color: '#f8fafc',
            x1: Math.round(center.x - (len / 2) * Math.cos(ang)),
            y1: Math.round(center.y - (len / 2) * Math.sin(ang)),
            x2: Math.round(center.x + (len / 2) * Math.cos(ang)),
            y2: Math.round(center.y + (len / 2) * Math.sin(ang))
          });
        }
      }

      // Filter out any invalid elements
      newElements = newElements.filter(el => el && typeof el === 'object' && el.type);

      if (newElements.length > 0) {
        // Save current canvas state to undo stack
        setHistory(prev => [...(Array.isArray(prev) ? prev : []), [...elements]]);

        if (mode === 'SIMULATE_STEPS' && steps.length > 1) {
          // Animated sequential step generation onto active CAD canvas
          let currentStepIdx = 0;
          setElements([]);
          activeAiStepTimerRef.current = setInterval(() => {
            if (currentStepIdx < steps.length) {
              const currentStepData = steps[currentStepIdx];
              if (currentStepData && Array.isArray(currentStepData.elements)) {
                const stepElements = convertConstructionElementsToWhiteboard(
                  currentStepData.elements, 
                  `step-${currentStepIdx + 1}`
                );
                setElements(stepElements);
                setCadHistory(prev => [
                  ...(Array.isArray(prev) ? prev : []),
                  {
                    command: `AI CAD STEP ${currentStepIdx + 1}/${steps.length}`,
                    timestamp: new Date().toLocaleTimeString().substring(0, 5),
                    status: 'SUCCESS',
                    message: `${currentStepData.title || 'Step'}: ${currentStepData.instruction || ''}`
                  }
                ]);
              }
              currentStepIdx++;
            } else {
              if (activeAiStepTimerRef.current) {
                clearInterval(activeAiStepTimerRef.current);
                activeAiStepTimerRef.current = null;
              }
            }
          }, 750);
        } else {
          // Instant direct synthesis & render on active CAD canvas
          setElements(prev => [...(Array.isArray(prev) ? prev : []), ...newElements]);

          setCadHistory(prev => [
            ...(Array.isArray(prev) ? prev : []),
            {
              command: `PROMPT: "${result.rawPrompt || 'Natural CAD'}"`,
              timestamp: new Date().toLocaleTimeString().substring(0, 5),
              status: 'SUCCESS',
              message: `Generated ${newElements.length} vector entities for ${result.geometryTitle || result.geometryType || 'CAD Entity'} (${result.cadCommandEcho || 'DONE'})`
            }
          ]);
        }
      }
    } catch (err) {
      console.error('[AI CAD Prompt-to-CAD Execution Error]', err);
    }
  }, [topic, elements, convertConstructionElementsToWhiteboard]);

  // CAD Command Interpreter
  const handleExecuteCadCommand = (cmdString: string) => {
    const rawTrimmed = cmdString.trim();
    if (!rawTrimmed) return;

    const tokens = rawTrimmed.toUpperCase().split(/\s+/);
    const cmd = tokens[0];

    const addHistory = (status: 'SUCCESS' | 'ERROR' | 'PROMPT', message: string) => {
      setCadHistory(prev => [
        ...prev,
        {
          command: cmdString,
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          status,
          message
        }
      ]);
    };

    switch (cmd) {
      case 'L':
      case 'LINE': {
        setActiveTool('LINE');
        // Case 1: Polar coordinate length<angle (e.g. L 120<45 or LINE 100<30)
        if (tokens.length >= 2 && tokens[1].includes('<')) {
          const parts = tokens[1].split('<');
          const len = parseFloat(parts[0]);
          const ang = parseFloat(parts[1]);
          if (!isNaN(len) && !isNaN(ang)) {
            setDynamicValues(prev => ({ ...prev, length: len, angle: ang }));
            commitAutoDraw({ length: len, angle: ang });
            addHistory('SUCCESS', `Auto-drawn LINE: ${len}mm @ ${ang}°`);
            break;
          }
        }

        // Case 2: Cartesian coordinates L x1,y1 x2,y2
        if (tokens.length >= 3 && tokens[1].includes(',') && tokens[2].includes(',')) {
          const [x1Str, y1Str] = tokens[1].split(',');
          const [x2Str, y2Str] = tokens[2].split(',');
          const x1 = parseFloat(x1Str);
          const y1 = parseFloat(y1Str);
          const x2 = parseFloat(x2Str);
          const y2 = parseFloat(y2Str);
          if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
            const newEl: WhiteboardElement = {
              id: `cad-line-${Date.now()}`,
              type: 'LINE',
              layer: activeLayer,
              lineWeight: 'THICK_CONTINUOUS',
              color: getLayerColor(activeLayer),
              x1,
              y1,
              x2,
              y2
            };
            setElements(prev => [...prev, newEl]);
            addHistory('SUCCESS', `Created LINE from (${x1}, ${y1}) to (${x2}, ${y2})`);
            break;
          }
        }

        // Case 3: Simple length parameter (e.g. L 150)
        if (tokens.length >= 2) {
          const len = parseFloat(tokens[1]);
          if (!isNaN(len)) {
            const angle = orthoLock ? 0 : (dynamicValues.angle || 0);
            setDynamicValues(prev => ({ ...prev, length: len, angle }));
            commitAutoDraw({ length: len, angle });
            addHistory('SUCCESS', `Auto-drawn LINE: ${len}mm`);
            break;
          }
        }

        addHistory('SUCCESS', 'LINE tool active. Type dimensions (e.g. L 120 or L 100<45) or click on canvas.');
        break;
      }

      case 'C':
      case 'CIRCLE': {
        setActiveTool('CIRCLE');
        // Case 1: Diameter syntax C D 100
        if (tokens.length >= 3 && (tokens[1] === 'D' || tokens[1] === 'DIA')) {
          const dia = parseFloat(tokens[2]);
          if (!isNaN(dia)) {
            setDynamicValues(prev => ({ ...prev, diameter: dia, radius: dia / 2, useDiameter: true }));
            commitAutoDraw({ diameter: dia, radius: dia / 2, useDiameter: true });
            addHistory('SUCCESS', `Auto-drawn CIRCLE: Diameter Ø=${dia}mm`);
            break;
          }
        }

        // Case 2: Coordinate & Radius: C cx,cy radius
        if (tokens.length >= 3 && tokens[1].includes(',')) {
          const [cxStr, cyStr] = tokens[1].split(',');
          const cx = parseFloat(cxStr);
          const cy = parseFloat(cyStr);
          const r = parseFloat(tokens[2]);
          if (!isNaN(cx) && !isNaN(cy) && !isNaN(r)) {
            const newEl: WhiteboardElement = {
              id: `cad-circle-${Date.now()}`,
              type: 'CIRCLE',
              layer: activeLayer,
              lineWeight: 'THICK_CONTINUOUS',
              color: getLayerColor(activeLayer),
              cx,
              cy,
              r
            };
            setElements(prev => [...prev, newEl]);
            addHistory('SUCCESS', `Created CIRCLE R=${r}mm at (${cx}, ${cy})`);
            break;
          }
        }

        // Case 3: Simple radius parameter C 60
        if (tokens.length >= 2) {
          const r = parseFloat(tokens[1]);
          if (!isNaN(r)) {
            setDynamicValues(prev => ({ ...prev, radius: r, diameter: r * 2, useDiameter: false }));
            commitAutoDraw({ radius: r, diameter: r * 2, useDiameter: false });
            addHistory('SUCCESS', `Auto-drawn CIRCLE: Radius R=${r}mm`);
            break;
          }
        }

        addHistory('SUCCESS', 'CIRCLE tool active. Type radius (e.g. C 50 or C D 100) or click center.');
        break;
      }

      case 'REC':
      case 'RECTANG': {
        setActiveTool('RECTANGLE');
        // Case 1: Two corner coordinates REC x1,y1 x2,y2
        if (tokens.length >= 3 && tokens[1].includes(',') && tokens[2].includes(',')) {
          const [x1Str, y1Str] = tokens[1].split(',');
          const [x2Str, y2Str] = tokens[2].split(',');
          const x1 = parseFloat(x1Str);
          const y1 = parseFloat(y1Str);
          const x2 = parseFloat(x2Str);
          const y2 = parseFloat(y2Str);
          if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
            const w = Math.abs(x2 - x1);
            const h = Math.abs(y2 - y1);
            const newEl: WhiteboardElement = {
              id: `cad-rec-${Date.now()}`,
              type: 'RECTANGLE',
              layer: activeLayer,
              lineWeight: 'THICK_CONTINUOUS',
              color: getLayerColor(activeLayer),
              x1: Math.min(x1, x2),
              y1: Math.min(y1, y2),
              width: w,
              height: h
            };
            setElements(prev => [...prev, newEl]);
            addHistory('SUCCESS', `Created RECTANGLE ${w}x${h}mm between (${x1}, ${y1}) and (${x2}, ${y2})`);
            break;
          }
        }

        // Case 2: Width and Height: REC w h or REC w,h
        let w = NaN;
        let h = NaN;
        if (tokens.length >= 2 && tokens[1].includes(',')) {
          const parts = tokens[1].split(',');
          w = parseFloat(parts[0]);
          h = parseFloat(parts[1]);
        } else if (tokens.length >= 3) {
          w = parseFloat(tokens[1]);
          h = parseFloat(tokens[2]);
        }

        if (!isNaN(w) && !isNaN(h)) {
          setDynamicValues(prev => ({ ...prev, width: w, height: h }));
          commitAutoDraw({ width: w, height: h });
          addHistory('SUCCESS', `Auto-drawn RECTANGLE: ${w} x ${h} mm`);
          break;
        }

        addHistory('SUCCESS', 'RECTANG tool active. Type dimensions (e.g. REC 120 80) or click corner.');
        break;
      }

      case 'POL':
      case 'POLYGON': {
        setActiveTool('POLYGON');
        if (tokens.length >= 3) {
          const sides = parseInt(tokens[1]);
          const rad = parseFloat(tokens[2]);
          if (!isNaN(sides) && !isNaN(rad) && sides >= 3) {
            setDynamicValues(prev => ({ ...prev, sides, polygonRadius: rad }));
            commitAutoDraw({ sides, polygonRadius: rad });
            addHistory('SUCCESS', `Auto-drawn Regular POLYGON: ${sides} sides, Radius=${rad}mm`);
            break;
          }
        } else if (tokens.length === 2) {
          const sides = parseInt(tokens[1]);
          if (!isNaN(sides) && sides >= 3) {
            setDynamicValues(prev => ({ ...prev, sides }));
            addHistory('SUCCESS', `Polygon sides set to ${sides}. Click center on canvas.`);
            break;
          }
        }
        addHistory('SUCCESS', 'POLYGON tool active. Type sides and radius (e.g. POL 6 50).');
        break;
      }

      case 'EL':
      case 'ELLIPSE': {
        setActiveTool('ELLIPSE');
        if (tokens.length >= 3) {
          const rx = parseFloat(tokens[1]);
          const ry = parseFloat(tokens[2]);
          if (!isNaN(rx) && !isNaN(ry)) {
            setDynamicValues(prev => ({ ...prev, ellipseRx: rx, ellipseRy: ry }));
            commitAutoDraw({ ellipseRx: rx, ellipseRy: ry });
            addHistory('SUCCESS', `Auto-drawn ELLIPSE: Rx=${rx}mm, Ry=${ry}mm`);
            break;
          }
        }
        addHistory('SUCCESS', 'ELLIPSE tool active. Type major and minor radii (e.g. EL 80 40).');
        break;
      }

      case 'A':
      case 'ARC': {
        setActiveTool('ARC');
        if (tokens.length >= 4) {
          const r = parseFloat(tokens[1]);
          const startA = parseFloat(tokens[2]);
          const endA = parseFloat(tokens[3]);
          if (!isNaN(r) && !isNaN(startA) && !isNaN(endA)) {
            setDynamicValues(prev => ({ ...prev, arcRadius: r, arcStartAngle: startA, arcEndAngle: endA }));
            commitAutoDraw({ arcRadius: r, arcStartAngle: startA, arcEndAngle: endA });
            addHistory('SUCCESS', `Auto-drawn ARC: R=${r}mm from ${startA}° to ${endA}°`);
            break;
          }
        } else if (tokens.length >= 2) {
          const r = parseFloat(tokens[1]);
          if (!isNaN(r)) {
            setDynamicValues(prev => ({ ...prev, arcRadius: r }));
            commitAutoDraw({ arcRadius: r });
            addHistory('SUCCESS', `Auto-drawn ARC: R=${r}mm`);
            break;
          }
        }
        addHistory('SUCCESS', 'ARC active. Type (e.g. A 60 0 180) or click canvas.');
        break;
      }

      case 'O':
      case 'OFFSET': {
        if (tokens.length >= 2) {
          const dist = parseFloat(tokens[1]);
          if (!isNaN(dist)) {
            setDynamicValues(prev => ({ ...prev, offsetDistance: dist }));
            commitAutoDraw({ offsetDistance: dist });
            addHistory('SUCCESS', `OFFSET: Geometry offset by ${dist}mm.`);
            break;
          }
        }
        setActiveTool('CAD_OFFSET');
        addHistory('SUCCESS', 'OFFSET active. Specify offset distance (e.g. O 15).');
        break;
      }

      case 'DYN':
      case 'DYNAMIC':
      case 'F12':
        setDynamicInputEnabled(prev => !prev);
        addHistory('SUCCESS', `Dynamic Input (DYN) toggled ${!dynamicInputEnabled ? 'ON' : 'OFF'}.`);
        break;

      case 'SPL':
      case 'SPLINE':
        setActiveTool('SPLINE');
        addHistory('SUCCESS', 'SPLINE / French Curve active. Draw smooth contour points.');
        break;

      case 'TR':
      case 'TRIM':
        setActiveTool('CAD_TRIM');
        addHistory('SUCCESS', 'TRIM active. Select edge to trim.');
        break;

      case 'MI':
      case 'MIRROR':
        setActiveTool('CAD_MIRROR');
        addHistory('SUCCESS', 'MIRROR active. Select elements to mirror across axis.');
        break;

      case 'F':
      case 'FILLET':
        setActiveTool('CAD_FILLET');
        addHistory('SUCCESS', 'FILLET active. Specify radius and select 2 lines.');
        break;

      case 'DIM':
      case 'DIMLINEAR':
        setActiveTool('DIMENSION_LINEAR');
        addHistory('SUCCESS', 'DIMLINEAR active. Specify extension origin points.');
        break;

      case 'F8':
      case 'ORTHO':
        setOrthoLock(prev => !prev);
        addHistory('SUCCESS', `ORTHO mode toggled ${!orthoLock ? 'ON' : 'OFF'}.`);
        break;

      case 'F7':
      case 'GRID':
        setGridMode(prev => prev === 'MILLIMETER' ? 'ISOMETRIC' : prev === 'ISOMETRIC' ? 'POLAR' : prev === 'POLAR' ? 'NONE' : 'MILLIMETER');
        addHistory('SUCCESS', 'Grid mode cycled.');
        break;

      case 'F9':
      case 'SNAP':
        setSnapGrid(prev => !prev);
        addHistory('SUCCESS', `Grid snap toggled ${!snapGrid ? 'ON' : 'OFF'}.`);
        break;

      case 'CLS':
      case 'CLEAR':
        setHistory(prev => [...prev, [...elements]]);
        setElements([]);
        addHistory('SUCCESS', 'Workspace model space cleared.');
        break;

      case 'HELP':
      case '?':
        addHistory('PROMPT', 'AutoCAD Commands: LINE (L 120 or L 100<45), CIRCLE (C 50 or C D 100), RECTANG (REC 120 80), POLYGON (POL 6 50), ELLIPSE (EL 80 40), ARC (A 60 0 180), OFFSET (O 15), DYN (F12), ORTHO (F8), GRID (F7), SNAP (F9), CLEAR');
        break;

      default:
        addHistory('ERROR', `Unknown command "${cmd}". Type HELP for available commands.`);
        break;
    }
  };

  // Pointer Handlers for Canvas Drawing with Null Safety & Boundary Checks
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (readOnly) return;
    try {
      // Check if user clicked on a drafting instrument or its controls - prevent canvas drawing
      const target = e.target as Element | null;
      if (target && typeof target.closest === 'function' && (target.closest('.drafting-instruments-overlay') || target.closest('[data-instrument-layer]'))) {
        return;
      }

      if (e.button === 1 || e.buttons === 4 || activeTool === 'PAN' || activeTool === 'SELECT') {
        setIsPanning(true);
        setStartPan({ x: e.clientX - (pan?.x ?? 0), y: e.clientY - (pan?.y ?? 0) });
        return;
      }

      let coords = screenToCanvasCoords(e.clientX, e.clientY);
      if (!coords || !Number.isFinite(coords.x) || !Number.isFinite(coords.y)) {
        return;
      }

      const rawPressure = typeof e.pressure === 'number' && Number.isFinite(e.pressure) && e.pressure > 0 ? e.pressure : 1;
      setActivePressure(rawPressure);

      // Magnetic snap to visible physical instrument edges when drawing lines or pen
      if (activeTool === 'LINE' || activeTool === 'PEN') {
        try {
          const edgeSnap = snapPointToInstrumentEdges(coords.x, coords.y, instruments || []);
          if (edgeSnap && edgeSnap.snapped && Number.isFinite(edgeSnap.x) && Number.isFinite(edgeSnap.y)) {
            coords = { x: edgeSnap.x, y: edgeSnap.y };
          }
        } catch (snapErr) {
          console.warn('[Instrument Snap Safe Recover]', snapErr);
        }
      }

      // Eraser / Trim mode
      if (activeTool === 'ERASER' || activeTool === 'CAD_TRIM') {
        setElements(prev => {
          if (!Array.isArray(prev)) return [];
          const threshold = 15;
          return prev.filter(el => {
            if (!el || el.locked) return true;
            if (el.type === 'LINE' && Number.isFinite(el.x1) && Number.isFinite(el.y1) && Number.isFinite(el.x2) && Number.isFinite(el.y2)) {
              const midX = (el.x1! + el.x2!) / 2;
              const midY = (el.y1! + el.y2!) / 2;
              const dist = Math.hypot(coords.x - midX, coords.y - midY);
              return dist > threshold;
            }
            if (el.type === 'CIRCLE' && Number.isFinite(el.cx) && Number.isFinite(el.cy)) {
              const dist = Math.hypot(coords.x - el.cx!, coords.y - el.cy!);
              return Math.abs(dist - (el.r || 0)) > threshold && dist > threshold;
            }
            return true;
          });
        });
        return;
      }

      // Save history
      setHistory(prev => [...(Array.isArray(prev) ? prev : []), [...elements]]);
      setRedoStack([]);

      setIsDrawing(true);
      setStartPoint(coords);
      setCurrentPoint(coords);

      if (activeTool === 'PEN' || activeTool === 'SPLINE') {
        setFreehandPoints([{ x: coords.x, y: coords.y, pressure: rawPressure, time: Date.now() }]);
      }
    } catch (err) {
      console.error('[Canvas PointerDown Safe Recover]', err);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    try {
      const rawCoords = screenToCanvasCoords(e.clientX, e.clientY);
      if (!rawCoords || !Number.isFinite(rawCoords.x) || !Number.isFinite(rawCoords.y)) {
        return;
      }
      setCursorCoords(rawCoords);

      if (isPanning) {
        setPan({
          x: e.clientX - (startPan?.x ?? 0),
          y: e.clientY - (startPan?.y ?? 0)
        });
        return;
      }

      if (!isDrawing || !startPoint || !Number.isFinite(startPoint.x) || !Number.isFinite(startPoint.y)) return;

      const rawPressure = typeof e.pressure === 'number' && Number.isFinite(e.pressure) && e.pressure > 0 ? e.pressure : 1;
      setActivePressure(rawPressure);

      let endX = rawCoords.x;
      let endY = rawCoords.y;

      // Magnetic snap to visible physical instrument edges when drawing lines or pen
      if (activeTool === 'LINE' || activeTool === 'PEN') {
        try {
          const edgeSnap = snapPointToInstrumentEdges(endX, endY, instruments || []);
          if (edgeSnap && edgeSnap.snapped && Number.isFinite(edgeSnap.x) && Number.isFinite(edgeSnap.y)) {
            endX = edgeSnap.x;
            endY = edgeSnap.y;
          }
        } catch (snapErr) {
          console.warn('[Instrument Snap Safe Recover]', snapErr);
        }
      }

      // Ortho Lock or 15° Angle Snap for Lines
      if (orthoLock || e.shiftKey) {
        const dx = Math.abs(endX - startPoint.x);
        const dy = Math.abs(endY - startPoint.y);
        if (dx > dy) endY = startPoint.y;
        else endX = startPoint.x;
      }

      setCurrentPoint({ x: endX, y: endY });

      // Synchronize dynamic input values in real-time with cursor displacement
      if (activeTool === 'LINE') {
        const len = Math.hypot(endX - startPoint.x, endY - startPoint.y);
        const ang = Math.round((Math.atan2(endY - startPoint.y, endX - startPoint.x) * 180) / Math.PI);
        if (Number.isFinite(len) && Number.isFinite(ang)) {
          setDynamicValues(prev => ({ ...prev, length: Math.round(len), angle: ang }));
        }
      } else if (activeTool === 'CIRCLE') {
        const r = Math.round(Math.hypot(endX - startPoint.x, endY - startPoint.y));
        if (Number.isFinite(r)) {
          setDynamicValues(prev => ({ ...prev, radius: r, diameter: r * 2 }));
        }
      } else if (activeTool === 'RECTANGLE') {
        const w = Math.round(Math.abs(endX - startPoint.x));
        const h = Math.round(Math.abs(endY - startPoint.y));
        if (Number.isFinite(w) && Number.isFinite(h)) {
          setDynamicValues(prev => ({ ...prev, width: w, height: h }));
        }
      } else if (activeTool === 'POLYGON') {
        const r = Math.round(Math.hypot(endX - startPoint.x, endY - startPoint.y));
        if (Number.isFinite(r)) {
          setDynamicValues(prev => ({ ...prev, polygonRadius: r }));
        }
      } else if (activeTool === 'ELLIPSE') {
        const rx = Math.round(Math.abs(endX - startPoint.x));
        const ry = Math.round(Math.abs(endY - startPoint.y));
        if (Number.isFinite(rx) && Number.isFinite(ry)) {
          setDynamicValues(prev => ({ ...prev, ellipseRx: rx, ellipseRy: ry }));
        }
      }

      if (activeTool === 'PEN' || activeTool === 'SPLINE') {
        setFreehandPoints(prev => [...(Array.isArray(prev) ? prev : []), { x: endX, y: endY, pressure: rawPressure, time: Date.now() }]);
      }
    } catch (err) {
      console.error('[Canvas PointerMove Safe Recover]', err);
    }
  };

  const handlePointerUp = () => {
    try {
      if (isPanning) {
        setIsPanning(false);
        return;
      }

      if (!isDrawing || !startPoint || !currentPoint || !Number.isFinite(startPoint.x) || !Number.isFinite(startPoint.y) || !Number.isFinite(currentPoint.x) || !Number.isFinite(currentPoint.y)) {
        setIsDrawing(false);
        setStartPoint(null);
        setCurrentPoint(null);
        return;
      }

      const newElementId = `elem-${Date.now()}`;
      const color = getLayerColor(activeLayer);
      const lineWeight: LineWeightType = activeLayer === 'OUTLINE_HB' ? 'THICK_CONTINUOUS' : activeLayer === 'HIDDEN_DASHED' ? 'THIN_DASHED' : activeLayer === 'CENTERLINE_CHAIN' ? 'THIN_CHAIN' : 'THIN_CONTINUOUS';

      let newElement: WhiteboardElement | null = null;

      if (activeTool === 'LINE') {
        const length = Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y);
        if (Number.isFinite(length) && length > 2) {
          newElement = {
            id: newElementId,
            type: 'LINE',
            layer: activeLayer,
            lineWeight,
            color,
            x1: Math.round(startPoint.x),
            y1: Math.round(startPoint.y),
            x2: Math.round(currentPoint.x),
            y2: Math.round(currentPoint.y)
          };
        }
      } else if (activeTool === 'RECTANGLE') {
        const w = currentPoint.x - startPoint.x;
        const h = currentPoint.y - startPoint.y;
        if (Number.isFinite(w) && Number.isFinite(h) && Math.abs(w) > 3 && Math.abs(h) > 3) {
          newElement = {
            id: newElementId,
            type: 'RECTANGLE',
            layer: activeLayer,
            lineWeight,
            color,
            x1: Math.round(Math.min(startPoint.x, currentPoint.x)),
            y1: Math.round(Math.min(startPoint.y, currentPoint.y)),
            width: Math.round(Math.abs(w)),
            height: Math.round(Math.abs(h))
          };
        }
      } else if (activeTool === 'CIRCLE') {
        const r = Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y);
        if (Number.isFinite(r) && r > 3) {
          newElement = {
            id: newElementId,
            type: 'CIRCLE',
            layer: activeLayer,
            lineWeight,
            color,
            cx: Math.round(startPoint.x),
            cy: Math.round(startPoint.y),
            r: Math.round(r)
          };
        }
      } else if (activeTool === 'ARC') {
        const r = Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y);
        if (Number.isFinite(r) && r > 3) {
          newElement = {
            id: newElementId,
            type: 'ARC',
            layer: activeLayer,
            lineWeight,
            color,
            cx: Math.round(startPoint.x),
            cy: Math.round(startPoint.y),
            r: Math.round(r),
            startAngle: 0,
            endAngle: 180
          };
        }
      } else if (activeTool === 'POLYGON') {
        const r = Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y);
        if (Number.isFinite(r) && r > 5) {
          const sides = Math.max(3, Math.min(32, dynamicValues?.sides || 6));
          const pts: [number, number][] = Array.from({ length: sides }, (_, i) => {
            const a = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
            return [
              Math.round(startPoint.x + r * Math.cos(a)), 
              Math.round(startPoint.y + r * Math.sin(a))
            ];
          });
          newElement = {
            id: newElementId,
            type: 'POLYGON',
            layer: activeLayer,
            lineWeight,
            color,
            polygonPoints: pts,
            cx: Math.round(startPoint.x),
            cy: Math.round(startPoint.y),
            r: Math.round(r)
          };
        }
      } else if (activeTool === 'ELLIPSE') {
        const rx = Math.abs(currentPoint.x - startPoint.x);
        const ry = Math.abs(currentPoint.y - startPoint.y);
        if (Number.isFinite(rx) && Number.isFinite(ry) && rx > 3 && ry > 3) {
          newElement = {
            id: newElementId,
            type: 'ELLIPSE',
            layer: activeLayer,
            lineWeight,
            color,
            cx: Math.round(startPoint.x),
            cy: Math.round(startPoint.y),
            rx: Math.round(rx),
            ry: Math.round(ry)
          };
        }
      } else if (activeTool === 'DIMENSION_LINEAR') {
        const length = Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y);
        if (Number.isFinite(length) && length > 5) {
          newElement = {
            id: newElementId,
            type: 'DIMENSION',
            layer: 'DIMENSIONS',
            lineWeight: 'DIMENSION_LINE',
            color: '#10b981',
            x1: Math.round(startPoint.x),
            y1: Math.round(startPoint.y),
            x2: Math.round(currentPoint.x),
            y2: Math.round(currentPoint.y),
            dimensionText: `${Math.round(length)} mm`
          };
        }
      } else if ((activeTool === 'PEN' || activeTool === 'SPLINE') && Array.isArray(freehandPoints) && freehandPoints.length > 1) {
        newElement = {
          id: newElementId,
          type: activeTool === 'SPLINE' ? 'SPLINE' : 'PEN_STROKE',
          layer: activeLayer,
          lineWeight,
          color,
          points: [...freehandPoints]
        };
      }

      if (newElement) {
        setElements(prev => [...(Array.isArray(prev) ? prev : []), newElement!]);
      }
    } catch (err) {
      console.error('[Canvas PointerUp Safe Recover]', err);
    } finally {
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);
      setFreehandPoints([]);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, [...elements]]);
    setElements(previous);
    setHistory(prev => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, [...elements]]);
    setElements(next);
    setRedoStack(prev => prev.slice(0, prev.length - 1));
  };

  const handleClear = () => {
    setHistory(prev => [...prev, [...elements]]);
    setElements([]);
  };

  const handleSubmitAssignmentToTeacher = () => {
    if (onSubmitAssignment) {
      onSubmitAssignment(elements, studentSubmissionNotes);
      setSubmissionSuccess(true);
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmissionSuccess(false);
      }, 1500);
    }
  };

  return (
    <div className={isEmbedded ? "relative w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden" : "fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 select-none animate-fadeIn"}>
      {/* Top Universal Header Bar */}
      <div className={`${isEmbedded ? 'h-11 px-3 bg-slate-900/95' : 'h-14 px-4 bg-slate-900'} border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md`}>
        {/* Left: Branding, Topic Badge, & Dual Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isEmbedded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  Drafthands Studio
                  {assignment ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      ASSIGNMENT MODE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      PRACTICE STUDIO
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-slate-400 max-w-[280px] sm:max-w-md truncate">
                  {assignment?.title || topic?.title || 'Interactive Geometric Drafting Canvas'}
                </p>
              </div>
            </div>
          )}

          {isEmbedded && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <PenTool className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-slate-300">Class Whiteboard:</span>
              <span className="text-cyan-300 font-medium truncate max-w-[160px] sm:max-w-xs">{topic?.title || 'Interactive Canvas'}</span>
            </div>
          )}

          {/* DUAL WORKSPACE MODE TOGGLE SWITCH */}
          <div className="flex items-center bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800 ml-1">
            <button
              onClick={() => setWorkspaceMode('TRADITIONAL_BOARD')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                workspaceMode === 'TRADITIONAL_BOARD'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              Traditional Board
            </button>

            <button
              onClick={() => setWorkspaceMode('CAD_WORKSTATION')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                workspaceMode === 'CAD_WORKSTATION'
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              CAD Workstation
            </button>

            <button
              onClick={() => {
                if (workspaceMode !== 'CAD_WORKSTATION') {
                  setWorkspaceMode('CAD_WORKSTATION');
                  setIsAiPromptBarOpen(true);
                } else {
                  setIsAiPromptBarOpen(prev => !prev);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                workspaceMode === 'CAD_WORKSTATION' && isAiPromptBarOpen
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="AI Prompt-to-CAD (Generate technical drawings with natural language)"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Prompt-to-CAD</span>
            </button>
          </div>
        </div>

        {/* Right: Instrument Drawer, Submit Assignment Button & Close */}
        <div className="flex items-center gap-2">
          {/* Traditional Instrument Drawer Toggle (Visible in Board Mode) */}
          {workspaceMode === 'TRADITIONAL_BOARD' && (
            <div className="relative">
              <button
                onClick={() => setShowInstrumentDrawer(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-amber-500/40 shadow-sm transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Instruments</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Instruments Popover Menu */}
              {showInstrumentDrawer && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Drafting Instrument Drawer
                  </div>
                  <button
                    onClick={() => toggleInstrument('TEE_SQUARE')}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs flex items-center justify-between transition-colors"
                  >
                    <span>T-Square (600mm Blade)</span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {instruments.find(i => i.type === 'TEE_SQUARE')?.visible ? 'ACTIVE' : '+ ADD'}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleInstrument('SETSQUARE_30_60')}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs flex items-center justify-between transition-colors"
                  >
                    <span>30° / 60° Set Square</span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {instruments.find(i => i.type === 'SETSQUARE_30_60')?.visible ? 'ACTIVE' : '+ ADD'}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleInstrument('SETSQUARE_45')}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs flex items-center justify-between transition-colors"
                  >
                    <span>45° Set Square</span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {instruments.find(i => i.type === 'SETSQUARE_45')?.visible ? 'ACTIVE' : '+ ADD'}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleInstrument('SCALE_RULE')}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs flex items-center justify-between transition-colors"
                  >
                    <span>Precision Scale Rule</span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {instruments.find(i => i.type === 'SCALE_RULE')?.visible ? 'ACTIVE' : '+ ADD'}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleInstrument('FRENCH_CURVE')}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs flex items-center justify-between transition-colors"
                  >
                    <span>French Curve (Burmester)</span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {instruments.find(i => i.type === 'FRENCH_CURVE')?.visible ? 'ACTIVE' : '+ ADD'}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleInstrument('COMPASS')}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs flex items-center justify-between transition-colors"
                  >
                    <span>Bow Compass & Sweep</span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {instruments.find(i => i.type === 'COMPASS')?.visible ? 'ACTIVE' : '+ ADD'}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleInstrument('PROTRACTOR')}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs flex items-center justify-between transition-colors"
                  >
                    <span>360° Engineering Protractor</span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {instruments.find(i => i.type === 'PROTRACTOR')?.visible ? 'ACTIVE' : '+ ADD'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* If opened for assignment, show Submit Button */}
          {assignment && (
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Assignment</span>
            </button>
          )}

          {/* Close Studio */}
          {onClose && !isEmbedded && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Workspace"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* CAD Workstation Ribbon Bar (When in CAD Mode) */}
      {workspaceMode === 'CAD_WORKSTATION' && (
        <CadRibbon
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          activeLayer={activeLayer}
          onSelectLayer={setActiveLayer}
          gridMode={gridMode}
          onCycleGridMode={() => {
            setGridMode(prev => prev === 'MILLIMETER' ? 'ISOMETRIC' : prev === 'ISOMETRIC' ? 'POLAR' : prev === 'POLAR' ? 'NONE' : 'MILLIMETER');
          }}
          snapGrid={snapGrid}
          onToggleSnapGrid={() => setSnapGrid(prev => !prev)}
          orthoLock={orthoLock}
          onToggleOrthoLock={() => setOrthoLock(prev => !prev)}
          dynamicInputEnabled={dynamicInputEnabled}
          onToggleDynamicInput={() => setDynamicInputEnabled(prev => !prev)}
          onClearCanvas={handleClear}
          onOpenVoiceAssistant={() => setIsAudioVoiceBarOpen(true)}
        />
      )}

      {/* AI Voice Transcription & Google Search Grounding Assistant */}
      <AudioCadVoiceBar
        isOpen={isAudioVoiceBarOpen}
        onClose={() => setIsAudioVoiceBarOpen(false)}
        onExecuteInstruction={handleExecuteVoiceInstruction}
      />

      {/* AI PROMPT-TO-CAD COMMAND BAR INTEGRATED DIRECTLY IN CAD STATION INTERFACE */}
      {workspaceMode === 'CAD_WORKSTATION' && isAiPromptBarOpen && (
        <CadErrorBoundary
          compact
          title="Interactive CAD Prompt Engine"
          fallbackMessage="CAD prompt parsing encountered an issue. Recovering input field."
        >
          <div className="border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20 shadow-md">
            <AiPromptToCadBar
              onExecuteCadCommand={handleAiCadCommandInStudio}
              activeTopic={topic}
              currentParameters={{}}
            />
          </div>
        </CadErrorBoundary>
      )}

      {/* Main Vector Drawing Canvas Viewport */}
      <div 
        ref={containerRef}
        className={`flex-1 relative overflow-hidden ${
          workspaceMode === 'TRADITIONAL_BOARD'
            ? 'bg-[#181d28]' // Drawing Board Canvas
            : 'bg-[#0f172a]' // Engineering CAD Model Space Canvas
        }`}
      >
        <svg
          ref={svgRef}
          className="w-full h-full cursor-crosshair select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <defs>
            {/* Millimeter Grid Pattern */}
            <pattern id="wb-grid-mm" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.5" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(56, 189, 248, 0.18)" strokeWidth="1" />
            </pattern>

            {/* Isometric 30° Grid Pattern */}
            <pattern id="wb-grid-iso" width="40" height="69.28" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 40 69.28 M 40 0 L 0 69.28 M 20 0 L 20 69.28" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.6" />
            </pattern>

            {/* Dimension Arrow Markers */}
            <marker id="wb-arrow-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 5 L 10 2 L 7 5 L 10 8 Z" fill="#10b981" />
            </marker>
            <marker id="wb-arrow-end" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 5 L 10 2 L 7 5 L 10 8 Z" fill="#10b981" />
            </marker>
          </defs>

          {/* Grid Background */}
          {gridMode === 'MILLIMETER' && <rect width="100%" height="100%" fill="url(#wb-grid-mm)" />}
          {gridMode === 'ISOMETRIC' && <rect width="100%" height="100%" fill="url(#wb-grid-iso)" />}

          {/* Drawing Content Root with Pan and Zoom */}
          <g transform={`translate(${Number.isFinite(pan?.x) ? pan.x : 0}, ${Number.isFinite(pan?.y) ? pan.y : 0}) scale(${Number.isFinite(zoom) && zoom > 0.05 ? zoom : 1})`}>
            {/* Render Elements Stack with Complete Coordinate Safety */}
            {Array.isArray(elements) && elements.filter((el): el is WhiteboardElement => Boolean(el && typeof el === 'object' && el.type)).map((el) => {
              const strokeColor = el.color || getLayerColor(el.layer);
              const strokeW = getLayerStrokeWidth(el.layer);
              const isDashed = el.layer === 'HIDDEN_DASHED' ? '6 4' : el.layer === 'CENTERLINE_CHAIN' ? '12 4 3 4' : undefined;

              if (el.type === 'LINE') {
                if (!Number.isFinite(el.x1) || !Number.isFinite(el.y1) || !Number.isFinite(el.x2) || !Number.isFinite(el.y2)) return null;
                return (
                  <line
                    key={el.id}
                    x1={el.x1}
                    y1={el.y1}
                    x2={el.x2}
                    y2={el.y2}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeDasharray={isDashed}
                  />
                );
              }

              if (el.type === 'RECTANGLE') {
                if (!Number.isFinite(el.x1) || !Number.isFinite(el.y1) || !Number.isFinite(el.width) || !Number.isFinite(el.height)) return null;
                return (
                  <rect
                    key={el.id}
                    x={el.x1}
                    y={el.y1}
                    width={Math.max(1, el.width!)}
                    height={Math.max(1, el.height!)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeDasharray={isDashed}
                  />
                );
              }

              if (el.type === 'CIRCLE') {
                if (!Number.isFinite(el.cx) || !Number.isFinite(el.cy) || !Number.isFinite(el.r) || el.r! <= 0) return null;
                return (
                  <circle
                    key={el.id}
                    cx={el.cx}
                    cy={el.cy}
                    r={el.r}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeDasharray={isDashed}
                  />
                );
              }

              if (el.type === 'ARC') {
                if (!Number.isFinite(el.cx) || !Number.isFinite(el.cy) || !Number.isFinite(el.r) || el.r! <= 0) return null;
                return (
                  <circle
                    key={el.id}
                    cx={el.cx}
                    cy={el.cy}
                    r={el.r}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeDasharray="5 4"
                  />
                );
              }

              if (el.type === 'DIMENSION') {
                if (!Number.isFinite(el.x1) || !Number.isFinite(el.y1) || !Number.isFinite(el.x2) || !Number.isFinite(el.y2)) return null;
                return (
                  <g key={el.id}>
                    <line
                      x1={el.x1}
                      y1={el.y1}
                      x2={el.x2}
                      y2={el.y2}
                      stroke="#10b981"
                      strokeWidth="1.2"
                      markerStart="url(#wb-arrow-start)"
                      markerEnd="url(#wb-arrow-end)"
                    />
                    <text
                      x={((el.x1 || 0) + (el.x2 || 0)) / 2}
                      y={((el.y1 || 0) + (el.y2 || 0)) / 2 - 6}
                      fill="#10b981"
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {el.dimensionText || ''}
                    </text>
                  </g>
                );
              }

              if (el.type === 'POLYGON' && Array.isArray(el.polygonPoints) && el.polygonPoints.length > 2) {
                const validPts = el.polygonPoints.filter(p => Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]));
                if (validPts.length < 3) return null;
                const pts = validPts.map(p => `${p[0]},${p[1]}`).join(' ');
                return (
                  <polygon
                    key={el.id}
                    points={pts}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeDasharray={isDashed}
                  />
                );
              }

              if (el.type === 'ELLIPSE' && Number.isFinite(el.cx) && Number.isFinite(el.cy) && Number.isFinite(el.rx) && Number.isFinite(el.ry) && el.rx! > 0 && el.ry! > 0) {
                return (
                  <ellipse
                    key={el.id}
                    cx={el.cx}
                    cy={el.cy}
                    rx={el.rx}
                    ry={el.ry}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeDasharray={isDashed}
                  />
                );
              }

              if ((el.type === 'PEN_STROKE' || el.type === 'SPLINE')) {
                const pathD = el.svgPath || (Array.isArray(el.points) && el.points.length > 1 ? el.points.reduce((acc, pt, i) => {
                  if (!pt || !Number.isFinite(pt.x) || !Number.isFinite(pt.y)) return acc;
                  return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                }, '') : '');
                if (!pathD) return null;
                return (
                  <path
                    key={el.id}
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeDasharray={isDashed}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              }

              if (el.type === 'TEXT' && el.text) {
                return (
                  <text
                    key={el.id}
                    x={Number.isFinite(el.x1) ? el.x1 : 0}
                    y={Number.isFinite(el.y1) ? el.y1 : 0}
                    fill={strokeColor}
                    fontSize={el.fontSize || 12}
                    fontFamily="monospace"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {el.text}
                  </text>
                );
              }

              return null;
            })}

            {/* In-Progress Drawing Preview */}
            {isDrawing && startPoint && currentPoint && Number.isFinite(startPoint.x) && Number.isFinite(startPoint.y) && Number.isFinite(currentPoint.x) && Number.isFinite(currentPoint.y) && (
              <g opacity="0.9">
                {activeTool === 'LINE' && (
                  <line
                    x1={startPoint.x}
                    y1={startPoint.y}
                    x2={currentPoint.x}
                    y2={currentPoint.y}
                    stroke={getLayerColor(activeLayer)}
                    strokeWidth={getLayerStrokeWidth(activeLayer, activePressure)}
                    strokeDasharray={activeLayer === 'HIDDEN_DASHED' ? '6 4' : undefined}
                  />
                )}

                {activeTool === 'RECTANGLE' && (
                  <rect
                    x={Math.min(startPoint.x, currentPoint.x)}
                    y={Math.min(startPoint.y, currentPoint.y)}
                    width={Math.max(1, Math.abs(currentPoint.x - startPoint.x))}
                    height={Math.max(1, Math.abs(currentPoint.y - startPoint.y))}
                    fill="none"
                    stroke={getLayerColor(activeLayer)}
                    strokeWidth={getLayerStrokeWidth(activeLayer)}
                  />
                )}

                {(activeTool === 'CIRCLE' || activeTool === 'ARC') && (
                  <circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r={Math.max(1, Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y))}
                    fill="none"
                    stroke={getLayerColor(activeLayer)}
                    strokeWidth={getLayerStrokeWidth(activeLayer)}
                    strokeDasharray={activeTool === 'ARC' ? '4 4' : undefined}
                  />
                )}

                {activeTool === 'POLYGON' && (
                  <polygon
                    points={Array.from({ length: Math.max(3, dynamicValues?.sides || 6) }, (_, i) => {
                      const sides = Math.max(3, dynamicValues?.sides || 6);
                      const r = Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y);
                      const a = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
                      return `${Math.round(startPoint.x + r * Math.cos(a))},${Math.round(startPoint.y + r * Math.sin(a))}`;
                    }).join(' ')}
                    fill="none"
                    stroke={getLayerColor(activeLayer)}
                    strokeWidth={getLayerStrokeWidth(activeLayer)}
                  />
                )}

                {activeTool === 'ELLIPSE' && (
                  <ellipse
                    cx={startPoint.x}
                    cy={startPoint.y}
                    rx={Math.max(1, Math.abs(currentPoint.x - startPoint.x))}
                    ry={Math.max(1, Math.abs(currentPoint.y - startPoint.y))}
                    fill="none"
                    stroke={getLayerColor(activeLayer)}
                    strokeWidth={getLayerStrokeWidth(activeLayer)}
                  />
                )}

                {activeTool === 'DIMENSION_LINEAR' && (
                  <g>
                    <line
                      x1={startPoint.x}
                      y1={startPoint.y}
                      x2={currentPoint.x}
                      y2={currentPoint.y}
                      stroke="#10b981"
                      strokeWidth="1.2"
                      markerStart="url(#wb-arrow-start)"
                      markerEnd="url(#wb-arrow-end)"
                    />
                    <text
                      x={(startPoint.x + currentPoint.x) / 2}
                      y={(startPoint.y + currentPoint.y) / 2 - 8}
                      fill="#10b981"
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {Math.round(Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y))} mm
                    </text>
                  </g>
                )}

                {(activeTool === 'PEN' || activeTool === 'SPLINE') && freehandPoints.length > 1 && (
                  <path
                    d={freehandPoints.reduce((acc, pt, i) => i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, '')}
                    fill="none"
                    stroke={getLayerColor(activeLayer)}
                    strokeWidth={getLayerStrokeWidth(activeLayer, activePressure)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            )}

            {/* Physical On-Canvas Drafting Instruments Overlay */}
            <DraftingInstrumentsOverlay
              instruments={instruments}
              zoom={zoom}
              activeInstrumentId={activeInstrumentId}
              onSelectInstrument={setActiveInstrumentId}
              onUpdateInstrument={updateInstrument}
              onRemoveInstrument={removeInstrument}
              onStrikeArc={strikeCompassArc}
              onDrawStraightEdge={drawStraightEdgeFromInstrument}
              onDrawCurvePath={drawCurvePathFromInstrument}
            />
          </g>
        </svg>

        {/* Traditional Board Mode Floating Tool Dock */}
        {workspaceMode === 'TRADITIONAL_BOARD' && (
          <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl">
            <button
              onClick={() => setActiveTool('LINE')}
              className={`p-2 rounded-xl transition-all ${
                activeTool === 'LINE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Straight Vector Line"
            >
              <Slash className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTool('CIRCLE')}
              className={`p-2 rounded-xl transition-all ${
                activeTool === 'CIRCLE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Circle (Center Radius)"
            >
              <Circle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTool('ARC')}
              className={`p-2 rounded-xl transition-all ${
                activeTool === 'ARC' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Arc"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTool('SPLINE')}
              className={`p-2 rounded-xl transition-all ${
                activeTool === 'SPLINE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="French Curve / Spline Tool"
            >
              <SplineIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTool('RECTANGLE')}
              className={`p-2 rounded-xl transition-all ${
                activeTool === 'RECTANGLE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Rectangle"
            >
              <Square className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTool('DIMENSION_LINEAR')}
              className={`p-2 rounded-xl transition-all ${
                activeTool === 'DIMENSION_LINEAR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Linear Dimension"
            >
              <Ruler className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTool('ERASER')}
              className={`p-2 rounded-xl transition-all ${
                activeTool === 'ERASER' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Eraser"
            >
              <Eraser className="w-4 h-4" />
            </button>

            <div className="w-full h-[1px] bg-slate-800 my-1" />

            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20"
              title="Clear Canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* On-Canvas Dynamic Input Box (AutoCAD Dynamic Input near cursor) */}
        {workspaceMode === 'CAD_WORKSTATION' && (
          <CadOnCanvasDynamicInput
            activeTool={activeTool}
            canvasCoords={cursorCoords}
            startPoint={startPoint}
            currentPoint={currentPoint}
            isDrawing={isDrawing}
            pan={pan}
            zoom={zoom}
            dynamicValues={dynamicValues}
            onUpdateValues={(updates) => setDynamicValues(prev => ({ ...prev, ...updates }))}
            onCommitAutoDraw={() => commitAutoDraw()}
            visible={dynamicInputEnabled}
          />
        )}

        {/* Floating Dimensional Controls HUD (AutoCAD Dimension Controls) */}
        {workspaceMode === 'CAD_WORKSTATION' && (
          <CadDynamicInputHud
            activeTool={activeTool}
            cursorCoords={cursorCoords}
            startPoint={startPoint}
            isDrawing={isDrawing}
            orthoLock={orthoLock}
            dynamicValues={dynamicValues}
            onUpdateValues={(updates) => setDynamicValues(prev => ({ ...prev, ...updates }))}
            onCommitAutoDraw={() => commitAutoDraw()}
            visible={dynamicInputEnabled}
          />
        )}

        {/* Real-time Coordinate & HUD Status Bar */}
        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-sm">
          <span>
            X: <strong className="text-cyan-400">{cursorCoords.x.toFixed(0)}</strong>
          </span>
          <span>
            Y: <strong className="text-cyan-400">{cursorCoords.y.toFixed(0)}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
        </div>

        {/* Floating Instrument Positioning & Mover Controller */}
        {instruments.some(i => i.visible) && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/95 border border-slate-700/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-2xl text-xs select-none">
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Instrument:</span>
              <select
                value={activeInstrumentId}
                onChange={(e) => setActiveInstrumentId(e.target.value)}
                className="bg-slate-950 text-slate-200 text-xs px-2 py-1 rounded-lg border border-slate-700 outline-none focus:border-cyan-500 font-sans"
              >
                {instruments.filter(i => i.visible).map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Move Arrows (Up, Down, Left, Right) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
                  if (inst) updateInstrument(inst.id, { x: inst.x - 20 });
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors"
                title="Move Left (◀ or Left Arrow)"
              >
                ◀
              </button>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
                    if (inst) updateInstrument(inst.id, { y: inst.y - 20 });
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white text-[9px] transition-colors leading-none"
                  title="Move Up (▲ or Up Arrow)"
                >
                  ▲
                </button>
                <button
                  onClick={() => {
                    const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
                    if (inst) updateInstrument(inst.id, { y: inst.y + 20 });
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white text-[9px] transition-colors leading-none"
                  title="Move Down (▼ or Down Arrow)"
                >
                  ▼
                </button>
              </div>
              <button
                onClick={() => {
                  const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
                  if (inst) updateInstrument(inst.id, { x: inst.x + 20 });
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors"
                title="Move Right (▶ or Right Arrow)"
              >
                ▶
              </button>
            </div>

            {/* Rotation Controls */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
              <button
                onClick={() => {
                  const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
                  if (inst) updateInstrument(inst.id, { rotation: (inst.rotation - 15 + 360) % 360 });
                }}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                title="Rotate Counter-Clockwise 15°"
              >
                -15°
              </button>
              <button
                onClick={() => {
                  const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
                  if (inst) updateInstrument(inst.id, { rotation: (inst.rotation + 15) % 360 });
                }}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                title="Rotate Clockwise 15°"
              >
                +15°
              </button>
              <button
                onClick={() => {
                  const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
                  if (inst) updateInstrument(inst.id, { rotation: 0 });
                }}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/80 text-amber-300 hover:text-white text-[11px]"
                title="Reset Rotation to 0°"
              >
                0°
              </button>
            </div>

            {/* Center on Sheet */}
            <button
              onClick={() => {
                const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
                if (inst) updateInstrument(inst.id, { x: 300, y: 300 });
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[11px] font-medium transition-colors"
              title="Center Instrument on Canvas Sheet"
            >
              🎯 Center
            </button>

            {/* Position Display */}
            {(() => {
              const inst = instruments.find(i => i.id === activeInstrumentId) || instruments.find(i => i.visible);
              if (!inst) return null;
              return (
                <span className="text-[10px] font-mono text-slate-400 pl-1">
                  X:{inst.x} Y:{inst.y}
                </span>
              );
            })()}
          </div>
        )}
      </div>

      {/* CAD Mode Bottom Command Line Console (When in CAD Mode) */}
      {workspaceMode === 'CAD_WORKSTATION' && (
        <CadCommandLine
          onExecuteCommand={handleExecuteCadCommand}
          history={cadHistory}
          onSelectTool={setActiveTool}
        />
      )}

      {/* Student Assignment Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" />
                Submit Practical Drawing Task
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300">
              <p className="font-semibold text-white mb-1">{assignment?.title}</p>
              <p className="text-slate-400">
                Total Vector Entities Created: <strong>{elements.length} elements</strong>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Self-Assessment & Construction Notes (Optional):
              </label>
              <textarea
                rows={3}
                value={studentSubmissionNotes}
                onChange={(e) => setStudentSubmissionNotes(e.target.value)}
                placeholder="Detail the procedural steps you used (e.g. geometric bisection, French curve points, pencil weight choices)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-400 resize-none"
              />
            </div>

            {submissionSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Drawing submitted to Teacher Portal successfully!
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssignmentToTeacher}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Confirm & Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
