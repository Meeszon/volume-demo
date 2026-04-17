import type { TreeNode } from "../types";

export const CATEGORY_COLORS: Record<string, string> = {
  "hold-types": "#e67e22",
  "wall-angles": "#3498db",
  "moves-technique": "#e74c3c",
  "physical-conditioning": "#27ae60",
  "mental-tactics": "#9b59b6",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "hold-types": "✊",
  "wall-angles": "🧗",
  "moves-technique": "⚡",
  "physical-conditioning": "💪",
  "mental-tactics": "🎯",
};

export const SKILL_TREE: TreeNode[] = [
  {
    id: "hold-types",
    label: "Hold Types",
    children: [
      {
        id: "slopers",
        label: "Slopers",
        description:
          "Master friction-dependent holds by controlling wrist position and shoulder alignment over the hold.",
        exercises: [
          { name: "Sloper Hangboard", detail: "20mm sloper · 7s on / 3s off × 6 reps · 2 sets" },
          {
            name: "Wrist Position Drills",
            detail: "Keep wrist low and shoulder over hold · 10 controlled moves",
          },
          {
            name: "Sloper Problems",
            detail: "Select 5 problems with sloper cruxes · 3 attempts each",
          },
          {
            name: "Open-hand Capacity",
            detail: "Avoid full crimp — build open-hand strength on moderate holds",
          },
        ],
      },
      {
        id: "crimps",
        label: "Crimps",
        description:
          "Build the specific finger strength and grip discipline that technical crimpy sequences demand.",
        exercises: [
          { name: "Half-crimp Hangs", detail: "20mm edge · 10s on / 3min off · 5 sets" },
          {
            name: "Open-to-Half Transition",
            detail: "Alternate grip positions on same holds · 6 reps × 3 sets",
          },
          {
            name: "Max Recruitment Hangs",
            detail: "Added weight · 6–10s · 3 sets — builds raw crimp power",
          },
          {
            name: "Limit Crimp Problems",
            detail: "Climb at or above your crimp grade ceiling · 45 min",
          },
        ],
      },
      {
        id: "pinches",
        label: "Pinches",
        description:
          "Develop thumb opposition and lateral finger force for compression-style and pinch-heavy sequences.",
        exercises: [
          {
            name: "Pinch Block Holds",
            detail: "10s holds · 4 sets — builds lateral finger strength",
          },
          {
            name: "Pinch Repeaters",
            detail: "7s on / 3s off × 6 reps · 2 sets · vary grip width",
          },
          {
            name: "Pinch-specific Problems",
            detail: "Select problems with pinch sequences · 3× each",
          },
          {
            name: "Thumb Opposition Drills",
            detail: "Focus on pressing thumb against fingers on each pinch hold",
          },
        ],
      },
      {
        id: "pockets",
        label: "Pockets",
        description:
          "Train precise pocket placement and build tendon resilience for technical pocket sequences.",
        exercises: [
          {
            name: "2-finger Pocket Hangs",
            detail: "7s on / 3s off × 4 reps per finger pair · 2 sets each",
          },
          {
            name: "Pocket Problems",
            detail:
              "Find or set problems requiring pocket holds · 5 problems × 3 attempts",
          },
          {
            name: "Pocket Transitions",
            detail: "Move between pocket positions on the wall · 10 moves × 3 sets",
          },
          {
            name: "Tendon Warm-up",
            detail: "Gentle pocket hangs at 40% effort before harder pocket sessions",
          },
        ],
      },
    ],
  },
  {
    id: "wall-angles",
    label: "Wall Angles",
    children: [
      {
        id: "slab",
        label: "Slab",
        children: [
          {
            id: "smearing",
            label: "Smearing",
            description:
              "Learn to generate and trust friction contact across the full sole of the shoe on low-angle walls.",
            exercises: [
              {
                name: "Foothold-free Traverses",
                detail: "Traverse on 5–10° wall with feet smearing only · 5 laps",
              },
              {
                name: "Weight-the-foot Drills",
                detail: "Stand on a smear hold for 3s before moving · 10 moves",
              },
              {
                name: "Eyes-closed Smearing",
                detail: "Climb easy slab with eyes closed — feel the friction change",
              },
              {
                name: "Steeper Smear Progression",
                detail: "Increase wall angle each session while maintaining technique",
              },
            ],
          },
          {
            id: "edging",
            label: "Edging",
            description:
              "Develop precise footwork using the inside and outside edges of the shoe on small footholds.",
            exercises: [
              {
                name: "Small Edge Problems",
                detail: "Find or set problems using tiny footholds only · 8 problems",
              },
              {
                name: "Silent Feet Drills",
                detail: "Climb any slab route placing feet without sound",
              },
              {
                name: "Dot Drills",
                detail: "Hit marked spots on the wall with your toes exactly · 10 routes",
              },
              {
                name: "Edge Alternating",
                detail:
                  "Deliberately alternate inside and outside edge on each foothold",
              },
            ],
          },
          {
            id: "trust-feet",
            label: "Trusting Feet",
            description:
              "Build the confidence to commit weight onto friction smears and small holds without hesitation.",
            exercises: [
              {
                name: "Commitment Routes",
                detail:
                  "Climb routes where the only option is trusting friction — no hesitation",
              },
              {
                name: "Eyes-on-Feet Rule",
                detail:
                  "Always look at your foot placement before weighting it · 10 routes",
              },
              {
                name: "Lead Slab Practice",
                detail:
                  "Lead (not top-rope) slab routes — commitment becomes non-negotiable",
              },
              {
                name: "Progressive Angle",
                detail: "Increase wall angle 5° each session until near-vertical",
              },
            ],
          },
        ],
      },
      {
        id: "vertical",
        label: "Vertical",
        description:
          "Establish efficient movement economy on vertical walls through straight-arm climbing and hip positioning.",
        exercises: [
          {
            name: "Straight-arm Climbing",
            detail:
              "Climb any vertical route keeping arms as straight as possible · 10 routes",
          },
          {
            name: "Hip-in Technique",
            detail: "Bring hip toward wall on every foothold · 15 moves × 3 sets",
          },
          {
            name: "Vertical Mileage",
            detail: "60 min climbing on 0–5° walls — build base movement economy",
          },
          {
            name: "Flag & Balance Circuits",
            detail: "Choose 5 problems · climb each using flags on every move",
          },
        ],
      },
      {
        id: "overhang",
        label: "Overhang",
        description:
          "Maintain body tension and efficient hip positioning on walls beyond vertical.",
        exercises: [
          {
            name: "Heel Hook Activation",
            detail: "On a 45° wall, weight the heel and pull actively · 3 sets of 5 moves",
          },
          {
            name: "Hip Rotation Drills",
            detail: "Exaggerate hip drop into wall on each overhang move · 10 reps",
          },
          {
            name: "Overhang Mileage",
            detail: "30 min continuous climbing on 30–45° — focus on body tension",
          },
          {
            name: "Drop Knee Traverses",
            detail: "Sustained drop-knee on traversing wall · 3 laps",
          },
        ],
      },
      {
        id: "cave",
        label: "Cave",
        description:
          "Develop the core tension and body positioning required for severely overhanging cave sections.",
        exercises: [
          {
            name: "Core Tension Holds",
            detail:
              "On 60°+ wall, hold hollow-body position between each move · 5 problems",
          },
          {
            name: "Kneebar Practice",
            detail: "Find kneebar rests on cave sections · use them for full recovery",
          },
          {
            name: "Campus Cave Moves",
            detail: "Move hands without feet on 60°+ board · 3 sets of 5 moves",
          },
          {
            name: "Cave Problem Sets",
            detail: "Select 4 cave-specific problems · 3 attempts each with full rest",
          },
        ],
      },
    ],
  },
  {
    id: "moves-technique",
    label: "Moves & Technique",
    children: [
      {
        id: "dynos",
        label: "Dynos",
        children: [
          {
            id: "dyno-coordination",
            label: "Coordination",
            description:
              "Train the timing precision to catch holds at the exact apex of momentum — the dead point.",
            exercises: [
              {
                name: "Dead Point Ladder",
                detail:
                  "Catch target holds at the moment of zero momentum · 3 sets of 6 reps",
              },
              {
                name: "Slow Press into Dead Point",
                detail: "From static, press slowly into target — catch at apex · 10 reps",
              },
              {
                name: "Timing Drills",
                detail: "Film your attempts · review for apex timing accuracy",
              },
              {
                name: "Dead Point on Crimps",
                detail:
                  "Practice dead pointing to crimp holds specifically · 8 reps × 3 sets",
              },
            ],
          },
          {
            id: "dyno-paddle",
            label: "Paddle",
            description:
              "Build the explosive power and body projection to complete full dynamic moves between distant holds.",
            exercises: [
              {
                name: "Progressive Distance Dynos",
                detail:
                  "Jugs on campus board · increase distance each set · 5 attempts per rung",
              },
              { name: "Lunge to Pinch", detail: "Lunge to small pinch, stick it · 8 reps" },
              {
                name: "Dyno Problems",
                detail: "Select 5 problems requiring full dynos · 3 attempts each",
              },
              {
                name: "Moon Board Catch Training",
                detail: "Random target holds · 3 sets of 5 · focus on clean catch",
              },
            ],
          },
        ],
      },
      {
        id: "heel-hooks",
        label: "Heel Hooks",
        description:
          "Learn to actively pull with the heel to maintain high feet and generate upward momentum on steep terrain.",
        exercises: [
          {
            name: "Heel Hook Activation",
            detail: "On a 45° wall, weight the heel and pull actively · 3 sets of 5 moves",
          },
          {
            name: "Seated Leg Curls (Eccentric)",
            detail: "3 kg · slow 4s lowering · 12 reps × 3 sets",
          },
          {
            name: "Heel Scum Practice",
            detail:
              "Find problems with heel scum on the overhang · 4 problems × 3 sets",
          },
          {
            name: "Hip Mobility Combo",
            detail:
              "Pigeon pose 2 min each side, then practice placing heels on high holds",
          },
        ],
      },
      {
        id: "toe-hooks",
        label: "Toe Hooks",
        description:
          "Use the top of the toe to pull against holds and maintain body position on overhanging terrain.",
        exercises: [
          {
            name: "Toe Hook Holds",
            detail:
              "On a 45° board, actively pull with the toe on designated holds · 5 sets of 3 moves",
          },
          {
            name: "Hamstring Activation",
            detail: "Lying leg curls · 15 reps × 3 sets to build toe hook pulling power",
          },
          {
            name: "Overhang Traverses",
            detail: "Traverse steep wall using only toe hooks to progress · 3 laps",
          },
          {
            name: "Problem Selection",
            detail: "Choose 5 problems requiring toe hooks · complete each 3×",
          },
        ],
      },
      {
        id: "drop-knee",
        label: "Drop Knee",
        description:
          "Master the drop knee to rotate the hip into the wall, extending reach and reducing arm strain on overhangs.",
        exercises: [
          {
            name: "Drop Knee Traverses",
            detail: "Sustained drop-knee on traversing wall · 3 laps",
          },
          { name: "Hip Flexibility", detail: "Cossack Squat 3×8 each side · daily warm-up" },
          {
            name: "Drop Knee Problem Set",
            detail: "5 problems requiring drop knee · complete 3× each",
          },
          { name: "90/90 Hip Stretch", detail: "2 min each side before climbing sessions" },
        ],
      },
      {
        id: "hip-rotation",
        label: "Hip Rotation",
        description:
          "Use shoulder-in and twist-lock movements to maximise reach and reduce energy expenditure on steep walls.",
        exercises: [
          {
            name: "Hip-to-wall Drills",
            detail:
              "On overhang: get hip flush to wall before moving · 10 moves × 3 sets",
          },
          {
            name: "Twist Lock Practice",
            detail: "Shoulder-in climbing on 30–45° overhang · 20 min",
          },
          {
            name: "Flag Technique Circuits",
            detail: "Inside/outside flag on 5 set problems · 3 rounds",
          },
          {
            name: "Slow-motion Repeats",
            detail:
              "3× slower on a familiar problem — notice hip position at each move",
          },
        ],
      },
      {
        id: "flagging",
        label: "Flagging",
        description:
          "Use the non-active foot as a counterbalance to maintain centre of gravity over the standing foot.",
        exercises: [
          {
            name: "Inside Flag Traverses",
            detail: "Traverse vertical wall using only inside flags · 3 laps",
          },
          {
            name: "Outside Flag Drills",
            detail: "Choose 5 problems · solve each using outside flag on every move",
          },
          {
            name: "Flag Identification",
            detail:
              "Before each move, decide: inside, outside, or cross-through flag",
          },
          {
            name: "Balance Problems",
            detail:
              "Set problems requiring balance-flag combinations · 3 attempts each",
          },
        ],
      },
      {
        id: "dead-points",
        label: "Dead Points",
        description:
          "Catch holds precisely at the apex of upward momentum to minimise grip force required.",
        exercises: [
          {
            name: "Dead Point Ladder",
            detail:
              "Catch target holds at the moment of zero momentum · 3 sets of 6 reps",
          },
          {
            name: "Slow Press into Dead Point",
            detail: "From static, press slowly into target — catch at apex · 10 reps",
          },
          {
            name: "Video Analysis",
            detail: "Film your attempts · review for apex timing accuracy",
          },
          {
            name: "Dead Point on Crimps",
            detail:
              "Practice dead pointing to crimp holds specifically · 8 reps × 3 sets",
          },
        ],
      },
    ],
  },
  {
    id: "physical-conditioning",
    label: "Physical & Conditioning",
    children: [
      {
        id: "finger-strength",
        label: "Finger Strength",
        children: [
          {
            id: "hangboard",
            label: "Hangboard",
            description:
              "Systematically overload the finger flexors using a hangboard to build grip strength across all hold types.",
            exercises: [
              {
                name: "Hangboard Repeaters",
                detail: "7s on / 3s off × 6 reps · 2 sets per grip type",
              },
              {
                name: "Max Recruitment Hangs",
                detail: "Added weight · 6–10s · full rest between · 3 sets",
              },
              {
                name: "Minimum Edge",
                detail: "Find smallest edge you can hang 10s · shrink over weeks",
              },
            ],
          },
          {
            id: "campus-strength",
            label: "Campus Training",
            description:
              "Build explosive contact strength and dynamic pulling power using campus board laddering and dynos.",
            exercises: [
              {
                name: "1-5 Ladder",
                detail: "Campus rung 1 then rung 5 with one hand · 3 sets each arm",
              },
              {
                name: "Double Dynos",
                detail: "Both hands move together up the board · 5 reps × 3 sets",
              },
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
            description:
              "Add load to pull-ups to build the raw pulling strength that translates directly to hard moves.",
            exercises: [
              {
                name: "Max Weight Sets",
                detail: "3–5 reps × 4 sets · slow 4s eccentric · 3 min rest between sets",
              },
              {
                name: "Lock-off Training",
                detail: "Hold at 90°, 120°, 150° · 5–8s each · 3 rounds",
              },
              {
                name: "Typewriter Pull-ups",
                detail: "3–5 reps · emphasises unilateral pulling strength",
              },
            ],
          },
          {
            id: "one-arm-progressions",
            label: "One-arm Progressions",
            description:
              "Progress toward one-arm pulling using assisted hangs, negatives, and lock-offs.",
            exercises: [
              {
                name: "Assisted One-arm Hangs",
                detail: "Finger assist on opposite arm · 10s · 3 sets each arm",
              },
              {
                name: "One-arm Negatives",
                detail: "5s eccentric · 3 reps each arm · 3 sets",
              },
              {
                name: "One-arm Lock-off",
                detail: "Hold at 90° with one arm · 5s · 3 sets each arm",
              },
            ],
          },
        ],
      },
      {
        id: "core",
        label: "Core",
        description:
          "Build the full-body tension required to maintain body position on steep terrain and through powerful sequences.",
        exercises: [
          {
            name: "Compression Problems",
            detail:
              "Select problems using compression technique · 5 problems × 3 attempts",
          },
          {
            name: "Hollow Body Holds",
            detail: "20–30s · 3 sets · maintain full body tension throughout",
          },
          { name: "Hanging Knee Raises", detail: "Slow, controlled · 10 reps × 3 sets" },
          {
            name: "Front Lever Progressions",
            detail: "Tuck → advanced tuck → straddle · 5–8s holds · 3 sets",
          },
        ],
      },
      {
        id: "power-endurance",
        label: "Power Endurance",
        children: [
          {
            id: "four-by-fours",
            label: "4x4s",
            description:
              "Train the ability to sustain hard moves under fatigue using structured 4×4 circuit formats.",
            exercises: [
              {
                name: "Classic 4×4",
                detail:
                  "4 problems × 4 sets · 1 min rest between problems, 4 min between sets",
              },
              {
                name: "Pyramid 4×4",
                detail: "Easy → hard → easy sequence · 4 problems · 3 sets",
              },
              {
                name: "Linked Sequences",
                detail: "Connect 4 moderate problems without rest · 3 rounds",
              },
            ],
          },
          {
            id: "arc-training",
            label: "ARC Training",
            description:
              "Build aerobic capacity and capillary density in the forearms through sustained low-intensity climbing.",
            exercises: [
              {
                name: "Continuous Easy Climbing",
                detail: "20–40 min non-stop on auto-belay · pump but never fail",
              },
              {
                name: "ARC Traversing",
                detail: "30 min on gentle overhang — maintain steady pace",
              },
              {
                name: "Easy Mileage Sessions",
                detail: "Flash/onsight only · 90 min sessions · 2× per week",
              },
            ],
          },
        ],
      },
      {
        id: "board-climbing",
        label: "Board Climbing",
        description:
          "Use system boards (Moonboard, Kilter, etc.) to develop strength, technique, and problem-solving under load.",
        exercises: [
          {
            name: "Systematic Board Sessions",
            detail: "Grade 2 below max · 10 problems per session · full rest between",
          },
          {
            name: "Benchmark Problems",
            detail: "Set 3 problems at current grade, repeat until automatic",
          },
          {
            name: "Max Effort Problems",
            detail: "3 hard attempts per problem · full rest · 5 problems",
          },
          {
            name: "Limit Bouldering",
            detail: "45 min on problems just above your grade ceiling",
          },
        ],
      },
    ],
  },
  {
    id: "mental-tactics",
    label: "Mental & Tactics",
    children: [
      {
        id: "route-reading",
        label: "Route Reading",
        description:
          "Develop the ability to visualise and plan an efficient sequence before touching the wall.",
        exercises: [
          {
            name: "Pre-climb Visualisation",
            detail:
              "Stand below the problem for 90s · visualise every move before touching the wall",
          },
          {
            name: "Beta Comparison",
            detail:
              "After climbing, watch 2 other climbers' beta · note differences",
          },
          {
            name: "Blind Sequence",
            detail:
              "Describe every move of a familiar problem from memory · check accuracy",
          },
          {
            name: "Move Prediction",
            detail:
              "For each new problem, predict the sequence before attempting · track accuracy rate",
          },
        ],
      },
      {
        id: "fear-management",
        label: "Fear Management",
        description:
          "Build a systematic approach to managing the fear of falling so it stops blocking performance.",
        exercises: [
          {
            name: "Controlled Falls Practice",
            detail:
              "Practice safe falling from low heights · 5 falls per session until automatic",
          },
          {
            name: "Breathing Reset",
            detail: "Box breathing before hard attempts · 4s in, 4s hold, 4s out",
          },
          {
            name: "Progressive Exposure",
            detail:
              "Systematically climb slightly higher each session · log your high point",
          },
          {
            name: "Commitment Moves",
            detail:
              "Choose one move per session that scares you · commit fully · repeat 3×",
          },
        ],
      },
      {
        id: "competition-mindset",
        label: "Competition Mindset",
        description:
          "Train the focus, pacing, and decision-making skills that separate performance in pressure situations.",
        exercises: [
          {
            name: "Timed Attempts",
            detail: "Set a 5-minute timer per problem — creates competition pressure",
          },
          {
            name: "Flash or Leave",
            detail: "Attempt each problem exactly once · forces full commitment",
          },
          {
            name: "Recovery Between Attempts",
            detail:
              "Practice active recovery: shake out, breathe, reset — 3 min max",
          },
          {
            name: "Mock Comp Simulation",
            detail: "Pick 5 problems · one attempt each · score yourself honestly",
          },
        ],
      },
    ],
  },
];
