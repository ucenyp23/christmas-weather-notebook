export function toC(temp, unit) {
  return unit === "F" ? (temp - 32) * 5 / 9 : temp;
}

export function feelsLike(tempC, wind = 0, precip = 0) {
  let f = tempC;
  if (wind > 10) f -= (wind - 10) * 0.1;
  if (precip > 0) f -= 1;
  return Math.round(f * 10) / 10;
}
