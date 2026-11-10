type Bar = { label: string; value: number; color?: string };

export function BarChart({
  bars,
  horizontal = false,
  height = 220,
}: {
  bars: Bar[];
  horizontal?: boolean;
  height?: number;
}) {
  if (bars.length === 0) {
    return <p className="admin-chart-empty">No data yet.</p>;
  }

  const max = Math.max(1, ...bars.map((b) => b.value));

  if (horizontal) {
    return (
      <ul className="admin-hbar-list">
        {bars.map((bar) => (
          <li key={bar.label} className="admin-hbar-item">
            <span className="admin-hbar-label" title={bar.label}>
              {bar.label}
            </span>
            <div className="admin-hbar-track">
              <div
                className="admin-hbar-fill"
                style={{
                  width: `${(100 * bar.value) / max}%`,
                  background: bar.color ?? "var(--accent)",
                }}
              />
            </div>
            <span className="admin-hbar-value">{bar.value}</span>
          </li>
        ))}
      </ul>
    );
  }

  const width = 640;
  const pad = { top: 12, right: 12, bottom: 48, left: 12 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const gap = 8;
  const barW = (innerW - gap * (bars.length - 1)) / bars.length;

  return (
    <div className="admin-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="admin-chart-svg" role="img">
        {bars.map((bar, i) => {
          const h = (bar.value / max) * innerH;
          const x = pad.left + i * (barW + gap);
          const y = pad.top + innerH - h;
          return (
            <g key={bar.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={4}
                fill={bar.color ?? "var(--accent)"}
              />
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                className="admin-chart-bar-value"
              >
                {bar.value}
              </text>
              <text
                x={x + barW / 2}
                y={height - 10}
                textAnchor="middle"
                className="admin-chart-axis admin-chart-x"
              >
                {bar.label.length > 10 ? `${bar.label.slice(0, 9)}…` : bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
