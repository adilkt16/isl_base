'use client';

import { useState, useEffect, useCallback } from 'react';
import { HandshapeEntry, HandPose } from '@/lib/handshape-data';
import { RotateCcw, Info } from 'lucide-react';

interface HandRigProps {
  entry: HandshapeEntry;
}

// Relaxed semi-fist pose to serve as the visual starting point for animations
const HARDCODED_REST_POSE: HandPose = {
  thumb: { mcp: 35, pip: 25, dip: 15, abduction: 8 },
  index: { mcp: 65, pip: 75, dip: 55, abduction: 0 },
  middle: { mcp: 70, pip: 80, dip: 60, abduction: 0 },
  ring: { mcp: 65, pip: 75, dip: 55, abduction: 0 },
  pinky: { mcp: 60, pip: 70, dip: 50, abduction: 0 },
  wristRotation: 0,
  handOrientation: 'palm-out',
};

function interpolateFinger(start: any, end: any, t: number) {
  return {
    mcp: start.mcp + (end.mcp - start.mcp) * t,
    pip: start.pip + (end.pip - start.pip) * t,
    dip: start.dip + (end.dip - start.dip) * t,
    abduction: start.abduction + (end.abduction - start.abduction) * t,
  };
}

function interpolatePose(start: HandPose, end: HandPose, t: number): HandPose {
  return {
    thumb: interpolateFinger(start.thumb, end.thumb, t),
    index: interpolateFinger(start.index, end.index, t),
    middle: interpolateFinger(start.middle, end.middle, t),
    ring: interpolateFinger(start.ring, end.ring, t),
    pinky: interpolateFinger(start.pinky, end.pinky, t),
    wristRotation: start.wristRotation + (end.wristRotation - start.wristRotation) * t,
    handOrientation: t < 0.5 ? start.handOrientation : end.handOrientation,
  };
}

interface HandLayout {
  x: number;
  y: number;
  r: number;
}

const CUSTOM_LAYOUTS: Record<string, { primary: HandLayout; secondary?: HandLayout }> = {
  // A: Closed fists side-by-side
  'A': {
    primary: { x: 140, y: 140, r: 25 },
    secondary: { x: 260, y: 140, r: -25 },
  },
  // B: Loops touching
  'B': {
    primary: { x: 150, y: 140, r: 25 },
    secondary: { x: 250, y: 140, r: -25 },
  },
  // C: One hand
  'C': {
    primary: { x: 180, y: 130, r: 20 },
  },
  // D: Left index vertical, right C loop touching it
  'D': {
    primary: { x: 165, y: 135, r: 35 },
    secondary: { x: 240, y: 145, r: -15 },
  },
  // E: Right index tip touches left index tip
  'E': {
    primary: { x: 150, y: 165, r: 35 },
    secondary: { x: 250, y: 165, r: -35 },
  },
  // F: Left horizontal, right vertical forming a cross
  'F': {
    primary: { x: 175, y: 140, r: 20 },
    secondary: { x: 235, y: 150, r: -60 },
  },
  // G: Stacked vertically
  'G': {
    primary: { x: 185, y: 105, r: 30 },
    secondary: { x: 215, y: 175, r: -30 },
  },
  // H: Left flat palm facing up (horizontal), right sweeping
  'H': {
    primary: { x: 175, y: 120, r: 20 },
    secondary: { x: 245, y: 165, r: -50 },
  },
  // I: Index straight up
  'I': {
    primary: { x: 180, y: 130, r: 15 },
  },
  // J: Start at middle, draw J
  'J': {
    primary: { x: 175, y: 120, r: 20 },
    secondary: { x: 245, y: 165, r: -50 },
  },
  // K: Left straight, right diagonal
  'K': {
    primary: { x: 170, y: 130, r: 35 },
    secondary: { x: 235, y: 145, r: -20 },
  },
  // L: One hand L-shape
  'L': {
    primary: { x: 180, y: 130, r: 15 },
  },
  // M: Right 3 fingers flat on left palm
  'M': {
    primary: { x: 175, y: 110, r: 20 },
    secondary: { x: 245, y: 165, r: -50 },
  },
  // N: Right 2 fingers flat on left palm
  'N': {
    primary: { x: 175, y: 110, r: 20 },
    secondary: { x: 245, y: 165, r: -50 },
  },
  // O: Curved O-shape
  'O': {
    primary: { x: 180, y: 130, r: 20 },
  },
  // P: Left index/thumb stem, right loop
  'P': {
    primary: { x: 165, y: 135, r: 35 },
    secondary: { x: 240, y: 145, r: -15 },
  },
  // Q: Left circle, right hook in circle from below
  'Q': {
    primary: { x: 180, y: 165, r: 65 },
    secondary: { x: 240, y: 125, r: -15 },
  },
  // R: Right hook on left flat palm
  'R': {
    primary: { x: 175, y: 115, r: 20 },
    secondary: { x: 245, y: 165, r: -50 },
  },
  // S: Pinkies extended and hooked
  'S': {
    primary: { x: 150, y: 140, r: 25 },
    secondary: { x: 250, y: 140, r: -25 },
  },
  // T: Index extended and crossing/touching
  'T': {
    primary: { x: 160, y: 140, r: 20 },
    secondary: { x: 240, y: 140, r: -20 },
  },
  // U: Curved fingers
  'U': {
    primary: { x: 180, y: 130, r: 15 },
  },
  // V: V-shape
  'V': {
    primary: { x: 180, y: 130, r: 15 },
  },
  // W: Interlocked fingers
  'W': {
    primary: { x: 160, y: 145, r: 35 },
    secondary: { x: 240, y: 145, r: -35 },
  },
  // X: Index fingers crossed forming an X
  'X': {
    primary: { x: 170, y: 145, r: 45 },
    secondary: { x: 230, y: 145, r: -45 },
  },
  // Y: Index fingers extended
  'Y': {
    primary: { x: 160, y: 140, r: 25 },
    secondary: { x: 240, y: 140, r: -25 },
  },
  // Z: Draws Z on left palm
  'Z': {
    primary: { x: 175, y: 110, r: 20 },
    secondary: { x: 245, y: 165, r: -50 },
  },
};

export default function HandRig({ entry }: HandRigProps) {
  const [currentPrimary, setCurrentPrimary] = useState<HandPose>(HARDCODED_REST_POSE);
  const [currentSecondary, setCurrentSecondary] = useState<HandPose | undefined>(undefined);
  const [isGlow, setIsGlow] = useState(false);
  const [animTrigger, setAnimTrigger] = useState(0);

  // Parse custom layout if defined, else fallback to defaults
  const signKey = entry.signId.toUpperCase();
  const isTwoHanded = entry.hands === 'two';
  const layoutConfig = CUSTOM_LAYOUTS[signKey] || (isTwoHanded ? {
    primary: { x: 140, y: 130, r: 35 },
    secondary: { x: 260, y: 130, r: -35 },
  } : {
    primary: { x: 180, y: 130, r: 15 },
  });

  // Play animation routine
  const triggerAnimation = useCallback(() => {
    let startTimestamp: number | null = null;
    const duration = 600; // ms

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const primaryPose = interpolatePose(HARDCODED_REST_POSE, entry.primary, ease);
      const secondaryPose = entry.secondary
        ? interpolatePose(HARDCODED_REST_POSE, entry.secondary, ease)
        : undefined;

      setCurrentPrimary(primaryPose);
      setCurrentSecondary(secondaryPose);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsGlow(true);
        const timer = setTimeout(() => setIsGlow(false), 150);
        return () => clearTimeout(timer);
      }
    };

    setIsGlow(false);
    requestAnimationFrame(animate);
  }, [entry]);

  useEffect(() => {
    // Reset to rest state first
    setCurrentPrimary(HARDCODED_REST_POSE);
    setCurrentSecondary(entry.secondary ? HARDCODED_REST_POSE : undefined);
    
    const delay = setTimeout(() => {
      triggerAnimation();
    }, 150);

    return () => clearTimeout(delay);
  }, [entry, animTrigger, triggerAnimation]);

  // Compute 2D skeletal joints
  const getHandPoints = (centerX: number, centerY: number, pose: HandPose, side: 'left' | 'right') => {
    const sideMultiplier = side === 'right' ? 1 : -1;
    const bendSign = side === 'right' ? 1 : -1;

    // Use handOrientation to dynamically mirror the left/right finger ordering
    const orientMultiplier = pose.handOrientation === 'palm-in' ? -1 : 1;
    const effectiveSideMultiplier = sideMultiplier * orientMultiplier;
    const effectiveSide = effectiveSideMultiplier === 1 ? 'right' : 'left';

    // Base coordinate locations for finger knuckles (MCP) relative to hand center
    const mcpBases = {
      thumb: { x: centerX - 35 * effectiveSideMultiplier, y: centerY + 25 },
      index: { x: centerX - 20 * effectiveSideMultiplier, y: centerY - 25 },
      middle: { x: centerX - 2 * effectiveSideMultiplier, y: centerY - 30 },
      ring: { x: centerX + 16 * effectiveSideMultiplier, y: centerY - 25 },
      pinky: { x: centerX + 32 * effectiveSideMultiplier, y: centerY - 15 },
    };

    // Ideal pointing angles (degrees) relative to hand vector
    const baseAngles = {
      thumb: effectiveSide === 'right' ? -145 : -35,
      index: effectiveSide === 'right' ? -98 : -82,
      middle: -90,
      ring: effectiveSide === 'right' ? -82 : -98,
      pinky: effectiveSide === 'right' ? -75 : -105,
    };

    // Bone length scales
    const lengths = {
      thumb: [22, 18, 14] as [number, number, number],
      index: [28, 20, 14] as [number, number, number],
      middle: [32, 22, 15] as [number, number, number],
      ring: [30, 20, 14] as [number, number, number],
      pinky: [24, 16, 12] as [number, number, number],
    };

    const getFingerJoints = (name: keyof typeof mcpBases, baseAngle: number, fingerLengths: [number, number, number]) => {
      const fPose = pose[name];
      const mcp = mcpBases[name];
      const d2r = Math.PI / 180;

      const MAX_ABDUCTION = 35;
      const clampedAbduction = Math.max(-MAX_ABDUCTION, Math.min(MAX_ABDUCTION, fPose.abduction));

      // Calculate cumulative flexion (excluding abduction)
      const totalFlexion = fPose.mcp + fPose.pip + fPose.dip;
      const flexProgress = Math.min(1, (fPose.mcp + fPose.pip) / 180);

      // Abduction only affects the base direction (lateral spread at the knuckle)
      const mcpAbduction = clampedAbduction * effectiveSideMultiplier;
      // Damping the abduction for distal joints as the finger curls to avoid tangled claws
      const distalAbduction = mcpAbduction * (1 - flexProgress * 0.9);

      // Apply foreshortening for curled joints to keep fist silhouettes compact and realistic
      let lenScale0 = 1;
      let lenScale1 = 1;
      let lenScale2 = 1;

      if (totalFlexion > 120) {
        const scaleFactor = Math.min(0.65, (totalFlexion - 120) / 150);
        lenScale0 = 1 - 0.35 * scaleFactor;
        lenScale1 = 1 - 0.5 * scaleFactor;
        lenScale2 = 1 - 0.65 * scaleFactor;
      }

      const l0 = fingerLengths[0] * lenScale0;
      const l1 = fingerLengths[1] * lenScale1;
      const l2 = fingerLengths[2] * lenScale2;

      // a1 (MCP joint): uses base mcpAbduction
      const a1 = (baseAngle + mcpAbduction + fPose.mcp * bendSign) * d2r;
      const pip = {
        x: mcp.x + l0 * Math.cos(a1),
        y: mcp.y + l0 * Math.sin(a1),
      };

      // a2 (PIP joint) & a3 (DIP joint): abduction is not compounded, using distalAbduction
      const a2 = (baseAngle + distalAbduction + (fPose.mcp + fPose.pip) * bendSign) * d2r;
      const dip = {
        x: pip.x + l1 * Math.cos(a2),
        y: pip.y + l1 * Math.sin(a2),
      };

      const a3 = (baseAngle + distalAbduction + (fPose.mcp + fPose.pip + fPose.dip) * bendSign) * d2r;
      const tip = {
        x: dip.x + l2 * Math.cos(a3),
        y: dip.y + l2 * Math.sin(a3),
      };

      return [mcp, pip, dip, tip];
    };

    return {
      wrist: { x: centerX, y: centerY + 80 },
      thumb: getFingerJoints('thumb', baseAngles.thumb, lengths.thumb),
      index: getFingerJoints('index', baseAngles.index, lengths.index),
      middle: getFingerJoints('middle', baseAngles.middle, lengths.middle),
      ring: getFingerJoints('ring', baseAngles.ring, lengths.ring),
      pinky: getFingerJoints('pinky', baseAngles.pinky, lengths.pinky),
      mcpBases,
    };
  };

  // ── Volumetric rendering helpers ──

  const capsulePath = (
    p1: {x: number; y: number}, p2: {x: number; y: number},
    r1: number, r2: number
  ): string | null => {
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.5) return null;
    const nx = -dy / len, ny = dx / len;
    return [
      `M ${p1.x + nx * r1} ${p1.y + ny * r1}`,
      `L ${p2.x + nx * r2} ${p2.y + ny * r2}`,
      `A ${r2} ${r2} 0 0 1 ${p2.x - nx * r2} ${p2.y - ny * r2}`,
      `L ${p1.x - nx * r1} ${p1.y - ny * r1}`,
      `A ${r1} ${r1} 0 0 1 ${p1.x + nx * r1} ${p1.y + ny * r1}`,
      'Z',
    ].join(' ');
  };

  const nailEl = (
    tip: {x: number; y: number}, prev: {x: number; y: number},
    r: number, key: string
  ) => {
    const dx = tip.x - prev.x, dy = tip.y - prev.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.5) return null;
    const cx = tip.x - (dx / len) * r * 0.25;
    const cy = tip.y - (dy / len) * r * 0.25;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return (
      <ellipse key={key} cx={cx} cy={cy}
        rx={r * 0.72} ry={r * 0.52}
        fill="#fce4d6" stroke="#dbb8a0" strokeWidth={0.6}
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
    );
  };

  const creaseEl = (
    jt: {x: number; y: number}, prev: {x: number; y: number},
    next: {x: number; y: number}, r: number, color: string, key: string
  ) => {
    const dx = next.x - prev.x, dy = next.y - prev.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.5) return null;
    const nx = -dy / len, ny = dx / len;
    const h = r * 0.65;
    return (
      <line key={key}
        x1={jt.x + nx * h} y1={jt.y + ny * h}
        x2={jt.x - nx * h} y2={jt.y - ny * h}
        stroke={color} strokeWidth={0.8} strokeLinecap="round"
      />
    );
  };

  // Finger capsule radii: [mcp→pip, pip→dip, dip→tip] each [r_start, r_end]
  const RADII: Record<string, number[][]> = {
    thumb:  [[6.5, 5.5], [5.5, 4.8], [4.8, 4]],
    index:  [[5.5, 4.7], [4.7, 3.8], [3.8, 3]],
    middle: [[5.8, 5],   [5, 4],     [4, 3.2]],
    ring:   [[5.2, 4.5], [4.5, 3.6], [3.6, 2.8]],
    pinky:  [[4.5, 3.8], [3.8, 3],   [3, 2.4]],
  };

  // Render a single hand — volumetric illustration style
  const renderHandSkeleton = (layout: HandLayout, pose: HandPose, side: 'left' | 'right') => {
    const data = getHandPoints(0, 0, pose, side);
    const sideMultiplier = side === 'right' ? 1 : -1;
    const totalRotation = layout.r + pose.wristRotation;
    const rad = totalRotation * Math.PI / 180;
    const orientMultiplier = pose.handOrientation === 'palm-in' ? -1 : 1;
    const effectiveSideMultiplier = sideMultiplier * orientMultiplier;

    const ptLeftX = layout.x + (-22 * effectiveSideMultiplier * Math.cos(rad) - 80 * Math.sin(rad));
    const ptLeftY = layout.y + (-22 * effectiveSideMultiplier * Math.sin(rad) + 80 * Math.cos(rad));
    const ptRightX = layout.x + (22 * effectiveSideMultiplier * Math.cos(rad) - 80 * Math.sin(rad));
    const ptRightY = layout.y + (22 * effectiveSideMultiplier * Math.sin(rad) + 80 * Math.cos(rad));

    const edgeX = layout.x < 200 ? 0 : 400;
    const edgeYTop = layout.y + 40;
    const edgeYBottom = layout.y + 110;

    const isPalmIn = pose.handOrientation === 'palm-in';
    const skin   = isPalmIn ? '#e8c4a0' : '#f5d4b5';
    const skinBg = isPalmIn ? '#ddb890' : '#edd0b0';
    const outline = isPalmIn ? '#c09870' : '#d4a878';
    const crease  = isPalmIn ? '#c8a078' : '#e0c0a0';

    const palmPoints = [
      `${-24 * effectiveSideMultiplier},${data.wrist.y}`,
      `${data.mcpBases.thumb.x},${data.mcpBases.thumb.y}`,
      `${data.mcpBases.index.x},${data.mcpBases.index.y}`,
      `${data.mcpBases.middle.x},${data.mcpBases.middle.y}`,
      `${data.mcpBases.ring.x},${data.mcpBases.ring.y}`,
      `${data.mcpBases.pinky.x},${data.mcpBases.pinky.y}`,
      `${24 * effectiveSideMultiplier},${data.wrist.y}`,
    ].join(' ');

    const fingers: ('thumb' | 'index' | 'middle' | 'ring' | 'pinky')[] = [
      'thumb', 'index', 'middle', 'ring', 'pinky',
    ];

    return (
      <g>
        {/* Forearm */}
        <path
          d={`M ${ptLeftX} ${ptLeftY} L ${ptRightX} ${ptRightY} L ${edgeX} ${edgeYBottom} L ${edgeX} ${edgeYTop} Z`}
          fill={skin} stroke={outline} strokeWidth="1.5" strokeLinejoin="round"
        />

        <g className="transition-all duration-300"
           transform={`translate(${layout.x}, ${layout.y}) rotate(${totalRotation})`}>

          {/* Glow pulse */}
          <circle cx={0} cy={0} r="100"
            className={`fill-brand-500/10 blur-xl transition-all duration-300 ease-out pointer-events-none ${
              isGlow ? 'scale-110 opacity-100' : 'scale-90 opacity-0'
            }`}
          />

          {/* Palm */}
          <polygon points={palmPoints}
            fill={skin} stroke={outline} strokeWidth="1.5" strokeLinejoin="round"
          />

          {/* Palm inner shadow for depth */}
          <polygon points={palmPoints}
            fill="url(#palmShadow)" stroke="none"
          />

          {/* Palm creases (palm-out) */}
          {!isPalmIn && (
            <g fill="none" stroke={crease} strokeWidth="1" strokeLinecap="round" opacity={0.7}>
              <path d="M -12 -8 Q 0 -3 12 -18" />
              <path d="M -16 6 Q -2 14 16 -3" />
              <path d="M -8 18 Q 2 22 10 12" />
            </g>
          )}

          {/* Knuckle bumps (palm-in) */}
          {isPalmIn && (
            <g fill="none" stroke={crease} strokeWidth="1.2" strokeLinecap="round" opacity={0.6}>
              {(['index', 'middle', 'ring', 'pinky'] as const).map((f) => {
                const b = data.mcpBases[f];
                return <circle key={f} cx={b.x} cy={b.y - 2} r={3.5} />;
              })}
            </g>
          )}

          {/* Finger capsules, creases, and nails */}
          {fingers.map((name) => {
            const pts = data[name];
            const r = RADII[name];
            const segments = [
              { a: pts[0], b: pts[1], r: r[0] },
              { a: pts[1], b: pts[2], r: r[1] },
              { a: pts[2], b: pts[3], r: r[2] },
            ];

            const glowOutline = isGlow ? 'var(--color-brand-500)' : outline;

            return (
              <g key={name}>
                {/* Shadow layer (slightly offset, blurred) */}
                {segments.map((s, i) => {
                  const d = capsulePath(s.a, s.b, s.r[0], s.r[1]);
                  return d ? (
                    <path key={`sh-${i}`} d={d}
                      fill={skinBg} stroke="none" opacity={0.5}
                      transform="translate(0.5, 1)"
                    />
                  ) : null;
                })}

                {/* Main capsule segments */}
                {segments.map((s, i) => {
                  const d = capsulePath(s.a, s.b, s.r[0], s.r[1]);
                  return d ? (
                    <path key={`cap-${i}`} d={d}
                      fill={skin} stroke={glowOutline}
                      strokeWidth={1.2} strokeLinejoin="round"
                      className="transition-colors duration-150"
                    />
                  ) : null;
                })}

                {/* Joint creases at PIP and DIP */}
                {creaseEl(pts[1], pts[0], pts[2], r[1][0], crease, `cr-${name}-pip`)}
                {creaseEl(pts[2], pts[1], pts[3], r[2][0], crease, `cr-${name}-dip`)}

                {/* Fingernail at tip */}
                {nailEl(pts[3], pts[2], r[2][1], `nail-${name}`)}
              </g>
            );
          })}
        </g>
      </g>
    );
  };

  // Generate dynamic disclaimer text based on confidence and sourceNote
  const getDisclaimerText = () => {
    const note = entry.sourceNote ? ` ${entry.sourceNote}` : '';
    switch (entry.confidence) {
      case 'data-derived':
        return `Rendered from real captured hand-landmark data (median across samples).${note}`;
      case 'convention':
        return `Based on standard finger-counting convention, not verified against captured data.${note}`;
      case 'placeholder-unconfirmed':
      default:
        return `Animating from rest to placeholder pose. Real joint angles require certified ISLRTC calibration data.${note}`;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center rounded-xl border border-brand-100 bg-[#fbfaf7]/60 p-4 shadow-inner min-h-[300px]">
      
      {/* Hand Rig SVG Viewport */}
      <svg
        viewBox="0 0 400 300"
        className="w-full max-w-sm h-auto select-none"
      >
        <defs>
          <radialGradient id="palmShadow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
          </radialGradient>
        </defs>
        {isTwoHanded && currentSecondary && layoutConfig.secondary ? (
          <>
            {/* Secondary Hand (Left, shown on the right side) */}
            {renderHandSkeleton(layoutConfig.secondary, currentSecondary, 'left')}
            
            {/* Primary Hand (Right, shown on the left side) */}
            {renderHandSkeleton(layoutConfig.primary, currentPrimary, 'right')}
          </>
        ) : (
          /* Single Hand (Right, centered/left) */
          renderHandSkeleton(layoutConfig.primary, currentPrimary, 'right')
        )}
      </svg>

      {/* Floating Toolbar Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setAnimTrigger((prev) => prev + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-100 bg-white text-[#5d5a55] hover:text-[#1e1e1f] hover:shadow-sm transition-all cursor-pointer"
          title="Replay movement"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Dynamic Disclaimer Info Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-start gap-1.5 rounded bg-brand-50/50 p-2 text-left border border-brand-50 text-[10px] text-brand-700 leading-normal">
        <Info className="h-3.5 w-3.5 shrink-0 text-brand-500 mt-0.5" />
        <span>
          <strong>
            {entry.confidence === 'data-derived' ? 'Data-Derived Sign' : entry.confidence === 'convention' ? 'Conventional Sign' : 'Visual Rest Pose'}
          </strong>: {getDisclaimerText()}
        </span>
      </div>
    </div>
  );
}
