import { Check, TriangleAlert } from "lucide-react";
import { ItemCard } from "@/components/copilot/item-card";
import { itemsTotal, shelfProduct, type ShoppingItem, type ShoppingList } from "@/lib/copilot/shopping-list";
import { formatPrice } from "@/lib/store/catalog";

type ListViewProps = {
  list: ShoppingList;
  picked: string[];
  onTogglePicked: (productId: string) => void;
  onScan: (item: ShoppingItem) => void;
};

export function ListView({ list, picked, onTogglePicked, onScan }: ListViewProps) {
  const items = [...list.items].sort(
    (a, b) => list.stops.indexOf(shelfProduct(a).aisle) - list.stops.indexOf(shelfProduct(b).aisle),
  );
  const allInStock = list.items.every((item) => !item.substitute && item.product.stock > 0);
  const total = itemsTotal(list.items);
  const toolsTotal = itemsTotal(list.items.filter((item) => item.kind === "tool"));

  return (
    <div className="flex flex-col gap-3">
      <div className="px-1">
        <h2 className="text-xl font-extrabold leading-tight tracking-[-0.035em]">{list.title}</h2>
        <p className="mt-0.5 text-sm text-ink-soft">
          {list.items.length} itens em {list.stops.length} {list.stops.length === 1 ? "corredor" : "corredores"}
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

      {items.map((item) => {
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
