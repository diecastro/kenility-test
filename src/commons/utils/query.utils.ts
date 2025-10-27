import { SortOrder } from 'mongoose';

export function buildSort(
  sort?: string,
): Record<string, SortOrder> | undefined {
  if (!sort) return undefined;
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  return { [field]: desc ? -1 : 1 } as Record<string, SortOrder>;
}

export function buildFilters(params: {
  name?: string;
  sku?: string;
  q?: string;
}) {
  const filter: Record<string, any> = {};

  if (params.name) {
    filter.name = { $regex: `^${escapeRegex(params.name)}$`, $options: 'i' };
  }

  if (params.sku) filter.sku = params.sku;

  if (params.q) {
    filter.$or = [
      { name: { $regex: params.q, $options: 'i' } },
      { sku: { $regex: params.q, $options: 'i' } },
    ];
  }

  return filter;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
