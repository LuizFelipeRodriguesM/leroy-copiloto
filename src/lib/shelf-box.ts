import type { CSSProperties } from "react";

export const boxStyle = ([yMin, xMin, yMax, xMax]: readonly number[]): CSSProperties => ({
  top: `${yMin / 10}%`,
  left: `${xMin / 10}%`,
  width: `${(xMax - xMin) / 10}%`,
  height: `${(yMax - yMin) / 10}%`,
});

export const labelInside = ([yMin]: readonly number[]) => yMin < 90;

export const labelSide = ([, xMin]: readonly number[]) => (xMin > 800 ? "right-1" : "left-1");
