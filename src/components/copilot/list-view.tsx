import { Check, TriangleAlert } from "lucide-react";
import { ItemCard } from "@/components/copilot/item-card";
import { StoreMap } from "@/components/copilot/store-map";
import { itemsTotal, shelfProduct, type ShoppingItem, type ShoppingList } from "@/lib/copilot/shopping-list";
import { formatPrice } from "@/lib/store/catalog";
import { aisleLabel } from "@/lib/store/layout";

type ListViewProps = {
  list: ShoppingList;
  picked: string[];
  onTogglePicked: (productId: string) => void;
  onScan: (item: ShoppingItem) => void;
};

export function ListView({ list, picked, onTogglePicked, onScan }: ListViewProps) {
  const itemsByAisle = (aisle: number) => list.items.filter((item) => shelfProduct(item).aisle === aisle);
  const doneStops = list.stops.filter((aisle) => itemsByAisle(aisle).every((item) => picked.includes(item.product.id)));
  const allInStock = list.items.every((item) => !item.substitute && item.product.stock > 0);
  const total = itemsTotal(list.items);
  const toolsTotal = itemsTotal(list.items.filter((item) => item.kind === "tool"));

  return (
    <div className="flex flex-col gap-3">
      <div className="px-1">
        <h2 className="text-xl font-extrabold leading-tight tracking-[-0.035em]">{list.title}</h2>
        <p className="mt-0.5 text-sm text-ink-soft">
          {list.items.length} itens em {list.stops.length} {list.stops.length === 1 ? "corredor" : "corredores"}, na
          ordem mais curta até o caixa
        </p>
      </div>

      <div className="flex items-end justify-between gap-4 rounded-[20px] bg-[linear-gradient(140deg,#e9f6da,#d2ecaf)] p-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-ink">Total do projeto</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums tracking-[-0.04em]">{formatPrice(total)}</p>
          {toolsTotal > 0 && (
            <p className="mt-1 text-xs font-semibold leading-snug text-brand-ink">
              Inclui {formatPrice(toolsTotal)} em ferramentas que você talvez já tenha em casa.
            </p>
          )}
        </div>
        <p className="shrink-0 text-right text-[11px] font-semibold text-brand-ink/70">Preços da loja de exemplo</p>
      </div>

      {list.needsSeller && (
        <div className="flex gap-3 rounded-[20px] bg-[#fff1e4] p-4 text-[#8a4300]">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-extrabold">Esse vale chamar um vendedor</p>
            {list.sellerNote && <p className="mt-1 text-sm leading-snug">{list.sellerNote}</p>}
          </div>
        </div>
      )}

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
          {itemsByAisle(aisle).map((item) => (
            <ItemCard
              key={item.product.id}
              item={item}
              picked={picked.includes(item.product.id)}
              onTogglePicked={() => onTogglePicked(item.product.id)}
              onScan={() => onScan(item)}
            />
          ))}
        </section>
      ))}

      <p className="flex items-center gap-1.5 px-1 text-sm font-bold text-brand-deep">
        <Check className="size-4" strokeWidth={3} />
        {allInStock ? "Tudo em estoque nesta loja" : "Onde acabou, o Charles já trocou pelo substituto"}
      </p>

      {list.steps.length > 0 && (
        <div className="rounded-[20px] bg-paper p-4 ring-1 ring-line">
          <p className="text-[15px] font-extrabold">Como resolver em casa</p>
          <ol className="mt-3 flex flex-col gap-2.5 text-sm leading-snug text-ink-soft">
            {list.steps.map((step, index) => (
              <li key={step} className="flex gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-extrabold text-brand-ink">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
