import type { Category } from "../types";

export const SKILL_TREE_V1: Category[] = [
  {
    id: "conditioning",
    label: "Conditioning",
    color: "#FF8B00",
    skills: [
      {
        id: "finger-prehab",
        label: "Finger Prehab",
        exercises: [
          { name: "Rice Bucket Training", detail: "Finger extension in rice · 3 × 60s after every session" },
          { name: "Finger Extension Band", detail: "Rubber band on fingers · 20 reps × 3 sets" },
          { name: "Open-hand Preference", detail: "Avoid full crimp — use open or half-crimp exclusively" },
          { name: "Reverse Wrist Curls", detail: "Light dumbbell · 15 reps × 3 sets · wrist extension" },
        ],
      },
      {
        id: "elbow-care",
        label: "Elbow Care",
        exercises: [
          { name: "Flexbar Tyler Twist", detail: "Theraband Flexbar green/red · 3 × 15 reps daily" },
          { name: "Wrist Curls (Eccentric)", detail: "3 kg · slow 4s lowering phase · 15 reps × 3 sets" },
          { name: "Reverse Wrist Curls (Eccentric)", detail: "Same protocol — tennis elbow side" },
          { name: "Ice + Load Cycling", detail: "Ice 10 min post-climb · avoid complete rest" },
        ],
      },
      {
        id: "shoulder-prehab",
        label: "Shoulder Prehab",
        exercises: [
          { name: "Cuban Press", detail: "2–5 kg · 10 reps × 3 sets · rotator cuff strength" },
          { name: "Band External Rotation", detail: "15 reps × 3 sets · elbow at 90°, arm at side" },
          { name: "YTWL Raises", detail: "Prone on bench · 5 reps each letter × 2 sets" },
          { name: "Scapular Push-ups", detail: "15 reps × 3 sets · serratus anterior activation" },
        ],
      },
      {
        id: "antagonist-training",
        label: "Antagonist Training",
        exercises: [
          { name: "Push-ups", detail: "3 × 15–20 reps · after every climbing session" },
          { name: "Dips", detail: "3 × 10–15 reps · tricep and chest balance" },
          { name: "Wrist Extension Curls", detail: "Light dumbbell · 15 reps × 3 sets" },
          { name: "Prone Y/T/W Raises", detail: "Bodyweight or 1–2 kg · 10 reps each shape" },
        ],
      },
    ],
  },
  {
    id: "strength",
    label: "Strength",
    color: "#DA2128",
    skills: [
      {
        id: "finger-strength",
        label: "Finger Strength",
        exercises: [
          { name: "Half-crimp Hangs", detail: "20mm edge · 10s on / 3min off · 5 sets" },
          { name: "Hangboard Repeaters", detail: "7s on / 3s off × 6 reps · 2 sets per grip" },
          { name: "Max Recruitment Hangs", detail: "Added weight · 6–10s · 3 sets" },
          { name: "Pinch Block Holds", detail: "10s · 4 sets — builds lateral finger strength" },
        ],
      },
      {
        id: "pull-power",
        label: "Pull Power",
        exercises: [
          { name: "Weighted Pull-ups", detail: "3–5 reps × 4 sets · slow 4s eccentric" },
          { name: "Lock-off Training", detail: "Hold at 90°, 120°, 150° · 5–8s each · 3 rounds" },
          { name: "One-arm Negatives", detail: "5s eccentric · 3 reps each arm · 3 sets" },
          { name: "Typewriter Pull-ups", detail: "3–5 reps · emphasises unilateral pulling" },
        ],
      },
      {
        id: "core-tension",
        label: "Core Tension",
        exercises: [
          { name: "Front Lever Progressions", detail: "Tuck → straddle → full · 5–10s holds · 3 sets" },
          { name: "Hollow Body Holds", detail: "20–30s · 3 sets · arch → hollow sequence" },
          { name: "Hanging Leg Raises", detail: "Slow, controlled · 8–10 reps × 3 sets" },
          { name: "L-sit Progressions", detail: "Rings or parallettes · 10–20s · 3 sets" },
        ],
      },
      {
        id: "shoulder-stability",
        label: "Shoulder Stability",
        exercises: [
          { name: "Band Pull-aparts", detail: "15 reps × 3 sets · external rotation focus" },
          { name: "Face Pulls", detail: "Cable or band · 15 reps × 3 sets" },
          { name: "Serratus Wall Slides", detail: "10 reps × 2 sets · scapular upward rotation" },
          { name: "Overhead Press", detail: "Light to moderate · 3 × 8 — shoulder health under load" },
        ],
      },
    ],
  },
  {
    id: "mobility",
    label: "Mobility",
    color: "#5CBBAE",
    skills: [
      {
        id: "hip-flexibility",
        label: "Hip Flexibility",
        exercises: [
          { name: "Cossack Squats", detail: "3 × 8 reps each side · slow and controlled" },
          { name: "Pigeon Pose", detail: "2 min each side · daily" },
          { name: "90/90 Hip Rotations", detail: "10 reps each direction · morning routine" },
          { name: "Deep Squat Hold", detail: "3 × 60s · heels on ground" },
        ],
      },
      {
        id: "shoulder-mobility",
        label: "Shoulder Mobility",
        exercises: [
          { name: "Sleeper Stretch", detail: "30s × 3 each shoulder · targets posterior capsule" },
          { name: "Banded Shoulder Distraction", detail: "60s each arm · 2 sets" },
          { name: "Wall Slides", detail: "10 reps × 3 sets · back flat to wall" },
          { name: "Pec Minor Doorframe Stretch", detail: "30s × 3 — opens chest for overhead" },
        ],
      },
      {
        id: "thoracic-rotation",
        label: "Thoracic Rotation",
        exercises: [
          { name: "Thread-the-needle", detail: "10 reps each side × 2 sets" },
          { name: "Quadruped T-spine Rotation", detail: "10 reps each side — hand behind head" },
          { name: "Foam Roller Extension", detail: "90s per segment across thoracic spine" },
          { name: "Seated Band Rotation", detail: "15 reps × 2 sets each side" },
        ],
      },
      {
        id: "wrist-care",
        label: "Wrist Care",
        exercises: [
          { name: "Wrist Circles", detail: "10 clockwise + 10 counterclockwise · daily warm-up" },
          { name: "Prayer / Reverse Prayer", detail: "30s each position × 3 · flexors and extensors" },
          { name: "Wrist Roller", detail: "3 rolls up + 3 rolls down · light load" },
          {
            name: "Neutral Wrist Loading",
            detail: "Avoid cocked-wrist positions on crimps during prehab phases",
          },
        ],
      },
    ],
  },
  {
    id: "endurance",
    label: "Endurance",
    color: "#1D85DF",
    skills: [
      {
        id: "power-endurance",
        label: "Power Endurance",
        exercises: [
          {
            name: "4×4s",
            detail: "4 problems × 4 sets · 1 min rest between, 4 min between sets",
          },
          { name: "Bouldering Circuits", detail: "10 linked problems non-stop · 3 rounds / 5 min rest" },
          { name: "Campus Endurance Ladders", detail: "1-3-5-7 pattern · 6 reps · 2 min rest" },
          { name: "ARC Training", detail: "20–40 min continuous easy climbing on auto-belay" },
        ],
      },
      {
        id: "aerobic-base",
        label: "Aerobic Base",
        exercises: [
          { name: "ARC Traversing", detail: "30 min non-stop on gentle overhang — pump but never fail" },
          { name: "Easy Mileage Sessions", detail: "Flash/onsight only · 90 min sessions · 2× per week" },
          { name: "Zone 2 Cardio", detail: "Running or cycling · 30 min · 2–3× per week" },
          { name: "Aerobic Hangboard", detail: "3-6-9 protocol · 30 min total · light load" },
        ],
      },
      {
        id: "recovery",
        label: "Recovery",
        exercises: [
          { name: "Contrast Bathing", detail: "2 min cold / 2 min warm × 4 cycles for forearms" },
          { name: "BFR Forearm Massage", detail: "10 min post-session — promotes blood flow" },
          { name: "Sleep Protocol", detail: "Target 8–9h on climbing days · track with journal" },
          { name: "Deload Week", detail: "Every 4–6 weeks · 50% volume, same intensity" },
        ],
      },
    ],
  },
  {
    id: "technique",
    label: "Technique",
    color: "#9900E6",
    skills: [
      {
        id: "footwork-precision",
        label: "Footwork Precision",
        exercises: [
          { name: "Silent Feet Drills", detail: "Climb any route placing feet without sound" },
          { name: "Smearing Traverses", detail: "Foothold-free slab traverses on 5–10° wall" },
          { name: "Small Foothold Problems", detail: "Set problems on tiny footholds only" },
          { name: "Dot Drills on Slab", detail: "Hit marked spots with toes · 10 routes" },
        ],
      },
      {
        id: "body-positioning",
        label: "Body Positioning",
        exercises: [
          { name: "Hip-to-wall Drills", detail: "Overhangs: get hip flush to wall before moving" },
          { name: "Flag Technique Circuits", detail: "Inside/outside flag on 5 set problems" },
          { name: "Twist Lock Practice", detail: "Shoulder-in climbing on 30–45° overhang" },
          { name: "Slow-motion Repeats", detail: "3× slower on a familiar problem — notice positions" },
        ],
      },
      {
        id: "dynamic-movement",
        label: "Dynamic Movement",
        exercises: [
          { name: "Dyno Ladders", detail: "Progressive distance dynos on jugs · 5 attempts per rung" },
          { name: "Dead Point Practice", detail: "Catch at apex of momentum · 10 reps per target hold" },
          { name: "Lunge-to-pinch Drills", detail: "Lunge to small pinch, stick it · 8 reps" },
          { name: "Moon Board Catch Training", detail: "Random target holds · 3 sets of 5" },
        ],
      },
      {
        id: "hip-mobility-on-wall",
        label: "Hip Mobility on Wall",
        exercises: [
          { name: "High-step Practice", detail: "Slab/vert: step onto holds at hip height, stand through" },
          { name: "Heel Hook Activation", detail: "Pull through heel hook on 45° wall · 10 reps" },
          { name: "Drop-knee Traverses", detail: "Sustained drop-knee on traversing wall · 3 laps" },
          { name: "Rockover Boulders", detail: "Choose problems requiring full rockover" },
        ],
      },
    ],
  },
  {
    id: "mental",
    label: "Mental",
    color: "#00B341",
    skills: [
      {
        id: "route-reading",
        label: "Route Reading",
        exercises: [
          { name: "3-minute Read Rule", detail: "Plan full sequence before touching the wall" },
          { name: "Blind Beta Challenges", detail: "Partner reads route, you follow without pre-inspection" },
          { name: "Video Analysis", detail: "Film attempts, review foot sequence vs planned" },
          { name: "Visualisation off the Wall", detail: "Imagine your project sequence away from the gym" },
        ],
      },
      {
        id: "fear-of-falling",
        label: "Fear of Falling",
        exercises: [
          { name: "Progressive Fall Practice", detail: "Controlled falls 1m → 2m → peak · padded zone" },
          { name: "Commitment Move Drills", detail: "Repeat the same committing move 10× until automatic" },
          { name: "Breathing Protocol", detail: "Box breathing (4-4-4-4) at top of problem before moving" },
          { name: "Easy-grade Fall Exposure", detail: "Intentional falls on V1–V2 for 10 min" },
        ],
      },
      {
        id: "focus-under-fatigue",
        label: "Focus Under Fatigue",
        exercises: [
          { name: "Endgame Projecting", detail: "Only attempt your project in the last 20 min of a session" },
          { name: "Single-attempt Rule", detail: "One try per problem per session — forces full focus" },
          { name: "Distraction Resistance", detail: "Climb with background noise — ignore environment" },
          { name: "Fatigue Beta Logging", detail: "Note which beta cues break down first under pump" },
        ],
      },
    ],
  },
];
