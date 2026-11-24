import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  BatteryFull,
  BrickWall,
  Camera,
  Check,
  CornerUpLeft,
  Disc,
  Droplets,
  MapPin,
  Mic,
  PanelTop,
  Play,
  ScanSearch,
  Signal,
  Sparkles,
  Wifi,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const PHONE_WIDTH = 316;
export const PHONE_HEIGHT = 640;

const sideButton = "absolute w-[3px] bg-[#2b3124]";
const cardShadow = "shadow-[0_1px_2px_rgba(18,23,14,.06),0_8px_20px_-12px_rgba(18,23,14,.28)]";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function PhoneFrame({ children, className, style }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative rounded-[54px] bg-[linear-gradient(145deg,#2f3628_0%,#12170e_50%,#2a3023_100%)] p-2 shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.14),0_70px_110px_-50px_rgba(36,64,12,.6),0_30px_60px_-30px_rgba(18,23,14,.45)]",
        className,
      )}
      style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT, ...style }}
    >
      <span className={cn(sideButton, "-left-[3px] top-[112px] h-7 rounded-l-sm")} />
      <span className={cn(sideButton, "-left-[3px] top-[160px] h-12 rounded-l-sm")} />
      <span className={cn(sideButton, "-left-[3px] top-[220px] h-12 rounded-l-sm")} />
      <span className={cn(sideButton, "-right-[3px] top-[178px] h-[72px] rounded-r-sm")} />
      <div className="relative h-full overflow-hidden rounded-[46px] bg-[#f6f8f1]">
        <div className="absolute inset-x-0 top-0 z-20 flex h-[50px] items-center justify-between px-7 pt-1 text-[14px] font-semibold text-ink">
          <span className="tabular-nums">9:41</span>
          <span className="flex items-center gap-1">
            <Signal className="size-[14px]" strokeWidth={2.6} />
            <Wifi className="size-[14px]" strokeWidth={2.6} />
            <BatteryFull className="size-[20px]" strokeWidth={1.8} />
          </span>
        </div>
        <div className="absolute left-1/2 top-[11px] z-30 h-[30px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
        {children}
        <div className="absolute bottom-2 left-1/2 z-30 h-[5px] w-[112px] -translate-x-1/2 rounded-full bg-ink/85" />
      </div>
    </div>
  );
}

function AppHeader() {
  return (
    <div className="flex items-center gap-2.5 border-b border-line/70 bg-white/85 px-4 pb-3 pt-[54px]">
      <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft">
        <Image src="/charles/parafuso.png" alt="" width={34} height={34} />
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-brand-deep ring-2 ring-white" />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-[15px] font-extrabold tracking-[-0.02em]">Charles</span>
        <span className="block text-[11px] font-medium text-ink-soft">Seu copiloto na Leroy Merlin</span>
      </span>
    </div>
  );
}

function Screen({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <div className="stagger flex flex-1 flex-col gap-2.5 overflow-hidden px-3.5 py-4">{children}</div>
      <div className="px-3.5 pb-7">{footer}</div>
    </div>
  );
}

function CharlesBubble({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[84%] rounded-[20px] rounded-bl-[6px] bg-white px-3.5 py-2.5 text-[13.5px] font-medium leading-snug",
        cardShadow,
        className,
      )}
    >
      {children}
    </div>
  );
}

function UserBubble({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "ml-auto max-w-[80%] rounded-[20px] rounded-br-[6px] bg-ink px-3.5 py-2.5 text-[13.5px] font-medium leading-snug text-white",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, tone = "ink" }: { children: ReactNode; tone?: "ink" | "brand" }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-full py-1.5 pl-5 pr-1.5 text-[14px] font-bold",
        tone === "ink" ? "bg-ink text-white" : "bg-brand text-ink",
      )}
    >
      {children}
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full",
          tone === "ink" ? "bg-brand text-ink" : "bg-ink text-brand",
        )}
      >
        <ArrowRight className="size-4" />
      </span>
    </div>
  );
}

const waveform = [6, 10, 16, 9, 20, 14, 8, 18, 12, 22, 15, 9, 17, 11, 7, 13, 19, 10, 6, 12, 8, 5];

export function TellScreen() {
  return (
    <Screen
      footer={
        <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 ring-1 ring-line">
          <span className="flex-1 text-[13px] font-medium text-ink-soft/70">Conta o problema…</span>
          <span className="grid size-9 place-items-center rounded-full bg-[#f1f3ec] text-ink">
            <Camera className="size-4" />
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-brand text-ink">
            <Mic className="size-4" />
          </span>
        </div>
      }
    >
      <p className="self-center rounded-full bg-ink/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft">
        Hoje
      </p>
      <CharlesBubble>Charles, ao seu dispor. Qual é o problema de hoje?</CharlesBubble>
      <UserBubble>minha torneira do banheiro tá pingando</UserBubble>
      <UserBubble className="flex items-center gap-2.5 py-2 pl-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-ink">
          <Play className="size-3.5 fill-current" />
        </span>
        <span className="flex h-6 items-center gap-[2px]">
          {waveform.map((height, index) => (
            <span key={index} className="w-[2.5px] rounded-full bg-white/70" style={{ height }} />
          ))}
        </span>
        <span className="text-[11px] font-semibold tabular-nums text-white/60">0:07</span>
      </UserBubble>
      <CharlesBubble className="flex w-fit items-center gap-1.5 py-3.5">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="typing-dot size-1.5 rounded-full bg-brand-deep"
            style={{ animationDelay: `${dot * 140}ms` }}
          />
        ))}
      </CharlesBubble>
    </Screen>
  );
}

function Option({ icon: Icon, label, selected }: { icon: LucideIcon; label: string; selected?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-[12px] font-bold",
        selected ? "bg-brand-mist text-ink ring-2 ring-brand-deep" : "bg-[#f4f6f0] text-ink-soft",
      )}
    >
      {selected && (
        <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-brand-deep text-white">
          <Check className="size-2.5" strokeWidth={3.5} />
        </span>
      )}
      <span className={cn("grid size-9 place-items-center rounded-xl", selected ? "bg-brand" : "bg-white")}>
        <Icon className="size-[18px] text-ink" />
      </span>
      {label}
    </div>
  );
}

function Choice({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1.5 text-[12px] font-bold",
        selected ? "bg-ink text-white" : "bg-[#f4f6f0] text-ink-soft",
      )}
    >
      {label}
    </span>
  );
}

export function AskScreen() {
  return (
    <Screen footer={<PrimaryButton>Montar minha lista</PrimaryButton>}>
      <CharlesBubble>Pra acertar de primeira, só duas perguntas.</CharlesBubble>
      <div className={cn("rounded-[22px] bg-white p-3.5", cardShadow)}>
        <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-deep">
          <Sparkles className="size-3" />
          Montada pra sua torneira
        </p>
        <p className="mt-3 text-[13px] font-extrabold">Onde fica a torneira?</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Option icon={BrickWall} label="Na parede" selected />
          <Option icon={PanelTop} label="Na bancada" />
        </div>
        <p className="mt-3.5 text-[13px] font-extrabold">Pinga com o registro fechado?</p>
        <div className="mt-2 flex gap-1.5">
          <Choice label="Sim" />
          <Choice label="Não" selected />
          <Choice label="Não sei" />
        </div>
      </div>
    </Screen>
  );
}

const listItems = [
  { icon: Droplets, name: "Reparo de vedação 1/2”", aisle: "41", forgot: false },
  { icon: Disc, name: "Fita veda-rosca 18 mm", aisle: "41", forgot: true },
  { icon: Wrench, name: "Chave inglesa 8”", aisle: "63", forgot: false },
];

export function ListScreen() {
  return (
    <Screen footer={<PrimaryButton tone="brand">Ver rota na loja</PrimaryButton>}>
      <div className="flex items-end justify-between px-0.5">
        <div>
          <p className="text-[22px] font-extrabold leading-none tracking-[-0.04em]">Sua lista</p>
          <p className="mt-1 text-[12px] font-medium text-ink-soft">Torneira do banheiro</p>
        </div>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-ink">3 itens</span>
      </div>
      {listItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.name} className={cn("flex items-center gap-3 rounded-[18px] bg-white p-2.5", cardShadow)}>
            <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-[linear-gradient(140deg,#e2f2cd,#c6e79c)]">
              <Icon className="size-5 text-brand-ink" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-extrabold">{item.name}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-ink-soft">
                <MapPin className="size-3 text-brand-deep" />
                Corredor {item.aisle} · 1 un.
              </span>
              {item.forgot && (
                <span className="mt-1 inline-block rounded-full bg-sun px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-ink">
                  você ia esquecer
                </span>
              )}
            </span>
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-ink">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          </div>
        );
      })}
      <p className="flex items-center gap-1.5 px-1 text-[11.5px] font-bold text-brand-deep">
        <Check className="size-3.5" strokeWidth={3} />
        Tudo em estoque nesta loja
      </p>
    </Screen>
  );
}

const aisles = [
  { x: 22, y: 24, label: "12" },
  { x: 82, y: 24, label: "14" },
  { x: 142, y: 24, label: "41", stop: 1 },
  { x: 202, y: 24, label: "52" },
  { x: 22, y: 112, label: "33" },
  { x: 82, y: 112, label: "47" },
  { x: 142, y: 112, label: "58" },
  { x: 202, y: 112, label: "63", stop: 2 },
];

export function RouteScreen() {
  return (
    <Screen
      footer={
        <div className="flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[14px] font-bold text-white">
          <ScanSearch className="size-4 text-brand" />
          Qual desses? Aponta a câmera
        </div>
      }
    >
      <div className="flex items-end justify-between px-0.5">
        <p className="text-[22px] font-extrabold leading-none tracking-[-0.04em]">Rota na loja</p>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-ink">2 paradas</span>
      </div>
      <div className={cn("rounded-[22px] bg-white p-2", cardShadow)}>
        <svg viewBox="0 0 264 226" className="w-full">
          <rect width="264" height="226" rx="16" fill="#f4f6f0" />
          {aisles.map((aisle) => (
            <g key={aisle.label}>
              <rect
                x={aisle.x}
                y={aisle.y}
                width="40"
                height="66"
                rx="9"
                fill={aisle.stop ? "var(--brand-soft)" : "#ffffff"}
                stroke={aisle.stop ? "var(--brand-deep)" : "var(--line)"}
                strokeWidth={aisle.stop ? 2 : 1.5}
              />
              <text
                x={aisle.x + 20}
                y={aisle.y + 37}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={aisle.stop ? "var(--brand-ink)" : "var(--ink-soft)"}
              >
                {aisle.label}
              </text>
            </g>
          ))}
          <path
            d="M30 208 V 101 H 132 V 57 H 137 M 187 57 V 101 H 192 V 145 H 252 V 208"
            fill="none"
            stroke="var(--brand-deep)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="route-path"
          />
          {aisles
            .filter((aisle) => aisle.stop)
            .map((aisle) => (
              <g key={`pin-${aisle.label}`}>
                <circle cx={aisle.x + 20} cy={aisle.y - 3} r="11" fill="var(--ink)" />
                <text x={aisle.x + 20} y={aisle.y + 1.5} textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--brand)">
                  {aisle.stop}
                </text>
              </g>
            ))}
          <circle cx="30" cy="208" r="12" fill="var(--brand)" opacity=".35" className="box-pulse" />
          <circle cx="30" cy="208" r="6" fill="var(--brand-deep)" stroke="#fff" strokeWidth="2.5" />
        </svg>
      </div>
      <div className={cn("flex items-center gap-3 rounded-[18px] bg-white p-3", cardShadow)}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-[13px] font-extrabold text-brand">
          1
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-extrabold">Corredor 41, à esquerda</span>
          <span className="block truncate text-[11.5px] font-medium text-ink-soft">Reparo de vedação e veda-rosca</span>
        </span>
        <CornerUpLeft className="size-5 shrink-0 text-brand-deep" />
      </div>
    </Screen>
  );
}

export const phoneScreens = [TellScreen, AskScreen, ListScreen, RouteScreen];
