import * as React from "react";
import { useAppStore } from "../store/appStore";
import { evaluateFormula } from "../engine/calcEngine";
import type { CalcFormula } from "../engine/calcEngine";
import { Card, CardHeader, CardTitle, CardDesc, CardContent, Badge, Input, Label } from "./ui/primitives";

function flagClass(status: string) {
  if (status === "pass") return "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20";
  if (status === "warn") return "border-amber-200 bg-amber-50 dark:bg-amber-900/20";
  return "border-red-200 bg-red-50 dark:bg-red-900/20";
}

export function CalcCard({ formula, onExplain }: { formula: CalcFormula; onExplain?: (f: CalcFormula) => void }) {
  const overrides = useAppStore((s) => s.formulaOverrides[formula.id] ?? {});
  const setOverride = useAppStore((s) => s.setFormulaOverride);
  const addAudit = useAppStore((s) => s.addAudit);
  const result = evaluateFormula(formula, overrides);
  const [showFormula, setShowFormula] = React.useState(false);

  return (
    <Card className={`overflow-hidden ${flagClass(result.status)}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-[13px] leading-tight">{formula.name}</CardTitle>
          <Badge variant={result.status === "pass" ? "success" : result.status === "warn" ? "warn" : "destructive"}>{result.status.toUpperCase()}</Badge>
        </div>
        <CardDesc className="flex flex-wrap gap-1.5 mt-1">
          <span className="rounded bg-white dark:bg-slate-800 border px-1.5 py-0.5 text-[10px]">{formula.standardRef}</span>
          <span className="text-[10px]">Margin {formula.marginPct}%</span>
          <button onClick={() => setShowFormula((v) => !v)} className="text-[10px] underline">formula</button>
          {onExplain && <button onClick={() => onExplain(formula)} className="text-[10px] underline">auditor</button>}
        </CardDesc>
      </CardHeader>
      <CardContent className="space-y-3">
        {showFormula && (
          <div className="rounded-lg bg-slate-900 text-slate-100 p-3 font-mono text-xs overflow-auto">
            <div className="opacity-60 text-[10px]">{formula.id}</div>
            <div className="mt-1 break-all">{formula.expression}</div>
            <div className="mt-1 opacity-60">→ {formula.unit}</div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {formula.inputs.map((inp) => (
            <div key={inp.id} className="space-y-1">
              <Label title={inp.description}>{inp.label} <span className="opacity-50">({inp.unit})</span></Label>
              <Input
                type="number"
                value={overrides[inp.id] ?? inp.value}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) { setOverride(formula.id, inp.id, v); addAudit("Calc input edited", `${formula.id}.${inp.id}=${v}`); }
                }}
                step="any"
              />
              <div className="text-[10px] opacity-60">default – verify: {inp.defaultVal}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-900 p-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wide opacity-60">Result</div>
            <div className="text-lg font-bold">{isFinite(result.value) ? result.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}</div>
            <div className="text-xs opacity-60">{result.unit}</div>
            {result.error && <div className="text-[10px] text-red-600 mt-1">{result.error}</div>}
          </div>
          <div className="border-l">
            <div className="text-[10px] uppercase tracking-wide opacity-60">With margin</div>
            <div className="text-lg font-bold">{isFinite(result.marginValue) ? result.marginValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}</div>
            <div className="text-xs opacity-60">{result.unit} @ {formula.marginPct}%</div>
          </div>
          <div className="border-l flex flex-col items-center justify-center">
            <div className="text-[10px] uppercase tracking-wide opacity-60">Assumptions</div>
            <div className="text-[11px] leading-tight mt-1">{formula.remarks ?? "Editable inputs; verify against URS & site data."}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full border px-2 py-1 bg-white dark:bg-slate-800">Inputs → Formula → Result → Margin</span>
          <span className="rounded-full border px-2 py-1 bg-white dark:bg-slate-800">Std: {formula.standardRef}</span>
        </div>
      </CardContent>
    </Card>
  );
}
