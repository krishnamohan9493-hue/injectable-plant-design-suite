import * as React from "react";
import * as XLSX from "xlsx";
import { useAppStore } from "../store/appStore";
import { CalcCard } from "./CalcCard";
import { FORMULAS } from "../engine/formulas";
import { evaluateFormula, math, ACCEPTANCE } from "../engine/calcEngine";
import type { CalcFormula } from "../engine/calcEngine";
import { Button, Input, Label, Card, CardContent, Badge } from "./ui/primitives";

export const MODULE_INFO: Record<string, { title: string; desc: string }> = {
  "0": { title: "Project Setup & URS", desc: "Location, lines, capacity and regulatory targets." },
  "1": { title: "Architecture & Layout", desc: "Area programme, airlocks, flows, cascade and fire compartments." },
  "2": { title: "HVAC & Cleanroom", desc: "ACH, HEPA, cooling load, AHU, chillers, recovery (ISO 14644 / Annex 1)." },
  "3": { title: "Process & Equipment Sizing", desc: "Compounding, filtration, autoclave F0, lyophiliser, vial washing and depyrogenation." },
  "4": { title: "Utilities – Water Systems", desc: "PW/WFI generation, storage, loop velocity, RO and pure steam (USP <1231>)." },
  "5": { title: "Utilities – Air, Gases, Steam, Vacuum", desc: "Compressed air, N₂, boiler/steam, vacuum (ISO 8573-1, IBR)." },
  "6": { title: "Electrical System", desc: "Load, transformer, DG, UPS, PF correction, cable, short-circuit, lighting." },
  "7": { title: "Instrumentation, Control & Automation", desc: "Control valves, orifice, I/O count (ISA 5.1, IEC 60534, 21 CFR Part 11)." },
  "8": { title: "BMS / EMS / Access / Safety", desc: "Fire water, sprinklers, CCTV storage, access control." },
  "9": { title: "Mechanical & Piping", desc: "Pump power, NPSH, pipe sizing, insulation." },
  "10": { title: "Qualification, Validation & Compliance", desc: "Carry-over limits, media-fill size, IQ/OQ/PQ planning." },
  "11": { title: "Cost, Schedule & Sustainability", desc: "Energy cost, capex, carbon footprint, solar payback." },
};

function detectInputs(expr: string): string[] {
  const names = new Set<string>();
  math.parse(expr).traverse((n: any, _p: string, parent: any) => {
    if (n.isSymbolNode && !(parent?.isFunctionNode && parent.fn === n) && !(n.name in math)) names.add(n.name);
  });
  return [...names];
}

function CustomFormulaForm({ moduleId }: { moduleId: string }) {
  const add = useAppStore((s) => s.addCustomFormula);
  const [name, setName] = React.useState("");
  const [expr, setExpr] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [std, setStd] = React.useState("User-defined");
  const [err, setErr] = React.useState("");
  const submit = () => {
    try {
      if (!name.trim() || !expr.trim()) throw new Error("Name and expression are required");
      const ids = detectInputs(expr);
      const inputs = ids.map((id) => ({ id, label: id, value: 1, unit: "-", defaultVal: 1, editable: true }));
      math.evaluate(expr, Object.fromEntries(ids.map((i) => [i, 1])));
      add({ id: `custom-${moduleId}-${Date.now()}`, name, category: "Custom", moduleId, unit: unit || "-", standardRef: std, marginPct: 0, expression: expr, inputs, remarks: "User-defined formula – verify before use." });
      setName(""); setExpr(""); setErr("");
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
  };
  return (
    <Card><CardContent className="pt-5 space-y-3">
      <h3 className="font-semibold text-sm">Add custom formula (extend this module)</h3>
      <div className="grid sm:grid-cols-2 gap-2">
        <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jacketed vessel heat-up time" /></div>
        <div><Label>Result unit</Label><Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kW" /></div>
        <div className="sm:col-span-2"><Label>Expression (variables become editable inputs)</Label><Input value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="massKg * cp * deltaT / (timeS * 1000)" /></div>
        <div className="sm:col-span-2"><Label>Standard / reference</Label><Input value={std} onChange={(e) => setStd(e.target.value)} /></div>
      </div>
      {err && <div className="text-xs text-red-600">{err}</div>}
      <Button size="sm" onClick={submit}>Add formula</Button>
    </CardContent></Card>
  );
}

export function ModuleView({ moduleId }: { moduleId: string }) {
  const custom = useAppStore((s) => s.customFormulas);
  const overrides = useAppStore((s) => s.formulaOverrides);
  const remove = useAppStore((s) => s.removeCustomFormula);
  const info = MODULE_INFO[moduleId];
  const formulas: CalcFormula[] = React.useMemo(
    () => [...FORMULAS.filter((f) => f.moduleId === moduleId), ...custom.filter((f) => f.moduleId === moduleId)], [moduleId, custom]);
  const groups = React.useMemo(() => {
    const g: Record<string, CalcFormula[]> = {};
    formulas.forEach((f) => (g[f.category] ??= []).push(f));
    return g;
  }, [formulas]);
  const results = formulas.map((f) => ({ f, r: evaluateFormula(f, overrides[f.id]) }));
  const counts = { pass: 0, warn: 0, fail: 0 } as Record<string, number>;
  results.forEach(({ r }) => counts[r.status]++);

  const exportXlsx = () => {
    const rows = results.map(({ f, r }) => ({ ID: f.id, Calculation: f.name, Result: r.value, Unit: r.unit, [`With margin`]: r.marginValue, "Margin %": f.marginPct, Status: r.status, Standard: f.standardRef, Acceptance: ACCEPTANCE[f.id]?.note ?? "", Inputs: JSON.stringify(r.inputs) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), `M${moduleId}`);
    XLSX.writeFile(wb, `module-${moduleId}-calculations.xlsx`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">M{moduleId} – {info.title}</h2>
          <p className="text-sm text-muted-foreground">{info.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">{counts.pass} pass</Badge><Badge variant="warn">{counts.warn} warn</Badge><Badge variant="destructive">{counts.fail} fail</Badge>
          <Button size="sm" variant="outline" onClick={exportXlsx}>Export XLSX</Button>
        </div>
      </div>
      {Object.entries(groups).map(([cat, list]) => (
        <section key={cat} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-70">{cat}</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {list.map((f) => (
              <div key={f.id} className="space-y-1">
                <CalcCard formula={f} onExplain={(x) => alert(`Standard: ${x.standardRef}\nAcceptance: ${ACCEPTANCE[x.id]?.note ?? "n/a"}\nRemarks: ${x.remarks ?? "N/A"}`)} />
                {f.category === "Custom" && <button className="text-xs underline text-red-600" onClick={() => remove(f.id)}>remove custom formula</button>}
              </div>
            ))}
          </div>
        </section>
      ))}
      {formulas.length === 0 && <p className="text-sm text-muted-foreground">No formulas yet – add one below.</p>}
      <CustomFormulaForm moduleId={moduleId} />
    </div>
  );
}
