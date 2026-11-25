"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BatteryFull, Signal, Wifi, X } from "lucide-react";
import { IPHONE_HEIGHT, IPHONE_WIDTH, Iphone } from "@/components/ui/iphone";
import { useClientValue } from "@/lib/use-client-value";

const RESERVED_HEIGHT = 170;
const MIN_SCALE = 0.5;

const isInsideFrame = () => window.self !== window.top;
const fitScale = () => Math.min(1, Math.max(MIN_SCALE, (window.innerHeight - RESERVED_HEIGHT) / IPHONE_HEIGHT));

type DevicePreviewProps = {
  path: string;
  className: string;
  label?: string;
  children: ReactNode;
};

export function DevicePreview({ path, className, label, children }: DevicePreviewProps) {
  const insideFrame = useClientValue(isInsideFrame, false);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!open) return;
    const handleResize = () => setScale(fitScale());
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (insideFrame) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setScale(fitScale());
          setOpen(true);
        }}
        aria-label={label}
        className={className}
      >
        {children}
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Prévia do app no celular"
            className="fixed inset-0 z-50 hidden flex-col items-center justify-center gap-5 bg-[rgba(243,248,234,.94)] backdrop-blur-xl lg:flex"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white py-2 pl-3 pr-4 text-sm font-bold text-ink ring-1 ring-line"
            >
              <X className="size-4" />
              Voltar pro desktop
            </button>

            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-deep">Prévia no celular</p>
              <p className="mt-1 text-sm text-ink-soft">É o mesmo app rodando de verdade. Pode clicar e usar.</p>
            </div>

            <div style={{ width: IPHONE_WIDTH * scale, height: IPHONE_HEIGHT * scale }}>
              <div
                className="origin-top-left drop-shadow-[0_40px_60px_rgba(36,64,12,.25)]"
                style={{ width: IPHONE_WIDTH, transform: `scale(${scale})` }}
              >
                <Iphone>
                  <div className="flex size-full flex-col bg-paper">
                    <div className="flex h-[54px] shrink-0 items-center justify-between px-8 pt-1 text-[15px] font-semibold text-ink">
                      <span className="tabular-nums">9:41</span>
                      <span className="flex items-center gap-1">
                        <Signal className="size-[15px]" strokeWidth={2.6} />
                        <Wifi className="size-[15px]" strokeWidth={2.6} />
                        <BatteryFull className="size-[21px]" strokeWidth={1.8} />
                      </span>
                    </div>
                    <iframe src={path} title="Leroy Copiloto no celular" className="w-full flex-1 border-0 bg-paper" />
                  </div>
                </Iphone>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
