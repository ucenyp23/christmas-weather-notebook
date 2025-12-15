export function displayTemp(c, unit) {
  return unit === "F" ? Math.round((c * 9/5 + 32) * 10) / 10 : c;
}
