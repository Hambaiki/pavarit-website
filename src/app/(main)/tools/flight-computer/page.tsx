"use client";

import { useMemo, useState } from "react";

import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { cn } from "@/lib/cn";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "E6B Flight Computer", href: "/tools/flight-computer" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "wind" | "tsd" | "fuel" | "convert";

// ─── Math helpers ─────────────────────────────────────────────────────────────

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function toDeg(r: number) {
  return (r * 180) / Math.PI;
}

function fmt(n: number, d = 1) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toFixed(d);
}

function fmtHMS(totalMinutes: number) {
  if (!isFinite(totalMinutes) || totalMinutes < 0) return "—";
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  const s = Math.round((totalMinutes * 60) % 60);
  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
}

/** Wind correction + ground speed using E6B vector math */
function calcWind(
  tas: number,
  course: number,
  windDir: number,
  windSpd: number
) {
  const wca = toDeg(
    Math.asin((windSpd / tas) * Math.sin(toRad(windDir - course)))
  );
  const hdg = course + wca;
  const gs =
    tas * Math.cos(toRad(wca)) - windSpd * Math.cos(toRad(windDir - course));
  return { wca, hdg: ((hdg % 360) + 360) % 360, gs };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] font-bold tracking-widest uppercase text-amber-600/70 mb-1">
      {children}
    </span>
  );
}

function Readout({
  value,
  unit,
  dim,
}: {
  value: string;
  unit?: string;
  dim?: boolean;
}) {
  return (
    <div
      className={cn(
        "font-mono text-2xl font-light tabular-nums transition-all duration-300",
        dim ? "text-gray-600" : "text-amber-300"
      )}
    >
      {value}
      {unit && <span className="text-sm text-amber-600/60 ml-1">{unit}</span>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value || ""}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={cn(
            "w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2",
            "font-mono text-amber-200 text-sm placeholder-gray-700",
            "focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20",
            "transition-colors duration-150"
          )}
        />
        {unit && (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
      <Label>{label}</Label>
      <Readout value={value} unit={unit} dim={value === "—"} />
    </div>
  );
}

// ─── Compass Rose ─────────────────────────────────────────────────────────────

function CompassRose({
  heading,
  course,
  wca,
}: {
  heading: number;
  course: number;
  wca: number;
}) {
  const cardinals = ["N", "E", "S", "W"];
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-52 h-52">
        {/* Outer ring */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          {/* Background */}
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="#0a0a0f"
            stroke="#1f2937"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="#111827"
            strokeWidth="1"
          />

          {/* Tick marks */}
          {ticks.map((deg) => {
            const r = toRad(deg - 90);
            const long = deg % 30 === 0;
            const x1 = Math.round(100 + 80 * Math.cos(r));
            const y1 = Math.round(100 + 80 * Math.sin(r));
            const x2 = Math.round(100 + (long ? 68 : 74) * Math.cos(r));
            const y2 = Math.round(100 + (long ? 68 : 74) * Math.sin(r));
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={long ? "#92400e" : "#374151"}
                strokeWidth={long ? 1.5 : 0.8}
              />
            );
          })}

          {/* Cardinal labels */}
          {cardinals.map((c, i) => {
            const r = toRad(i * 90 - 90);
            return (
              <text
                key={c}
                x={100 + 58 * Math.cos(r)}
                y={100 + 58 * Math.sin(r)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fontWeight="700"
                fontFamily="monospace"
                fill={c === "N" ? "#f59e0b" : "#6b7280"}
              >
                {c}
              </text>
            );
          })}

          {/* Course arrow (fixed, cyan) */}
          {(() => {
            const r = toRad(course - 90);
            return (
              <g>
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 62 * Math.cos(r)}
                  y2={100 + 62 * Math.sin(r)}
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.6"
                />
                <circle
                  cx={100 + 66 * Math.cos(r)}
                  cy={100 + 66 * Math.sin(r)}
                  r="3"
                  fill="#06b6d4"
                  opacity="0.7"
                />
              </g>
            );
          })()}

          {/* Heading arrow (amber, solid) */}
          {(() => {
            const r = toRad(heading - 90);
            const tx = 100 + 72 * Math.cos(r);
            const ty = 100 + 72 * Math.sin(r);
            const lx = 100 + 56 * Math.cos(r);
            const ly = 100 + 56 * Math.sin(r);
            // Arrowhead perpendicular points
            const pr = r + Math.PI / 2;
            return (
              <g>
                <line
                  x1="100"
                  y1="100"
                  x2={lx}
                  y2={ly}
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <polygon
                  points={`${tx},${ty} ${lx + 5 * Math.cos(pr)},${ly + 5 * Math.sin(pr)} ${lx - 5 * Math.cos(pr)},${ly - 5 * Math.sin(pr)}`}
                  fill="#f59e0b"
                />
              </g>
            );
          })()}

          {/* Center dot */}
          <circle
            cx="100"
            cy="100"
            r="4"
            fill="#1f2937"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />

          {/* Lubber line (top) */}
          <line
            x1="100"
            y1="2"
            x2="100"
            y2="14"
            stroke="#f59e0b"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-5 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px bg-cyan-500 border-dashed border-t border-cyan-500" />
          <span className="text-gray-500">Course {fmt(course, 0)}°</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-amber-400" />
          <span className="text-gray-500">Heading {fmt(heading, 0)}°</span>
        </div>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function WindTab() {
  const [tas, setTas] = useState(120);
  const [course, setCourse] = useState(270);
  const [windDir, setWDir] = useState(220);
  const [windSpd, setWSpd] = useState(20);

  const result = useMemo(() => {
    if (!tas || tas <= 0) return null;
    try {
      return calcWind(tas, course, windDir, windSpd);
    } catch {
      return null;
    }
  }, [tas, course, windDir, windSpd]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="True Airspeed"
          value={tas}
          onChange={setTas}
          unit="kt"
          min={1}
        />
        <Field
          label="Course (True)"
          value={course}
          onChange={setCourse}
          unit="°"
          min={0}
          max={359}
        />
        <Field
          label="Wind Direction (From)"
          value={windDir}
          onChange={setWDir}
          unit="°"
          min={0}
          max={359}
        />
        <Field
          label="Wind Speed"
          value={windSpd}
          onChange={setWSpd}
          unit="kt"
          min={0}
        />
      </div>

      {/* Compass */}
      <div className="flex justify-center py-2">
        <CompassRose
          heading={result?.hdg ?? course}
          course={course}
          wca={result?.wca ?? 0}
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3">
        <ResultCard
          label="True Heading"
          value={result ? fmt(result.hdg, 0) : "—"}
          unit="°"
        />
        <ResultCard
          label="Wind Correction"
          value={
            result ? `${result.wca >= 0 ? "+" : ""}${fmt(result.wca, 1)}` : "—"
          }
          unit="°"
        />
        <ResultCard
          label="Ground Speed"
          value={result ? fmt(result.gs, 0) : "—"}
          unit="kt"
        />
      </div>
    </div>
  );
}

function TSDTab() {
  const [speed, setSpeed] = useState(120);
  const [distance, setDist] = useState(0);
  const [time, setTime] = useState(0);
  const [solve, setSolve] = useState<"time" | "dist" | "speed">("time");

  const result = useMemo(() => {
    switch (solve) {
      case "time":
        if (speed > 0 && distance > 0)
          return {
            label: "Time",
            value: fmtHMS((distance / speed) * 60),
            raw: (distance / speed) * 60,
          };
        break;
      case "dist":
        if (speed > 0 && time > 0)
          return {
            label: "Distance",
            value: fmt(speed * (time / 60), 1) + " nm",
            raw: speed * (time / 60),
          };
        break;
      case "speed":
        if (distance > 0 && time > 0)
          return {
            label: "Ground Speed",
            value: fmt(distance / (time / 60), 1) + " kt",
            raw: distance / (time / 60),
          };
        break;
    }
    return null;
  }, [solve, speed, distance, time]);

  const solveOptions: { value: typeof solve; label: string }[] = [
    { value: "time", label: "Solve Time" },
    { value: "dist", label: "Solve Distance" },
    { value: "speed", label: "Solve Speed" },
  ];

  return (
    <div className="space-y-5">
      {/* Solve mode */}
      <div>
        <Label>Solve for</Label>
        <div className="flex gap-2">
          {solveOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => setSolve(o.value)}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150",
                solve === o.value
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-gray-900 text-gray-500 border border-gray-800 hover:border-gray-700"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {solve !== "speed" && (
          <Field
            label="Ground Speed"
            value={speed}
            onChange={setSpeed}
            unit="kt"
            min={1}
          />
        )}
        {solve !== "dist" && (
          <Field
            label="Distance"
            value={distance}
            onChange={setDist}
            unit="nm"
            min={0}
          />
        )}
        {solve !== "time" && (
          <Field
            label="Time"
            value={time}
            onChange={setTime}
            unit="min"
            min={0}
          />
        )}
      </div>

      {result && (
        <div className="bg-gray-900/60 border border-amber-500/20 rounded-xl p-5 text-center">
          <Label>{result.label}</Label>
          <div className="font-mono text-3xl text-amber-300 font-light mt-1">
            {result.value}
          </div>
        </div>
      )}

      {/* Rule of thumb helpers */}
      {solve === "time" && speed > 0 && distance > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {[0.25, 0.5, 0.75].map((frac) => (
            <div
              key={frac}
              className="bg-gray-900/40 border border-gray-800 rounded-lg p-3 text-center"
            >
              <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">
                {frac * 100}%
              </div>
              <div className="font-mono text-sm text-gray-400">
                {fmtHMS(((distance * frac) / speed) * 60)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FuelTab() {
  const [fuelOnBoard, setFob] = useState(40);
  const [burnRate, setBurn] = useState(8);
  const [reserve, setReserve] = useState(45);
  const [distance, setDist] = useState(200);
  const [gs, setGs] = useState(120);

  const results = useMemo(() => {
    const flightTime = gs > 0 ? (distance / gs) * 60 : 0; // minutes
    const fuelRequired = (burnRate / 60) * flightTime; // gal
    const reserveFuel = (burnRate / 60) * reserve; // gal
    const totalRequired = fuelRequired + reserveFuel;
    const extraFuel = fuelOnBoard - totalRequired;
    const endurance =
      fuelOnBoard > 0 && burnRate > 0 ? (fuelOnBoard / burnRate) * 60 : 0; // minutes
    const safeRange =
      gs > 0 && burnRate > 0
        ? ((fuelOnBoard - reserveFuel) / burnRate) * gs
        : 0;

    return {
      flightTime,
      fuelRequired,
      reserveFuel,
      totalRequired,
      extraFuel,
      endurance,
      safeRange,
    };
  }, [fuelOnBoard, burnRate, reserve, distance, gs]);

  const goNoGo = results.extraFuel >= 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Fuel on Board"
          value={fuelOnBoard}
          onChange={setFob}
          unit="gal"
          min={0}
          step={0.5}
        />
        <Field
          label="Fuel Burn Rate"
          value={burnRate}
          onChange={setBurn}
          unit="gal/hr"
          min={0}
          step={0.1}
        />
        <Field
          label="Ground Speed"
          value={gs}
          onChange={setGs}
          unit="kt"
          min={1}
        />
        <Field
          label="Distance"
          value={distance}
          onChange={setDist}
          unit="nm"
          min={0}
        />
        <Field
          label="Reserve Time"
          value={reserve}
          onChange={setReserve}
          unit="min"
          min={0}
        />
      </div>

      {/* Go / No-Go */}
      <div
        className={cn(
          "rounded-xl border p-4 text-center transition-all duration-300",
          goNoGo
            ? "bg-green-900/20 border-green-700/40"
            : "bg-red-900/20 border-red-700/40"
        )}
      >
        <div
          className={cn(
            "text-xs font-bold tracking-widest uppercase mb-1",
            goNoGo ? "text-green-500" : "text-red-500"
          )}
        >
          {goNoGo ? "▲ GO" : "▼ NO-GO"}
        </div>
        <div
          className={cn(
            "font-mono text-lg",
            goNoGo ? "text-green-300" : "text-red-300"
          )}
        >
          {goNoGo
            ? `+${fmt(results.extraFuel, 1)} gal margin`
            : `${fmt(Math.abs(results.extraFuel), 1)} gal short`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Flight Time" value={fmtHMS(results.flightTime)} />
        <ResultCard
          label="Fuel Required"
          value={fmt(results.fuelRequired, 1)}
          unit="gal"
        />
        <ResultCard
          label="Reserve Fuel"
          value={fmt(results.reserveFuel, 1)}
          unit="gal"
        />
        <ResultCard label="Endurance" value={fmtHMS(results.endurance)} />
        <ResultCard
          label="Safe Range"
          value={fmt(results.safeRange, 0)}
          unit="nm"
        />
        <ResultCard
          label="Total Required"
          value={fmt(results.totalRequired, 1)}
          unit="gal"
        />
      </div>
    </div>
  );
}

type ConvertGroup = {
  label: string;
  units: string[];
  toBase: Record<string, number>;
};

const CONVERT_GROUPS: ConvertGroup[] = [
  {
    label: "Speed",
    units: ["kt", "mph", "km/h", "m/s", "ft/min"],
    toBase: {
      kt: 1,
      mph: 0.868976,
      "km/h": 0.539957,
      "m/s": 1.94384,
      "ft/min": 0.00987473,
    },
  },
  {
    label: "Distance",
    units: ["nm", "mi", "km", "ft", "m"],
    toBase: {
      nm: 1,
      mi: 0.868976,
      km: 0.539957,
      ft: 0.000164579,
      m: 0.000539957,
    },
  },
  {
    label: "Altitude / Pressure",
    units: ["ft", "m", "inHg", "hPa", "mb"],
    toBase: { ft: 1, m: 3.28084, inHg: 1145.04, hPa: 33.8639, mb: 33.8639 },
  },
  {
    label: "Temperature",
    units: ["°C", "°F", "K"],
    toBase: { "°C": 1, "°F": 1, K: 1 }, // handled specially
  },
];

function convertTemp(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "°C") celsius = value;
  else if (from === "°F") celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function ConvertTab() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [fromUnit, setFrom] = useState("kt");
  const [toUnit, setTo] = useState("km/h");
  const [input, setInput] = useState(100);

  const group = CONVERT_GROUPS[groupIdx];

  const result = useMemo(() => {
    if (group.label === "Temperature") {
      return convertTemp(input, fromUnit, toUnit);
    }
    const base = input / group.toBase[fromUnit];
    return base * group.toBase[toUnit];
  }, [input, fromUnit, toUnit, group]);

  const handleGroupChange = (i: number) => {
    setGroupIdx(i);
    setFrom(CONVERT_GROUPS[i].units[0]);
    setTo(CONVERT_GROUPS[i].units[1]);
  };

  return (
    <div className="space-y-5">
      {/* Group selector */}
      <div>
        <Label>Category</Label>
        <div className="flex gap-2 flex-wrap">
          {CONVERT_GROUPS.map((g, i) => (
            <button
              key={g.label}
              onClick={() => handleGroupChange(i)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150",
                groupIdx === i
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-gray-900 text-gray-500 border border-gray-800 hover:border-gray-700"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 items-end gap-3">
        <div>
          <Label>From</Label>
          <select
            value={fromUnit}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-amber-200 text-sm focus:outline-none focus:border-amber-500/60"
          >
            {group.units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>To</Label>
          <select
            value={toUnit}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-amber-200 text-sm focus:outline-none focus:border-amber-500/60"
          >
            {group.units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Value</Label>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-amber-200 text-sm focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      <div className="bg-gray-900/60 border border-amber-500/20 rounded-xl p-6 text-center">
        <div className="font-mono text-gray-500 text-sm mb-2">
          {fmt(input, 2)} {fromUnit} =
        </div>
        <div className="font-mono text-4xl font-light text-amber-300">
          {fmt(result, 4)}
        </div>
        <div className="text-amber-600/60 text-sm mt-1">{toUnit}</div>
      </div>

      {/* Quick reference table */}
      <div>
        <Label>Quick reference — all {group.label.toLowerCase()} units</Label>
        <div className="space-y-1">
          {group.units.map((u) => {
            let val: number;
            if (group.label === "Temperature") {
              val = convertTemp(input, fromUnit, u);
            } else {
              val = (input / group.toBase[fromUnit]) * group.toBase[u];
            }
            return (
              <div
                key={u}
                className={cn(
                  "flex justify-between items-center px-3 py-2 rounded-lg text-sm font-mono",
                  u === toUnit
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "bg-gray-900/40"
                )}
              >
                <span className="text-gray-500">{u}</span>
                <span
                  className={u === toUnit ? "text-amber-300" : "text-gray-400"}
                >
                  {fmt(val, 4)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; desc: string }[] = [
  { id: "wind", label: "Wind", desc: "Correction & heading" },
  { id: "tsd", label: "T·S·D", desc: "Time, speed, distance" },
  { id: "fuel", label: "Fuel", desc: "Endurance & go/no-go" },
  { id: "convert", label: "Convert", desc: "Aviation unit converter" },
];

export default function FlightComputerPage() {
  const [tab, setTab] = useState<Tab>("wind");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <>
      <Header
        title="E6B Flight Computer"
        description="A powerful flight planning tool for pilots."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <div className="flex flex-col items-center justify-center p-4 bg-white/50 rounded-3xl border border-gray-200">
          {/* Header */}
          <div className="w-full max-w-lg mb-6">
            <div className="flex items-center gap-3 mb-1">
              {/* Stylised instrument icon */}
              <div className="w-8 h-8 rounded-full border-2 border-amber-500/40 flex items-center justify-center">
                <div
                  className="w-1 h-4 bg-amber-400 rounded-full"
                  style={{ transform: "rotate(-30deg)" }}
                />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-amber-400">
                  E6B Flight Computer
                </h1>
                <p className="text-[11px] text-gray-600 tracking-wider">
                  Pilot planning toolkit
                </p>
              </div>
            </div>
          </div>

          {/* Main card */}
          <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
            {/* Tab bar */}
            <div className="grid grid-cols-4 border-b border-gray-800">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "py-3 px-2 text-center transition-all duration-150",
                    tab === t.id
                      ? "bg-gray-800 border-b-2 border-amber-500"
                      : "hover:bg-gray-800/50 border-b-2 border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "text-xs font-bold tracking-widest uppercase",
                      tab === t.id ? "text-amber-400" : "text-gray-600"
                    )}
                  >
                    {t.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Tab description */}
            <div className="px-5 py-3 bg-gray-900/60 border-b border-gray-800/50">
              <p className="text-[11px] text-gray-500 tracking-wide">
                {active.desc}
              </p>
            </div>

            {/* Tab content */}
            <div className="p-5">
              {tab === "wind" && <WindTab />}
              {tab === "tsd" && <TSDTab />}
              {tab === "fuel" && <FuelTab />}
              {tab === "convert" && <ConvertTab />}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-gray-700 mt-5 text-center max-w-sm">
            For flight planning reference only. Always verify with certified
            instruments and official charts before flight.
          </p>
        </div>
      </Section>
    </>
  );
}
