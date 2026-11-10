export function LineChart({
  data,
  series,
  height = 220,
}: {
  data: { label: string; [key: string]: string | number }[];
  series: { key: string; label: string; color: string }[];
  height?: number;
}) {
  if (data.length === 0) {
    return <p className="admin-chart-empty">No data for this period yet.</p>;
  }

  const width = 640;
  const pad = { top: 16, right: 12, bottom: 36, left: 36 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const maxY = Math.max(
    1,
    ...data.flatMap((row) => series.map((s) => Number(row[s.key] ?? 0))),
  );

  const xAt = (i: number) =>
    pad.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yAt = (v: number) => pad.top + innerH - (v / maxY) * innerH;

  return (
    <div className="admin-chart-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="admin-chart-svg"
        role="img"
        aria-label="Trend over time"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.top + innerH * (1 - t);
          const val = Math.round(maxY * t);
          return (
            <g key={t}>
              <line
                x1={pad.left}
                y1={y}
                x2={width - pad.right}
                y2={y}
                className="admin-chart-grid"
              />
              <text x={pad.left - 8} y={y + 4} className="admin-chart-axis">
                {val}
              </text>
            </g>
          );
        })}

        {series.map((s) => {
          const points = data.map((row, i) => ({
            x: xAt(i),
            y: yAt(Number(row[s.key] ?? 0)),
          }));
          const d = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
            .join(" ");
          return (
            <g key={s.key}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={2.5} />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3} fill={s.color} />
              ))}
            </g>
          );
        })}

        {data.map((row, i) => {
          if (data.length > 14 && i % 2 !== 0 && i !== data.length - 1) return null;
          return (
            <text
              key={row.label}
              x={xAt(i)}
              y={height - 8}
              className="admin-chart-axis admin-chart-x"
              textAnchor="middle"
            >
              {row.label.slice(5)}
            </text>
          );
        })}
      </svg>

      <ul className="admin-chart-legend">
        {series.map((s) => (
          <li key={s.key}>
            <span className="admin-chart-swatch" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
