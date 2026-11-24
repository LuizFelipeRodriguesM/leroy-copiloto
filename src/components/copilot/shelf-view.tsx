"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, Check, ImagePlus, RotateCcw, ScanSearch, X } from "lucide-react";
import { postJson, toJpegDataUrl, urlToJpegDataUrl } from "@/lib/copilot/client";
import type { ShelfRequest, ShelfResult } from "@/lib/copilot/schemas";
import { boxStyle, labelInside, labelSide } from "@/lib/shelf-box";
import { shelfDemos } from "@/lib/shelf-demos";
import { cn } from "@/lib/utils";

export type ShelfTarget = {
  productId: string | null;
  name: string;
  details: string;
};

type Status = "idle" | "scanning" | "done";

type ShelfViewProps = {
  target: ShelfTarget | null;
  problem: string;
  onPicked: (productId: string) => void;
};

export function ShelfView({ target, problem, onPicked }: ShelfViewProps) {
  const [freeTarget, setFreeTarget] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ShelfResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const lookingFor = target ? target.name : freeTarget.trim();
  const context = [problem, target?.details].filter(Boolean).join(". ");
  const canScan = lookingFor.length >= 3;

  const scan = async (dataUrl: string, wanted: string) => {
    setPhoto(dataUrl);
    setResult(null);
    setError(null);
    setStatus("scanning");
    try {
      const body: ShelfRequest = { photo: dataUrl, target: wanted, problem: context || undefined };
      setResult(await postJson<ShelfResult>("/api/shelf", body));
      setStatus("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não consegui ler a prateleira.");
      setStatus("idle");
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file || !canScan) return;
    try {
      await scan(await toJpegDataUrl(file), lookingFor);
    } catch {
      setError("Não consegui abrir essa foto. Tenta outra?");
    }
  };

  const scanDemo = async (photoUrl: string, demoTarget: string) => {
    const wanted = canScan ? lookingFor : demoTarget;
    if (!canScan) setFreeTarget(demoTarget);
    await scan(await urlToJpegDataUrl(photoUrl), wanted);
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setError(null);
    setStatus("idle");
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="px-1">
        <h2 className="text-xl font-extrabold leading-tight tracking-[-0.035em]">
          {target ? target.name : photo ? freeTarget : "O que você procura na prateleira?"}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {target
            ? target.details
            : "Tira uma foto da prateleira: o Charles circula o certo e diz por que os vizinhos não servem."}
        </p>
      </div>

      {!target && status === "idle" && !photo && (
        <input
          type="text"
          value={freeTarget}
          onChange={(event) => setFreeTarget(event.target.value)}
          maxLength={200}
          placeholder="Ex.: óleo 5W-30 de 5 litros"
          className="w-full rounded-2xl bg-white px-4 py-3.5 text-base outline-none ring-1 ring-line placeholder:text-ink-soft/60 focus:ring-2 focus:ring-brand-deep"
        />
      )}

      {photo && (
        <div className="relative overflow-hidden rounded-[24px] bg-ink shadow-[0_20px_40px_-24px_rgba(18,23,14,.6)]">
          <Image src={photo} alt="Foto da prateleira" width={1600} height={1200} unoptimized className="h-auto w-full" />
          {status === "scanning" && (
            <>
              <div className="scan-line absolute inset-x-0 h-[18%] bg-[linear-gradient(to_bottom,transparent,rgba(156,209,103,.55)_85%,#9cd167)]" />
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink">
                <ScanSearch className="size-4 text-brand-deep" />
                Charles lendo a prateleira…
              </div>
            </>
          )}
          {status === "done" && result && (
            <>
              <div className="absolute inset-0 bg-ink/30" />
              {result.lookalikes.map((lookalike, index) => (
                <div
                  key={`${lookalike.product}-${index}`}
                  className="pop-in absolute rounded-xl border-2 border-dashed border-signal bg-signal/10"
                  style={{ ...boxStyle(lookalike.box), animationDelay: `${index * 160}ms` }}
                >
                  <span
                    className={cn(
                      "absolute flex items-center gap-1 whitespace-nowrap rounded-full bg-signal px-2 py-0.5 text-[11px] font-extrabold text-ink",
                      labelSide(lookalike.box),
                      labelInside(lookalike.box) ? "top-1" : "-top-7",
                    )}
                  >
                    <X className="size-3" strokeWidth={3.5} />
                    não
                  </span>
                </div>
              ))}
              {result.found && result.box && (
                <div className="pop-in box-pulse absolute rounded-xl border-[3px] border-brand" style={boxStyle(result.box)}>
                  <span
                    className={cn(
                      "absolute flex items-center gap-1 whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-xs font-extrabold text-ink",
                      labelSide(result.box),
                      labelInside(result.box) ? "top-1" : "-top-8",
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={3.5} />
                    ESTE
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {status === "done" && result && (
        <div className="rounded-[20px] bg-white p-4 shadow-[0_1px_2px_rgba(18,23,14,.06),0_10px_24px_-16px_rgba(18,23,14,.3)]">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-deep">
            {result.found ? "Charles achou" : "Não achei nessa foto"}
          </p>
          <p className="mt-1 text-lg font-extrabold leading-tight tracking-[-0.02em]">{result.product}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{result.reason}</p>
          {result.lookalikes.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
              {result.lookalikes.map((lookalike, index) => (
                <li key={`${lookalike.product}-${index}`} className="flex gap-2 text-sm leading-snug">
                  <X className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={3} />
                  <span>
                    <strong className="font-bold">{lookalike.product}:</strong>{" "}
                    <span className="text-ink-soft">{lookalike.whyNot}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <p className="rounded-2xl bg-[#fff1e4] px-4 py-3 text-sm font-semibold text-[#8a4300]">{error}</p>}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {status === "done" ? (
        <div className="mt-auto flex flex-col gap-2.5 pt-2">
          {target?.productId && result?.found && (
            <button
              type="button"
              onClick={() => target.productId && onPicked(target.productId)}
              className="flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-base font-bold text-ink"
            >
              <Check className="size-5" strokeWidth={3} />
              Peguei esse
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-base font-bold text-white"
          >
            <RotateCcw className="size-4 text-brand" />
            Tirar outra foto
          </button>
        </div>
      ) : (
        status === "idle" && (
          <div className="mt-auto flex flex-col gap-3 pt-2">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={!canScan}
                onClick={() => cameraRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-bold text-white disabled:opacity-40"
              >
                <Camera className="size-4 text-brand" />
                Tirar foto
              </button>
              <button
                type="button"
                disabled={!canScan}
                onClick={() => galleryRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-bold ring-1 ring-line disabled:opacity-40"
              >
                <ImagePlus className="size-4 text-brand-deep" />
                Da galeria
              </button>
            </div>
            <div>
              <p className="px-1 text-xs font-bold text-ink-soft">Ou teste com uma prateleira de exemplo:</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {shelfDemos.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => void scanDemo(demo.photo, demo.answer)}
                    className="group flex flex-col gap-1 text-left"
                  >
                    <Image
                      src={demo.photo}
                      alt={demo.tab}
                      width={160}
                      height={120}
                      className="aspect-[4/3] w-full rounded-xl object-cover ring-1 ring-line transition-transform group-hover:-translate-y-0.5"
                    />
                    <span className="text-[11px] font-semibold leading-tight text-ink-soft">{demo.tab}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
