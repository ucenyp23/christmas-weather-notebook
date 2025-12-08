export function computeFeelsLike(tempC, windKph=0, precipMm=0) {
  let feels = tempC;
  if (tempC <= 10 && windKph >= 4.8) {
    const v = windKph;
    feels = 13.12 + 0.6215*tempC - 11.37*Math.pow(v,0.16) + 0.3965*tempC*Math.pow(v,0.16);
  } else if (tempC >= 27) {
    const T = (tempC * 9/5) + 32;
    const R = 40;
    const HI = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R - 6.83783e-3*T*T - 5.481717e-2*R*R + 1.22874e-3*T*T*R + 8.5282e-4*T*R*R - 1.99e-6*T*T*R*R;
    feels = (HI - 32) * 5/9;
  }
  if (precipMm > 0) feels -= 0.5;
  return Number(feels.toFixed(1));
}

export function clothingAdvice(tempC) {
  if (tempC <= 0) return "Heavy coat, hat, gloves";
  if (tempC <= 10) return "Coat and layers";
  if (tempC <= 18) return "Light jacket or sweater";
  if (tempC <= 25) return "Long sleeve or short sleeve";
  return "Light clothing, stay hydrated";
}

export function walkDurationAdvice(tempC, feelsC) {
  const comfortable = (feelsC >= 5 && feelsC <= 25);
  if (comfortable) return "Up to 120 minutes";
  if (feelsC < 5) return "Keep walks short, 20–40 minutes";
  return "Shorter walks, 20–45 minutes; avoid midday heat";
}
