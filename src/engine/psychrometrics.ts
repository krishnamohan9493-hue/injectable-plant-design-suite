// Psychrometrics for ISHRAE / ASHRAE – Hyderabad design conditions
// Uses SI units: T in °C, P in kPa, W in kg/kg, h in kJ/kg
const P_ATM_HYD = 95.3; // kPa at 542m altitude (approx – editable)
// Magnus formula for Psat (kPa)
export function psat(T: number): number {
  return 0.61078 * Math.exp((17.27 * T) / (T + 237.3));
}
export function humidityRatio(Tdb: number, RH: number, P = P_ATM_HYD): number {
  const ps = psat(Tdb);
  const pv = (RH / 100) * ps;
  return 0.622 * pv / (P - pv);
}
export function enthalpy(Tdb: number, W: number): number {
  return 1.006 * Tdb + W * (2501 + 1.86 * Tdb);
}
export function dewPoint(RH: number, Tdb: number): number {
  const ps = psat(Tdb);
  const pv = (RH / 100) * ps;
  const ln = Math.log(pv / 0.61078);
  return (237.3 * ln) / (17.27 - ln);
}
export function wetBulbApprox(Tdb: number, RH: number): number {
  const T = Tdb * Math.atan(0.151977 * Math.sqrt(RH + 8.313659));
  const t2 = Math.atan(Tdb + RH) - Math.atan(RH - 1.676331);
  const t3 = 0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH);
  return T + t2 - t3 + 0.00391838 * 1 * 1 - 4.686035;
}
export function airDensity(Tdb: number, W: number, P = P_ATM_HYD): number {
  const Tk = Tdb + 273.15;
  return (P * 1000) / (287.058 * Tk * (1 + 1.6078 * W));
}
export function coolingLoadSensible(mDot: number, cpdT: number): number {
  return mDot * cpdT; // kW if mDot in kg/s and cpdT in kJ/kg => kW
}
// Generate psych chart curve (saturation line)
export function saturationCurve(): { T: number; W: number; h: number }[] {
  const pts = [];
  for (let T = 0; T <= 50; T += 1) {
    const W = humidityRatio(T, 100);
    pts.push({ T, W, h: enthalpy(T, W) });
  }
  return pts;
}
export function processLinePoints(T1: number, RH1: number, T2: number, RH2: number) {
  return [
    { T: T1, W: humidityRatio(T1, RH1), label: "Outside" },
    { T: T2, W: humidityRatio(T2, RH2), label: "Supply" },
    { T: 22, W: humidityRatio(22, 55), label: "Room" },
  ];
}
