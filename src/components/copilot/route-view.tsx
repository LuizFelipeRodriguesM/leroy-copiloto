import { ItemCard } from "@/components/copilot/item-card";
import { StoreMap } from "@/components/copilot/store-map";
import { shelfProduct, type ShoppingItem, type ShoppingList } from "@/lib/copilot/shopping-list";
import { aisleLabel } from "@/lib/store/layout";

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

      {list.stops.map((aisle) => (
        <section key={aisle} className="flex flex-col gap-2.5">
          <h3 className="flex items-baseline gap-2.5 px-1 pt-2 text-base font-extrabold tracking-[-0.02em]">
            Corredor {aisle}
            <span className="text-sm font-semibold text-ink-soft">{aisleLabel(aisle)}</span>
          </h3>
          {itemsByAisle(aisle).map((item) => {
            const isPicked = picked.includes(item.product.id);
            return (
              <ItemCard
                key={item.product.id}
                item={item}
                picked={isPicked}
                onTogglePicked={() => onTogglePicked(item.product.id)}
                onScan={() => onScan(item)}
              />
            );
          })}
        </section>
      ))}
    </div>
  );
}
