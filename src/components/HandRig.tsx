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

export default function HandRig({ entry }: HandRigProps) {
  const [currentPrimary, setCurrentPrimary] = useState<HandPose>(HARDCODED_REST_POSE);
  const [currentSecondary, setCurrentSecondary] = useState<HandPose | undefined>(undefined);
  const [isGlow, setIsGlow] = useState(false);
  const [animTrigger, setAnimTrigger] = useState(0);

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

      const a1 = (baseAngle + fPose.abduction * sideMultiplier + fPose.mcp * bendSign) * d2r;
      const pip = {
        x: mcp.x + fingerLengths[0] * Math.cos(a1),
        y: mcp.y + fingerLengths[0] * Math.sin(a1),
      };

      const a2 = (baseAngle + fPose.abduction * sideMultiplier + (fPose.mcp + fPose.pip) * bendSign) * d2r;
      const dip = {
        x: pip.x + fingerLengths[1] * Math.cos(a2),
        y: pip.y + fingerLengths[1] * Math.sin(a2),
      };

      const a3 = (baseAngle + fPose.abduction * sideMultiplier + (fPose.mcp + fPose.pip + fPose.dip) * bendSign) * d2r;
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
  const renderHandSkeleton = (centerX: number, centerY: number, pose: HandPose, side: 'left' | 'right') => {
    const data = getHandPoints(centerX, centerY, pose, side);
    const sideMultiplier = side === 'right' ? 1 : -1;

    // Draw palm polygon
    const palmPoints = [
      `${centerX - 24 * sideMultiplier},${data.wrist.y}`,
      `${data.mcpBases.thumb.x},${data.mcpBases.thumb.y}`,
      `${data.mcpBases.index.x},${data.mcpBases.index.y}`,
      `${data.mcpBases.middle.x},${data.mcpBases.middle.y}`,
      `${data.mcpBases.ring.x},${data.mcpBases.ring.y}`,
      `${data.mcpBases.pinky.x},${data.mcpBases.pinky.y}`,
      `${centerX + 24 * sideMultiplier},${data.wrist.y}`,
    ].join(' ');

    const fingers: ('thumb' | 'index' | 'middle' | 'ring' | 'pinky')[] = [
      'thumb',
      'index',
      'middle',
      'ring',
      'pinky',
    ];

    return (
      <g className="transition-all duration-300">
        
        {/* Subtle background lock-in glow */}
        <circle
          cx={centerX}
          cy={centerY}
          r="100"
          className={`fill-brand-500/10 blur-xl transition-all duration-300 ease-out pointer-events-none ${
            isGlow ? 'scale-110 opacity-100' : 'scale-90 opacity-0'
          }`}
        />

        {/* Wrist base shape */}
        <path
          d={`M ${centerX - 24 * sideMultiplier} ${data.wrist.y} 
              L ${centerX + 24 * sideMultiplier} ${data.wrist.y} 
              L ${centerX + 18 * sideMultiplier} ${data.wrist.y + 20} 
              L ${centerX - 18 * sideMultiplier} ${data.wrist.y + 20} Z`}
          fill="#f0ede8"
          stroke="#5d5a55"
          strokeWidth="2"
          strokeLinejoin="round"
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
    );
  };

  const isTwoHanded = entry.hands === 'two';

  return (
    <div className="relative flex flex-col items-center justify-center rounded-xl border border-brand-100 bg-[#fbfaf7]/60 p-4 shadow-inner min-h-[300px]">
      
      {/* Hand Rig SVG Viewport */}
      <svg
        viewBox="0 0 400 300"
        className="w-full max-w-sm h-auto select-none"
      >
        {isTwoHanded && currentSecondary ? (
          <>
            {/* Secondary Hand (Left, shown on the left) */}
            {renderHandSkeleton(120, 140, currentSecondary, 'left')}
            
            {/* Primary Hand (Right, shown on the right) */}
            {renderHandSkeleton(280, 140, currentPrimary, 'right')}
          </>
        ) : (
          /* Single Hand (Right, centered) */
          renderHandSkeleton(200, 140, currentPrimary, 'right')
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
