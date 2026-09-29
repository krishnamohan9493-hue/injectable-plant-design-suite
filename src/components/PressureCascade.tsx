export function PressureCascade() {
  const rooms = [
    { name: "Grade A (Isolator)", grade: "A", dp: "+45 Pa", color: "bg-emerald-500" },
    { name: "Grade B Background", grade: "B", dp: "+30 Pa", color: "bg-sky-500" },
    { name: "Grade C Prep", grade: "C", dp: "+15 Pa", color: "bg-amber-500" },
    { name: "Grade D Corridor", grade: "D", dp: "0 Pa", color: "bg-orange-400" },
    { name: "CNC / Grey", grade: "CNC", dp: "-10 Pa", color: "bg-slate-400" },
  ];
  return (
    <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
      <div className="text-xs font-semibold mb-3">Pressure Cascade & Zoning (SVG) – 10–15 Pa steps per Annex 1</div>
      <svg viewBox="0 0 720 160" className="w-full h-[160px]">
        {rooms.map((r, i) => (
          <g key={r.grade}>
            <rect x={10 + i * 140} y={20} width={125} height={90} rx={12} className="stroke-slate-300" fill={i === 0 ? "#10b981" : i === 1 ? "#0ea5e9" : i === 2 ? "#f59e0b" : i === 3 ? "#fb923c" : "#94a3b8"} opacity={0.9} />
            <text x={72 + i * 140} y={55} textAnchor="middle" fontSize={11} fill="white" fontWeight={700}>{r.grade}</text>
            <text x={72 + i * 140} y={72} textAnchor="middle" fontSize={8} fill="white">{r.name}</text>
            <text x={72 + i * 140} y={92} textAnchor="middle" fontSize={10} fill="white" fontWeight={600}>{r.dp}</text>
            {i < rooms.length - 1 && <g>
              <line x1={135 + i * 140} y1={65} x2={150 + i * 140} y2={65} stroke="#334155" strokeWidth={2} markerEnd="url(#arrow)" />
              <text x={142 + i * 140} y={58} textAnchor="middle" fontSize={7} fill="#334155">+12 Pa</text>
            </g>}
          </g>
        ))}
        <defs><marker id="arrow" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" /></marker></defs>
      </svg>
      <div className="text-[11px] opacity-70">Airlocks, pass-boxes and interlocked doors maintain cascade; manometer + BMS monitoring per ISO 14644. Recovery & smoke studies per Grade A UDAF 0.45 m/s ±20%.</div>
    </div>
  );
}
