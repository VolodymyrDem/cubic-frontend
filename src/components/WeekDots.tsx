import React from "react";

type Props = {
  total: number;         // скільки тижнів
  value: number;         // обраний тиждень (1-based)
  onChange: (week: number) => void;
  current?: number;      // 👈 поточний тиждень (1-based), підсвічується завжди
};

const WeekDots: React.FC<Props> = ({ total, value, onChange, current }) => {
  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {Array.from({ length: total }, (_, i) => {
        const week = i + 1;
        const isActive = week === value;
        const isCurrent = typeof current === "number" && week === current;

        const classes = [
          "w-4 h-4 rounded-full transition-colors border border-[var(--border)] hover-lift relative",
          isActive
            ? "bg-[var(--primary)]/70"
            : "bg-[var(--muted)]/15 hover:bg-[var(--muted)]/50",
          isCurrent ? "outline outline-2 outline-offset-2 outline-[var(--primary)]" : ""
        ].join(" ");

        return (
          <button
            key={week}
            onClick={() => onChange(week)}
            className={classes}
            aria-label={`Тиждень ${week}`}
            aria-current={isCurrent ? "true" : undefined}
            title={isCurrent ? `Тиждень ${week} (поточний)` : `Тиждень ${week}`}
          />
        );
      })}
    </div>
  );
};

export default WeekDots;
