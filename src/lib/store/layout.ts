import { departmentNames, type Department } from "@/lib/store/catalog";

export type Point = { x: number; y: number };

export type AisleBlock = {
  aisle: number;
  department: Department;
  x: number;
  y: number;
};

export const MAP_WIDTH = 340;
export const MAP_HEIGHT = 470;
export const BLOCK_WIDTH = 62;
export const BLOCK_HEIGHT = 96;

const COLUMNS = [24, 104, 184, 264];
const ROWS = [30, 170, 310];
const CORRIDOR_GAP = 22;

const blockPlan: [number, Department][] = [
  [12, "fixacao"],
  [14, "fixacao"],
  [33, "eletrica"],
  [37, "iluminacao"],
  [41, "hidraulica"],
  [47, "torneiras"],
  [52, "revestimento"],
  [61, "ferramentas"],
  [63, "pintura"],
  [65, "acessorios-pintura"],
  [71, "ferramentas-eletricas"],
];

export const aisleBlocks: AisleBlock[] = blockPlan.map(([aisle, department], index) => ({
  aisle,
  department,
  x: COLUMNS[index % COLUMNS.length],
  y: ROWS[Math.floor(index / COLUMNS.length)],
}));

export const ENTRANCE: Point = { x: COLUMNS[0] - 12, y: MAP_HEIGHT - 16 };
export const CHECKOUT: Point = { x: MAP_WIDTH - 34, y: MAP_HEIGHT - 16 };

const verticalCorridors = [COLUMNS[0] - 12, ...COLUMNS.map((x) => x + BLOCK_WIDTH + 9)];
const MAX_EXACT_STOPS = 7;

const blockFor = (aisle: number) => aisleBlocks.find((block) => block.aisle === aisle);

export const aisleLabel = (aisle: number) => {
  const block = blockFor(aisle);
  return block ? departmentNames[block.department] : "";
};

const accessPoint = (block: AisleBlock): Point => ({
  x: block.x + BLOCK_WIDTH / 2,
  y: block.y + BLOCK_HEIGHT + CORRIDOR_GAP,
});

const nearestCorridor = (target: number) =>
  verticalCorridors.reduce((best, x) => (Math.abs(x - target) < Math.abs(best - target) ? x : best));

const walk = (from: Point, to: Point, corridor: number): Point[] => {
  if (Math.abs(from.y - to.y) < 1) return [to];
  return [
    { x: corridor, y: from.y },
    { x: corridor, y: to.y },
    to,
  ];
};

const buildPath = (stops: Point[]) => {
  const points: Point[] = [ENTRANCE];
  let position = ENTRANCE;
  stops.forEach((stop, index) => {
    const corridor = index === 0 ? nearestCorridor(ENTRANCE.x) : nearestCorridor((position.x + stop.x) / 2);
    points.push(...walk(position, stop, corridor));
    position = stop;
  });
  points.push(...walk(position, CHECKOUT, nearestCorridor(MAP_WIDTH)));
  return points;
};

const pathLength = (points: Point[]) =>
  points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    return total + Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y);
  }, 0);

const permutations = <T,>(items: T[]): T[][] =>
  items.length <= 1
    ? [items]
    : items.flatMap((item, index) =>
        permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest]),
      );

const nearestNeighborOrder = (blocks: AisleBlock[]) => {
  const remaining = [...blocks];
  const ordered: AisleBlock[] = [];
  let position = ENTRANCE;
  while (remaining.length) {
    remaining.sort(
      (a, b) => pathLength([position, accessPoint(a)]) - pathLength([position, accessPoint(b)]),
    );
    const next = remaining.shift();
    if (!next) break;
    ordered.push(next);
    position = accessPoint(next);
  }
  return ordered;
};

export const orderStops = (aisles: number[]) => {
  const blocks = [...new Set(aisles)].map(blockFor).filter((block): block is AisleBlock => Boolean(block));
  if (blocks.length > MAX_EXACT_STOPS) return nearestNeighborOrder(blocks).map((block) => block.aisle);
  const best = permutations(blocks).reduce(
    (winner, order) => {
      const length = pathLength(buildPath(order.map(accessPoint)));
      return length < winner.length ? { order, length } : winner;
    },
    { order: blocks, length: Number.POSITIVE_INFINITY },
  );
  return best.order.map((block) => block.aisle);
};

export const routePath = (orderedAisles: number[]) =>
  buildPath(
    orderedAisles
      .map(blockFor)
      .filter((block): block is AisleBlock => Boolean(block))
      .map(accessPoint),
  );

export const stopPoint = (aisle: number) => {
  const block = blockFor(aisle);
  return block ? accessPoint(block) : null;
};
