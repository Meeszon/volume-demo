import { useState, useMemo, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import {
  SportShoe, Dumbbell, Wrench, Puzzle, Spline,
  Eye, Target, Heart, User, Zap,
  RotateCcw, RotateCw, Hand, RefreshCw, GripHorizontal,
  type LucideIcon,
} from "lucide-react";
import { SKILL_TREE, CATEGORY_COLORS } from "../../data/skillTree";
import { isLeaf } from "../../utils/tree";
import type { TreeBranch, TreeLeaf, TreeNode } from "../../types";
import { GoalsDashboard } from "./GoalsDashboard";
import { SkillDetailPanel } from "./SkillDetailPanel";
import styles from "./SkillTreePage.module.css";

// ── Layout constants ──────────────────────────────────────────────────────────
const W = 900;
const H = 640;
const PENT_CX = 450;
const PENT_CY = 320;
const PENT_R = 145;
const CAT_R = 46;
const CAT_GLOW_R = 58;
const CAT_ICON = 26;
const CENTER_R = 24;
const L1_R = 32;
const L1_GLOW_R = 44;
const L1_ICON = 18;
const L1_FORWARD = 115;
const L1_LATERAL = 80;

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  "technique": SportShoe,
  "flexibility-mobility": Spline,
  "mental": Puzzle,
  "grips": Wrench,
  "physical-strength": Dumbbell,
  "footwork": SportShoe,
  "body-positioning": User,
  "dynamic-movement": Zap,
  "hip-mobility": RotateCcw,
  "ankle-calf-flexibility": RotateCw,
  "shoulder-mobility": RotateCcw,
  "route-reading": Eye,
  "commitment": Target,
  "fear-management": Heart,
  "slopers": Hand,
  "crimp-styles": GripHorizontal,
  "pinches": Hand,
  "core-tension": Zap,
  "finger-strength": GripHorizontal,
  "power-endurance": RefreshCw,
  "antagonist-training": Dumbbell,
};

// ── Geometry helpers ──────────────────────────────────────────────────────────
function catPos(i: number): [number, number] {
  const a = (i * 72 - 90) * (Math.PI / 180);
  return [
    Math.round(PENT_CX + PENT_R * Math.cos(a)),
    Math.round(PENT_CY + PENT_R * Math.sin(a)),
  ];
}

function hexPts(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = i * 60 * (Math.PI / 180);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

function calcL1Positions(catIdx: number, count: number): Array<[number, number]> {
  const θ = (catIdx * 72 - 90) * (Math.PI / 180);
  const perpθ = θ + Math.PI / 2;
  const [cx, cy] = catPos(catIdx);
  return Array.from({ length: count }, (_, i) => {
    const lateral = (i - (count - 1) / 2) * L1_LATERAL;
    return [
      cx + L1_FORWARD * Math.cos(θ) + lateral * Math.cos(perpθ),
      cy + L1_FORWARD * Math.sin(θ) + lateral * Math.sin(perpθ),
    ] as [number, number];
  });
}

function l1LabelProps(cx: number, cy: number, lineIdx: number, lineCount: number) {
  const θ = Math.atan2(cy - PENT_CY, cx - PENT_CX) * (180 / Math.PI);
  const gap = L1_GLOW_R + 7;
  if (θ < -45 && θ > -135) {
    return { x: cx, y: cy - gap - (lineCount - 1 - lineIdx) * 12, anchor: "middle" as const };
  } else if (θ > 45 && θ < 135) {
    return { x: cx, y: cy + gap + lineIdx * 12, anchor: "middle" as const };
  } else if (cx >= PENT_CX) {
    return { x: cx + gap, y: cy + (lineIdx - (lineCount - 1) / 2) * 12, anchor: "start" as const };
  } else {
    return { x: cx - gap, y: cy + (lineIdx - (lineCount - 1) / 2) * 12, anchor: "end" as const };
  }
}

function labelLines(label: string): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (w === "&") { cur += (cur ? " " : "") + w; }
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ── Center person icon ────────────────────────────────────────────────────────
function PersonCenter() {
  return (
    <g style={{ pointerEvents: "none" }}>
      <polygon points={hexPts(PENT_CX, PENT_CY, CENTER_R)} fill="#1a1a1a" />
      <circle cx={PENT_CX} cy={PENT_CY - 8} r={5.5} fill="white" />
      <path
        d={`M ${PENT_CX - 9},${PENT_CY + 14} Q ${PENT_CX - 9},${PENT_CY + 3} ${PENT_CX},${PENT_CY + 2} Q ${PENT_CX + 9},${PENT_CY + 3} ${PENT_CX + 9},${PENT_CY + 14}`}
        fill="white"
      />
    </g>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function SkillTreePage() {
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [selectedLeafId, setSelectedLeafId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ startMx: number; startMy: number; startPx: number; startPy: number } | null>(null);
  const hasDragged = useRef(false);

  const activeCat = useMemo(
    () => SKILL_TREE.find((n) => n.id === activeCatId && !isLeaf(n)) as TreeBranch | undefined,
    [activeCatId],
  );
  const catIdx = SKILL_TREE.findIndex((n) => n.id === activeCatId);
  const [catX, catY] = catIdx >= 0 ? catPos(catIdx) : [PENT_CX, PENT_CY];
  const catColor = activeCatId ? (CATEGORY_COLORS[activeCatId] ?? "#888") : "#888";
  const l1Nodes = activeCat?.children ?? [];

  const l1Positions = useMemo(
    () => (catIdx >= 0 ? calcL1Positions(catIdx, l1Nodes.length) : []),
    [catIdx, l1Nodes.length],
  );

  const selectedLeaf = useMemo((): TreeLeaf | null => {
    if (!selectedLeafId) return null;
    function find(nodes: TreeNode[]): TreeLeaf | null {
      for (const n of nodes) {
        if (n.id === selectedLeafId && isLeaf(n)) return n as TreeLeaf;
        if (!isLeaf(n)) {
          const found = find((n as TreeBranch).children);
          if (found) return found;
        }
      }
      return null;
    }
    return find(SKILL_TREE);
  }, [selectedLeafId]);

  const spring = { type: "spring" as const, stiffness: 280, damping: 22 };
  const panSpring = { type: "spring" as const, stiffness: 260, damping: 28 };

  function centerOnCat(id: string) {
    const idx = SKILL_TREE.findIndex((n) => n.id === id);
    if (idx < 0) return;
    const cat = SKILL_TREE[idx];
    if (!cat || isLeaf(cat)) return;
    const children = (cat as TreeBranch).children;
    const positions = calcL1Positions(idx, children.length);
    const [cx, cy] = catPos(idx);
    const allPoints: [number, number][] = [[cx, cy], ...positions];
    const centX = allPoints.reduce((s, [x]) => s + x, 0) / allPoints.length;
    const centY = allPoints.reduce((s, [, y]) => s + y, 0) / allPoints.length;
    animate(panX, PENT_CX - centX, panSpring);
    animate(panY, PENT_CY - centY, panSpring);
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    hasDragged.current = false;
    dragRef.current = {
      startMx: e.clientX,
      startMy: e.clientY,
      startPx: panX.get(),
      startPy: panY.get(),
    };
    setIsDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragRef.current || !svgRef.current) return;
    const dx = e.clientX - dragRef.current.startMx;
    const dy = e.clientY - dragRef.current.startMy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
    const rect = svgRef.current.getBoundingClientRect();
    panX.set(dragRef.current.startPx + dx * (W / rect.width));
    panY.set(dragRef.current.startPy + dy * (H / rect.height));
  }

  function onPointerUp() {
    if (hasDragged.current) {
      animate(panX, panX.get(), {
        type: "inertia",
        velocity: panX.getVelocity(),
        timeConstant: 350,
        power: 0.4,
        restDelta: 1,
      });
      animate(panY, panY.get(), {
        type: "inertia",
        velocity: panY.getVelocity(),
        timeConstant: 350,
        power: 0.4,
        restDelta: 1,
      });
    }
    dragRef.current = null;
    setIsDragging(false);
  }

  function onCatClick(id: string) {
    if (hasDragged.current) return;
    if (id === activeCatId) {
      setActiveCatId(null);
      setSelectedLeafId(null);
      animate(panX, 0, panSpring);
      animate(panY, 0, panSpring);
    } else {
      setActiveCatId(id);
      setSelectedLeafId(null);
      centerOnCat(id);
    }
  }

  function onLeafClick(node: TreeNode) {
    if (hasDragged.current) return;
    if (isLeaf(node)) setSelectedLeafId((p) => (p === node.id ? null : node.id));
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Skill Tree</span>
      </header>

      <GoalsDashboard />

      <div className={styles.treeCanvas}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className={styles.svg}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <defs>
            <filter id="hex-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#000000" floodOpacity="0.18" />
            </filter>
          </defs>

          <motion.g style={{ x: panX, y: panY }}>

            {/* ── Center → category connecting lines (always visible) ── */}
            {SKILL_TREE.map((cat, i) => {
              const [cx, cy] = catPos(i);
              const isActive = cat.id === activeCatId;
              const isInactive = activeCatId !== null && !isActive;
              return (
                <line
                  key={`c2c-${cat.id}`}
                  x1={PENT_CX}
                  y1={PENT_CY}
                  x2={cx}
                  y2={cy}
                  stroke={isActive ? catColor : "#d4d4d0"}
                  strokeWidth={isActive ? 2 : 1.5}
                  opacity={isInactive ? 0.15 : isActive ? 0.55 : 1}
                  style={{ transition: "opacity 0.2s" }}
                />
              );
            })}

            {/* ── Category → L1 straight connector lines ── */}
            <AnimatePresence>
              {l1Nodes.length > 0 && l1Positions.map((pos, i) => {
                const [l1x, l1y] = pos;
                const angle = Math.atan2(l1y - catY, l1x - catX);
                const x1 = catX + CAT_R * Math.cos(angle);
                const y1 = catY + CAT_R * Math.sin(angle);
                const x2 = l1x - L1_R * Math.cos(angle);
                const y2 = l1y - L1_R * Math.sin(angle);
                return (
                  <motion.path
                    key={`conn-${activeCatId}-${i}`}
                    d={`M ${x1},${y1} L ${x2},${y2}`}
                    stroke={catColor}
                    fill="none"
                    strokeWidth={1.5}
                    opacity={0.45}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.05 }}
                  />
                );
              })}
            </AnimatePresence>

            {/* ── L1 leaf nodes ── */}
            <AnimatePresence>
              {l1Nodes.map((node, i) => {
                const [cx, cy] = l1Positions[i] ?? [PENT_CX, PENT_CY];
                const isSel = node.id === selectedLeafId;
                const Icon = ICON_MAP[node.id] ?? Zap;
                const half = L1_ICON / 2;
                const lines = labelLines(node.label);
                return (
                  <motion.g
                    key={`l1-${activeCatId}-${node.id}`}
                    onClick={() => onLeafClick(node)}
                    style={{ cursor: "pointer", transformOrigin: `${cx}px ${cy}px` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: isSel ? 1 : 0.75 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ ...spring, delay: i * 0.06 + 0.1 }}
                  >
                    <polygon points={hexPts(cx, cy, L1_GLOW_R)} fill={catColor} opacity={0.1} />
                    <polygon points={hexPts(cx, cy, L1_R)} fill={catColor} filter="url(#hex-shadow)" />
                    <Icon
                      x={cx - half}
                      y={cy - half}
                      width={L1_ICON}
                      height={L1_ICON}
                      color="white"
                      strokeWidth={2.5}
                      style={{ pointerEvents: "none" }}
                    />
                    {lines.map((line, li) => {
                      const lp = l1LabelProps(cx, cy, li, lines.length);
                      return (
                        <text
                          key={li}
                          x={lp.x}
                          y={lp.y}
                          textAnchor={lp.anchor}
                          dominantBaseline="central"
                          fill="#6b6b68"
                          fontSize={9.5}
                          fontFamily="system-ui,-apple-system,sans-serif"
                          style={{ pointerEvents: "none" }}
                        >
                          {line}
                        </text>
                      );
                    })}
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {/* ── Center person icon ── */}
            <PersonCenter />

            {/* ── Category hexagons ── */}
            {SKILL_TREE.map((cat, i) => {
              const [cx, cy] = catPos(i);
              const isActive = cat.id === activeCatId;
              const isInactive = activeCatId !== null && !isActive;
              const color = CATEGORY_COLORS[cat.id] ?? "#888";
              const Icon = ICON_MAP[cat.id] ?? Zap;
              const half = CAT_ICON / 2;
              return (
                <g
                  key={cat.id}
                  onClick={() => onCatClick(cat.id)}
                  style={{ cursor: "pointer", opacity: isInactive ? 0.3 : 1, transition: "opacity 0.2s" }}
                >
                  <polygon points={hexPts(cx, cy, CAT_GLOW_R)} fill={color} opacity={isActive ? 0.18 : 0.1} />
                  <polygon points={hexPts(cx, cy, CAT_R)} fill={color} filter="url(#hex-shadow)" />
                  <Icon
                    x={cx - half}
                    y={cy - half}
                    width={CAT_ICON}
                    height={CAT_ICON}
                    color="white"
                    strokeWidth={2}
                    style={{ pointerEvents: "none" }}
                  />
                  <text
                    x={cx}
                    y={cy + CAT_GLOW_R + 14}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    fill="#413f39"
                    fontSize={12}
                    fontWeight={700}
                    fontFamily="system-ui,-apple-system,sans-serif"
                    style={{ pointerEvents: "none" }}
                  >
                    {cat.label}
                  </text>
                </g>
              );
            })}

          </motion.g>
        </svg>
      </div>

      <AnimatePresence>
        {selectedLeaf && (
          <SkillDetailPanel
            leaf={selectedLeaf}
            categoryColor={catColor}
            onClose={() => setSelectedLeafId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
