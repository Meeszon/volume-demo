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

// Recursive skill tree (Goals v2)
export interface TreeBranch {
  id: string;
  label: string;
  children: TreeNode[];
}

export interface TreeLeaf {
  id: string;
  label: string;
  exercises: Exercise[];
}

export type TreeNode = TreeBranch | TreeLeaf;

export interface SelectedSkillV2 extends TreeLeaf {
  ancestorPath: string[];
}

// Schedule / kanban
export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  grade: string;
  accent: string;
}

export interface Day {
  id: string;
  date: string;
}

export type Columns = Record<string, Activity[]>;
