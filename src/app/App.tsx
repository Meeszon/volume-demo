import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { SchedulePage } from "../features/schedule/SchedulePage";
import { GoalsPage } from "../features/goals/GoalsPage";
import { Goals2Page } from "../features/goals/Goals2Page";
import { ActivitiesPage } from "../features/activities/ActivitiesPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <HashRouter>
      <div className={styles.page}>
        <Sidebar />
        <div className={styles.mainCard}>
          <Routes>
            <Route path="/" element={<Navigate to="/schedule" replace />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/goals2" element={<Goals2Page />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
