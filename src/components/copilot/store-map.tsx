import {
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  CHECKOUT,
  ENTRANCE,
  MAP_HEIGHT,
  MAP_WIDTH,
  aisleBlocks,
  routePath,
  stopPoint,
} from "@/lib/store/layout";
import { departmentNames } from "@/lib/store/catalog";

type StoreMapProps = {
  stops: number[];
  doneStops: number[];
};

export function StoreMap({ stops, doneStops }: StoreMapProps) {
  const path = routePath(stops)
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="w-full"
      role="img"
      aria-label={`Mapa da loja com ${stops.length} paradas: corredores ${stops.join(", ")}`}
    >
      <rect width={MAP_WIDTH} height={MAP_HEIGHT} rx="20" fill="#f4f6f0" />
      {aisleBlocks.map((block) => {
        const stopIndex = stops.indexOf(block.aisle);
        const isStop = stopIndex >= 0;
        const isDone = doneStops.includes(block.aisle);
        return (
          <g key={block.aisle}>
            <rect
              x={block.x}
              y={block.y}
              width={BLOCK_WIDTH}
              height={BLOCK_HEIGHT}
              rx="10"
              fill={isStop ? (isDone ? "#ffffff" : "var(--brand-soft)") : "#ffffff"}
              stroke={isStop ? "var(--brand-deep)" : "var(--line)"}
              strokeWidth={isStop ? 2 : 1.5}
              strokeDasharray={isDone ? "4 4" : undefined}
            />
            <text
              x={block.x + BLOCK_WIDTH / 2}
              y={block.y + 42}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={isStop ? "var(--brand-ink)" : "var(--ink-soft)"}
            >
              {block.aisle}
            </text>
            <text
              x={block.x + BLOCK_WIDTH / 2}
              y={block.y + 60}
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="600"
              fill="var(--ink-soft)"
            >
              {departmentNames[block.department].split(" ")[0]}
            </text>
          </g>
        );
      })}

      <path
        d={path}
        fill="none"
        stroke="var(--brand-deep)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="route-path"
      />

      {stops.map((aisle, index) => {
        const point = stopPoint(aisle);
        if (!point) return null;
        const isDone = doneStops.includes(aisle);
        return (
          <g key={aisle}>
            <circle cx={point.x} cy={point.y} r="12" fill={isDone ? "var(--brand)" : "var(--ink)"} />
            <text
              x={point.x}
              y={point.y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={isDone ? "var(--ink)" : "var(--brand)"}
            >
              {index + 1}
            </text>
          </g>
        );
      })}

      <g>
        <circle cx={ENTRANCE.x} cy={ENTRANCE.y} r="13" fill="var(--brand)" opacity=".35" className="box-pulse" />
        <circle cx={ENTRANCE.x} cy={ENTRANCE.y} r="6.5" fill="var(--brand-deep)" stroke="#fff" strokeWidth="2.5" />
        <text x={ENTRANCE.x + 14} y={ENTRANCE.y + 4} fontSize="10" fontWeight="800" fill="var(--ink)">
          Você está aqui
        </text>
      </g>
      <g>
        <rect x={CHECKOUT.x - 26} y={CHECKOUT.y - 10} width="52" height="20" rx="10" fill="var(--ink)" />
        <text x={CHECKOUT.x} y={CHECKOUT.y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">
          CAIXA
        </text>
      </g>
    </svg>
  );
}
