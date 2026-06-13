/**
 * Hand-drawn SVG icon set — crisp, theme-aware (currentColor), and fully
 * offline (no icon-library dependency). 24px grid, round caps/joins.
 */
const PATHS = {
  droplet: <path d="M12 3s6 6.3 6 10.8a6 6 0 0 1-12 0C6 9.3 12 3 12 3z" />,
  gauge: (
    <>
      <path d="M4 15.5a8 8 0 0 1 16 0" />
      <path d="M12 15.5l4.6-3.2" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pulse: <path d="M3 12h4l2.2-6 3.6 12L15 12h6" />,
  pill: (
    <>
      <rect x="4.5" y="9" width="15" height="6" rx="3" transform="rotate(-45 12 12)" />
      <path d="M9 9l6 6" />
    </>
  ),
  beaker: (
    <>
      <path d="M8 3h8" />
      <path d="M9 3v6l-4 8.5A2 2 0 0 0 6.8 21h10.4a2 2 0 0 0 1.8-3.5L15 9V3" />
      <path d="M7.5 14.5h9" />
    </>
  ),
  weight: (
    <>
      <path d="M9 8.5a3 3 0 0 1 6 0" />
      <path d="M6.4 8.5h11.2l1.1 10.8a1.6 1.6 0 0 1-1.6 1.7H6.9a1.6 1.6 0 0 1-1.6-1.7z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 2.5V11c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V5.5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6.5L5.2 18A2 2 0 0 0 7 21h10a2 2 0 0 0 1.8-3L14 9.5V3" />
      <path d="M8.7 15.5h6.6" />
    </>
  ),
  ruler: (
    <g transform="rotate(-45 12 12)">
      <rect x="2.5" y="9" width="19" height="6" rx="1.3" />
      <path d="M7 9v2.4M11 9v3M15 9v2.4" />
    </g>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.7" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.7" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.7" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.7" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10 5 7.5 5 5 5.4v13C7.5 18 10 18 12 19.5 14 18 16.5 18 19 18.4v-13C16.5 5 14 5 12 6.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </>
  ),
  moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
};

export default function Icon({ name, size = 22, strokeWidth = 1.75, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  );
}
