import { useState } from "react";
import "./Goals2Page.css";

/*
  Node shape (recursive):
    Branch: { id, label, children: Node[] }
    Leaf:   { id, label, exercises: [{ name, detail }] }
*/

const SKILL_TREE = [
  {
    id: "overhang",
    label: "Overhang",
    children: [
      {
        id: "overhang-footwork",
        label: "Footwork",
        children: [
          {
            id: "toe-hooks",
            label: "Toe Hooks",
            exercises: [
              { name: "Toe Hook Holds", detail: "On a 45° board, actively pull with the toe on designated holds · 5 sets of 3 moves" },
              { name: "Hamstring Activation", detail: "Lying leg curls · 15 reps × 3 sets to build toe hook pulling power" },
              { name: "Overhang Traverses", detail: "Traverse steep wall using only toe hooks to progress · 3 laps" },
              { name: "Problem Selection", detail: "Choose 5 problems requiring toe hooks · complete each 3×" },
            ],
          },
          {
            id: "heel-hooks",
            label: "Heel Hooks",
            exercises: [
              { name: "Heel Hook Activation", detail: "On a 45° wall, weight the heel and pull actively · 3 sets of 5 moves" },
              { name: "Seated Leg Curls (Eccentric)", detail: "3 kg · slow 4s lowering · 12 reps × 3 sets" },
              { name: "Heel Scum Practice", detail: "Find problems with heel scum on the overhang · 4 problems × 3 sets" },
              { name: "Hip Mobility Combo", detail: "Pigeon pose 2 min each side, then practice placing heels on high holds" },
            ],
          },
          {
            id: "backstep",
            label: "Backstep",
            exercises: [
              { name: "Backstep Traverses", detail: "Traverse overhanging wall using only outside edge backstep footwork · 3 laps" },
              { name: "Hip Rotation Drills", detail: "Exaggerate hip drop into wall on each backstep move · 10 reps" },
              { name: "Silent Backstep Practice", detail: "Place feet without sound on each backstep hold · 5 problems" },
            ],
          },
        ],
      },
      {
        id: "overhang-tension",
        label: "Tension",
        children: [
          {
            id: "core-compression",
            label: "Core Compression",
            exercises: [
              { name: "Compression Problems", detail: "Select problems using compression technique · 5 problems × 3 attempts" },
              { name: "Hollow Body Holds", detail: "20–30s · 3 sets · maintain full body tension throughout" },
              { name: "Hanging Knee Raises", detail: "Slow, controlled · 10 reps × 3 sets" },
              { name: "Front Lever Progressions", detail: "Tuck → advanced tuck → straddle · 5–8s holds · 3 sets" },
            ],
          },
          {
            id: "board-climbing",
            label: "Board Climbing",
            exercises: [
              { name: "Systematic Board Sessions", detail: "Grade 2 below max · 10 problems per session · full rest between" },
              { name: "Benchmark Problems", detail: "Set 3 problems at current grade, repeat until automatic" },
              { name: "Max Effort Problems", detail: "3 hard attempts per problem · full rest · 5 problems" },
              { name: "Limit Bouldering", detail: "45 min on problems just above your grade ceiling" },
            ],
          },
          {
            id: "shoulder-stability-ov",
            label: "Shoulder Stability",
            exercises: [
              { name: "Band Pull-aparts", detail: "15 reps × 3 sets · external rotation focus" },
              { name: "Face Pulls", detail: "Cable or band · 15 reps × 3 sets" },
              { name: "Serratus Wall Slides", detail: "10 reps × 2 sets · scapular upward rotation" },
              { name: "Cuban Press", detail: "2–5 kg · 10 reps × 3 sets · rotator cuff strength" },
            ],
          },
        ],
      },
      {
        id: "overhang-hip",
        label: "Hip Movement",
        children: [
          {
            id: "drop-knee",
            label: "Drop Knee",
            exercises: [
              { name: "Drop Knee Traverses", detail: "Sustained drop-knee on traversing wall · 3 laps" },
              { name: "Hip Flexibility", detail: "Cossack Squat 3×8 each side · daily warm-up" },
              { name: "Drop Knee Problem Set", detail: "5 problems requiring drop knee · complete 3× each" },
              { name: "90/90 Hip Stretch", detail: "2 min each side before climbing sessions" },
            ],
          },
          {
            id: "hip-rotation-ov",
            label: "Hip Rotation",
            exercises: [
              { name: "Hip-to-wall Drills", detail: "On overhang: get hip flush to wall before moving · 10 moves × 3 sets" },
              { name: "Twist Lock Practice", detail: "Shoulder-in climbing on 30–45° overhang · 20 min" },
              { name: "Flag Technique Circuits", detail: "Inside/outside flag on 5 set problems · 3 rounds" },
              { name: "Slow-motion Repeats", detail: "3× slower on a familiar problem — notice hip position at each move" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "slab",
    label: "Slab",
    children: [
      {
        id: "slab-footwork",
        label: "Footwork",
        children: [
          {
            id: "smearing",
            label: "Smearing",
            exercises: [
              { name: "Foothold-free Traverses", detail: "Traverse on 5–10° wall with feet smearing only · 5 laps" },
              { name: "Weight-the-foot Drills", detail: "Stand on a smear hold for 3s before moving · 10 moves" },
              { name: "Eyes-closed Smearing", detail: "Climb easy slab with eyes closed — feel the friction change" },
              { name: "Steeper Smear Progression", detail: "Increase wall angle each session while maintaining technique" },
            ],
          },
          {
            id: "edging",
            label: "Edging",
            exercises: [
              { name: "Small Edge Problems", detail: "Find or set problems using tiny footholds only · 8 problems" },
              { name: "Silent Feet Drills", detail: "Climb any slab route placing feet without sound" },
              { name: "Dot Drills", detail: "Hit marked spots on the wall with your toes exactly · 10 routes" },
              { name: "Edge Alternating", detail: "Deliberately alternate inside and outside edge on each foothold" },
            ],
          },
        ],
      },
      {
        id: "slab-balance",
        label: "Balance",
        children: [
          {
            id: "body-position-slab",
            label: "Body Position",
            exercises: [
              { name: "Hip Over Foot Drills", detail: "Pause at each move — ensure hip is directly above stance foot" },
              { name: "Slow-motion Slab", detail: "Climb easy slab at 3× slower pace · notice weight distribution" },
              { name: "One-foot Balance Holds", detail: "Stand on one foot for 5s per foothold before moving" },
              { name: "Downclimbing Practice", detail: "Downclimb every slab route · equal reps up and down" },
            ],
          },
          {
            id: "trust-feet",
            label: "Trusting Feet",
            exercises: [
              { name: "Commitment Routes", detail: "Climb routes where the only option is trusting friction — no hesitation" },
              { name: "Eyes-on-Feet Rule", detail: "Always look at your foot placement before weighting it · 10 routes" },
              { name: "Lead Slab Practice", detail: "Lead (not top-rope) slab routes — commitment becomes non-negotiable" },
              { name: "Progressive Angle", detail: "Increase wall angle 5° each session until near-vertical" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dynamic-movement",
    label: "Dynamic Movement",
    children: [
      {
        id: "dynos",
        label: "Dynos",
        exercises: [
          { name: "Progressive Distance Dynos", detail: "Jugs on campus board · increase distance each set · 5 attempts per rung" },
          { name: "Lunge to Pinch", detail: "Lunge to small pinch, stick it · 8 reps" },
          { name: "Dyno Problems", detail: "Select 5 problems requiring full dynos · 3 attempts each" },
          { name: "Moon Board Catch Training", detail: "Random target holds · 3 sets of 5 · focus on clean catch" },
        ],
      },
      {
        id: "momentum",
        label: "Momentum Reading",
        children: [
          {
            id: "dead-points",
            label: "Dead Points",
            exercises: [
              { name: "Dead Point Ladder", detail: "Catch target holds at the moment of zero momentum · 3 sets of 6 reps" },
              { name: "Slow Press into Dead Point", detail: "From static, press slowly into target — catch at apex · 10 reps" },
              { name: "Video Analysis", detail: "Film your attempts · review for apex timing accuracy" },
              { name: "Dead Point on Crimps", detail: "Practice dead pointing to crimp holds specifically · 8 reps × 3 sets" },
            ],
          },
          {
            id: "swing-use",
            label: "Using Swing",
            exercises: [
              { name: "Pendulum Moves", detail: "Use body swing to reach holds in sequence · 5 problems set for this" },
              { name: "Campus Swing Drills", detail: "Generate and direct swing momentum on campus rungs · 3 sets" },
              { name: "Steep Momentum Circuits", detail: "Climb steep routes maintaining momentum through crux sequences" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "technical-holds",
    label: "Technical Holds",
    children: [
      {
        id: "friction-holds",
        label: "Friction Holds",
        children: [
          {
            id: "slopers",
            label: "Slopers",
            exercises: [
              { name: "Sloper Hangboard", detail: "20mm sloper · 7s on / 3s off × 6 reps · 2 sets" },
              { name: "Wrist Position Drills", detail: "Keep wrist low and shoulder over hold · 10 controlled moves" },
              { name: "Sloper Problems", detail: "Select 5 problems with sloper cruxes · 3 attempts each" },
              { name: "Open-hand Capacity", detail: "Avoid full crimp — build open-hand strength on moderate holds" },
            ],
          },
          {
            id: "pinches",
            label: "Pinches",
            exercises: [
              { name: "Pinch Block Holds", detail: "10s holds · 4 sets — builds lateral finger strength" },
              { name: "Pinch Repeaters", detail: "7s on / 3s off × 6 reps · 2 sets · vary grip width" },
              { name: "Pinch-specific Problems", detail: "Select problems with pinch sequences · 3× each" },
              { name: "Thumb Opposition Drills", detail: "Focus on pressing thumb against fingers on each pinch hold" },
            ],
          },
        ],
      },
      {
        id: "pulling-holds",
        label: "Pulling Holds",
        children: [
          {
            id: "underclings",
            label: "Underclings",
            exercises: [
              { name: "Undercling Traverses", detail: "Traverse using only undercling holds · 3 laps" },
              { name: "Feet-high Drill", detail: "Push feet up and away while pulling outward · 10 moves" },
              { name: "Campus Undercling", detail: "Campus rungs — pull outward from below · 3 sets of 5" },
            ],
          },
          {
            id: "gastons",
            label: "Gastons",
            exercises: [
              { name: "Gaston Movement Drill", detail: "Elbow out, thumb down, push outward — 10 moves on set holds" },
              { name: "Side Pull to Gaston", detail: "Transition from side pull to gaston on overhang · 3 sets" },
              { name: "Shoulder External Rotation", detail: "Band external rotation · 15 reps × 3 sets · builds gaston stability" },
            ],
          },
          {
            id: "crimps",
            label: "Crimps",
            exercises: [
              { name: "Half-crimp Hangs", detail: "20mm edge · 10s on / 3min off · 5 sets" },
              { name: "Open-to-Half Transition", detail: "Alternate grip positions on same holds · 6 reps × 3 sets" },
              { name: "Max Recruitment Hangs", detail: "Added weight · 6–10s · 3 sets — builds raw crimp power" },
              { name: "Limit Crimp Problems", detail: "Climb at or above your crimp grade ceiling · 45 min" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "fitness",
    label: "Fitness",
    children: [
      {
        id: "power-endurance",
        label: "Power Endurance",
        children: [
          {
            id: "four-by-fours",
            label: "4x4s",
            exercises: [
              { name: "Classic 4×4", detail: "4 problems × 4 sets · 1 min rest between problems, 4 min between sets" },
              { name: "Pyramid 4×4", detail: "Easy → hard → easy sequence · 4 problems · 3 sets" },
              { name: "Linked Sequences", detail: "Connect 4 moderate problems without rest · 3 rounds" },
            ],
          },
          {
            id: "arc-training",
            label: "ARC Training",
            exercises: [
              { name: "Continuous Easy Climbing", detail: "20–40 min non-stop on auto-belay · pump but never fail" },
              { name: "ARC Traversing", detail: "30 min on gentle overhang — maintain steady pace" },
              { name: "Easy Mileage Sessions", detail: "Flash/onsight only · 90 min sessions · 2× per week" },
            ],
          },
        ],
      },
      {
        id: "max-strength",
        label: "Max Strength",
        children: [
          {
            id: "finger-strength-training",
            label: "Finger Strength",
            children: [
              {
                id: "hangboard",
                label: "Hangboard",
                exercises: [
                  { name: "Hangboard Repeaters", detail: "7s on / 3s off × 6 reps · 2 sets per grip type" },
                  { name: "Max Recruitment Hangs", detail: "Added weight · 6–10s · full rest between · 3 sets" },
                  { name: "Minimum Edge", detail: "Find smallest edge you can hang 10s · shrink over weeks" },
                ],
              },
              {
                id: "campus-strength",
                label: "Campus Training",
                exercises: [
                  { name: "1-5 Ladder", detail: "Campus rung 1 then rung 5 with one hand · 3 sets each arm" },
                  { name: "Double Dynos", detail: "Both hands move together up the board · 5 reps × 3 sets" },
                  { name: "Laddering", detail: "Consecutive rung movements · 3 sets of max rungs" },
                ],
              },
            ],
          },
          {
            id: "pull-strength",
            label: "Pull Strength",
            children: [
              {
                id: "weighted-pullups",
                label: "Weighted Pull-ups",
                exercises: [
                  { name: "Max Weight Sets", detail: "3–5 reps × 4 sets · slow 4s eccentric · 3 min rest between sets" },
                  { name: "Lock-off Training", detail: "Hold at 90°, 120°, 150° · 5–8s each · 3 rounds" },
                  { name: "Typewriter Pull-ups", detail: "3–5 reps · emphasises unilateral pulling" },
                ],
              },
              {
                id: "one-arm-progressions",
                label: "One-arm Progressions",
                exercises: [
                  { name: "Assisted One-arm Hangs", detail: "Finger assist on opposite arm · 10s · 3 sets each arm" },
                  { name: "One-arm Negatives", detail: "5s eccentric · 3 reps each arm · 3 sets" },
                  { name: "One-arm Lock-off", detail: "Hold at 90° with one arm · 5s · 3 sets each arm" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

/* ── Helpers ── */

function isLeaf(node) {
  return !node.children || node.children.length === 0;
}

// Returns the path labels (ancestor → leaf) for a given leaf id
function findPath(nodes, targetId, currentPath = []) {
  for (const node of nodes) {
    const path = [...currentPath, node.label];
    if (node.id === targetId) return path;
    if (node.children) {
      const found = findPath(node.children, targetId, path);
      if (found) return found;
    }
  }
  return null;
}

// Collect all selected leaf nodes with their ancestor path
function collectSelected(nodes, selectedIds, path = []) {
  const results = [];
  for (const node of nodes) {
    const currentPath = [...path, node.label];
    if (isLeaf(node)) {
      if (selectedIds.has(node.id)) {
        results.push({ ...node, ancestorPath: path });
      }
    } else if (node.children) {
      results.push(...collectSelected(node.children, selectedIds, currentPath));
    }
  }
  return results;
}

/* ── Icons ── */

function ChevronIcon({ open }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.18s ease",
        flexShrink: 0,
      }}
    >
      <path d="M4.5 9L7.5 6l-3-3" stroke="#b0afa9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Tree components ── */

function TreeNode({ node, depth, selectedSkills, expandedNodes, onToggleExpand, onToggleSelect }) {
  const leaf = isLeaf(node);
  const expanded = expandedNodes.has(node.id);
  const selected = selectedSkills.has(node.id);

  return (
    <div className={`tree-node${depth === 0 ? " tree-root-node" : ""}`}>
      <div
        className={`tree-row${leaf ? " tree-leaf" : " tree-branch"}${selected ? " selected" : ""}`}
        style={{ paddingLeft: depth === 0 ? 20 : 14 }}
        onClick={() => leaf ? onToggleSelect(node.id) : onToggleExpand(node.id)}
      >
        {leaf
          ? <span className={`tree-leaf-dot${selected ? " on" : ""}`} />
          : <ChevronIcon open={expanded} />
        }
        <span className="tree-label">{node.label}</span>
      </div>

      {!leaf && (
        <div className={`tree-children-wrapper${expanded ? " open" : ""}`}>
          <div className="tree-children">
            {node.children.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedSkills={selectedSkills}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Goal card ── */

function GoalCard({ skill, onRemove }) {
  const [showExercises, setShowExercises] = useState(false);

  return (
    <div className="goal2-card">
      <div className="goal2-card-header">
        <div className="goal2-card-meta">
          {skill.ancestorPath.length > 0 && (
            <span className="goal2-path">{skill.ancestorPath.join(" → ")}</span>
          )}
          <span className="goal2-name">{skill.label}</span>
        </div>
        <button className="goal2-remove-btn" onClick={() => onRemove(skill.id)}>×</button>
      </div>
      <button
        className="goal2-exercises-toggle"
        onClick={() => setShowExercises(v => !v)}
      >
        {showExercises ? "Hide" : "Show"} suggested exercises
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: showExercises ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
        >
          <path d="M2 3.5L5 6.5l3-3" stroke="#9d9c99" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {showExercises && (
        <div className="goal2-exercises-list">
          {skill.exercises.map((ex, i) => (
            <div key={i} className="goal2-exercise-item">
              <span className="goal2-exercise-name">{ex.name}</span>
              <span className="goal2-exercise-detail">{ex.detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ── */

export default function Goals2Page() {
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [expandedNodes, setExpandedNodes] = useState(
    () => new Set(SKILL_TREE.map(r => r.id)) // top-level roots open, rest collapsed
  );

  const onToggleExpand = (id) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onToggleSelect = (id) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onRemoveSkill = (id) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const selectedSkillObjects = collectSelected(SKILL_TREE, selectedSkills);

  return (
    <div className="goals2-layout">
      {/* Skill tree */}
      <div className="goals2-tree-panel">
        {SKILL_TREE.map(root => (
          <TreeNode
            key={root.id}
            node={root}
            depth={0}
            selectedSkills={selectedSkills}
            expandedNodes={expandedNodes}
            onToggleExpand={onToggleExpand}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>

      {/* My Goals */}
      <div className="goals2-detail-panel">
        {selectedSkillObjects.length === 0 ? (
          <div className="goals2-empty-state">
            <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
              <circle cx="4" cy="8" r="1.5" stroke="#dcdcdc" strokeWidth="1.2" />
              <circle cx="12" cy="4.5" r="1.5" stroke="#dcdcdc" strokeWidth="1.2" />
              <circle cx="12" cy="11.5" r="1.5" stroke="#dcdcdc" strokeWidth="1.2" />
              <path d="M5.5 8L10.5 4.5" stroke="#dcdcdc" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M5.5 8L10.5 11.5" stroke="#dcdcdc" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>Pick a skill to focus on</span>
            <span className="goals2-empty-sub">Drill into the tree and select a specific technique</span>
          </div>
        ) : (
          <div className="goals2-detail-inner">
            <div className="goals2-my-goals-title">My Goals</div>
            <div className="goals2-my-goals-sub">
              {selectedSkillObjects.length > 4
                ? "Consider narrowing — depth beats breadth"
                : "Your current technique focus"}
            </div>
            <div className="goals2-card-list">
              {selectedSkillObjects.map(skill => (
                <GoalCard
                  key={skill.id}
                  skill={skill}
                  onRemove={onRemoveSkill}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
