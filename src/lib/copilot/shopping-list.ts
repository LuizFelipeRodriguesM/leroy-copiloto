import { findProduct, type Product } from "@/lib/store/catalog";
import { orderStops } from "@/lib/store/layout";
import type { ItemKind, ListDraft } from "@/lib/copilot/schemas";

export type ShoppingItem = {
  product: Product;
  quantity: number;
  reason: string;
  kind: ItemKind;
  substitute: Product | null;
};

export type ShoppingList = {
  title: string;
  reply: string;
  items: ShoppingItem[];
  steps: string[];
  needsSeller: boolean;
  sellerNote: string | null;
  stops: number[];
};

export const shelfProduct = (item: ShoppingItem) => item.substitute ?? item.product;

export const itemTotal = (item: ShoppingItem) => shelfProduct(item).price * item.quantity;

export const itemsTotal = (items: ShoppingItem[]) => items.reduce((sum, item) => sum + itemTotal(item), 0);

const findSubstitute = (product: Product) => {
  if (product.stock > 0 || !product.substituteId) return null;
  const substitute = findProduct(product.substituteId);
  return substitute && substitute.stock > 0 ? substitute : null;
};

export const resolveList = (draft: ListDraft): ShoppingList => {
  const seen = new Set<string>();
  const items = draft.items.flatMap((item): ShoppingItem[] => {
    const product = findProduct(item.productId);
    if (!product || seen.has(product.id)) return [];
    seen.add(product.id);
    return [{ product, quantity: item.quantity, reason: item.reason, kind: item.kind, substitute: findSubstitute(product) }];
  });
  return {
    title: draft.title,
    reply: draft.reply,
    items,
    steps: draft.steps,
    needsSeller: draft.needsSeller,
    sellerNote: draft.sellerNote ?? null,
    stops: orderStops(items.map((item) => shelfProduct(item).aisle)),
  };
};
