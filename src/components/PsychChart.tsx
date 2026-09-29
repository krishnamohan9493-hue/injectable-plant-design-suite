import * as React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Scatter } from "recharts";
import { humidityRatio, saturationCurve } from "../engine/psychrometrics";
import { useAppStore } from "../store/appStore";

export function PsychChart() {
  const p = useAppStore((s) => s.project);
  const sat = React.useMemo(() => saturationCurve().map((d) => ({ T: d.T, Wg: +(d.W * 1000).toFixed(2) })), []);
  const points = [
    { T: p.dbSummer, Wg: +(humidityRatio(p.dbSummer, p.rhSummer) * 1000).toFixed(2), label: "Summer DB/WB" },
    { T: p.dbMonsoon, Wg: +(humidityRatio(p.dbMonsoon, p.rhMonsoon) * 1000).toFixed(2), label: "Monsoon" },
    { T: 13, Wg: +(humidityRatio(13, 95) * 1000).toFixed(2), label: "Supply (13°C)" },
    { T: 22, Wg: +(humidityRatio(22, 55) * 1000).toFixed(2), label: "Room 22°C/55%" },
  ];
  return (
    <div className="h-[300px] w-full rounded-xl border bg-white dark:bg-slate-900 p-2">
      <div className="text-xs font-semibold mb-1">Psychrometric Chart – Hyderabad (alt {p.altitudeM} m, Patm ~95.3 kPa) – g/kg vs °C</div>
      <ResponsiveContainer width="100%" height="92%">
        <LineChart data={sat} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="T" type="number" domain={[0, 50]} label={{ value: "Dry-bulb (°C)", position: "insideBottom", offset: -2 }} />
          <YAxis dataKey="Wg" type="number" domain={[0, 30]} label={{ value: "Humidity ratio (g/kg)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Line type="monotone" dataKey="Wg" stroke="#0ea5e9" dot={false} strokeWidth={2} name="Saturation (100% RH)" />
          {/* scatter points */}
          <Scatter data={points} fill="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 text-[11px] mt-1">
        {points.map((pt) => <span key={pt.label} className="rounded-full border px-2 py-0.5 bg-slate-50 dark:bg-slate-800">{pt.label}: {pt.T}°C, {pt.Wg} g/kg</span>)}
      </div>
    </div>
  );
}
