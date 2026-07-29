import * as QRCodeEncoder from "qrcode";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { qrCode } from "../../styled-system/recipes";

export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeProps extends Omit<ComponentPropsWithoutRef<"svg">, "children"> {
  value: string;
  size?: number;
  margin?: number;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  foreground?: string;
  background?: string;
  label?: string;
  fallback?: ReactNode;
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
      <rect fill={color} height="7" rx="1" width="7" x={x} y={y} />
      <rect fill={background} height="5" rx="0.75" width="5" x={x + 1} y={y + 1} />
      <rect fill={color} height="3" rx="0.5" width="3" x={x + 2} y={y + 2} />
    </g>
  );
}

export const QRCode = forwardRef<SVGSVGElement, QRCodeProps>(function QRCode(
  {
    background = "transparent",
    className,
    errorCorrectionLevel = "Q",
    fallback,
    foreground = "currentColor",
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
  // Finder patterns need a contrasting quiet area between the frame and the
  // eyeball. Keep the overall SVG transparent by default, but use a white
  // cutout when no background was supplied so the code remains scannable.
  const finderBackground = background === "transparent" ? "white" : background;

  try {
    const code = QRCodeEncoder.create(value, { errorCorrectionLevel });
    const moduleCount = code.modules.size;
    const viewBoxSize = moduleCount + safeMargin * 2;
    const modules: ReactNode[] = [];

    for (let row = 0; row < moduleCount; row += 1) {
      for (let column = 0; column < moduleCount; column += 1) {
        if (code.modules.get(row, column) && !isFinderCell(row, column, moduleCount)) {
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

    return (
      <svg
        {...props}
        ref={ref}
        aria-label={label}
        className={cx(qrCode(), className)}
        data-dot-shape="circle"
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
