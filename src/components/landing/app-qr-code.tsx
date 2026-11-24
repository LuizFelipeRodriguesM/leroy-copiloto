"use client";

import { useId, useMemo } from "react";
import QRCode from "qrcode";
import { useClientValue } from "@/lib/use-client-value";

const APP_PATH = "/app";
const FALLBACK_ORIGIN = "https://leroy-copiloto.vercel.app";
const FINDER_SIZE = 7;
const LOGO_RATIO = 0.27;
const DOT_RADIUS = 0.43;

type Module = { row: number; col: number };

const buildCode = (value: string) => {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "H" });
  const size = modules.size;
  const logoSide = Math.round(size * LOGO_RATIO) | 1;
  const logoStart = (size - logoSide) / 2;
  const finders = [
    { row: 0, col: 0 },
    { row: 0, col: size - FINDER_SIZE },
    { row: size - FINDER_SIZE, col: 0 },
  ];
  const inFinder = (row: number, col: number) =>
    finders.some((finder) => row >= finder.row && row < finder.row + FINDER_SIZE && col >= finder.col && col < finder.col + FINDER_SIZE);
  const inLogo = (row: number, col: number) =>
    row >= logoStart - 0.5 && row < logoStart + logoSide + 0.5 && col >= logoStart - 0.5 && col < logoStart + logoSide + 0.5;
  const dots: Module[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules.get(row, col) && !inFinder(row, col) && !inLogo(row, col)) dots.push({ row, col });
    }
  }
  return { size, dots, finders, logoStart, logoSide };
};

type AppQrCodeProps = {
  size?: number;
  className?: string;
};

export function AppQrCode({ size = 196, className }: AppQrCodeProps) {
  const origin = useClientValue(() => window.location.origin, FALLBACK_ORIGIN);
  const url = `${origin}${APP_PATH}`;
  const code = useMemo(() => buildCode(url), [url]);
  const gradientId = useId();
  const logoPadding = code.logoSide * 0.14;

  return (
    <svg
      viewBox={`0 0 ${code.size} ${code.size}`}
      width={size}
      height={size}
      role="img"
      aria-label={`QR code que abre o Charles em ${url}`}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#12170e" />
          <stop offset="100%" stopColor="#24400c" />
        </linearGradient>
      </defs>

      <g fill={`url(#${gradientId})`}>
        {code.dots.map((dot) => (
          <circle key={`${dot.row}-${dot.col}`} cx={dot.col + 0.5} cy={dot.row + 0.5} r={DOT_RADIUS} />
        ))}
      </g>

      {code.finders.map((finder) => (
        <g key={`${finder.row}-${finder.col}`}>
          <rect
            x={finder.col + 0.5}
            y={finder.row + 0.5}
            width={FINDER_SIZE - 1}
            height={FINDER_SIZE - 1}
            rx={2.1}
            fill="none"
            stroke="#12170e"
            strokeWidth={1}
          />
          <rect x={finder.col + 2} y={finder.row + 2} width={3} height={3} rx={1.1} fill="#4f8a1c" />
        </g>
      ))}

      <rect
        x={code.logoStart}
        y={code.logoStart}
        width={code.logoSide}
        height={code.logoSide}
        rx={code.logoSide * 0.3}
        fill="#e2f2cd"
      />
      <image
        href="/charles/parafuso.png"
        x={code.logoStart + logoPadding}
        y={code.logoStart + logoPadding}
        width={code.logoSide - logoPadding * 2}
        height={code.logoSide - logoPadding * 2}
      />
    </svg>
  );
}
