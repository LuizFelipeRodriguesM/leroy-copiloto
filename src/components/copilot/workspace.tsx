"use client";

import { ArrowRight, ListChecks, Map as MapIcon, ScanSearch, X } from "lucide-react";
import { CheckoutView } from "@/components/copilot/checkout-view";
import { ListView } from "@/components/copilot/list-view";
import type { WorkspaceTab } from "@/components/copilot/messages";
import { RouteView } from "@/components/copilot/route-view";
import { ShelfView, type ShelfTarget } from "@/components/copilot/shelf-view";
import { itemsTotal, shelfProduct, type ShoppingItem, type ShoppingList } from "@/lib/copilot/shopping-list";
import { formatPrice } from "@/lib/store/catalog";
import { cn } from "@/lib/utils";

const tabs: { id: Exclude<WorkspaceTab, "checkout">; label: string; icon: typeof ListChecks }[] = [
  { id: "list", label: "Lista", icon: ListChecks },
  { id: "route", label: "Rota", icon: MapIcon },
  { id: "shelf", label: "Qual desses?", icon: ScanSearch },
];

type WorkspaceProps = {
  list: ShoppingList | null;
  tab: WorkspaceTab;
  onTab: (tab: WorkspaceTab) => void;
  picked: string[];
  onTogglePicked: (productId: string) => void;
  shelfItemId: string | null;
  onShelfItem: (productId: string | null) => void;
  problem: string;
  onClose: () => void;
  onRestart: () => void;
};

const targetFor = (item: ShoppingItem): ShelfTarget => {
  const product = shelfProduct(item);
  return { productId: item.product.id, name: product.name, details: product.details };
};

export function Workspace({
  list,
  tab,
  onTab,
  picked,
  onTogglePicked,
  shelfItemId,
  onShelfItem,
  problem,
  onClose,
  onRestart,
}: WorkspaceProps) {
  const shelfItem = list?.items.find((item) => item.product.id === shelfItemId) ?? null;
  const pickedCount = list ? list.items.filter((item) => picked.includes(item.product.id)).length : 0;
  const allPicked = Boolean(list) && pickedCount === list?.items.length;
  const cartTotal = list ? itemsTotal(list.items.filter((item) => picked.includes(item.product.id))) : 0;

  const scanItem = (item: ShoppingItem) => {
    onShelfItem(item.product.id);
    onTab("shelf");
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
        {list ? (
          <div className="flex flex-1 gap-1 rounded-full bg-[#f1f4ec] p-1" role="tablist">
            {tabs.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onTab(item.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[13px] font-bold transition-all",
                    active ? "bg-white text-ink shadow-[0_2px_8px_-3px_rgba(18,23,14,.3)]" : "text-ink-soft hover:text-ink",
                  )}
                >
                  <Icon className={cn("size-4", active && "text-brand-deep")} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="flex flex-1 items-center gap-2 px-2 text-sm font-extrabold">
            <ScanSearch className="size-4 text-brand-deep" />
            Qual desses?
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar painel"
          className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
        {list && tab === "list" && (
          <ListView list={list} picked={picked} onTogglePicked={onTogglePicked} onScan={scanItem} />
        )}
        {list && tab === "route" && (
          <RouteView list={list} picked={picked} onTogglePicked={onTogglePicked} onScan={scanItem} />
        )}
        {list && tab === "checkout" && <CheckoutView list={list} picked={picked} onRestart={onRestart} />}
        {tab === "shelf" && (
          <div className="flex flex-col gap-4">
            {list && (
              <div className="flex flex-wrap gap-1.5">
                {list.items.map((item) => (
                  <button
                    key={item.product.id}
                    type="button"
                    onClick={() => onShelfItem(item.product.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                      shelfItemId === item.product.id
                        ? "bg-ink text-white"
                        : "bg-[#f1f4ec] text-ink-soft hover:text-ink",
                    )}
                  >
                    {shelfProduct(item).name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onShelfItem(null)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                    shelfItemId === null ? "bg-ink text-white" : "bg-[#f1f4ec] text-ink-soft hover:text-ink",
                  )}
                >
                  Outro produto
                </button>
              </div>
            )}
            <ShelfView
              key={shelfItemId ?? "free"}
              target={shelfItem ? targetFor(shelfItem) : null}
              problem={problem}
              onPicked={(productId) => {
                if (!picked.includes(productId)) onTogglePicked(productId);
                onTab("route");
              }}
            />
          </div>
        )}
      </div>

      {list && tab !== "checkout" && (
        <div className="flex items-center gap-3 border-t border-line px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-ink-soft">
              {pickedCount} de {list.items.length} itens ·{" "}
              <span className="tabular-nums text-ink">{formatPrice(cartTotal)}</span> no carrinho
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-brand-deep transition-all duration-500"
                style={{ width: `${(pickedCount / Math.max(1, list.items.length)) * 100}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTab("checkout")}
            className={cn(
              "flex items-center gap-2 rounded-full py-2 pl-4 pr-2 text-sm font-bold transition-colors",
              allPicked ? "bg-brand text-ink" : "bg-ink text-white",
            )}
          >
            Ir pro caixa
            <span className={cn("grid size-7 place-items-center rounded-full", allPicked ? "bg-ink text-brand" : "bg-brand text-ink")}>
              <ArrowRight className="size-4" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
