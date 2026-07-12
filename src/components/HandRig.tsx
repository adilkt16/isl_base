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

    // Base coordinate locations for finger knuckles (MCP) relative to hand center
    const mcpBases = {
      thumb: { x: centerX - 35 * sideMultiplier, y: centerY + 25 },
      index: { x: centerX - 20 * sideMultiplier, y: centerY - 25 },
      middle: { x: centerX - 2 * sideMultiplier, y: centerY - 30 },
      ring: { x: centerX + 16 * sideMultiplier, y: centerY - 25 },
      pinky: { x: centerX + 32 * sideMultiplier, y: centerY - 15 },
    };

    // Ideal pointing angles (degrees) relative to hand vector
    const baseAngles = {
      thumb: side === 'right' ? -145 : -35,
      index: side === 'right' ? -98 : -82,
      middle: -90,
      ring: side === 'right' ? -82 : -98,
      pinky: side === 'right' ? -75 : -105,
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

      const MAX_ABDUCTION = 35; // degrees -- real finger spread rarely exceeds this
      const clampedAbduction = Math.max(-MAX_ABDUCTION, Math.min(MAX_ABDUCTION, fPose.abduction));

      const a1 = (baseAngle + clampedAbduction * sideMultiplier + fPose.mcp * bendSign) * d2r;
      const pip = {
        x: mcp.x + fingerLengths[0] * Math.cos(a1),
        y: mcp.y + fingerLengths[0] * Math.sin(a1),
      };

      const a2 = (baseAngle + clampedAbduction * sideMultiplier + (fPose.mcp + fPose.pip) * bendSign) * d2r;
      const dip = {
        x: pip.x + fingerLengths[1] * Math.cos(a2),
        y: pip.y + fingerLengths[1] * Math.sin(a2),
      };

      const a3 = (baseAngle + clampedAbduction * sideMultiplier + (fPose.mcp + fPose.pip + fPose.dip) * bendSign) * d2r;
      const tip = {
        x: dip.x + fingerLengths[2] * Math.cos(a3),
        y: dip.y + fingerLengths[2] * Math.sin(a3),
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

  // Render a single hand SVG skeleton
  const renderHandSkeleton = (layout: HandLayout, pose: HandPose, side: 'left' | 'right') => {
    const data = getHandPoints(0, 0, pose, side);
    const sideMultiplier = side === 'right' ? 1 : -1;

    // Draw palm polygon
    const palmPoints = [
      `${-24 * sideMultiplier},${data.wrist.y}`,
      `${data.mcpBases.thumb.x},${data.mcpBases.thumb.y}`,
      `${data.mcpBases.index.x},${data.mcpBases.index.y}`,
      `${data.mcpBases.middle.x},${data.mcpBases.middle.y}`,
      `${data.mcpBases.ring.x},${data.mcpBases.ring.y}`,
      `${data.mcpBases.pinky.x},${data.mcpBases.pinky.y}`,
      `${24 * sideMultiplier},${data.wrist.y}`,
    ].join(' ');

    const fingers: ('thumb' | 'index' | 'middle' | 'ring' | 'pinky')[] = [
      'thumb',
      'index',
      'middle',
      'ring',
      'pinky',
    ];

    const rad = layout.r * Math.PI / 180;

    // Calculate global wrist connection points
    const ptLeftX = layout.x + (-22 * sideMultiplier * Math.cos(rad) - 80 * Math.sin(rad));
    const ptLeftY = layout.y + (-22 * sideMultiplier * Math.sin(rad) + 80 * Math.cos(rad));
    const ptRightX = layout.x + (22 * sideMultiplier * Math.cos(rad) - 80 * Math.sin(rad));
    const ptRightY = layout.y + (22 * sideMultiplier * Math.sin(rad) + 80 * Math.cos(rad));

    // Determine screen edge based on horizontal layout placement
    // Left-side hands connect to left edge (x = 0), right-side hands connect to right edge (x = 400)
    const edgeX = layout.x < 200 ? 0 : 400;
    const edgeYTop = layout.y + 40;
    const edgeYBottom = layout.y + 110;

    return (
      <g>
        {/* Forearm shape in global coordinates (rendered behind palm) */}
        <path
          d={`M ${ptLeftX} ${ptLeftY} L ${ptRightX} ${ptRightY} L ${edgeX} ${edgeYBottom} L ${edgeX} ${edgeYTop} Z`}
          fill="#faf7f2"
          stroke="#1e1e1f"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Rotated hand skeleton group */}
        <g 
          className="transition-all duration-300"
          transform={`translate(${layout.x}, ${layout.y}) rotate(${layout.r})`}
        >
          {/* Subtle background lock-in glow */}
          <circle
            cx={0}
            cy={0}
            r="100"
            className={`fill-brand-500/10 blur-xl transition-all duration-300 ease-out pointer-events-none ${
              isGlow ? 'scale-110 opacity-100' : 'scale-90 opacity-0'
            }`}
          />

          {/* Palm polygon */}
          <polygon
            points={palmPoints}
            fill="#faf7f2"
            stroke="#1e1e1f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Finger bone lines & joints */}
          {fingers.map((name) => {
            const pts = data[name];
            const pathD = `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y} L ${pts[3].x} ${pts[3].y}`;

            return (
              <g key={name}>
                {/* Bone segment paths */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isGlow ? 'var(--color-brand-500)' : '#1e1e1f'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-150"
                />
                
                {/* Joint nodes */}
                {pts.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#ffffff"
                    stroke={isGlow ? 'var(--color-brand-500)' : '#5d5a55'}
                    strokeWidth="2"
                    className="transition-colors duration-150"
                  />
                ))}
              </g>
            );
          })}
        </g>
      </g>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center rounded-xl border border-brand-100 bg-[#fbfaf7]/60 p-4 shadow-inner min-h-[300px]">
      
      {/* Hand Rig SVG Viewport */}
      <svg
        viewBox="0 0 400 300"
        className="w-full max-w-sm h-auto select-none"
      >
        {isTwoHanded && currentSecondary && layoutConfig.secondary ? (
          <>
            {/* Secondary Hand (Left, shown on the left) */}
            {renderHandSkeleton(layoutConfig.secondary, currentSecondary, 'left')}
            
            {/* Primary Hand (Right, shown on the right) */}
            {renderHandSkeleton(layoutConfig.primary, currentPrimary, 'right')}
          </>
        ) : (
          /* Single Hand (Right, centered) */
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

      {/* Placeholder Disclaimer Info Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-start gap-1.5 rounded bg-brand-50/50 p-2 text-left border border-brand-50 text-[10px] text-brand-700 leading-normal">
        <Info className="h-3.5 w-3.5 shrink-0 text-brand-500 mt-0.5" />
        <span>
          <strong>Visual Rest Pose</strong>: Animating from rest to placeholder pose. Real joint angles require certified ISLRTC calibration data.
        </span>
      </div>
    </div>
  );
}
