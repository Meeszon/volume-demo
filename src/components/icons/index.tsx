/* ── Navigation icons ── */

export function ScheduleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#787878" strokeWidth="1.2" />
      <path d="M5 2v2M11 2v2" stroke="#787878" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M2 6.5h12" stroke="#787878" strokeWidth="1.2" />
    </svg>
  );
}

export function ActivitiesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="6.5" width="3" height="3" rx="0.75" stroke="#787878" strokeWidth="1.2" />
      <rect x="12" y="6.5" width="3" height="3" rx="0.75" stroke="#787878" strokeWidth="1.2" />
      <path d="M4 8h2.5M9.5 8H12" stroke="#787878" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="6.5" y="5.5" width="3" height="5" rx="0.75" stroke="#787878" strokeWidth="1.2" />
    </svg>
  );
}

export function GoalsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#787878" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3.5" stroke="#787878" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1" fill="#787878" />
    </svg>
  );
}

/* ── Chevrons ── */

export function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M3 4.5L6 7.5l3-3"
        stroke="#9d9c99"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M7.5 9L4.5 6l3-3"
        stroke="#787878"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M4.5 9L7.5 6l-3-3"
        stroke="#787878"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Expandable chevron for tree nodes and category blocks. */
export function ChevronExpandIcon({ open, size = 12 }: { open: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        flexShrink: 0,
      }}
    >
      <path
        d="M4.5 9L7.5 6l-3-3"
        stroke="#9d9c99"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Card / action icons ── */

export function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="#9d9c99" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#787878"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ImagePlaceholderIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c8c7c4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M2 5.5l2.5 2.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small inline chevron used inside exercise toggle buttons. */
export function ChevronSmallIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
    >
      <path d="M2 3.5L5 6.5l3-3" stroke="#9d9c99" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
