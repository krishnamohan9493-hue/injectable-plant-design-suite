import * as React from "react";
import { useAppStore } from "./store/appStore";
import { CalcCard } from "./components/CalcCard";
import { PsychChart } from "./components/PsychChart";
import { PressureCascade } from "./components/PressureCascade";
import { FORMULAS } from "./engine/formulas";
import { ModuleView, MODULE_INFO } from "./components/ModuleView";
import { buildPdfReport } from "./engine/report";
import type { Role, LineConfig } from "./store/appStore";
import "./index.css";

function Module0() {
  const lines = useAppStore((s) => s.lines);
  const project = useAppStore((s) => s.project);
  const role = useAppStore((s) => s.role);
  const canEdit = role === "Admin" || role === "Designer";
  const upd = (id: string, patch: Partial<LineConfig>) => { useAppStore.getState().updateLine(id, patch); useAppStore.getState().addAudit("Line edited", `${id}: ${JSON.stringify(patch)}`); };
  const formulas = React.useMemo(() => FORMULAS.filter(f => f.moduleId === "0"), []);
  const handleExplain = (f: any) => {
    alert(`Standard: ${f.standardRef}\nRemarks: ${f.remarks ?? "N/A"}`);
  };
  return (
    <div className="space-y-6 p-4">
      <div className="border rounded-xl p-4 bg-white dark:bg-slate-900">
        <h2 className="text-xl font-semibold mb-2">Project Setup & URS</h2>
        <p className="text-sm text-muted-foreground">Define location, facility lines, regulatory targets, and product/line matrix.</p>
      </div>
      <div className="grid gap-4">
        {/* Project Info */}
        <div className="border rounded-xl p-4 bg-white dark:bg-slate-900">
          <h3 className="font-semibold mb-2">Project Information</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Facility Name</label>
              <p className="block w-full rounded border px-3 py-2 bg-slate-50 dark:bg-slate-800">{project.name}</p>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Location</label>
              <p className="block w-full rounded border px-3 py-2 bg-slate-50 dark:bg-slate-800">{project.location}</p>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Latitude (°N)</label>
              <p className="block w-full rounded border px-3 py-2 bg-slate-50 dark:bg-slate-800">{project.lat}</p>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Altitude (m)</label>
              <p className="block w-full rounded border px-3 py-2 bg-slate-50 dark:bg-slate-800">{project.altitudeM}</p>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Design DB Summer (°C)</label>
              <p className="block w-full rounded border px-3 py-2 bg-slate-50 dark:bg-slate-800">{project.dbSummer}</p>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Design WB Summer (°C)</label>
              <p className="block w-full rounded border px-3 py-2 bg-slate-50 dark:bg-slate-800">{project.wbSummer}</p>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Seismic Zone</label>
              <p className="block w-full rounded border px-3 py-2 bg-slate-50 dark:bg-slate-800">{project.seismicZone}</p>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Wind Speed (m/s)</label>
              <p className="block w-full rounded border px-3 py-2 bg-slate-50 dark:bg-slate-800">{project.windSpeedMs}</p>
            </div>
          </div>
        </div>

        {/* Lines */}
        <div className="border rounded-xl p-4 bg-white dark:bg-slate-900">
          <h3 className="font-semibold mb-2">Production Lines</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Line</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Batch Size</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fill Speed (vpm)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Vial Size (mL)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fill Vol (mL)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Shifts</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">OEE (%)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Working Days</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {lines.map((line) => (
                  <tr key={line.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-2 py-1 text-sm"><input disabled={!canEdit} className="w-56 rounded border px-2 py-1 bg-transparent" value={line.name} onChange={(e) => upd(line.id, { name: e.target.value })} /></td>
                    <td className="px-2 py-1 text-sm"><input disabled={!canEdit} className="w-36 rounded border px-2 py-1 bg-transparent" value={line.type} onChange={(e) => upd(line.id, { type: e.target.value })} /></td>
                    {(["batchSize", "fillSpeed", "vialSizeMl", "fillVolMl", "shifts", "oee", "workingDays"] as const).map((k) => (
                      <td key={k} className="px-2 py-1 text-sm"><input disabled={!canEdit} type="number" step="any" className="w-20 rounded border px-2 py-1 bg-transparent" value={line[k]} onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) upd(line.id, { [k]: v }); }} /></td>
                    ))}
                    <td className="px-2 py-1 text-sm"><button disabled={!canEdit} onClick={() => { if (confirm(`Delete ${line.name}?`)) { useAppStore.getState().removeLine(line.id); useAppStore.getState().addAudit("Line deleted", line.id); } }} className="btn-xs btn-outline btn-destructive">Del</button></td>
                  </tr>
                ))}
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <td className="px-4 py-2 text-sm font-medium" colSpan={9}>
                    <button disabled={!canEdit} onClick={() => { useAppStore.getState().addLine(); useAppStore.getState().addAudit("Line added", "new line"); }} className="btn btn-sm btn-outline">+ Add New Line</button>
                  </td>
                  <td className="px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* URS Formulas */}
        <div className="border rounded-xl p-4 bg-white dark:bg-slate-900">
          <h3 className="font-semibold mb-2">Capacity Calculations</h3>
          <div className="space-y-4">
            {formulas.map((f) => (
              <CalcCard key={f.id} formula={f} onExplain={handleExplain} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Module1() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Architecture and Layout</h2>
      <p className="text-muted-foreground">Area programme, personnel/material flow, airlock sizing, cascade pressure map, adjacency matrix, fire compartments.</p>
      <PressureCascade />
      <div className="mt-6"><ModuleView moduleId="1" /></div>
    </div>
  );
}

function Module2() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">HVAC and Cleanroom (Most Critical)</h2>
      <p className="text-muted-foreground">Room-by-room data sheets, cooling load, AHU sizing, chillers, isolator/RABS design.</p>
      <PsychChart />
      <div className="mt-6"><ModuleView moduleId="2" /></div>
    </div>
  );
}

function GenericModule({ id }: { id: string }) { return <ModuleView moduleId={id} />; }

function AuditView() {
  const audit = useAppStore((s) => s.audit);
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Audit Log (ALCOA+ trail)</h2>
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="px-3 py-2 text-left">Time</th><th className="px-3 py-2 text-left">Role</th><th className="px-3 py-2 text-left">Action</th><th className="px-3 py-2 text-left">Detail</th></tr></thead>
          <tbody>{[...audit].reverse().map((a, i) => <tr key={i} className="border-t"><td className="px-3 py-1 whitespace-nowrap">{a.ts.slice(0, 19).replace("T", " ")}</td><td className="px-3 py-1">{a.user}</td><td className="px-3 py-1">{a.action}</td><td className="px-3 py-1 break-all">{a.detail}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const currentModule = useAppStore((s) => s.currentModule);
  const role = useAppStore((s) => s.role);
  const dark = useAppStore((s) => s.dark);

  const ModuleComponent = currentModule === "audit" ? AuditView : currentModule === "0" ? Module0 : currentModule === "1" ? Module1 : currentModule === "2" ? Module2 : () => <GenericModule id={currentModule} />;

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-200 ${dark ? "dark" : ""}`}>
      <header className="border-b border-border bg-card/50 dark:bg-card/50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Injectable Plant Design Suite</h1>
          <div className="flex items-center gap-3">
            <select value={role} onChange={(e) => useAppStore.getState().setRole(e.target.value as Role)} className="rounded border px-2 py-1 text-sm bg-transparent">
              {["Admin", "Designer", "Reviewer", "Approver", "Auditor"].map((r) => <option key={r}>{r}</option>)}
            </select>
            {!(role === "Admin" || role === "Designer") && <span className="text-xs opacity-70">read-only</span>}
            <button onClick={() => useAppStore.getState().setModule(currentModule === "audit" ? "0" : "audit")} className="btn btn-sm btn-ghost">📜 Audit log</button>
            <button onClick={() => buildPdfReport()} className="btn btn-sm btn-ghost">📄 PDF report</button>
            <button onClick={() => useAppStore.getState().toggleDark()} className="btn btn-sm btn-ghost">
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="border-r border-border w-64 bg-card/50 dark:bg-card/50 flex flex-col">
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold mb-4">Modules</h2>
            <nav className="space-y-1">
              {[0,1,2,3,4,5,6,7,8,9,10,11].map((n) => (
                <button
                  key={n}
                  onClick={() => useAppStore.getState().setModule(String(n))}
                  className={`w-full text-left justify-start px-3 py-2 rounded-lg transition-colors ${currentModule === String(n) ? "bg-primary/20 text-primary" : "hover:bg-accent/10"}`}
                >
                  <span className="mr-2">M{n}</span>
                  <span className="flex-1">{MODULE_INFO[String(n)].title}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto px-4 py-4 border-t border-border">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Completion:</div>
              <div className="w-full bg-accent rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <div className="text-xs text-muted-foreground">100% (12/12 modules)</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <ModuleComponent />
        </main>
      </div>

      <footer className="border-t border-border text-center text-xs text-muted-foreground py-3">
        Injectable Plant Design Suite v1.0 • Built for sterile injectable facility design • © 2026 Krishna Mohan
      </footer>
    </div>
  );
}

export default App;
