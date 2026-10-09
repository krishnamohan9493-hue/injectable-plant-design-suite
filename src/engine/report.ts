import { jsPDF } from "jspdf";
import { FORMULAS } from "./formulas";
import { evaluateFormula, ACCEPTANCE } from "./calcEngine";
import type { CalcFormula } from "./calcEngine";
import { useAppStore } from "../store/appStore";
import { MODULE_INFO } from "../components/ModuleView";

export function buildPdfReport() {
  const st = useAppStore.getState();
  const all: CalcFormula[] = [...FORMULAS, ...st.customFormulas];
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 15;
  const line = (t: string, size = 9, bold = false, gap = 5) => {
    if (y > 280) { doc.addPage(); y = 15; }
    doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size);
    doc.splitTextToSize(t, 180).forEach((l: string) => { if (y > 280) { doc.addPage(); y = 15; } doc.text(l, 15, y); y += gap; });
  };
  const ascii = (t: string) => t.replace(/[–—]/g, "-").replace(/[²]/g, "2").replace(/[³]/g, "3").replace(/[₂]/g, "2").replace(/[·×]/g, "x").replace(/[^\x20-\x7E]/g, "");
  line("Injectable Plant Design Suite - Calculation Report", 15, true, 8);
  line(ascii(`${st.project.name} | ${st.project.location}`), 10);
  line(`Generated: ${new Date().toLocaleString()} | Role: ${st.role}`, 9, false, 7);
  line("Production lines", 11, true, 6);
  st.lines.forEach((l) => line(ascii(`${l.name}: batch ${l.batchSize}, ${l.fillSpeed} vpm, ${l.shifts} shift(s), OEE ${l.oee}%, ${l.workingDays} d/yr`)));
  y += 3;
  for (const m of Object.keys(MODULE_INFO)) {
    const list = all.filter((f) => f.moduleId === m);
    if (!list.length) continue;
    y += 3; line(ascii(`M${m} - ${MODULE_INFO[m].title}`), 11, true, 6);
    list.forEach((f) => {
      const r = evaluateFormula(f, st.formulaOverrides[f.id]);
      const v = isFinite(r.value) ? r.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "n/a";
      const mv = isFinite(r.marginValue) ? r.marginValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "n/a";
      line(ascii(`${f.name}: ${v} ${r.unit} (with ${f.marginPct}% margin: ${mv}) [${r.status.toUpperCase()}]`), 9, true, 4.5);
      line(ascii(`  Std: ${f.standardRef}${ACCEPTANCE[f.id] ? " | Acceptance: " + ACCEPTANCE[f.id].note : ""}`), 8, false, 4);
      line(ascii(`  Inputs: ${Object.entries(r.inputs).map(([k, x]) => `${k}=${x}`).join(", ")}`), 8, false, 4.5);
    });
  }
  y += 4; line("Audit trail (last 30 entries)", 11, true, 6);
  st.audit.slice(-30).forEach((a) => line(ascii(`${a.ts.slice(0, 19).replace("T", " ")} | ${a.user} | ${a.action} | ${a.detail}`), 7, false, 3.8));
  doc.save("injectable-plant-design-report.pdf");
}
