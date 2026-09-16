import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Layers,
  Box,
  RotateCcw,
  Play,
  Pause,
  Download,
  Printer,
  Sliders,
  Check,
  Compass,
  Eye,
  Info,
  ChevronRight,
  Sparkles,
  Scissors,
  X,
  Maximize2,
  Minimize2,
  Ruler,
  HelpCircle,
  FileDown
} from 'lucide-react';

export type SolidShapeType = 'TRUNCATED_CYLINDER' | 'CONE_FRUSTUM' | 'PIPE_TEE_JUNCTION';

interface SurfaceDevelopmentViewerProps {
  initialShape?: SolidShapeType;
  isOpen?: boolean;
  onClose?: () => void;
  viewMode?: 'MODAL' | 'EMBEDDED' | 'FULLSCREEN';
  className?: string;
}

// ---------------------------------------------------------------------------
// 3D Math & Projection Utilities
// ---------------------------------------------------------------------------
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  depth: number;
}

function project3D(
  pt: Point3D,
  azimuthDeg: number,
  elevationDeg: number,
  zoom: number,
  cx: number,
  cy: number
): ProjectedPoint {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;

  // Rotation around Z (azimuth)
  const x1 = pt.x * Math.cos(az) - pt.y * Math.sin(az);
  const y1 = pt.x * Math.sin(az) + pt.y * Math.cos(az);
  const z1 = pt.z;

  // Rotation around X (elevation)
  const x2 = x1;
  const y2 = y1 * Math.cos(el) - z1 * Math.sin(el);
  const z2 = y1 * Math.sin(el) + z1 * Math.cos(el);

  // Isometric / weak perspective projection
  const scale = zoom;
  return {
    x: cx + x2 * scale,
    y: cy - z2 * scale,
    depth: y2
  };
}

export const SurfaceDevelopmentViewer: React.FC<SurfaceDevelopmentViewerProps> = ({
  initialShape = 'TRUNCATED_CYLINDER',
  isOpen = true,
  onClose,
  viewMode = 'MODAL',
  className = ''
}) => {
  // 1. Core State
  const [selectedShape, setSelectedShape] = useState<SolidShapeType>(initialShape);
  const [unfoldPercent, setUnfoldPercent] = useState<number>(0); // 0% (3D solid) to 100% (flat sheet)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSeamAllowance, setShowSeamAllowance] = useState<boolean>(true);
  const [showGenerators, setShowGenerators] = useState<boolean>(true);
  const [activeViewLayout, setActiveViewLayout] = useState<'SPLIT' | '3D_FOCUS' | '2D_FOCUS'>('SPLIT');
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(viewMode === 'FULLSCREEN');

  // 2. 3D Orbit Camera State
  const [cameraAzimuth, setCameraAzimuth] = useState<number>(35);
  const [cameraElevation, setCameraElevation] = useState<number>(25);
  const [isDraggingOrbit, setIsDraggingOrbit] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; az: number; el: number }>({ x: 0, y: 0, az: 0, el: 0 });

  // 3. Shape Parameters (Editable)
  // Cylinder Parameters
  const [cylDiameter, setCylDiameter] = useState<number>(60); // mm
  const [cylHeight, setCylHeight] = useState<number>(100);    // mm
  const [cylCutAngle, setCylCutAngle] = useState<number>(35);  // degrees

  // Cone Parameters
  const [coneBaseDiam, setConeBaseDiam] = useState<number>(70); // mm
  const [coneTopDiam, setConeTopDiam] = useState<number>(30);   // mm
  const [coneHeight, setConeHeight] = useState<number>(85);     // mm

  // Pipe T-Junction Parameters
  const [pipeMainDiam, setPipeMainDiam] = useState<number>(70);  // mm
  const [pipeBranchDiam, setPipeBranchDiam] = useState<number>(50); // mm
  const [pipeBranchLen, setPipeBranchLen] = useState<number>(75);  // mm

  // Animation Frame Loop
  useEffect(() => {
    let animFrame: number;
    if (isPlaying) {
      let lastTime = performance.now();
      const loop = (now: number) => {
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        setUnfoldPercent((prev) => {
          const next = prev + delta * 25 * playbackSpeed;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
        animFrame = requestAnimationFrame(loop);
      };
      animFrame = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, playbackSpeed]);

  // Orbit Mouse Handlers
  const handleMouseDownOrbit = (e: React.MouseEvent) => {
    setIsDraggingOrbit(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      az: cameraAzimuth,
      el: cameraElevation
    };
  };

  const handleMouseMoveOrbit = useCallback((e: MouseEvent) => {
    if (!isDraggingOrbit) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setCameraAzimuth((dragStartRef.current.az + dx * 0.6) % 360);
    setCameraElevation(Math.max(-85, Math.min(85, dragStartRef.current.el - dy * 0.6)));
  }, [isDraggingOrbit]);

  const handleMouseUpOrbit = useCallback(() => {
    setIsDraggingOrbit(false);
  }, []);

  useEffect(() => {
    if (isDraggingOrbit) {
      window.addEventListener('mousemove', handleMouseMoveOrbit);
      window.addEventListener('mouseup', handleMouseUpOrbit);
      return () => {
        window.removeEventListener('mousemove', handleMouseMoveOrbit);
        window.removeEventListener('mouseup', handleMouseUpOrbit);
      };
    }
  }, [isDraggingOrbit, handleMouseMoveOrbit, handleMouseUpOrbit]);

  // ---------------------------------------------------------------------------
  // Calculations & Geometric Derivations
  // ---------------------------------------------------------------------------
  const cylinderMath = useMemo(() => {
    const R = cylDiameter / 2;
    const radCut = (cylCutAngle * Math.PI) / 180;
    const stretchoutL = Math.PI * cylDiameter;
    const numGens = 12;
    const genSpacing = stretchoutL / numGens;
    const hMin = cylHeight - R * Math.tan(radCut);
    const hMax = cylHeight + R * Math.tan(radCut);
    const majorAxis = cylDiameter / Math.cos(radCut);
    const minorAxis = cylDiameter;
    const lateralArea = Math.PI * cylDiameter * cylHeight;

    // 12 generator heights: h(k) = cylHeight - R * tan(radCut) * cos(k * 30°)
    const generatorHeights: number[] = [];
    for (let i = 0; i <= numGens; i++) {
      const angle = (i * (2 * Math.PI)) / numGens;
      const h = cylHeight - R * Math.tan(radCut) * Math.cos(angle);
      generatorHeights.push(h);
    }

    return {
      R,
      radCut,
      stretchoutL,
      numGens,
      genSpacing,
      hMin,
      hMax,
      majorAxis,
      minorAxis,
      lateralArea,
      generatorHeights
    };
  }, [cylDiameter, cylHeight, cylCutAngle]);

  const coneMath = useMemo(() => {
    const r1 = coneBaseDiam / 2;
    const r2 = coneTopDiam / 2;
    const h = coneHeight;
    const slantFrustum = Math.sqrt(h * h + (r1 - r2) * (r1 - r2));
    const slantApex = r1 > r2 ? (r1 * slantFrustum) / (r1 - r2) : slantFrustum;
    const slantCut = Math.max(0, slantApex - slantFrustum);
    const halfApexAngleDeg = (Math.asin(Math.min(1, (r1 - r2) / slantFrustum)) * 180) / Math.PI;
    const sectorAngleDeg = (r1 / slantApex) * 360;
    const sectorArcLength = Math.PI * coneBaseDiam;
    const chordLength = 2 * slantApex * Math.sin(((sectorAngleDeg / 2) * Math.PI) / 180);
    const numGens = 12;
    const angleStepDeg = sectorAngleDeg / numGens;

    return {
      r1,
      r2,
      h,
      slantFrustum,
      slantApex,
      slantCut,
      halfApexAngleDeg,
      sectorAngleDeg,
      sectorArcLength,
      chordLength,
      numGens,
      angleStepDeg
    };
  }, [coneBaseDiam, coneTopDiam, coneHeight]);

  const pipeMath = useMemo(() => {
    const R = pipeMainDiam / 2;
    const r = pipeBranchDiam / 2;
    const ratio = (pipeBranchDiam / pipeMainDiam).toFixed(2);
    const stretchoutBranch = Math.PI * pipeBranchDiam;
    const numGens = 12;
    const genSpacing = stretchoutBranch / numGens;
    const maxSaddleDepth = R - Math.sqrt(Math.max(0, R * R - r * r));
    const mainHoleCircumStretch = 2 * R * Math.asin(Math.min(1, r / R));

    // Branch generator heights:
    // angle phi = 0 at bottom, 90° at sides, 180° at top
    const branchHeights: number[] = [];
    for (let i = 0; i <= numGens; i++) {
      const phi = (i * (2 * Math.PI)) / numGens;
      const sinPhi = Math.sin(phi);
      const penetration = R - Math.sqrt(Math.max(0, R * R - r * r * sinPhi * sinPhi));
      const h = pipeBranchLen - penetration;
      branchHeights.push(h);
    }

    return {
      R,
      r,
      ratio,
      stretchoutBranch,
      numGens,
      genSpacing,
      maxSaddleDepth,
      mainHoleCircumStretch,
      branchHeights
    };
  }, [pipeMainDiam, pipeBranchDiam, pipeBranchLen]);

  // ---------------------------------------------------------------------------
  // 3D Unfolding Geometric Generation
  // ---------------------------------------------------------------------------
  const u = unfoldPercent / 100; // 0 (solid) -> 1 (flat)

  // Cylinder 3D & Unfolding Points
  const cylinder3DData = useMemo(() => {
    const numGens = 12;
    const ptsPerGen = 10;
    const R = cylinderMath.R;
    const zoom = 1.6;
    const cx = 240;
    const cy = 240;

    // We interpolate each generator line from cylindrical coordinate to flat line!
    // At u = 0, generator i is at angle theta_i = i * 360/12, radius R.
    // At u > 0, the cylinder "unrolls" around tangency point.
    // Effective radius Reff = R / (1 - u * 0.999), angle span thetaEff = (theta_i - pi) * (1 - u).
    // When u = 1, x = (theta_i - pi) * R, y = 0, z = z.
    const generators3D: { index: number; points: ProjectedPoint[]; height: number }[] = [];
    const topPerimeter3D: ProjectedPoint[] = [];
    const basePerimeter3D: ProjectedPoint[] = [];

    for (let i = 0; i <= numGens; i++) {
      const theta = (i * 2 * Math.PI) / numGens - Math.PI; // -pi to +pi
      const arcS = theta * R; // arc distance along circumference
      const h = cylinderMath.generatorHeights[i];
      const genPoints: ProjectedPoint[] = [];

      // Current 3D position of generator baseline point
      let ptX: number, ptY: number;
      if (u < 0.99) {
        const Ru = R / (1 - u);
        const psi = (arcS * (1 - u)) / R;
        ptX = Ru * Math.sin(psi);
        ptY = Ru * (1 - Math.cos(psi)) - R;
      } else {
        ptX = arcS;
        ptY = -R;
      }

      for (let j = 0; j <= ptsPerGen; j++) {
        const z = (j / ptsPerGen) * h;
        const p3d: Point3D = { x: ptX, y: ptY, z: z - cylinderMath.hMax / 2 };
        const proj = project3D(p3d, cameraAzimuth, cameraElevation, zoom, cx, cy);
        genPoints.push(proj);
      }

      generators3D.push({ index: i, points: genPoints, height: h });
      basePerimeter3D.push(genPoints[0]);
      topPerimeter3D.push(genPoints[ptsPerGen]);
    }

    return { generators3D, topPerimeter3D, basePerimeter3D };
  }, [cylinderMath, u, cameraAzimuth, cameraElevation]);

  // Cone 3D & Unfolding Points
  const cone3DData = useMemo(() => {
    const numGens = 12;
    const r1 = coneMath.r1;
    const r2 = coneMath.r2;
    const h = coneMath.h;
    const zoom = 1.7;
    const cx = 240;
    const cy = 240;

    const generators3D: { index: number; pBase: ProjectedPoint; pTop: ProjectedPoint }[] = [];
    const baseCurve: ProjectedPoint[] = [];
    const topCurve: ProjectedPoint[] = [];

    // Cone unrolls by opening its lateral angle and flattening toward sector plane
    for (let i = 0; i <= numGens; i++) {
      const frac = i / numGens;
      const angleCone = frac * 2 * Math.PI - Math.PI;

      // When u = 0: normal 3D cone
      // When u = 1: flat circular sector
      const sectorTheta = (frac - 0.5) * ((coneMath.sectorAngleDeg * Math.PI) / 180);

      // Solid 3D point base
      const bSolid: Point3D = { x: r1 * Math.cos(angleCone), y: r1 * Math.sin(angleCone), z: -h / 2 };
      const tSolid: Point3D = { x: r2 * Math.cos(angleCone), y: r2 * Math.sin(angleCone), z: h / 2 };

      // Flat 2D point (in XY plane at z = -h/2)
      const bFlat: Point3D = {
        x: coneMath.slantApex * Math.sin(sectorTheta),
        y: -coneMath.slantApex * Math.cos(sectorTheta) + coneMath.slantFrustum / 2,
        z: -h / 2
      };
      const tFlat: Point3D = {
        x: coneMath.slantCut * Math.sin(sectorTheta),
        y: -coneMath.slantCut * Math.cos(sectorTheta) + coneMath.slantFrustum / 2,
        z: -h / 2
      };

      // Interpolated 3D point
      const bInterp: Point3D = {
        x: (1 - u) * bSolid.x + u * bFlat.x,
        y: (1 - u) * bSolid.y + u * bFlat.y,
        z: (1 - u) * bSolid.z + u * bFlat.z
      };
      const tInterp: Point3D = {
        x: (1 - u) * tSolid.x + u * tFlat.x,
        y: (1 - u) * tSolid.y + u * tFlat.y,
        z: (1 - u) * tSolid.z + u * tFlat.z
      };

      const pBase = project3D(bInterp, cameraAzimuth, cameraElevation, zoom, cx, cy);
      const pTop = project3D(tInterp, cameraAzimuth, cameraElevation, zoom, cx, cy);

      generators3D.push({ index: i, pBase, pTop });
      baseCurve.push(pBase);
      topCurve.push(pTop);
    }

    return { generators3D, baseCurve, topCurve };
  }, [coneMath, u, cameraAzimuth, cameraElevation]);

  // Pipe T-Junction 3D & Unfolding Points
  const pipe3DData = useMemo(() => {
    const numGens = 12;
    const R = pipeMath.R;
    const r = pipeMath.r;
    const zoom = 1.6;
    const cx = 240;
    const cy = 240;

    // Main Pipe Outline
    const mainPipeTop: ProjectedPoint[] = [];
    const mainPipeBot: ProjectedPoint[] = [];
    const mainLen = 120;
    for (let i = 0; i <= 24; i++) {
      const ang = (i * 2 * Math.PI) / 24;
      mainPipeTop.push(project3D({ x: R * Math.cos(ang), y: R * Math.sin(ang), z: mainLen / 2 }, cameraAzimuth, cameraElevation, zoom, cx, cy));
      mainPipeBot.push(project3D({ x: R * Math.cos(ang), y: R * Math.sin(ang), z: -mainLen / 2 }, cameraAzimuth, cameraElevation, zoom, cx, cy));
    }

    // Branch Pipe Generators (Unrolling)
    const branchGens: { index: number; pEnd: ProjectedPoint; pInt: ProjectedPoint }[] = [];
    const branchEndCurve: ProjectedPoint[] = [];
    const branchIntCurve: ProjectedPoint[] = [];

    for (let i = 0; i <= numGens; i++) {
      const frac = i / numGens;
      const phi = frac * 2 * Math.PI - Math.PI;
      const arcS = phi * r;
      const sinPhi = Math.sin(phi);
      const depth = Math.sqrt(Math.max(0, R * R - r * r * sinPhi * sinPhi));
      const branchH = pipeMath.branchHeights[i];

      // Solid positions
      // Branch axis extends in +X direction from main pipe
      const pEndSolid: Point3D = { x: R + pipeBranchLen, y: r * Math.cos(phi), z: r * Math.sin(phi) };
      const pIntSolid: Point3D = { x: depth, y: r * Math.cos(phi), z: r * Math.sin(phi) };

      // Flat positions
      const pEndFlat: Point3D = { x: R + pipeBranchLen, y: arcS, z: -mainLen / 3 };
      const pIntFlat: Point3D = { x: R + pipeBranchLen - branchH, y: arcS, z: -mainLen / 3 };

      const pEndInterp: Point3D = {
        x: (1 - u) * pEndSolid.x + u * pEndFlat.x,
        y: (1 - u) * pEndSolid.y + u * pEndFlat.y,
        z: (1 - u) * pEndSolid.z + u * pEndFlat.z
      };
      const pIntInterp: Point3D = {
        x: (1 - u) * pIntSolid.x + u * pIntFlat.x,
        y: (1 - u) * pIntSolid.y + u * pIntFlat.y,
        z: (1 - u) * pIntSolid.z + u * pIntFlat.z
      };

      const projEnd = project3D(pEndInterp, cameraAzimuth, cameraElevation, zoom, cx, cy);
      const projInt = project3D(pIntInterp, cameraAzimuth, cameraElevation, zoom, cx, cy);

      branchGens.push({ index: i, pEnd: projEnd, pInt: projInt });
      branchEndCurve.push(projEnd);
      branchIntCurve.push(projInt);
    }

    return { mainPipeTop, mainPipeBot, branchGens, branchEndCurve, branchIntCurve };
  }, [pipeMath, pipeBranchLen, u, cameraAzimuth, cameraElevation]);

  // ---------------------------------------------------------------------------
  // 2D Flat Development Pattern Geometry (1:1 Template Mode)
  // ---------------------------------------------------------------------------
  const pattern2D = useMemo(() => {
    if (selectedShape === 'TRUNCATED_CYLINDER') {
      const L = cylinderMath.stretchoutL;
      const numGens = 12;
      const stepX = L / numGens;
      const scale = 1.3;
      const ox = 50;
      const oy = 260; // baseline

      // Generate points along the sinusoidal truncation top
      const topPoints: [number, number][] = [];
      const genLines: { x: number; y1: number; y2: number; label: string; h: number }[] = [];

      for (let i = 0; i <= numGens; i++) {
        const x = ox + i * stepX * scale;
        const h = cylinderMath.generatorHeights[i];
        const y = oy - h * scale;
        topPoints.push([x, y]);
        genLines.push({
          x,
          y1: oy,
          y2: y,
          label: i === 12 ? '1' : `${i + 1}`,
          h
        });
      }

      // Cut path string
      let pathD = `M ${ox} ${oy} `;
      pathD += `L ${ox + L * scale} ${oy} `;
      pathD += `L ${ox + L * scale} ${oy - cylinderMath.generatorHeights[numGens] * scale} `;
      for (let i = numGens - 1; i >= 0; i--) {
        pathD += `L ${topPoints[i][0]} ${topPoints[i][1]} `;
      }
      pathD += `Z`;

      // Seam allowance tab (5mm with 45° chamfer)
      const seamWidth = 5 * scale;
      const seamPath = `M ${ox} ${oy} L ${ox - seamWidth} ${oy - seamWidth} L ${ox - seamWidth} ${topPoints[0][1] + seamWidth} L ${ox} ${topPoints[0][1]}`;

      return {
        viewBox: `0 0 ${Math.max(480, (L + 80) * scale)} 320`,
        pathD,
        seamPath,
        genLines,
        ox,
        oy,
        scale,
        totalW: L * scale,
        hMin: cylinderMath.hMin * scale,
        hMax: cylinderMath.hMax * scale
      };
    } else if (selectedShape === 'CONE_FRUSTUM') {
      const R_apex = coneMath.slantApex;
      const R_cut = coneMath.slantCut;
      const sectorDeg = coneMath.sectorAngleDeg;
      const numGens = 12;
      const scale = 1.6;

      const ox = 260;
      const oy = 40; // apex point
      const startAngle = (180 - sectorDeg) / 2; // centered sector

      const outerArcPts: [number, number][] = [];
      const innerArcPts: [number, number][] = [];
      const genRays: { x1: number; y1: number; x2: number; y2: number; label: string }[] = [];

      for (let i = 0; i <= numGens; i++) {
        const frac = i / numGens;
        const angDeg = startAngle + frac * sectorDeg;
        const rad = (angDeg * Math.PI) / 180;

        const xOuter = ox + R_apex * scale * Math.cos(rad);
        const yOuter = oy + R_apex * scale * Math.sin(rad);
        const xInner = ox + R_cut * scale * Math.cos(rad);
        const yInner = oy + R_cut * scale * Math.sin(rad);

        outerArcPts.push([xOuter, yOuter]);
        innerArcPts.push([xInner, yInner]);

        genRays.push({
          x1: xInner,
          y1: yInner,
          x2: xOuter,
          y2: yOuter,
          label: i === 12 ? '1' : `${i + 1}`
        });
      }

      // Build SVG sector path with arcs
      const firstO = outerArcPts[0];
      const lastO = outerArcPts[numGens];
      const firstI = innerArcPts[0];
      const lastI = innerArcPts[numGens];
      const largeArc = sectorDeg > 180 ? 1 : 0;

      const pathD = `M ${firstI[0]} ${firstI[1]} L ${firstO[0]} ${firstO[1]} A ${R_apex * scale} ${R_apex * scale} 0 ${largeArc} 1 ${lastO[0]} ${lastO[1]} L ${lastI[0]} ${lastI[1]} A ${R_cut * scale} ${R_cut * scale} 0 ${largeArc} 0 ${firstI[0]} ${firstI[1]} Z`;

      return {
        viewBox: `0 0 520 320`,
        pathD,
        genRays,
        ox,
        oy,
        scale,
        R_apex: R_apex * scale,
        R_cut: R_cut * scale,
        sectorDeg
      };
    } else {
      // Pipe T-Junction Development
      const L = pipeMath.stretchoutBranch;
      const numGens = 12;
      const stepX = L / numGens;
      const scale = 1.3;
      const ox = 50;
      const oy = 260;

      const topPoints: [number, number][] = [];
      const genLines: { x: number; y1: number; y2: number; label: string; h: number }[] = [];

      for (let i = 0; i <= numGens; i++) {
        const x = ox + i * stepX * scale;
        const h = pipeMath.branchHeights[i];
        const y = oy - h * scale;
        topPoints.push([x, y]);
        genLines.push({
          x,
          y1: oy,
          y2: y,
          label: i === 12 ? '1' : `${i + 1}`,
          h
        });
      }

      let pathD = `M ${ox} ${oy} L ${ox + L * scale} ${oy} L ${ox + L * scale} ${topPoints[numGens][1]} `;
      for (let i = numGens - 1; i >= 0; i--) {
        pathD += `L ${topPoints[i][0]} ${topPoints[i][1]} `;
      }
      pathD += `Z`;

      return {
        viewBox: `0 0 ${Math.max(480, (L + 80) * scale)} 320`,
        pathD,
        genLines,
        ox,
        oy,
        scale,
        totalW: L * scale
      };
    }
  }, [selectedShape, cylinderMath, coneMath, pipeMath]);

  // ---------------------------------------------------------------------------
  // Export & Download Utilities
  // ---------------------------------------------------------------------------
  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('iso-drawing-sheet-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ISO-Surface-Development-${selectedShape}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintSheet = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      id="surface-development-viewer"
      className={`flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden h-full w-full ${
        isFullscreen ? 'fixed inset-0 z-50' : 'relative'
      } ${className}`}
    >
      {/* 1. TOP HEADER TOOLBAR */}
      <header className="h-14 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">Surface Development & Unfolding Engine</h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                ISO 128 / ISO 5456
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Interactive 3D Solid ⇄ 2D Sheet Metal Template Deformation • WAEC SS3 Term 1
            </p>
          </div>
        </div>

        {/* Center: Shape Selector Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            id="tab-shape-cylinder"
            onClick={() => {
              setSelectedShape('TRUNCATED_CYLINDER');
              setUnfoldPercent(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedShape === 'TRUNCATED_CYLINDER'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Truncated Cylinder
          </button>
          <button
            id="tab-shape-cone"
            onClick={() => {
              setSelectedShape('CONE_FRUSTUM');
              setUnfoldPercent(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedShape === 'CONE_FRUSTUM'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Right Cone Frustum
          </button>
          <button
            id="tab-shape-pipe"
            onClick={() => {
              setSelectedShape('PIPE_TEE_JUNCTION');
              setUnfoldPercent(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedShape === 'PIPE_TEE_JUNCTION'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Pipe T-Junction
          </button>
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-2">
          {/* Download ISO Sheet Preview Button */}
          <button
            id="btn-open-print-preview"
            onClick={() => setIsPrintPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/50 transition-all border border-emerald-400/30"
            title="Open printable ISO drawing sheet with border, title block, and step-by-step instructions"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download ISO Sheet (PDF/SVG)</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Modal Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-950/60 hover:text-rose-300 transition-colors ml-1"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. DYNAMIC SLIDER & PLAYBACK CONTROL BAR */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Unfold Slider & Percentage Display */}
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <button
            id="btn-toggle-play"
            onClick={() => {
              if (unfoldPercent >= 100) setUnfoldPercent(0);
              setIsPlaying(!isPlaying);
            }}
            className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center transition-colors shadow-sm shrink-0"
            title={isPlaying ? 'Pause Unfolding' : 'Auto Play Unfolding'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            id="btn-reset-unfold"
            onClick={() => {
              setIsPlaying(false);
              setUnfoldPercent(0);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Reset to 3D Solid"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-300 shrink-0 flex items-center gap-1.5">
              <span>Unfold:</span>
              <span className="w-12 text-emerald-400">{unfoldPercent.toFixed(0)}%</span>
            </span>

            <input
              id="unfold-slider"
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={unfoldPercent}
              onChange={(e) => {
                setIsPlaying(false);
                setUnfoldPercent(parseFloat(e.target.value));
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quick Stage Jump Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => {
              setIsPlaying(false);
              setUnfoldPercent(0);
            }}
            className={`px-2 py-1 rounded font-medium transition-all ${
              unfoldPercent === 0 ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            0% Solid
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setUnfoldPercent(50);
            }}
            className={`px-2 py-1 rounded font-medium transition-all ${
              unfoldPercent === 50 ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            50% Unfolding
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setUnfoldPercent(100);
            }}
            className={`px-2 py-1 rounded font-medium transition-all ${
              unfoldPercent === 100 ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            100% Flat Sheet
          </button>
        </div>

        {/* View Layout Options */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSeamAllowance(!showSeamAllowance)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
              showSeamAllowance
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle 5mm sheet metal lap joint seam tab with 45° chamfer"
          >
            <Scissors className="w-3 h-3" />
            <span className="hidden sm:inline">5mm Seam Tab</span>
          </button>

          <button
            onClick={() => setShowGenerators(!showGenerators)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
              showGenerators
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle 12 ISO generator lines (1 - 12)"
          >
            <Ruler className="w-3 h-3" />
            <span className="hidden sm:inline">12 Generators</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN DUAL VIEWPORT WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 bg-slate-950 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
        {/* LEFT PANE: 3D SOLID UNROLLING SIMULATION */}
        <div className="flex flex-col relative h-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
          {/* Viewport Header */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                3D Interactive Solid Space
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                (Az: {cameraAzimuth.toFixed(0)}°, El: {cameraElevation.toFixed(0)}°)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Click & Drag to Orbit 3D Camera
            </span>
          </div>

          {/* 3D SVG Canvas */}
          <div
            className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center p-2"
            onMouseDown={handleMouseDownOrbit}
          >
            <svg
              className="w-full h-full max-h-[500px]"
              viewBox="0 0 480 480"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Metallic gradient for 3D skin */}
                <linearGradient id="grad-3d-skin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0369a1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#075985" stopOpacity="0.75" />
                </linearGradient>

                <linearGradient id="grad-3d-cut" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>

                {/* ISO 128 Line Styles */}
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
              </defs>

              {/* Datum Ground Grid */}
              <g opacity="0.25">
                {[-120, -60, 0, 60, 120].map((coord, idx) => {
                  const pA = project3D({ x: -150, y: coord, z: -cylinderMath.hMax / 2 }, cameraAzimuth, cameraElevation, 1.6, 240, 240);
                  const pB = project3D({ x: 150, y: coord, z: -cylinderMath.hMax / 2 }, cameraAzimuth, cameraElevation, 1.6, 240, 240);
                  const pC = project3D({ x: coord, y: -150, z: -cylinderMath.hMax / 2 }, cameraAzimuth, cameraElevation, 1.6, 240, 240);
                  const pD = project3D({ x: coord, y: 150, z: -cylinderMath.hMax / 2 }, cameraAzimuth, cameraElevation, 1.6, 240, 240);
                  return (
                    <React.Fragment key={idx}>
                      <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#64748b" strokeWidth="0.8" />
                      <line x1={pC.x} y1={pC.y} x2={pD.x} y2={pD.y} stroke="#64748b" strokeWidth="0.8" />
                    </React.Fragment>
                  );
                })}
              </g>

              {/* RENDER SHAPE 1: TRUNCATED CYLINDER */}
              {selectedShape === 'TRUNCATED_CYLINDER' && (
                <g id="3d-truncated-cylinder">
                  {/* Base Perimeter */}
                  <polygon
                    points={cylinder3DData.basePerimeter3D.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.2"
                  />

                  {/* Cut Surface Polygon (at u = 0, closed ellipse) */}
                  {u < 0.1 && (
                    <polygon
                      points={cylinder3DData.topPerimeter3D.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="url(#grad-3d-cut)"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  )}

                  {/* Lateral Surface Shading Ribbons */}
                  {cylinder3DData.generators3D.slice(0, -1).map((gen, i) => {
                    const nextGen = cylinder3DData.generators3D[i + 1];
                    const pts = [
                      gen.points[0],
                      nextGen.points[0],
                      nextGen.points[nextGen.points.length - 1],
                      gen.points[gen.points.length - 1]
                    ];
                    return (
                      <polygon
                        key={i}
                        points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                        fill="url(#grad-3d-skin)"
                        opacity={0.7}
                        stroke="#0ea5e9"
                        strokeWidth="0.5"
                      />
                    );
                  })}

                  {/* Generator Fold Lines (ISO 128: 0.25mm dashed or thin) */}
                  {showGenerators &&
                    cylinder3DData.generators3D.map((gen, idx) => {
                      const pBot = gen.points[0];
                      const pTop = gen.points[gen.points.length - 1];
                      const isSeam = idx === 0 || idx === 12;
                      return (
                        <g key={idx}>
                          <line
                            x1={pBot.x}
                            y1={pBot.y}
                            x2={pTop.x}
                            y2={pTop.y}
                            stroke={isSeam ? '#f59e0b' : '#38bdf8'}
                            strokeWidth={isSeam ? 2 : 1}
                            strokeDasharray={isSeam ? undefined : '5,3'}
                          />
                          {/* Generator Index Tag */}
                          <text
                            x={pTop.x}
                            y={pTop.y - 6}
                            fill={isSeam ? '#fbbf24' : '#7dd3fc'}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {idx === 12 ? '1' : `${idx + 1}`}
                          </text>
                        </g>
                      );
                    })}

                  {/* Cut Profile Top Edge (ISO 128: Continuous Thick 0.5mm) */}
                  <polyline
                    points={cylinder3DData.topPerimeter3D.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}

              {/* RENDER SHAPE 2: RIGHT CONE FRUSTUM */}
              {selectedShape === 'CONE_FRUSTUM' && (
                <g id="3d-cone-frustum">
                  {/* Lateral Ribbons */}
                  {cone3DData.generators3D.slice(0, -1).map((gen, i) => {
                    const nextGen = cone3DData.generators3D[i + 1];
                    const pts = [gen.pBase, nextGen.pBase, nextGen.pTop, gen.pTop];
                    return (
                      <polygon
                        key={i}
                        points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                        fill="url(#grad-3d-skin)"
                        opacity={0.65}
                        stroke="#0ea5e9"
                        strokeWidth="0.5"
                      />
                    );
                  })}

                  {/* Base Perimeter */}
                  <polyline
                    points={cone3DData.baseCurve.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                  />

                  {/* Top Cut Perimeter */}
                  <polyline
                    points={cone3DData.topCurve.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />

                  {/* Radiating Generators */}
                  {showGenerators &&
                    cone3DData.generators3D.map((gen, idx) => {
                      const isSeam = idx === 0 || idx === 12;
                      return (
                        <g key={idx}>
                          <line
                            x1={gen.pBase.x}
                            y1={gen.pBase.y}
                            x2={gen.pTop.x}
                            y2={gen.pTop.y}
                            stroke={isSeam ? '#f59e0b' : '#38bdf8'}
                            strokeWidth={isSeam ? 2 : 1}
                            strokeDasharray={isSeam ? undefined : '5,3'}
                          />
                          <text
                            x={gen.pBase.x}
                            y={gen.pBase.y + 12}
                            fill={isSeam ? '#fbbf24' : '#7dd3fc'}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {idx === 12 ? '1' : `${idx + 1}`}
                          </text>
                        </g>
                      );
                    })}
                </g>
              )}

              {/* RENDER SHAPE 3: PIPE T-JUNCTION */}
              {selectedShape === 'PIPE_TEE_JUNCTION' && (
                <g id="3d-pipe-tee">
                  {/* Main Vertical Cylinder Outlines */}
                  <polygon
                    points={pipe3DData.mainPipeTop.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="#1e293b"
                    opacity={0.7}
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points={pipe3DData.mainPipeBot.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="#0f172a"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />

                  {/* Connecting Main Cylinder Walls */}
                  <line
                    x1={pipe3DData.mainPipeTop[0].x}
                    y1={pipe3DData.mainPipeTop[0].y}
                    x2={pipe3DData.mainPipeBot[0].x}
                    y2={pipe3DData.mainPipeBot[0].y}
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={pipe3DData.mainPipeTop[12].x}
                    y1={pipe3DData.mainPipeTop[12].y}
                    x2={pipe3DData.mainPipeBot[12].x}
                    y2={pipe3DData.mainPipeBot[12].y}
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />

                  {/* Branch Horizontal Pipe Surface */}
                  {pipe3DData.branchGens.slice(0, -1).map((gen, i) => {
                    const nextGen = pipe3DData.branchGens[i + 1];
                    const pts = [gen.pInt, nextGen.pInt, nextGen.pEnd, gen.pEnd];
                    return (
                      <polygon
                        key={i}
                        points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                        fill="url(#grad-3d-skin)"
                        opacity={0.75}
                        stroke="#0ea5e9"
                        strokeWidth="0.5"
                      />
                    );
                  })}

                  {/* Interpenetration Curve (Saddle Cut) */}
                  <polyline
                    points={pipe3DData.branchIntCurve.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Branch Generators */}
                  {showGenerators &&
                    pipe3DData.branchGens.map((gen, idx) => (
                      <line
                        key={idx}
                        x1={gen.pEnd.x}
                        y1={gen.pEnd.y}
                        x2={gen.pInt.x}
                        y2={gen.pInt.y}
                        stroke="#38bdf8"
                        strokeWidth="1"
                        strokeDasharray="4,2"
                      />
                    ))}
                </g>
              )}
            </svg>

            {/* Floating Camera Reset Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCameraAzimuth(35);
                setCameraElevation(25);
              }}
              className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] font-mono text-slate-400 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3 h-3" />
              Reset 3D View
            </button>
          </div>
        </div>

        {/* RIGHT PANE: 2D FLAT PATTERN DEVELOPMENT TEMPLATE (ISO 128) */}
        <div className="flex flex-col relative h-full overflow-hidden bg-slate-950">
          {/* Viewport Header */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                2D Flat Pattern Template (ISO 128)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Scale 1:1 • Stretchout Drafting
              </span>
            </div>
          </div>

          {/* 2D SVG Canvas */}
          <div className="flex-1 w-full h-full relative flex items-center justify-center p-3 overflow-auto">
            <svg
              className="w-full h-full max-h-[480px]"
              viewBox={pattern2D.viewBox}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Engineering millimeter grid */}
                <pattern id="cad-grid-10" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <pattern id="cad-grid-50" width="50" height="50" patternUnits="userSpaceOnUse">
                  <rect width="50" height="50" fill="url(#cad-grid-10)" />
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#334155" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect width="100%" height="100%" fill="url(#cad-grid-50)" />

              {/* RENDER SHAPE 1 2D PATTERN: TRUNCATED CYLINDER */}
              {selectedShape === 'TRUNCATED_CYLINDER' && 'genLines' in pattern2D && (
                <g id="2d-cylinder-pattern">
                  {/* Baseline & Stretchout Extension line */}
                  <line
                    x1={pattern2D.ox}
                    y1={pattern2D.oy}
                    x2={pattern2D.ox + pattern2D.totalW}
                    y2={pattern2D.oy}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />

                  {/* 12 Generator Lines (ISO 128 Type E: Short-Dashed Thin 0.25mm) */}
                  {showGenerators &&
                    pattern2D.genLines.map((gen, idx) => {
                      const isSeam = idx === 0 || idx === 12;
                      return (
                        <g key={idx}>
                          <line
                            x1={gen.x}
                            y1={gen.y1}
                            x2={gen.x}
                            y2={gen.y2}
                            stroke={isSeam ? '#f59e0b' : '#64748b'}
                            strokeWidth={isSeam ? 2 : 1}
                            strokeDasharray={isSeam ? undefined : '5,3'}
                          />
                          {/* Baseline Generator Marker */}
                          <circle cx={gen.x} cy={gen.y1} r="2.5" fill="#38bdf8" />
                          <text
                            x={gen.x}
                            y={gen.y1 + 15}
                            fill={isSeam ? '#fbbf24' : '#94a3b8'}
                            fontSize="10"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {gen.label}
                          </text>

                          {/* Height indicator text on key generators */}
                          {(idx === 0 || idx === 6 || idx === 12) && (
                            <text
                              x={gen.x}
                              y={gen.y2 - 8}
                              fill="#10b981"
                              fontSize="9"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              h={gen.h.toFixed(0)}mm
                            </text>
                          )}
                        </g>
                      );
                    })}

                  {/* Seam Allowance Tab (5mm with 45° chamfer) */}
                  {showSeamAllowance && 'seamPath' in pattern2D && (
                    <path
                      d={pattern2D.seamPath}
                      fill="#f59e0b"
                      fillOpacity="0.15"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                      strokeDasharray="4,2"
                    />
                  )}

                  {/* Finished Development Perimeter (ISO 128 Type A: Continuous Thick 0.5mm) */}
                  <path
                    d={pattern2D.pathD}
                    fill="#0ea5e9"
                    fillOpacity="0.1"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dimension: Stretchout Length L = πD */}
                  <g id="dim-stretchout">
                    <line
                      x1={pattern2D.ox}
                      y1={pattern2D.oy + 32}
                      x2={pattern2D.ox + pattern2D.totalW}
                      y2={pattern2D.oy + 32}
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                      markerStart="url(#dim-arrow-start)"
                      markerEnd="url(#dim-arrow-end)"
                    />
                    <line
                      x1={pattern2D.ox}
                      y1={pattern2D.oy + 8}
                      x2={pattern2D.ox}
                      y2={pattern2D.oy + 40}
                      stroke="#64748b"
                      strokeWidth="0.8"
                    />
                    <line
                      x1={pattern2D.ox + pattern2D.totalW}
                      y1={pattern2D.oy + 8}
                      x2={pattern2D.ox + pattern2D.totalW}
                      y2={pattern2D.oy + 40}
                      stroke="#64748b"
                      strokeWidth="0.8"
                    />
                    <text
                      x={pattern2D.ox + pattern2D.totalW / 2}
                      y={pattern2D.oy + 48}
                      fill="#38bdf8"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Stretchout L = π × D = {cylinderMath.stretchoutL.toFixed(1)} mm
                    </text>
                  </g>

                  {/* Live Unroll Sweep Indicator */}
                  {u > 0 && (
                    <line
                      x1={pattern2D.ox + pattern2D.totalW * u}
                      y1={pattern2D.oy + 10}
                      x2={pattern2D.ox + pattern2D.totalW * u}
                      y2={30}
                      stroke="#a855f7"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                    />
                  )}
                </g>
              )}

              {/* RENDER SHAPE 2 2D PATTERN: CONE FRUSTUM */}
              {selectedShape === 'CONE_FRUSTUM' && 'genRays' in pattern2D && (
                <g id="2d-cone-pattern">
                  {/* Apex Point O */}
                  <circle cx={pattern2D.ox} cy={pattern2D.oy} r="3" fill="#f59e0b" />
                  <text
                    x={pattern2D.ox}
                    y={pattern2D.oy - 8}
                    fill="#fbbf24"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Apex O
                  </text>

                  {/* 12 Radiating Sector Rays (ISO 128: 0.25mm) */}
                  {showGenerators &&
                    pattern2D.genRays.map((ray, idx) => (
                      <g key={idx}>
                        <line
                          x1={ray.x1}
                          y1={ray.y1}
                          x2={ray.x2}
                          y2={ray.y2}
                          stroke="#64748b"
                          strokeWidth="1"
                          strokeDasharray="4,2"
                        />
                        <text
                          x={ray.x2 + 8 * Math.cos(((idx * coneMath.sectorAngleDeg) / 12 * Math.PI) / 180)}
                          y={ray.y2 + 8 * Math.sin(((idx * coneMath.sectorAngleDeg) / 12 * Math.PI) / 180)}
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {ray.label}
                        </text>
                      </g>
                    ))}

                  {/* Finished Sector Template (ISO 128 Type A: 0.5mm Thick) */}
                  <path
                    d={pattern2D.pathD}
                    fill="#0ea5e9"
                    fillOpacity="0.12"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Sector Angle Dimension θ */}
                  <text
                    x={pattern2D.ox}
                    y={pattern2D.oy + 45}
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Sector Angle θ = (r/L) × 360° = {coneMath.sectorAngleDeg.toFixed(1)}°
                  </text>
                </g>
              )}

              {/* RENDER SHAPE 3 2D PATTERN: PIPE T-JUNCTION */}
              {selectedShape === 'PIPE_TEE_JUNCTION' && 'genLines' in pattern2D && (
                <g id="2d-pipe-pattern">
                  {/* Baseline */}
                  <line
                    x1={pattern2D.ox}
                    y1={pattern2D.oy}
                    x2={pattern2D.ox + pattern2D.totalW}
                    y2={pattern2D.oy}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />

                  {/* Branch Generators */}
                  {showGenerators &&
                    pattern2D.genLines.map((gen, idx) => (
                      <g key={idx}>
                        <line
                          x1={gen.x}
                          y1={gen.y1}
                          x2={gen.x}
                          y2={gen.y2}
                          stroke="#64748b"
                          strokeWidth="1"
                          strokeDasharray="4,2"
                        />
                        <circle cx={gen.x} cy={gen.y1} r="2.5" fill="#38bdf8" />
                        <text
                          x={gen.x}
                          y={gen.y1 + 15}
                          fill="#94a3b8"
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {gen.label}
                        </text>
                      </g>
                    ))}

                  {/* Fish-mouth saddle cut profile */}
                  <path
                    d={pattern2D.pathD}
                    fill="#0ea5e9"
                    fillOpacity="0.1"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <text
                    x={pattern2D.ox + pattern2D.totalW / 2}
                    y={pattern2D.oy + 40}
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Branch Stretchout = π × d = {pipeMath.stretchoutBranch.toFixed(1)} mm
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* 4. MATHEMATICAL CALCULATIONS & PARAMETER TUNING DRAWER */}
      <footer className="px-4 py-3 bg-slate-900/95 border-t border-slate-800 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Col 1: Live Mathematical Equations */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Dynamic Analytical Formulas</span>
            </div>
            {selectedShape === 'TRUNCATED_CYLINDER' && (
              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stretchout Length (L = πD):</span>
                  <span className="text-emerald-300 font-bold">{cylinderMath.stretchoutL.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">12-Generator Spacing (s):</span>
                  <span className="text-emerald-300">{cylinderMath.genSpacing.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cut Heights (h_min / h_max):</span>
                  <span className="text-emerald-300 font-bold">{cylinderMath.hMin.toFixed(0)} mm / {cylinderMath.hMax.toFixed(0)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">True Cut Ellipse Axes:</span>
                  <span className="text-emerald-300">{cylinderMath.majorAxis.toFixed(1)} × {cylinderMath.minorAxis.toFixed(1)} mm</span>
                </div>
              </div>
            )}
            {selectedShape === 'CONE_FRUSTUM' && (
              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sector Angle θ = (r/L) × 360°:</span>
                  <span className="text-emerald-300 font-bold">{coneMath.sectorAngleDeg.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Apex Slant Radius (L_apex):</span>
                  <span className="text-emerald-300">{coneMath.slantApex.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frustum Slant Length (L):</span>
                  <span className="text-emerald-300 font-bold">{coneMath.slantFrustum.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sector Arc Length (πD):</span>
                  <span className="text-emerald-300">{coneMath.sectorArcLength.toFixed(1)} mm</span>
                </div>
              </div>
            )}
            {selectedShape === 'PIPE_TEE_JUNCTION' && (
              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Branch Stretchout (πd):</span>
                  <span className="text-emerald-300 font-bold">{pipeMath.stretchoutBranch.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diameter Ratio (d/D):</span>
                  <span className="text-emerald-300">{pipeMath.ratio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Saddle Depth (Δz):</span>
                  <span className="text-emerald-300 font-bold">{pipeMath.maxSaddleDepth.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Main Pipe Hole Stretch:</span>
                  <span className="text-emerald-300">{pipeMath.mainHoleCircumStretch.toFixed(1)} mm</span>
                </div>
              </div>
            )}
          </div>

          {/* Col 2: Interactive Parameter Sliders */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Geometric Dimensions</span>
            </div>
            {selectedShape === 'TRUNCATED_CYLINDER' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Diameter D: {cylDiameter}mm</span>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    step="5"
                    value={cylDiameter}
                    onChange={(e) => setCylDiameter(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Height H: {cylHeight}mm</span>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    step="5"
                    value={cylHeight}
                    onChange={(e) => setCylHeight(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Cut Angle α: {cylCutAngle}°</span>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="5"
                    value={cylCutAngle}
                    onChange={(e) => setCylCutAngle(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
              </div>
            )}
            {selectedShape === 'CONE_FRUSTUM' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Base D1: {coneBaseDiam}mm</span>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    step="5"
                    value={coneBaseDiam}
                    onChange={(e) => setConeBaseDiam(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Top D2: {coneTopDiam}mm</span>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="5"
                    value={coneTopDiam}
                    onChange={(e) => setConeTopDiam(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Height H: {coneHeight}mm</span>
                  <input
                    type="range"
                    min="60"
                    max="110"
                    step="5"
                    value={coneHeight}
                    onChange={(e) => setConeHeight(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
              </div>
            )}
            {selectedShape === 'PIPE_TEE_JUNCTION' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Main D: {pipeMainDiam}mm</span>
                  <input
                    type="range"
                    min="60"
                    max="90"
                    step="5"
                    value={pipeMainDiam}
                    onChange={(e) => setPipeMainDiam(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Branch d: {pipeBranchDiam}mm</span>
                  <input
                    type="range"
                    min="40"
                    max={pipeMainDiam}
                    step="5"
                    value={pipeBranchDiam}
                    onChange={(e) => setPipeBranchDiam(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Length L: {pipeBranchLen}mm</span>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    step="5"
                    value={pipeBranchLen}
                    onChange={(e) => setPipeBranchLen(Number(e.target.value))}
                    className="w-24 h-1.5 bg-slate-800 rounded accent-sky-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Col 3: ISO 128 Line Weight Enforcement Legend */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ISO 128 Line Weights Enforced</span>
            </div>
            <div className="space-y-1 text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-emerald-400 shrink-0" />
                <span className="text-slate-300">Continuous Thick (0.5mm HB)</span>
                <span className="text-slate-500 ml-auto">Cutting Outline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 border-b border-dashed border-sky-400 shrink-0" />
                <span className="text-slate-300">Short-Dashed Thin (0.25mm 2H)</span>
                <span className="text-slate-500 ml-auto">Fold & Bend Lines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 border-b border-amber-400 shrink-0" />
                <span className="text-slate-300">Chain Thin (0.25mm 2H)</span>
                <span className="text-slate-500 ml-auto">Centerlines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-slate-600 shrink-0" />
                <span className="text-slate-300">Continuous Thin (0.25mm 2H)</span>
                <span className="text-slate-500 ml-auto">Generators</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. DOWNLOAD ISO DRAWING SHEET PRINT PREVIEW MODAL */}
      {isPrintPreviewOpen && (
        <div
          id="iso-print-preview-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="w-full max-w-5xl h-[92vh] max-h-[900px] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Printer className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">ISO Technical Drawing Sheet Print Preview</h3>
                  <span className="text-[11px] text-slate-400">
                    Standard A4/A3 Border • NERDC WAEC Title Block • First-Angle Symbol
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-print-action"
                  onClick={handlePrintSheet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  id="btn-download-svg-action"
                  onClick={handleDownloadSVG}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Download SVG
                </button>
                <button
                  onClick={() => setIsPrintPreviewOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Drawing Sheet Container */}
            <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-auto flex items-center justify-center">
              <div className="bg-white text-black p-4 shadow-2xl rounded-sm max-w-[850px] w-full aspect-[1.414/1] relative flex flex-col justify-between border-2 border-black">
                <svg
                  id="iso-drawing-sheet-svg"
                  viewBox="0 0 840 594"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Paper Boundary */}
                  <rect x="0" y="0" width="840" height="594" fill="#ffffff" />

                  {/* Standard Drawing Margin: 20mm left filing, 10mm top, right, bottom */}
                  <rect
                    x="25"
                    y="15"
                    width="790"
                    height="564"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1.8"
                  />

                  {/* Grid Reference Border Lines (A, B, C / 1, 2, 3) */}
                  <text x="420" y="11" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
                    ZONE 2
                  </text>
                  <text x="18" y="297" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
                    B
                  </text>

                  {/* Title Block Box in Bottom Right (ISO 7200 / NERDC) */}
                  <g id="title-block">
                    <rect x="490" y="474" width="325" height="105" fill="none" stroke="#000000" strokeWidth="1.5" />
                    <line x1="490" y1="504" x2="815" y2="504" stroke="#000000" strokeWidth="1" />
                    <line x1="490" y1="534" x2="815" y2="534" stroke="#000000" strokeWidth="1" />
                    <line x1="680" y1="504" x2="680" y2="579" stroke="#000000" strokeWidth="1" />

                    {/* Title Block Content */}
                    <text x="496" y="488" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                      WEST AFRICAN EXAMINATIONS COUNCIL (WASSCE)
                    </text>
                    <text x="496" y="499" fontSize="8" fontFamily="sans-serif" fill="#333">
                      NERDC TECHNICAL DRAWING CURRICULUM • SS3 PRACTICAL
                    </text>

                    <text x="496" y="517" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      {selectedShape === 'TRUNCATED_CYLINDER'
                        ? 'DEVELOPMENT: TRUNCATED CYLINDER'
                        : selectedShape === 'CONE_FRUSTUM'
                        ? 'DEVELOPMENT: RIGHT CONE FRUSTUM'
                        : 'INTERPENETRATION: PIPE TEE BRANCH'}
                    </text>
                    <text x="496" y="528" fontSize="8" fontFamily="sans-serif">
                      STANDARDS: ISO 128-20 / ISO 5456-2 / BS 8888
                    </text>

                    <text x="496" y="547" fontSize="8" fontFamily="sans-serif">
                      SCALE: 1:1 FULL SIZE
                    </text>
                    <text x="496" y="559" fontSize="8" fontFamily="sans-serif">
                      DATE: 2026-09-16
                    </text>
                    <text x="496" y="571" fontSize="8" fontFamily="sans-serif">
                      CANDIDATE: TECHNICAL DRAFTING ACADEMY
                    </text>

                    {/* First Angle Projection Cone Symbol (ISO 5456-2) */}
                    <g transform="translate(710, 520) scale(0.65)">
                      <polygon points="10,20 40,30 40,0 10,10" fill="none" stroke="#000" strokeWidth="1.2" />
                      <line x1="10" y1="10" x2="10" y2="20" stroke="#000" strokeWidth="1.2" />
                      <line x1="40" y1="0" x2="40" y2="30" stroke="#000" strokeWidth="1.2" />
                      <circle cx="65" cy="15" r="14" fill="none" stroke="#000" strokeWidth="1.2" />
                      <circle cx="65" cy="15" r="7" fill="none" stroke="#000" strokeWidth="1.2" />
                      <line x1="0" y1="15" x2="85" y2="15" stroke="#000" strokeWidth="0.6" strokeDasharray="6,2,2,2" />
                      <line x1="65" y1="-5" x2="65" y2="35" stroke="#000" strokeWidth="0.6" strokeDasharray="6,2,2,2" />
                    </g>
                    <text x="745" y="565" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
                      FIRST ANGLE
                    </text>
                  </g>

                  {/* Left Drawing Section: 2D Elevation & Plan Projection */}
                  <g id="sheet-orthographic-views" transform="translate(45, 40)">
                    <text x="0" y="15" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                      1. GIVEN ORTHOGRAPHIC ELEVATION & PLAN
                    </text>
                    <rect x="0" y="30" width="220" height="380" fill="none" stroke="#999" strokeWidth="0.5" strokeDasharray="2,2" />

                    {/* Orthographic Front Elevation */}
                    {selectedShape === 'TRUNCATED_CYLINDER' && (
                      <g transform="translate(40, 50)">
                        {/* Elevation outline */}
                        <polygon
                          points={`0,120 ${cylinderMath.R * 2},120 ${cylinderMath.R * 2},${120 - cylinderMath.hMax} 0,${120 - cylinderMath.hMin}`}
                          fill="none"
                          stroke="#000"
                          strokeWidth="1.5"
                        />
                        {/* Centerline */}
                        <line x1={cylinderMath.R} y1="0" x2={cylinderMath.R} y2="135" stroke="#000" strokeWidth="0.6" strokeDasharray="10,2,2,2" />
                        {/* Cut Line */}
                        <line
                          x1="0"
                          y1={120 - cylinderMath.hMin}
                          x2={cylinderMath.R * 2}
                          y2={120 - cylinderMath.hMax}
                          stroke="#000"
                          strokeWidth="1.5"
                        />
                        {/* Plan View below */}
                        <circle cx={cylinderMath.R} cy="190" r={cylinderMath.R} fill="none" stroke="#000" strokeWidth="1.5" />
                        <line x1={cylinderMath.R} y1="145" x2={cylinderMath.R} y2="235" stroke="#000" strokeWidth="0.6" strokeDasharray="8,2,2,2" />
                        <line x1="-15" y1="190" x2={cylinderMath.R * 2 + 15} y2="190" stroke="#000" strokeWidth="0.6" strokeDasharray="8,2,2,2" />
                        {/* 12 radial generators in Plan */}
                        {[0, 30, 60, 90, 120, 150].map((deg, k) => (
                          <line
                            key={k}
                            x1={cylinderMath.R + cylinderMath.R * Math.cos((deg * Math.PI) / 180)}
                            y1={190 + cylinderMath.R * Math.sin((deg * Math.PI) / 180)}
                            x2={cylinderMath.R - cylinderMath.R * Math.cos((deg * Math.PI) / 180)}
                            y2={190 - cylinderMath.R * Math.sin((deg * Math.PI) / 180)}
                            stroke="#555"
                            strokeWidth="0.5"
                          />
                        ))}
                      </g>
                    )}

                    {selectedShape === 'CONE_FRUSTUM' && (
                      <g transform="translate(45, 60)">
                        <polygon
                          points={`0,130 ${coneMath.r1 * 2},130 ${coneMath.r1 + coneMath.r2},${130 - coneMath.h} ${coneMath.r1 - coneMath.r2},${130 - coneMath.h}`}
                          fill="none"
                          stroke="#000"
                          strokeWidth="1.5"
                        />
                        <line x1={coneMath.r1} y1="10" x2={coneMath.r1} y2="145" stroke="#000" strokeWidth="0.6" strokeDasharray="8,2,2,2" />
                        <circle cx={coneMath.r1} cy="200" r={coneMath.r1} fill="none" stroke="#000" strokeWidth="1.5" />
                        <circle cx={coneMath.r1} cy="200" r={coneMath.r2} fill="none" stroke="#000" strokeWidth="1" strokeDasharray="3,2" />
                      </g>
                    )}

                    {selectedShape === 'PIPE_TEE_JUNCTION' && (
                      <g transform="translate(35, 60)">
                        <rect x="25" y="20" width={pipeMath.R * 2} height="130" fill="none" stroke="#000" strokeWidth="1.5" />
                        <rect x="-35" y="60" width="60" height={pipeMath.r * 2} fill="none" stroke="#000" strokeWidth="1.5" />
                        <path
                          d={`M 25 60 Q ${25 + pipeMath.maxSaddleDepth} ${60 + pipeMath.r} 25 ${60 + pipeMath.r * 2}`}
                          fill="none"
                          stroke="#000"
                          strokeWidth="1.8"
                        />
                      </g>
                    )}
                  </g>

                  {/* Right Drawing Section: Complete 2D Flat Pattern Template (1:1) */}
                  <g id="sheet-pattern-development" transform="translate(290, 40)">
                    <text x="0" y="15" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                      2. FULL SURFACE PATTERN DEVELOPMENT (ISO 128 DRAFTING)
                    </text>
                    <rect x="0" y="30" width="525" height="380" fill="none" stroke="#999" strokeWidth="0.5" strokeDasharray="2,2" />

                    {/* Render Scaled Sheet Pattern */}
                    {selectedShape === 'TRUNCATED_CYLINDER' && (
                      <g transform="translate(25, 140) scale(0.95)">
                        {/* Baseline */}
                        <line x1="0" y1="180" x2={cylinderMath.stretchoutL} y2="180" stroke="#000" strokeWidth="1.5" />
                        {/* 12 Generators */}
                        {Array.from({ length: 13 }).map((_, i) => {
                          const x = (i * cylinderMath.stretchoutL) / 12;
                          const h = cylinderMath.generatorHeights[i];
                          return (
                            <g key={i}>
                              <line x1={x} y1="180" x2={x} y2={180 - h} stroke="#666" strokeWidth="0.6" strokeDasharray="4,2" />
                              <text x={x} y="195" fontSize="8" fontFamily="monospace" textAnchor="middle">
                                {i === 12 ? '1' : `${i + 1}`}
                              </text>
                            </g>
                          );
                        })}
                        {/* Top Sinusoidal Curve */}
                        <path
                          d={`M 0 180 L ${cylinderMath.stretchoutL} 180 L ${cylinderMath.stretchoutL} ${180 - cylinderMath.generatorHeights[12]} ` +
                            Array.from({ length: 13 })
                              .map((_, i) => `${(i * cylinderMath.stretchoutL) / 12},${180 - cylinderMath.generatorHeights[i]}`)
                              .reverse()
                              .join(' L ') + ' Z'}
                          fill="none"
                          stroke="#000"
                          strokeWidth="2"
                        />
                        {/* Seam Tab */}
                        <path
                          d={`M 0 180 L -8 172 L -8 ${180 - cylinderMath.generatorHeights[0] + 8} L 0 ${180 - cylinderMath.generatorHeights[0]}`}
                          fill="none"
                          stroke="#000"
                          strokeWidth="0.8"
                          strokeDasharray="3,2"
                        />
                      </g>
                    )}

                    {selectedShape === 'CONE_FRUSTUM' && (
                      <g transform="translate(250, 45) scale(0.95)">
                        <path
                          d={pattern2D.pathD}
                          fill="none"
                          stroke="#000"
                          strokeWidth="2"
                        />
                        <text x="0" y="240" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                          Sector Angle θ = {coneMath.sectorAngleDeg.toFixed(1)}° • R = {coneMath.slantApex.toFixed(1)}mm
                        </text>
                      </g>
                    )}

                    {selectedShape === 'PIPE_TEE_JUNCTION' && (
                      <g transform="translate(30, 140) scale(0.95)">
                        <path
                          d={pattern2D.pathD}
                          fill="none"
                          stroke="#000"
                          strokeWidth="2"
                        />
                      </g>
                    )}
                  </g>

                  {/* Practical WAEC Candidate Drafting Instructions */}
                  <g id="drafting-instructions" transform="translate(45, 435)">
                    <text x="0" y="15" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      BOARD PRACTICE PROCEDURE (15-MARK WAEC COMPULSORY QUESTIONS):
                    </text>
                    <text x="0" y="30" fontSize="8.5" fontFamily="sans-serif" fill="#222">
                      1. Draw Plan View circle, divide perimeter into 12 equal 30° sectors using 30°-60° Set Square.
                    </text>
                    <text x="0" y="44" fontSize="8.5" fontFamily="sans-serif" fill="#222">
                      2. Project generator division points vertically to intersect the cutting plane in Front Elevation.
                    </text>
                    <text x="0" y="58" fontSize="8.5" fontFamily="sans-serif" fill="#222">
                      3. Lay out stretchout baseline L = π × D (or sector arc θ = (r/L) × 360°) and erect 12 division lines.
                    </text>
                    <text x="0" y="72" fontSize="8.5" fontFamily="sans-serif" fill="#222">
                      4. Project true heights horizontally with T-square; join plot points with a smooth French Curve.
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SurfaceDevelopmentViewer;
