import { Check, ScanSearch } from "lucide-react";
import { ItemCard } from "@/components/copilot/item-card";
import { StoreMap } from "@/components/copilot/store-map";
import { shelfProduct, type ShoppingItem, type ShoppingList } from "@/lib/copilot/shopping-list";
import { aisleLabel } from "@/lib/store/layout";
import { cn } from "@/lib/utils";

type RouteViewProps = {
  list: ShoppingList;
  picked: string[];
  onTogglePicked: (productId: string) => void;
  onScan: (item: ShoppingItem) => void;
};

export function RouteView({ list, picked, onTogglePicked, onScan }: RouteViewProps) {
  const itemsByAisle = (aisle: number) => list.items.filter((item) => shelfProduct(item).aisle === aisle);
  const doneStops = list.stops.filter((aisle) => itemsByAisle(aisle).every((item) => picked.includes(item.product.id)));

  return (
    <div className="flex flex-col gap-3">
      <div className="px-1">
        <h2 className="text-xl font-extrabold leading-tight tracking-[-0.035em]">Rota na loja</h2>
        <p className="mt-0.5 text-sm text-ink-soft">
          {list.stops.length} {list.stops.length === 1 ? "parada" : "paradas"}, na ordem mais curta até o caixa
        </p>
      </div>

      <div className="rounded-[24px] bg-white p-2 ring-1 ring-line">
        <div className="mx-auto w-full max-w-[340px]">
          <StoreMap stops={list.stops} doneStops={doneStops} />
        </div>
      </div>

      {list.stops.map((aisle, index) => (
        <section key={aisle} className="flex flex-col gap-2.5">
          <h3 className="flex items-center gap-2.5 px-1 pt-2 text-base font-extrabold tracking-[-0.02em]">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full text-xs",
                doneStops.includes(aisle) ? "bg-brand text-ink" : "bg-ink text-brand",
              )}
            >
              {doneStops.includes(aisle) ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
            </span>
            Corredor {aisle}
            <span className="text-sm font-semibold text-ink-soft">{aisleLabel(aisle)}</span>
          </h3>
          {itemsByAisle(aisle).map((item) => {
            const isPicked = picked.includes(item.product.id);
            return (
              <ItemCard key={item.product.id} item={item} done={isPicked}>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onTogglePicked(item.product.id)}
                    aria-pressed={isPicked}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold transition-colors",
                      isPicked ? "bg-brand text-ink" : "bg-[#f4f6f0] text-ink hover:bg-[#ebefe4]",
                    )}
                  >
                    <Check className="size-4" strokeWidth={3} />
                    {isPicked ? "Peguei" : "Marcar como pego"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onScan(item)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink py-2.5 text-sm font-bold text-white"
                  >
                    <ScanSearch className="size-4 text-brand" />
                    Qual desses?
                  </button>
                </div>
              </ItemCard>
            );
          })}
        </section>
      ))}
    </div>
  );
}
