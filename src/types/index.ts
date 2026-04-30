export interface Exercise {
  name: string;
  detail: string;
}

export interface Skill {
  id: string;
  label: string;
  exercises: Exercise[];
}

export interface Category {
  id: string;
  label: string;
  color: string;
  skills: Skill[];
}

export interface SelectedSkillV1 extends Skill {
  categoryColor: string;
  categoryLabel: string;
}

// Recursive skill tree
export interface TreeBranch {
  id: string;
  label: string;
  children: TreeNode[];
}

export interface TreeLeaf {
  id: string;
  label: string;
  description?: string;
  exercises: Exercise[];
}

export type TreeNode = TreeBranch | TreeLeaf;

export interface SelectedSkillV2 extends TreeLeaf {
  ancestorPath: string[];
}

// Goals
export interface GoalTag {
  nodeId: string;
  nodeLabel: string;
}

export interface Goal {
  id: string;
  areaId: string;
  areaLabel: string;
  isPrimary: boolean;
  selectedNodeIds: string[];
}

// Schedule / kanban
export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  grade?: string;
  accent: string;
  goalTags?: GoalTag[];
}

export interface Day {
  id: string;
  date: string;
}

export type Columns = Record<string, Activity[]>;

// Supabase activity row
export type ActivityType = "climbing" | "conditioning" | "mobility" | "warmup";

export interface DbActivity {
  id: string;
  user_id: string;
  scheduled_date: string;
  type: ActivityType;
  title: string;
  intent_node_id: string | null;
  duration_minutes: number | null;
  order: number;
  created_at: string;
}

// Activity templates
export type ActivityCategory = "conditioning" | "mobility" | "warmup";

export interface ActivityTemplate {
  name: string;
  category: ActivityCategory;
  exercises?: string[];
}
