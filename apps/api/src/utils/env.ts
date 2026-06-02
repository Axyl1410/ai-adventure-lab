import process from "node:process";
export function env(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}

export function envNumber(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}
