/**
 * Schema indexing and graph traversal.
 * Responsible for building the lookup maps from schema.json
 * and finding ancestor paths (used by search to expand the tree).
 */
import { state } from "./state.js";

/** Build nodeById and parentIndex from schema.nodes. */
export function buildIndexes() {
  state.nodeById = new Map(state.schema.nodes.map((n) => [n.id, n]));
  state.parentIndex = new Map();

  for (const n of state.schema.nodes) {
    for (const child of n.children || []) {
      if (!state.parentIndex.has(child)) state.parentIndex.set(child, new Set());
      state.parentIndex.get(child).add(n.id);
    }
  }
}

/**
 * BFS upward from targetId to find a path from any root node.
 * Returns an array of IDs from root → target, or null if unreachable.
 */
export function findPathFromRoots(targetId) {
  const roots = new Set(state.schema.roots || []);
  if (roots.has(targetId)) return [targetId];

  const queue = [targetId];
  const prev = new Map();
  const visited = new Set([targetId]);

  while (queue.length) {
    const cur = queue.shift();
    const parents = state.parentIndex.get(cur);
    if (!parents) continue;

    for (const p of parents) {
      if (visited.has(p)) continue;
      visited.add(p);
      prev.set(p, cur);

      if (roots.has(p)) {
        const path = [p];
        let step = p;
        while (step !== targetId) {
          const child = prev.get(step);
          if (!child) break;
          path.push(child);
          step = child;
        }
        return path;
      }
      queue.push(p);
    }
  }
  return null;
}
