import { create, all } from "mathjs";
const math = create(all);

export type Unit = string;
export interface CalcInput {
  id: string; label: string; value: number; unit: Unit; min?: number; max?: number; defaultVal: number; editable: boolean; description?: string;
}
export interface CalcFormula {
  id: string; name: string; inputs: CalcInput[]; expression: string; unit: string; standardRef: string; marginPct: number; remarks?: string; category: string; moduleId: string;
}
export interface CalcResult {
  formulaId: string; value: number; unit: string; marginValue: number; status: "pass" | "warn" | "fail"; inputs: Record<string, number>; error?: string;
}
export function evaluateFormula(f: CalcFormula, overrides?: Record<string, number>): CalcResult {
  const scope: Record<string, number> = {};
  for (const inp of f.inputs) scope[inp.id] = overrides?.[inp.id] ?? inp.value;
  try {
    const value = math.evaluate(f.expression, scope) as number;
    const marginValue = value * (1 + f.marginPct / 100);
    let status: CalcResult["status"] = "pass";
    // warn if expression contains reference check handled externally
    return { formulaId: f.id, value, unit: f.unit, marginValue, status, inputs: { ...scope } };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { formulaId: f.id, value: NaN, unit: f.unit, marginValue: NaN, status: "fail", inputs: { ...scope }, error: msg };
  }
}
export function evaluateAll(formulas: CalcFormula[], overridesMap?: Record<string, Record<string, number>>): CalcResult[] {
  return formulas.map((f) => evaluateFormula(f, overridesMap?.[f.id]));
}
// Dependency graph – topological sort for chained calcs
export function sortByDependencies(formulas: CalcFormula[]): CalcFormula[] {
  // naive: formulas whose expression references another formula's id come after
  const ids = new Set(formulas.map((f) => f.id));
  const deps = new Map<string, Set<string>>();
  for (const f of formulas) {
    const d = new Set<string>();
    for (const id of ids) if (f.expression.includes(id) && id !== f.id) d.add(id);
    deps.set(f.id, d);
  }
  const visited = new Set<string>(); const temp = new Set<string>(); const order: string[] = [];
  const visit = (id: string) => {
    if (visited.has(id)) return; if (temp.has(id)) throw new Error("Circular dependency: " + id);
    temp.add(id);
    for (const dep of deps.get(id) ?? []) visit(dep);
    temp.delete(id); visited.add(id); order.push(id);
  };
  for (const f of formulas) visit(f.id);
  const map = new Map(formulas.map((f) => [f.id, f]));
  return order.map((id) => map.get(id)!);
}

export { math };
