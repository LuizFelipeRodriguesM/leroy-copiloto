"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CharlesMood = "idle" | "thinking" | "happy";

export type CharlesPoke = "tap" | "spin";

type CharlesEmbedProps = {
  bot?: string;
  accessory?: string;
  mood?: CharlesMood;
  title?: string;
  className?: string;
  eager?: boolean;
  hopSignal?: number;
  fit?: number;
  onShown?: () => void;
  onPoke?: (kind: CharlesPoke) => void;
};

export function CharlesEmbed({
  bot = "parafuso",
  accessory = "cartola",
  mood = "idle",
  title = "Charles, o copiloto da Leroy Merlin",
  className,
  eager = false,
  hopSignal = 0,
  fit = 1,
  onShown,
  onPoke,
}: CharlesEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [initialMood] = useState(mood);
  const readyRef = useRef(false);
  const moodRef = useRef(mood);
  const shownRef = useRef(onShown);
  const pokeRef = useRef(onPoke);

  useEffect(() => {
    shownRef.current = onShown;
    pokeRef.current = onPoke;
  }, [onShown, onPoke]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let pending = 0;
    let lastPointer: { x: number; y: number } | null = null;

    const send = (message: object) => {
      frame.contentWindow?.postMessage(message, window.location.origin);
    };

    const flushPointer = () => {
      pending = 0;
      if (!lastPointer) return;
      const rect = frame.getBoundingClientRect();
      send({ type: "charles:pointer", x: lastPointer.x - rect.left, y: lastPointer.y - rect.top });
    };

    const handlePointer = (event: PointerEvent) => {
      lastPointer = { x: event.clientX, y: event.clientY };
      if (!pending) pending = requestAnimationFrame(flushPointer);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
      const type = event.data?.type;
      if (type === "charles:shown") shownRef.current?.();
      if (type === "charles:poked") pokeRef.current?.(event.data.kind === "spin" ? "spin" : "tap");
      if (type !== "charles:ready") return;
      readyRef.current = true;
      send({ type: "charles:mood", mood: moodRef.current });
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("message", handleMessage);
    send({ type: "charles:hello" });
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("message", handleMessage);
      if (pending) cancelAnimationFrame(pending);
    };
  }, []);

  useEffect(() => {
    moodRef.current = mood;
    if (!readyRef.current) return;
    frameRef.current?.contentWindow?.postMessage({ type: "charles:mood", mood }, window.location.origin);
  }, [mood]);

  useEffect(() => {
    if (!hopSignal || !readyRef.current) return;
    frameRef.current?.contentWindow?.postMessage({ type: "charles:hop" }, window.location.origin);
  }, [hopSignal]);

  const source = `/charles-3d.html?embed&bot=${bot}&acc=${accessory}&mood=${initialMood}&fit=${fit}`;

  return (
    <iframe
      ref={frameRef}
      src={source}
      title={title}
      loading={eager ? "eager" : "lazy"}
      className={cn("block border-0 bg-transparent", className)}
      style={{ colorScheme: "light" }}
    />
  );
}
