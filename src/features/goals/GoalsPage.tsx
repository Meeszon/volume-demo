import { useState } from "react";
import { SKILL_TREE_V1 } from "../../data/skillTreeV1";
import type { Category, Skill, SelectedSkillV1 } from "../../types";
import { useSetToggle } from "../../hooks/useSetToggle";
import { ChevronExpandIcon, CheckIcon, ChevronSmallIcon } from "../../components/icons";
import styles from "./GoalsPage.module.css";

/* ── Category block ── */

interface CategoryBlockProps {
  category: Category;
  expandedCategories: Set<string>;
  selectedSkills: Set<string>;
  onToggleCategory: (id: string) => void;
  onToggleSkill: (id: string) => void;
}

function CategoryBlock({
  category,
  expandedCategories,
  selectedSkills,
  onToggleCategory,
  onToggleSkill,
}: CategoryBlockProps) {
  const isOpen = expandedCategories.has(category.id);
  const selectedCount = category.skills.filter((s) => selectedSkills.has(s.id)).length;

  return (
    <div className={styles.categoryBlock}>
      <div className={styles.categoryHeader} onClick={() => onToggleCategory(category.id)}>
        <ChevronExpandIcon open={isOpen} />
        <span className={styles.categoryDot} style={{ backgroundColor: category.color }} />
        <span className={styles.categoryLabel}>{category.label}</span>
        {selectedCount > 0 && (
          <span className={styles.categoryCount} style={{ color: category.color }}>
            {selectedCount} selected
          </span>
        )}
      </div>
      <div className={`${styles.categoryBodyWrapper}${isOpen ? ` ${styles.open}` : ""}`}>
        <div className={styles.categoryBody}>
          {category.skills.map((skill: Skill) => {
            const isSelected = selectedSkills.has(skill.id);
            return (
              <button
                key={skill.id}
                className={`${styles.skillChip}${isSelected ? ` ${styles.selected}` : ""}`}
                style={
                  isSelected ? { backgroundColor: category.color, borderColor: category.color } : {}
                }
                onClick={() => onToggleSkill(skill.id)}
              >
                {isSelected && <CheckIcon />}
                {skill.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Goal card ── */

interface GoalCardProps {
  skill: SelectedSkillV1;
  onRemove: (id: string) => void;
}

function GoalCard({ skill, onRemove }: GoalCardProps) {
  const [showExercises, setShowExercises] = useState(false);

  return (
    <div className={styles.goalCard} style={{ borderLeftColor: skill.categoryColor }}>
      <div className={styles.goalCardHeader}>
        <div className={styles.goalCardMeta}>
          <span className={styles.goalCardCategory} style={{ color: skill.categoryColor }}>
            {skill.categoryLabel}
          </span>
          <span className={styles.goalCardName}>{skill.label}</span>
        </div>
        <button className={styles.removeBtn} onClick={() => onRemove(skill.id)}>
          ×
        </button>
      </div>
      <button className={styles.exercisesToggle} onClick={() => setShowExercises((v) => !v)}>
        {showExercises ? "Hide" : "Show"} suggested exercises
        <ChevronSmallIcon open={showExercises} />
      </button>
      {showExercises && (
        <div className={styles.exercisesList}>
          {skill.exercises.map((ex) => (
            <div key={ex.name} className={styles.exerciseItem}>
              <span className={styles.exerciseName}>{ex.name}</span>
              <span className={styles.exerciseDetail}>{ex.detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ── */

export function GoalsPage() {
  const expanded = useSetToggle(SKILL_TREE_V1.map((c) => c.id));
  const selected = useSetToggle();

  const selectedSkillObjects: SelectedSkillV1[] = SKILL_TREE_V1.flatMap((cat) =>
    cat.skills
      .filter((s) => selected.set.has(s.id))
      .map((s) => ({ ...s, categoryColor: cat.color, categoryLabel: cat.label }))
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Goals</span>
      </header>

      <div className={styles.layout}>
        <div className={styles.treePanel}>
          {SKILL_TREE_V1.map((category) => (
            <CategoryBlock
              key={category.id}
              category={category}
              expandedCategories={expanded.set}
              selectedSkills={selected.set}
              onToggleCategory={expanded.toggle}
              onToggleSkill={selected.toggle}
            />
          ))}
        </div>

        <div className={styles.detailPanel}>
          {selectedSkillObjects.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#dcdcdc" strokeWidth="1.2" />
                <circle cx="8" cy="8" r="3.5" stroke="#dcdcdc" strokeWidth="1.2" />
                <circle cx="8" cy="8" r="1" fill="#dcdcdc" />
              </svg>
              <span>What are you working on?</span>
              <span className={styles.emptySub}>
                Pick skills from the left to set your training focus
              </span>
            </div>
          ) : (
            <div className={styles.detailInner}>
              <div className={styles.myGoalsHeader}>
                <div className={styles.myGoalsTitle}>My Goals</div>
                <div className={styles.myGoalsSub}>
                  {selectedSkillObjects.length > 4
                    ? "Consider narrowing your focus — less is more"
                    : "Your current training focus"}
                </div>
              </div>
              <div className={styles.cardList}>
                {selectedSkillObjects.map((skill) => (
                  <GoalCard key={skill.id} skill={skill} onRemove={selected.remove} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
