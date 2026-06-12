const LEVEL_STYLES = {
  "high-alert":
    "border-red-500 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-950/60 dark:text-red-200",
  vesicant:
    "border-orange-500 bg-orange-50 text-orange-800 dark:border-orange-600 dark:bg-orange-950/60 dark:text-orange-200",
  lasa: "border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-200",
  pediatric:
    "border-purple-500 bg-purple-50 text-purple-800 dark:border-purple-600 dark:bg-purple-950/60 dark:text-purple-200",
};

const LEVEL_LABELS = {
  "high-alert": "⚠ HIGH ALERT",
  vesicant: "⚠ VESICANT",
  lasa: "⚠ LOOK-ALIKE / SOUND-ALIKE",
  pediatric: "⚠ PEDIATRIC",
};

/** Standing banners (high-alert / vesicant / LASA / pediatric) from validation.js */
export default function SafetyBanner({ banners = [], warnings = [], errors = [] }) {
  if (!banners.length && !warnings.length && !errors.length) return null;
  return (
    <div className="space-y-2">
      {errors.map((e, i) => (
        <div
          key={`e${i}`}
          className="rounded-lg border-l-4 border-red-600 bg-red-50 p-3 text-sm font-medium text-red-800 dark:bg-red-950/60 dark:text-red-200"
          role="alert"
        >
          <span className="font-bold">Cannot calculate: </span>
          {e}
        </div>
      ))}
      {banners.map((b, i) => (
        <div
          key={`b${i}`}
          className={`rounded-lg border-l-4 p-3 text-sm font-medium ${LEVEL_STYLES[b.level] || LEVEL_STYLES["high-alert"]}`}
          role="alert"
        >
          <span className="font-bold">{LEVEL_LABELS[b.level] || "⚠"}: </span>
          {b.text}
        </div>
      ))}
      {warnings.map((w, i) => (
        <div
          key={`w${i}`}
          className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-3 text-sm font-medium text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-200"
          role="alert"
        >
          <span className="font-bold">Verify: </span>
          {w}
        </div>
      ))}
    </div>
  );
}
