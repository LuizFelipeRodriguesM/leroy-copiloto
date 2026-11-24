import Image from "next/image";
import { PartyPopper, RotateCcw, UserRound } from "lucide-react";
import { itemTotal, itemsTotal, shelfProduct, type ShoppingList } from "@/lib/copilot/shopping-list";
import { formatPrice } from "@/lib/store/catalog";

type CheckoutViewProps = {
  list: ShoppingList;
  picked: string[];
  onRestart: () => void;
};

export function CheckoutView({ list, picked, onRestart }: CheckoutViewProps) {
  const missing = list.items.filter((item) => !picked.includes(item.product.id));
  const cartTotal = itemsTotal(list.items.filter((item) => picked.includes(item.product.id)));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-[24px] bg-[linear-gradient(140deg,#c6e79c_0%,#def2c3_55%,#f4f9d9_100%)] p-5">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/70">
          <Image src="/charles/parafuso.png" alt="" width={46} height={46} />
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-xl font-extrabold tracking-[-0.03em]">
            {missing.length ? "Quase lá." : "Tudo na mão."}
            {!missing.length && <PartyPopper className="size-5 text-brand-ink" />}
          </p>
          <p className="mt-0.5 text-sm leading-snug text-brand-ink">
            {missing.length
              ? `Ficou faltando ${missing.length === 1 ? "1 item" : `${missing.length} itens`}. Tudo bem, é só passar no caixa.`
              : "Pode passar no caixa ou no self-checkout. Boa obra!"}
          </p>
        </div>
      </div>

      <div className="rounded-[20px] bg-white p-4 ring-1 ring-line">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-deep">{list.title}</p>
        <ul className="mt-2 divide-y divide-line">
          {list.items.map((item) => {
            const product = shelfProduct(item);
            const isPicked = picked.includes(item.product.id);
            return (
              <li key={item.product.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="min-w-0">
                  <span className={isPicked ? "block font-semibold" : "block font-semibold text-ink-soft"}>
                    {item.quantity}x {product.name}
                  </span>
                  {!isPicked && (
                    <span className="mt-1 inline-block rounded-full bg-[#fff1e4] px-2 py-0.5 text-[11px] font-bold text-[#8a4300]">
                      faltou · corredor {product.aisle}
                    </span>
                  )}
                </span>
                <span className={isPicked ? "shrink-0 font-bold tabular-nums" : "shrink-0 font-semibold tabular-nums text-ink-soft line-through"}>
                  {formatPrice(itemTotal(item))}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex items-end justify-between border-t border-ink/15 pt-3">
          <span className="text-sm font-bold">Total no caixa</span>
          <span className="text-2xl font-extrabold tabular-nums tracking-[-0.03em]">{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {list.needsSeller && list.sellerNote && (
        <div className="flex gap-3 rounded-[20px] bg-[#fff1e4] p-4 text-[#8a4300]">
          <UserRound className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm leading-snug">
            <strong className="font-extrabold">Pro vendedor:</strong> {list.sellerNote}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-base font-bold text-white"
      >
        <RotateCcw className="size-4 text-brand" />
        Resolver outro problema
      </button>
    </div>
  );
}
