import styles from "./ActivitiesPage.module.css";

export function ActivitiesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Activities</span>
      </header>
      <div className={styles.placeholder}>
        <span>Activities library coming soon</span>
      </div>
    </div>
  );
}
