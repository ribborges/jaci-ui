import * as QRCodeEncoder from "qrcode";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { qrCode } from "../../styled-system/recipes";

export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeProps
  extends Omit<ComponentPropsWithoutRef<"svg">, "children" | "download"> {
  value: string;
  size?: number;
  margin?: number;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  foreground?: string;
  background?: string;
  label?: string;
  fallback?: ReactNode;
  /** Enables a native SVG download link inside the rendered code. */
  download?: boolean | string;
  downloadLabel?: string;
}

function isFinderCell(row: number, column: number, size: number) {
  return (
    (row < 7 && column < 7) || (row < 7 && column >= size - 7) || (row >= size - 7 && column < 7)
  );
}

function Finder({
  x,
  y,
  color,
  background,
}: {
  x: number;
  y: number;
  color: string;
  background: string;
}) {
  return (
    <g data-slot="qr-code-eye">
      <rect data-slot="qr-code-eye-frame" fill={color} height="7" rx="1" width="7" x={x} y={y} />
      <rect
        data-slot="qr-code-eye-cutout"
        fill={background}
        height="5"
        rx="0.75"
        width="5"
        x={x + 1}
        y={y + 1}
      />
      <rect
        data-slot="qr-code-eyeball"
        fill={color}
        height="3"
        rx="0.5"
        width="3"
        x={x + 2}
        y={y + 2}
      />
    </g>
  );
}

function escapeXml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function createDownloadSvg({
  background,
  dots,
  foreground,
  finderBackground,
  label,
  margin,
  moduleCount,
}: {
  background: string;
  dots: readonly [number, number][];
  foreground: string;
  finderBackground: string;
  label: string;
  margin: number;
  moduleCount: number;
}) {
  const viewBoxSize = moduleCount + margin * 2;
  const backgroundMarkup =
    background === "transparent"
      ? ""
      : `<rect fill="${escapeXml(background)}" height="${viewBoxSize}" width="${viewBoxSize}" x="0" y="0"/>`;
  const dotsMarkup = dots
    .map(
      ([row, column]) =>
        `<circle cx="${margin + column + 0.5}" cy="${margin + row + 0.5}" fill="${escapeXml(foreground)}" r="0.43"/>`,
    )
    .join("");
  const finderMarkup = (x: number, y: number) =>
    `<g><rect fill="${escapeXml(foreground)}" height="7" rx="1" width="7" x="${x}" y="${y}"/><rect fill="${escapeXml(finderBackground)}" height="5" rx="0.75" width="5" x="${x + 1}" y="${y + 1}"/><rect fill="${escapeXml(foreground)}" height="3" rx="0.5" width="3" x="${x + 2}" y="${y + 2}"/></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" aria-label="${escapeXml(label)}" role="img" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">${backgroundMarkup}${dotsMarkup}${finderMarkup(margin, margin)}${finderMarkup(margin + moduleCount - 7, margin)}${finderMarkup(margin, margin + moduleCount - 7)}</svg>`;
}

export const QRCode = forwardRef<SVGSVGElement, QRCodeProps>(function QRCode(
  {
    // A QR code needs a deterministic high-contrast base. Inheriting
    // `currentColor` or a transparent surface can make finder layers merge
    // in dark scopes, so the defaults intentionally remain black on white.
    background = "#ffffff",
    className,
    download = false,
    downloadLabel = "Download QR code",
    errorCorrectionLevel = "Q",
    fallback,
    foreground = "#18181b",
    label = "QR code",
    margin = 2,
    size = 192,
    style,
    value,
    ...props
  },
  ref,
) {
  const safeSize = Number.isFinite(size) && size > 0 ? size : 192;
  const safeMargin = Number.isFinite(margin) && margin >= 0 ? Math.floor(margin) : 2;
  const finderBackground =
    background === "transparent" ? "var(--jaci-colors-surface-raised)" : background;

  try {
    const code = QRCodeEncoder.create(value, { errorCorrectionLevel });
    const moduleCount = code.modules.size;
    const viewBoxSize = moduleCount + safeMargin * 2;
    const modules: ReactNode[] = [];
    const dotCoordinates: [number, number][] = [];

    for (let row = 0; row < moduleCount; row += 1) {
      for (let column = 0; column < moduleCount; column += 1) {
        if (code.modules.get(row, column) && !isFinderCell(row, column, moduleCount)) {
          dotCoordinates.push([row, column]);
          modules.push(
            <circle
              cx={safeMargin + column + 0.5}
              cy={safeMargin + row + 0.5}
              data-slot="qr-code-dot"
              fill={foreground}
              key={`${row}-${column}`}
              r="0.43"
            />,
          );
        }
      }
    }

    const downloadHref =
      download &&
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        createDownloadSvg({
          background,
          dots: dotCoordinates,
          foreground,
          finderBackground: background === "transparent" ? "#ffffff" : background,
          label,
          margin: safeMargin,
          moduleCount,
        }),
      )}`;
    const downloadFilename = typeof download === "string" ? download : "qrcode.svg";
    const visualCode = (
      <>
        {background !== "transparent" ? (
          <rect fill={background} height={viewBoxSize} width={viewBoxSize} x="0" y="0" />
        ) : null}
        {modules}
        <Finder background={finderBackground} color={foreground} x={safeMargin} y={safeMargin} />
        <Finder
          background={finderBackground}
          color={foreground}
          x={safeMargin + moduleCount - 7}
          y={safeMargin}
        />
        <Finder
          background={finderBackground}
          color={foreground}
          x={safeMargin}
          y={safeMargin + moduleCount - 7}
        />
      </>
    );

    return (
      <svg
        {...props}
        ref={ref}
        aria-label={label}
        className={cx(qrCode(), className)}
        data-dot-shape="circle"
        data-download={download ? "true" : undefined}
        data-eye-shape="rounded-square"
        data-jaci-component="qr-code"
        data-slot="qr-code"
        height={safeSize}
        role="img"
        style={style}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        width={safeSize}
      >
        <title>{label}</title>
        {downloadHref ? (
          <a aria-label={downloadLabel} download={downloadFilename} href={downloadHref}>
            {visualCode}
          </a>
        ) : (
          visualCode
        )}
      </svg>
    );
  } catch {
    return (
      <span
        aria-label={label}
        className={cx(qrCode(), className)}
        data-jaci-component="qr-code"
        data-slot="qr-code"
        data-status="error"
        role="img"
      >
        {fallback ?? "Unable to generate QR code"}
      </span>
    );
  }
});
