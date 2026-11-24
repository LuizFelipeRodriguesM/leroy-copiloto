"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUp, ImagePlus, X } from "lucide-react";
import { toJpegDataUrl } from "@/lib/copilot/client";
import { cn } from "@/lib/utils";

type ComposerProps = {
  onSubmit: (problem: string, photo: string | null) => void;
  placeholder?: string;
  compact?: boolean;
  className?: string;
};

export function Composer({
  onSubmit,
  placeholder = "Conta o problema do seu jeito…",
  compact = false,
  className,
}: ComposerProps) {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const ready = text.trim().length >= 3;

  const submit = () => {
    if (!ready) return;
    onSubmit(text.trim(), photo);
    setText("");
    setPhoto(null);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(null);
    try {
      setPhoto(await toJpegDataUrl(file));
    } catch {
      setPhotoError("Não consegui abrir essa foto.");
    }
  };

  const fileInput = (
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(event) => {
        void handleFile(event.target.files?.[0]);
        event.target.value = "";
      }}
    />
  );

  const photoPreview = photo && (
    <div className="relative mb-1 ml-2 mt-1 w-fit">
      <Image
        src={photo}
        alt="Foto do problema"
        width={72}
        height={72}
        unoptimized
        className="size-[72px] rounded-2xl object-cover ring-1 ring-line"
      />
      <button
        type="button"
        onClick={() => setPhoto(null)}
        aria-label="Tirar a foto"
        className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-ink text-white"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );

  const textarea = (
    <label className={compact ? "min-w-0 flex-1" : "block"}>
      <span className="sr-only">Seu problema</span>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
          }
        }}
        maxLength={600}
        rows={compact ? 1 : 2}
        placeholder={placeholder}
        className={cn(
          "field-sizing-content block max-h-44 w-full resize-none bg-transparent text-base outline-none placeholder:text-ink-soft/60",
          compact ? "min-h-10 px-1 py-2 leading-6" : "min-h-[56px] px-3 pt-2 leading-snug",
        )}
      />
    </label>
  );

  const sendButton = (
    <button
      type="submit"
      disabled={!ready}
      aria-label="Mandar pro Charles"
      className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-all disabled:bg-ink/15 disabled:text-ink/40"
    >
      <ArrowUp className="size-5" strokeWidth={2.4} />
    </button>
  );

  const photoButton = (
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      aria-label="Mandar foto"
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-ink",
        compact ? "size-10 justify-center" : "px-3 py-2",
      )}
    >
      <ImagePlus className="size-4 text-brand-deep" />
      {!compact && "Foto"}
    </button>
  );

  return (
    <form
      className={cn(
        "bg-white shadow-[0_1px_2px_rgba(18,23,14,.06),0_18px_40px_-22px_rgba(18,23,14,.35)] ring-1 ring-line transition-shadow focus-within:ring-brand-deep/50",
        compact ? "rounded-[24px] p-1.5" : "rounded-[28px] p-2.5",
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      {fileInput}
      {photoPreview}
      {compact ? (
        <div className="flex items-end gap-1">
          {photoButton}
          {textarea}
          {sendButton}
        </div>
      ) : (
        <>
          {textarea}
          <div className="flex items-center justify-between gap-2 px-1">
            {photoButton}
            {photoError && <p className="text-xs font-semibold text-signal">{photoError}</p>}
            {sendButton}
          </div>
        </>
      )}
      {compact && photoError && <p className="px-3 pb-1 text-xs font-semibold text-signal">{photoError}</p>}
    </form>
  );
}
