"use client";

import { useCallback, useState } from "react";

import Header from "@/components/content/Header";
import Section from "@/components/content/Section";
import { cn } from "@/lib/cn";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Scientific Calculator", href: "/tools/scientific-calculator" },
];

type AngleMode = "DEG" | "RAD";

function toRad(x: number, mode: AngleMode) {
  return mode === "DEG" ? (x * Math.PI) / 180 : x;
}

function formatResult(n: number): string {
  if (!isFinite(n)) return "Error";
  if (isNaN(n)) return "Error";
  // Avoid insane floating-point tails
  const s = parseFloat(n.toPrecision(12)).toString();
  return s.length > 16 ? n.toExponential(6) : s;
}

type ButtonVariant =
  | "default"
  | "operator"
  | "fn"
  | "equals"
  | "clear"
  | "mode";

interface CalcButton {
  label: string;
  value: string;
  variant: ButtonVariant;
  wide?: boolean;
}

const BUTTONS: CalcButton[] = [
  // Row 1: mode / memory / misc
  { label: "DEG/RAD", value: "MODE", variant: "mode" },
  { label: "(", value: "(", variant: "fn" },
  { label: ")", value: ")", variant: "fn" },
  { label: "AC", value: "AC", variant: "clear" },
  { label: "⌫", value: "DEL", variant: "clear" },

  // Row 2: trig
  { label: "sin", value: "sin", variant: "fn" },
  { label: "cos", value: "cos", variant: "fn" },
  { label: "tan", value: "tan", variant: "fn" },
  { label: "π", value: "π", variant: "fn" },
  { label: "e", value: "e", variant: "fn" },

  // Row 3: inverse trig / power
  { label: "sin⁻¹", value: "asin", variant: "fn" },
  { label: "cos⁻¹", value: "acos", variant: "fn" },
  { label: "tan⁻¹", value: "atan", variant: "fn" },
  { label: "xʸ", value: "^", variant: "fn" },
  { label: "√", value: "sqrt(", variant: "fn" },

  // Row 4: log / exp
  { label: "log", value: "log(", variant: "fn" },
  { label: "ln", value: "ln(", variant: "fn" },
  { label: "x²", value: "^2", variant: "fn" },
  { label: "1/x", value: "1/(", variant: "fn" },
  { label: "n!", value: "!", variant: "fn" },

  // Row 5: digits + ops
  { label: "7", value: "7", variant: "default" },
  { label: "8", value: "8", variant: "default" },
  { label: "9", value: "9", variant: "default" },
  { label: "÷", value: "/", variant: "operator" },
  { label: "%", value: "%", variant: "operator" },

  // Row 6
  { label: "4", value: "4", variant: "default" },
  { label: "5", value: "5", variant: "default" },
  { label: "6", value: "6", variant: "default" },
  { label: "×", value: "*", variant: "operator" },
  { label: "±", value: "NEG", variant: "operator" },

  // Row 7
  { label: "1", value: "1", variant: "default" },
  { label: "2", value: "2", variant: "default" },
  { label: "3", value: "3", variant: "default" },
  { label: "−", value: "-", variant: "operator" },
  { label: "=", value: "=", variant: "equals" },

  // Row 8
  { label: "0", value: "0", variant: "default", wide: true },
  { label: ".", value: ".", variant: "default" },
  { label: "+", value: "+", variant: "operator" },
];

function evaluate(expr: string, mode: AngleMode): string {
  try {
    // Replace constants
    let e = expr
      .replace(/π/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E));

    // Replace trig functions (angle-aware)
    e = e.replace(/asin\(/g, `__asin(`);
    e = e.replace(/acos\(/g, `__acos(`);
    e = e.replace(/atan\(/g, `__atan(`);
    e = e.replace(/sin\(/g, `__sin(`);
    e = e.replace(/cos\(/g, `__cos(`);
    e = e.replace(/tan\(/g, `__tan(`);
    e = e.replace(/sqrt\(/g, `Math.sqrt(`);
    e = e.replace(/log\(/g, `Math.log10(`);
    e = e.replace(/ln\(/g, `Math.log(`);

    // Power
    e = e.replace(
      /(\d+\.?\d*|\))\^(\d+\.?\d*|\()/g,
      (_, a, b) => `Math.pow(${a},${b})`
    );

    // Factorial
    e = e.replace(/(\d+)!/g, (_, n) => String(factorial(parseInt(n))));

    // Percentage: treat trailing % as /100
    e = e.replace(/(\d+\.?\d*)%/g, (_, n) => `(${n}/100)`);

    // Inject trig with angle awareness
    const sin = (x: number) => Math.sin(toRad(x, mode));
    const cos = (x: number) => Math.cos(toRad(x, mode));
    const tan = (x: number) => Math.tan(toRad(x, mode));
    const asin = (x: number) =>
      mode === "DEG" ? (Math.asin(x) * 180) / Math.PI : Math.asin(x);
    const acos = (x: number) =>
      mode === "DEG" ? (Math.acos(x) * 180) / Math.PI : Math.acos(x);
    const atan = (x: number) =>
      mode === "DEG" ? (Math.atan(x) * 180) / Math.PI : Math.atan(x);

    // eslint-disable-next-line no-new-func
    const fn = new Function(
      "__sin",
      "__cos",
      "__tan",
      "__asin",
      "__acos",
      "__atan",
      `"use strict"; return (${e});`
    );
    const result = fn(sin, cos, tan, asin, acos, atan);
    return formatResult(result);
  } catch {
    return "Error";
  }
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export default function CalculatorPage() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>(
    []
  );

  const handleButton = useCallback(
    (value: string) => {
      switch (value) {
        case "AC":
          setExpression("");
          setResult("");
          break;

        case "DEL":
          setExpression((prev) => prev.slice(0, -1));
          break;

        case "MODE":
          setAngleMode((prev) => (prev === "DEG" ? "RAD" : "DEG"));
          break;

        case "NEG":
          setExpression((prev) => {
            if (!prev) return "-";
            // Wrap last number in negation
            return prev.replace(/([\d.]+)$/, (m) => `(-${m})`);
          });
          break;

        case "=": {
          const res = evaluate(expression, angleMode);
          setResult(res);
          if (res !== "Error") {
            setHistory((h) =>
              [{ expr: expression, result: res }, ...h].slice(0, 20)
            );
          }
          break;
        }

        case "sin":
        case "cos":
        case "tan":
        case "asin":
        case "acos":
        case "atan":
          setExpression((prev) => prev + value + "(");
          break;

        default:
          setExpression((prev) => {
            // If previous result and user types a digit/fn, start fresh
            if (result && /^[\d.(πe]/.test(value)) {
              setResult("");
              return value;
            }
            setResult("");
            return prev + value;
          });
      }
    },
    [expression, result, angleMode]
  );

  // Keyboard support
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      const map: Record<string, string> = {
        Enter: "=",
        Backspace: "DEL",
        Escape: "AC",
      };
      const k = map[e.key] ?? e.key;
      const allowed =
        /^[\d+\-*/().^%]$/.test(k) || ["=", "DEL", "AC"].includes(k);
      if (allowed) {
        e.preventDefault();
        handleButton(k);
      }
    },
    [handleButton]
  );

  const displayValue = result || expression || "0";

  return (
    <>
      <Header
        title="Scientific Calculator"
        description="A powerful scientific calculator for complex mathematical operations."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <div
          className="flex items-center justify-center p-4 focus:outline-none bg-white/50 rounded-3xl border border-gray-200"
          onKeyDown={handleKey}
          tabIndex={-1}
        >
          <div className="w-full max-w-sm">
            {/* History */}
            {history.length > 0 && (
              <div className="mb-3 max-h-28 overflow-y-auto space-y-1 px-1">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setExpression(h.result);
                      setResult("");
                    }}
                    className="w-full text-right text-xs text-gray-400 hover:text-gray-600 transition-colors truncate"
                  >
                    <span className="text-gray-300 mr-2">{h.expr} =</span>
                    {h.result}
                  </button>
                ))}
              </div>
            )}

            {/* Calculator body */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 overflow-hidden border border-gray-100">
              {/* Display */}
              <div className="bg-gray-950 px-6 pt-6 pb-5 relative">
                {/* Angle mode badge */}
                <span className="absolute top-4 left-5 text-[10px] font-semibold tracking-widest text-primary-400 uppercase">
                  {angleMode}
                </span>

                {/* Expression */}
                <div className="mt-2 min-h-6 text-right text-sm text-gray-500 font-mono truncate">
                  {expression || ""}
                </div>

                {/* Result */}
                <div
                  className={cn(
                    "text-right font-mono font-light tracking-tight mt-1 transition-all duration-150",
                    displayValue.length > 12 ? "text-2xl" : "text-4xl",
                    result ? "text-white" : "text-gray-200"
                  )}
                >
                  {displayValue}
                </div>
              </div>

              {/* Buttons grid */}
              <div className="grid grid-cols-5 gap-px bg-gray-100 border-t border-gray-100">
                {BUTTONS.map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => handleButton(btn.value)}
                    className={cn(
                      "relative flex items-center justify-center text-sm font-medium h-14 select-none",
                      "transition-all duration-75 active:scale-95",
                      btn.wide && "col-span-2",
                      btn.variant === "default" &&
                        "bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100",
                      btn.variant === "operator" &&
                        "bg-white text-primary-600 hover:bg-primary-50 active:bg-primary-100",
                      btn.variant === "fn" &&
                        "bg-gray-50 text-gray-600 text-xs hover:bg-gray-100 active:bg-gray-200",
                      btn.variant === "equals" &&
                        "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 row-span-2 h-full",
                      btn.variant === "clear" &&
                        "bg-gray-50 text-red-500 hover:bg-red-50 active:bg-red-100",
                      btn.variant === "mode" &&
                        "bg-gray-50 text-primary-500 text-[10px] font-bold tracking-wider hover:bg-primary-50 active:bg-primary-100 uppercase"
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-gray-300 mt-4">
              Keyboard input supported
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
