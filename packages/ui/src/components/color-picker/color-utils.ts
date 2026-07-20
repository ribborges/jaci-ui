export type ColorFormat = "hex" | "rgb" | "hsl";

export interface ColorModel {
  alpha: number;
  hue: number;
  lightness: number;
  saturation: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function parseNumber(value: string, min: number, max: number) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? clamp(parsed, min, max) : null;
}

function parseAlpha(value: string | undefined) {
  if (value === undefined) return 1;
  if (value.trim().endsWith("%")) {
    return parseNumber(value, 0, 100) === null
      ? null
      : (parseNumber(value, 0, 100) as number) / 100;
  }
  return parseNumber(value, 0, 1);
}

function parseHex(value: string): ColorModel | null {
  const hex = value.slice(1);
  if (![3, 4, 6, 8].includes(hex.length) || !/^[\da-f]+$/i.test(hex)) return null;
  const expanded =
    hex.length <= 4
      ? hex
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : hex;
  const red = Number.parseInt(expanded.slice(0, 2), 16) / 255;
  const green = Number.parseInt(expanded.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(expanded.slice(4, 6), 16) / 255;
  const alpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;
  return rgbToHsl(red * 255, green * 255, blue * 255, alpha);
}

function parseRgb(value: string): ColorModel | null {
  const match = value.match(
    /^rgba?\(\s*([^,\s]+)[,\s]+([^,\s]+)[,\s]+([^,\s]+)(?:\s*[,/]\s*([^\s]+))?\s*\)$/i,
  );
  if (!match) return null;

  const redValue = match[1];
  const greenValue = match[2];
  const blueValue = match[3];
  if (!redValue || !greenValue || !blueValue) return null;
  const channels = [redValue, greenValue, blueValue].map((channel) => {
    if (channel.endsWith("%")) {
      const percentage = parseNumber(channel, 0, 100);
      return percentage === null ? null : (percentage / 100) * 255;
    }
    return parseNumber(channel, 0, 255);
  });
  const alpha = parseAlpha(match[4]);
  if (channels.some((channel) => channel === null) || alpha === null) return null;
  return rgbToHsl(channels[0] as number, channels[1] as number, channels[2] as number, alpha);
}

function parseHsl(value: string): ColorModel | null {
  const match = value.match(
    /^hsla?\(\s*([^,\s]+)(?:deg)?[,\s]+([^,\s]+)[,\s]+([^,\s]+)(?:\s*[,/]\s*([^\s]+))?\s*\)$/i,
  );
  if (!match) return null;
  const hueValue = match[1];
  const saturationValue = match[2];
  const lightnessValue = match[3];
  if (!hueValue || !saturationValue || !lightnessValue) return null;
  const hue = parseNumber(hueValue.replace(/deg$/i, ""), -360, 360);
  const saturation = parseNumber(saturationValue, 0, 100);
  const lightness = parseNumber(lightnessValue, 0, 100);
  const alpha = parseAlpha(match[4]);
  if (hue === null || saturation === null || lightness === null || alpha === null) return null;
  if (!saturationValue.endsWith("%") || !lightnessValue.endsWith("%")) return null;
  return { alpha, hue: (hue + 360) % 360, lightness, saturation };
}

function rgbToHsl(red: number, green: number, blue: number, alpha = 1): ColorModel {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }

  return {
    alpha: clamp(alpha, 0, 1),
    hue: (hue + 360) % 360,
    lightness: lightness * 100,
    saturation: saturation * 100,
  };
}

function hslToRgb({ hue, lightness, saturation }: ColorModel) {
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const segment = h * 6;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const [r, g, b] =
    segment < 1
      ? [chroma, x, 0]
      : segment < 2
        ? [x, chroma, 0]
        : segment < 3
          ? [0, chroma, x]
          : segment < 4
            ? [0, x, chroma]
            : segment < 5
              ? [x, 0, chroma]
              : [chroma, 0, x];
  const match = l - chroma / 2;
  return {
    blue: Math.round((b + match) * 255),
    green: Math.round((g + match) * 255),
    red: Math.round((r + match) * 255),
  };
}

export function parseColor(value: string | undefined): ColorModel | null {
  if (!value) return null;
  const normalized = value.trim();
  if (normalized.startsWith("#")) return parseHex(normalized);
  if (/^rgba?/i.test(normalized)) return parseRgb(normalized);
  if (/^hsla?/i.test(normalized)) return parseHsl(normalized);
  return null;
}

function formatAlpha(alpha: number) {
  return Number(alpha.toFixed(3)).toString();
}

export function formatColor(color: ColorModel, format: ColorFormat, showAlpha = false) {
  const rgb = hslToRgb(color);
  if (format === "hex") {
    const base = [rgb.red, rgb.green, rgb.blue]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("");
    return `#${base}${
      showAlpha
        ? Math.round(color.alpha * 255)
            .toString(16)
            .padStart(2, "0")
        : ""
    }`;
  }
  if (format === "rgb") {
    return showAlpha
      ? `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${formatAlpha(color.alpha)})`
      : `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
  }
  return showAlpha
    ? `hsla(${Math.round(color.hue)}, ${Math.round(color.saturation)}%, ${Math.round(color.lightness)}%, ${formatAlpha(color.alpha)})`
    : `hsl(${Math.round(color.hue)}, ${Math.round(color.saturation)}%, ${Math.round(color.lightness)}%)`;
}

export function defaultColor(value?: string) {
  return parseColor(value) ?? { alpha: 1, hue: 0, lightness: 0, saturation: 0 };
}
