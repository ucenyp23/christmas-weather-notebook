import dayjs from "dayjs";
export const toCelsius = (value, unit) => {
  if (unit === "C") return Number(value);
  return (Number(value) - 32) * 5 / 9;
};
export const toFahrenheit = (c) => (c * 9 / 5) + 32;
export const isoNow = () => dayjs().toISOString();
