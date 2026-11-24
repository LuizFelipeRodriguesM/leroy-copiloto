import type { ReactNode } from "react";
import { ArrowRightLeft, MapPin } from "lucide-react";
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
  showReason?: boolean;
  done?: boolean;
  children?: ReactNode;
};

export function ItemCard({ item, showReason = false, done = false, children }: ItemCardProps) {
  const product = shelfProduct(item);
  const kindLabel = kindLabels[item.kind];
  return (
    <div
      className={cn(
        "rounded-[20px] bg-white p-3.5 shadow-[0_1px_2px_rgba(18,23,14,.06),0_8px_20px_-14px_rgba(18,23,14,.3)] transition-opacity",
        done && "opacity-55",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(140deg,#e2f2cd,#c6e79c)] text-sm font-extrabold text-brand-ink">
          {item.quantity}x
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className={cn("text-[15px] font-extrabold leading-snug", done && "line-through")}>{product.name}</p>
            <p className="shrink-0 text-right">
              <span className="block text-[15px] font-extrabold tabular-nums">{formatPrice(itemTotal(item))}</span>
              {item.quantity > 1 && (
                <span className="block text-[11px] font-semibold tabular-nums text-ink-soft">
                  {item.quantity} × {formatPrice(product.price)}
                </span>
              )}
            </p>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-ink-soft">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 text-brand-deep" />
              Corredor {product.aisle}
            </span>
            <span>{product.stock} em estoque</span>
            {kindLabel && (
              <span className="rounded-full bg-sun px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
                {kindLabel}
              </span>
            )}
          </p>
          {item.substitute && (
            <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-[#fff1e4] px-2.5 py-2 text-xs font-semibold text-[#8a4300]">
              <ArrowRightLeft className="mt-0.5 size-3.5 shrink-0" />
              Sem estoque: {item.product.name}. Leve este, que faz o mesmo serviço.
            </p>
          )}
          {showReason && item.reason && <p className="mt-2 text-[13px] leading-snug text-ink-soft">{item.reason}</p>}
        </div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
