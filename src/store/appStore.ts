import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LineConfig {
  id: string; name: string; type: string; batchSize: number; fillSpeed: number; vialSizeMl: number; fillVolMl: number; shifts: number; oee: number; workingDays: number;
}
export interface ProjectConfig {
  name: string; location: string; lat: number; altitudeM: number;
  dbSummer: number; wbSummer: number; rhSummer: number;
  dbMonsoon: number; rhMonsoon: number; seismicZone: string; windSpeedMs: number;
  builtUpM2: number; cleanroomM2: number;
}
export interface Scenario { id: string; name: string; factor: number; note: string; }
export interface AuditEntry { ts: string; user: string; action: string; detail: string; }
export type Role = "Admin" | "Designer" | "Reviewer" | "Approver" | "Auditor";
export type UnitSystem = "SI" | "Imperial";

interface AppState {
  project: ProjectConfig;
  lines: LineConfig[];
  scenarios: Scenario[]; activeScenarioId: string;
  role: Role; unitSystem: UnitSystem; dark: boolean;
  audit: AuditEntry[];
  currentModule: string;
  formulaOverrides: Record<string, Record<string, number>>;
  setProject: (p: Partial<ProjectConfig>) => void;
  setLines: (l: LineConfig[]) => void;
  addLine: () => void;
  removeLine: (id: string) => void;
  updateLine: (id: string, patch: Partial<LineConfig>) => void;
  setModule: (m: string) => void;
  setRole: (r: Role) => void;
  setUnitSystem: (u: UnitSystem) => void;
  toggleDark: () => void;
  setFormulaOverride: (fid: string, inpId: string, val: number) => void;
  addAudit: (action: string, detail: string) => void;
}

const defaultLines: LineConfig[] = [
  { id: "L1", name: "L1 – Terminally Sterilised Vials", type: "Terminal sterilised", batchSize: 8000, fillSpeed: 300, vialSizeMl: 10, fillVolMl: 5, shifts: 2, oee: 68, workingDays: 300 },
  { id: "L2", name: "L2 – Aseptic Liquid Vials", type: "Aseptic fill", batchSize: 6000, fillSpeed: 220, vialSizeMl: 10, fillVolMl: 5, shifts: 2, oee: 62, workingDays: 300 },
  { id: "L3", name: "L3 – Lyophilised Vials (2 dryers)", type: "Lyo aseptic", batchSize: 8000, fillSpeed: 180, vialSizeMl: 20, fillVolMl: 10, shifts: 2, oee: 55, workingDays: 300 },
  { id: "L4", name: "L4 – High-potent / Cytotoxic (Isolator)", type: "High-potent isolator/RABS", batchSize: 3000, fillSpeed: 100, vialSizeMl: 10, fillVolMl: 3, shifts: 1, oee: 50, workingDays: 280 },
  { id: "L5", name: "L5 – PFS / Cartridges", type: "PFS/Cartridge", batchSize: 12000, fillSpeed: 250, vialSizeMl: 2.25, fillVolMl: 1, shifts: 2, oee: 65, workingDays: 300 },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      project: { name: "Hyderabad Sterile Injectables – Greenfield", location: "Hyderabad, Telangana", lat: 17.38, altitudeM: 542, dbSummer: 42, wbSummer: 26, rhSummer: 32, dbMonsoon: 33, rhMonsoon: 78, seismicZone: "II", windSpeedMs: 44, builtUpM2: 6500, cleanroomM2: 2100 },
      lines: defaultLines,
      scenarios: [
        { id: "base", name: "Base", factor: 1, note: "Current design" },
        { id: "peak", name: "Peak", factor: 1.25, note: "+25% demand" },
        { id: "future", name: "Future Expansion", factor: 1.6, note: "6th line provision" },
        { id: "worst", name: "Worst-case", factor: 1.4, note: "Summer + peak coincident" },
      ],
      activeScenarioId: "base",
      role: "Designer",
      unitSystem: "SI",
      dark: false,
      audit: [{ ts: new Date().toISOString(), user: "System", action: "Project created", detail: "Default Hyderabad greenfield" }],
      currentModule: "0",
      formulaOverrides: {},
      setProject: (p) => { set((s) => ({ project: { ...s.project, ...p } })); get().addAudit("Project updated", JSON.stringify(p)); },
      setLines: (l) => set({ lines: l }),
      addLine: () => set((s) => ({ lines: [...s.lines, { id: `L${s.lines.length + 1}`, name: `L${s.lines.length + 1} – New Line (editable)`, type: "User-defined", batchSize: 5000, fillSpeed: 150, vialSizeMl: 10, fillVolMl: 5, shifts: 2, oee: 60, workingDays: 300 }] })),
      removeLine: (id) => set((s) => ({ lines: s.lines.filter((x) => x.id !== id) })),
      updateLine: (id, patch) => set((s) => ({ lines: s.lines.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      setModule: (m) => set({ currentModule: m }),
      setRole: (r) => set({ role: r }),
      setUnitSystem: (u) => set({ unitSystem: u }),
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      setFormulaOverride: (fid, inpId, val) => set((s) => ({ formulaOverrides: { ...s.formulaOverrides, [fid]: { ...(s.formulaOverrides[fid] ?? {}), [inpId]: val } } })),
      addAudit: (action, detail) => set((s) => ({ audit: [...s.audit.slice(-199), { ts: new Date().toISOString(), user: s.role, action, detail }] })),
    }),
    { name: "ipds-v1", partialize: (s) => ({ project: s.project, lines: s.lines, formulaOverrides: s.formulaOverrides, dark: s.dark }) }
  )
);
