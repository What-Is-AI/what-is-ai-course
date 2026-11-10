type Slice = { label: string; value: number; color: string };

export function DonutChart({ slices, size = 180 }: { slices: Slice[]; size?: number }) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  if (total === 0) {
    return <p className="admin-chart-empty">No attempts yet.</p>;
  }

  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;

  const arcs = slices
    .filter((s) => s.value > 0)
    .map((slice) => {
      const sweep = (slice.value / total) * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      angle += sweep;
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      const large = sweep > Math.PI ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      const pct = Math.round((1000 * slice.value) / total) / 10;
      return { ...slice, d, pct };
    });

  return (
    <div className="admin-donut-row">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="admin-chart-svg"
        role="img"
        aria-label="Completion breakdown"
      >
        {arcs.map((a) => (
          <path key={a.label} d={a.d} fill={a.color} />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--surface-solid)" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="admin-donut-total">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="admin-donut-sub">
          attempts
        </text>
      </svg>
      <ul className="admin-donut-legend">
        {arcs.map((a) => (
          <li key={a.label}>
            <span className="admin-chart-swatch" style={{ background: a.color }} />
            <span>
              {a.label} — {a.value} ({a.pct}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
