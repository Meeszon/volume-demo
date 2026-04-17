import { NavLink } from "react-router-dom";
import {
  ScheduleIcon,
  ActivitiesIcon,
  GoalsIcon,
  ChevronDownIcon,
} from "../icons";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/schedule", label: "Schedule", icon: <ScheduleIcon /> },
  { to: "/activities", label: "Activities", icon: <ActivitiesIcon /> },
  { to: "/goals", label: "Skill Tree", icon: <GoalsIcon /> },
] as const;

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <span className={styles.sidebarTitle}>Volume</span>
        <ChevronDownIcon />
      </div>
      <nav className={styles.sidebarNav}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem}${isActive ? ` ${styles.active}` : ""}`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
