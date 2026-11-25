"use client";

import { useState } from "react";
import { ArrowRightLeft, Check, ChevronDown, MapPin, ScanSearch } from "lucide-react";
import { itemTotal, shelfProduct, type ShoppingItem } from "@/lib/copilot/shopping-list";
import { formatPrice } from "@/lib/store/catalog";
import { cn } from "@/lib/utils";

const kindLabels: Record<ShoppingItem["kind"], string | null> = {
  essential: null,
  forgotten: "você ia esquecer",
  tool: "se não tiver em casa",
};

type ItemCardProps = {
  item: ShoppingItem;
  picked: boolean;
  onTogglePicked: () => void;
  onScan: () => void;
};

export function ItemCard({ item, picked, onTogglePicked, onScan }: ItemCardProps) {
  const [open, setOpen] = useState(false);
  const product = shelfProduct(item);
  const kindLabel = kindLabels[item.kind];

  return (
    <div className="rounded-[20px] bg-white shadow-[0_1px_2px_rgba(18,23,14,.06),0_8px_20px_-14px_rgba(18,23,14,.3)] ring-1 ring-line/60">
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={onTogglePicked}
          aria-pressed={picked}
          aria-label={picked ? `Desmarcar ${product.name}` : `Marcar ${product.name} como pego`}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full transition-all",
            picked ? "bg-brand text-ink" : "text-transparent ring-2 ring-line hover:text-ink/25 hover:ring-brand-deep",
          )}
        >
          <Check className="size-4" strokeWidth={3} />
        </button>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "line-clamp-2 text-[15px] font-extrabold leading-snug transition-colors",
                picked && "text-ink-soft line-through",
              )}
            >
              {product.name}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-ink-soft">
              <span className="font-extrabold text-ink">{item.quantity}×</span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-brand-deep" />
                Corredor {product.aisle}
              </span>
              {kindLabel && (
                <span className="rounded-full bg-sun px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
                  {kindLabel}
                </span>
              )}
              {item.substitute && (
                <span className="rounded-full bg-[#fff1e4] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#8a4300]">
                  trocado
                </span>
              )}
            </span>
          </span>
          <span className={cn("shrink-0 text-[15px] font-extrabold tabular-nums", picked && "text-ink-soft")}>
            {formatPrice(itemTotal(item))}
          </span>
          <ChevronDown
            className={cn("size-5 shrink-0 text-ink-soft transition-transform duration-300", open && "rotate-180")}
          />
        </button>
      </div>

      <div className="-mt-1 ml-[52px] pb-3 pr-3">
        <button
          type="button"
          onClick={onScan}
          className="flex items-center gap-1.5 rounded-full bg-ink py-1.5 pl-2.5 pr-3.5 text-xs font-bold text-white transition-transform active:scale-95"
        >
          <ScanSearch className="size-3.5 text-brand" />
          Qual desses?
        </button>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="ml-[52px] mr-3 flex flex-col gap-2.5 border-t border-line pb-3 pt-3">
            {item.reason && <p className="text-[13px] leading-snug text-ink-soft">{item.reason}</p>}
            <p className="text-xs font-semibold text-ink-soft">
              {product.stock} em estoque · {item.quantity} × {formatPrice(product.price)}
            </p>
            {item.substitute && (
              <p className="flex items-start gap-1.5 rounded-xl bg-[#fff1e4] px-2.5 py-2 text-xs font-semibold text-[#8a4300]">
                <ArrowRightLeft className="mt-0.5 size-3.5 shrink-0" />
                Sem estoque: {item.product.name}. Leve este, que faz o mesmo serviço.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
