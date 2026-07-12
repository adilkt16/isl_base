'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredProgress, ProgressState } from '@/utils/localStorage';
import { ALPHABET_SIGNS, NUMBER_SIGNS } from '@/data/signs';
import { Play, Check, Circle, ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';

type NodeState = 'not-started' | 'in-progress' | 'completed';

type CurriculumNode = {
  id: string;
  label: string;
  category: 'alphabet' | 'number' | 'origin';
  x: number;
  y: number;
  description: string;
  signCount: number;
};

const NODES: CurriculumNode[] = [
  {
    id: 'origin',
    label: 'Start Here',
    category: 'origin',
    x: 300,
    y: 60,
    description: 'Begin your journey into Indian Sign Language fingerspelling and numbers.',
    signCount: 0,
  },
  {
    id: 'alphabet',
    label: 'Alphabet Track',
    category: 'alphabet',
    x: 130,
    y: 240,
    description: 'Learn the 2-handed fingerspelling signs for letters A to Z.',
    signCount: 26,
  },
  {
    id: 'numbers',
    label: 'Numbers Track',
    category: 'number',
    x: 470,
    y: 240,
    description: 'Learn single digits, combination gestures, and decimal transitions.',
    signCount: 14,
  },
];

export default function CurriculumMap() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<CurriculumNode | null>(null);
  const [animatePaths, setAnimatePaths] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Load progress
  useEffect(() => {
    setProgress(getStoredProgress());

    // Skip path draw animations on subsequent visits
    const visited = sessionStorage.getItem('isl_curriculum_visited');
    if (!visited) {
      setAnimatePaths(true);
      sessionStorage.setItem('isl_curriculum_visited', 'true');
    }
  }, []);

  // Compute stats for progress
  const getProgressStats = (node: CurriculumNode) => {
    if (node.category === 'origin') {
      return { learned: 0, percent: 100, state: 'completed' as NodeState };
    }
    const currentList = node.category === 'alphabet' ? ALPHABET_SIGNS : NUMBER_SIGNS;
    const learnedInList = progress
      ? progress.learnedSigns.filter((id) => currentList.some((s) => s.id === id)).length
      : 0;
    const total = currentList.length;
    const percent = Math.round((learnedInList / total) * 100) || 0;
    
    let state: NodeState = 'not-started';
    if (percent === 100) {
      state = 'completed';
    } else if (percent > 0) {
      state = 'in-progress';
    }
    
    return { learned: learnedInList, percent, state };
  };

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.zoom-control-btn')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.zoom-control-btn')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
  };

  const handleZoom = (factor: number) => {
    setZoom((z) => Math.max(0.6, Math.min(z * factor, 2.5)));
  };

  const handleReset = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleNodeClick = (node: CurriculumNode) => {
    if (node.category === 'alphabet') {
      router.push('/lessons/alphabet/a');
    } else if (node.category === 'number') {
      router.push('/lessons/number/0');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-brand-100 bg-white/70 shadow-inner select-none h-[420px] w-full">
      {/* Zoom and Drag Instructions */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-1 bg-[#fbfaf7] border border-brand-100 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => handleZoom(1.2)}
            className="zoom-control-btn p-1.5 rounded text-[#5d5a55] hover:bg-brand-50 hover:text-brand-600 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="zoom-control-btn p-1.5 rounded text-[#5d5a55] hover:bg-brand-50 hover:text-brand-600 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="zoom-control-btn p-1.5 rounded text-[#5d5a55] hover:bg-brand-50 hover:text-brand-600 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 rounded-full bg-brand-50/80 px-2 py-0.5 text-[9px] text-[#5d5a55] border border-brand-100">
          <Move className="h-3 w-3" />
          <span>Drag to pan map</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className={`h-full w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="transition-transform duration-75">
          {/* Paths (Edges) */}
          {NODES.filter(n => n.id !== 'origin').map((node) => {
            const startX = 300;
            const startY = 60;
            const endX = node.x;
            const endY = node.y;
            // Draw smooth bezier curves
            const pathData = `M ${startX} ${startY} C ${startX} ${startY + 100}, ${endX} ${endY - 100}, ${endX} ${endY}`;
            
            const stats = getProgressStats(node);
            const isPathActive = stats.state !== 'not-started';

            return (
              <path
                key={`edge-${node.id}`}
                d={pathData}
                fill="none"
                stroke={isPathActive ? '#bf4f26' : '#ebdcd0'}
                strokeWidth="3"
                strokeDasharray={animatePaths ? '1000' : 'none'}
                strokeDashoffset={animatePaths ? '1000' : 'none'}
                className={animatePaths ? 'animate-draw' : ''}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const stats = getProgressStats(node);
            const { state, percent } = stats;

            // Compute styling based on state
            let bgFill = '#fcfbf9';
            let strokeColor = '#ebdcd0';
            let textColor = '#5d5a55';
            let statusIcon = null;

            if (node.category === 'origin') {
              bgFill = '#bf4f26';
              strokeColor = '#a83d1c';
              textColor = '#ffffff';
            } else if (state === 'completed') {
              bgFill = '#fae2d3';
              strokeColor = '#bf4f26';
              textColor = '#bf4f26';
            } else if (state === 'in-progress') {
              bgFill = '#ffffff';
              strokeColor = '#bf4f26';
              textColor = '#1e1e1f';
            }

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.x - 90}, ${node.y - 35})`}
                className="cursor-pointer group"
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Box */}
                <rect
                  width="180"
                  height="70"
                  rx="12"
                  ry="12"
                  fill={bgFill}
                  stroke={strokeColor}
                  strokeWidth={state !== 'not-started' ? '2.5' : '1.5'}
                  className="transition-all group-hover:shadow-md group-hover:scale-[1.02]"
                />

                {/* Node Label */}
                <text
                  x="90"
                  y="30"
                  textAnchor="middle"
                  className={`font-serif text-sm font-bold ${
                    node.category === 'origin' ? 'fill-white' : 'fill-[#1e1e1f]'
                  }`}
                >
                  {node.label}
                </text>

                {/* Subtext (Progress) */}
                {node.category !== 'origin' && (
                  <text
                    x="90"
                    y="50"
                    textAnchor="middle"
                    className="font-sans text-[10px] font-semibold fill-[#86827a]"
                  >
                    {state === 'completed'
                      ? 'Completed'
                      : state === 'in-progress'
                      ? `In Progress (${percent}%)`
                      : 'Not Started'}
                  </text>
                )}

                {node.category === 'origin' && (
                  <text
                    x="90"
                    y="50"
                    textAnchor="middle"
                    className="font-sans text-[9px] font-medium fill-brand-100"
                  >
                    Click to browse tracks
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Preview Card on Hover */}
      {hoveredNode && (
        <div
          className="absolute bottom-4 right-4 max-w-xs rounded-lg border border-brand-200 bg-white p-4 shadow-lg pointer-events-none transition-opacity duration-200 animate-in fade-in"
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-brand-600">
            {hoveredNode.category === 'origin'
              ? 'Introduction'
              : hoveredNode.category === 'alphabet'
              ? 'Alphabet Track'
              : 'Numbers Track'}
          </span>
          <h4 className="font-serif text-sm font-bold text-[#1e1e1f] mt-0.5">
            {hoveredNode.label}
          </h4>
          <p className="mt-1 text-xs text-[#5d5a55] leading-relaxed">
            {hoveredNode.description}
          </p>
          {hoveredNode.category !== 'origin' && (
            <div className="mt-2.5 flex items-center justify-between text-[10px] border-t border-brand-50 pt-2 font-semibold">
              <span className="text-[#86827a]">{hoveredNode.signCount} total signs</span>
              <span className="text-brand-600">
                {getProgressStats(hoveredNode).learned} learned (
                {getProgressStats(hoveredNode).percent}%)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
