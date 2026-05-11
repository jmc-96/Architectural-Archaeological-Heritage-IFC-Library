/**
 * This file has been refactored into ES modules.
 * Entry point: main.js
 * Modules:     modules/state.js, modules/schema.js, modules/inspector.js,
 *              modules/tree.js, modules/search.js, modules/utils.js
 *
 * index.html now loads main.js via <script type="module">.
 * This file is no longer referenced and is kept only for git history.
 */

const elInspector = document.getElementById("inspectorContent");
const elSchemaInfo = document.getElementById("schemaInfo");
const elSearch = document.getElementById("search");
const elReset = document.getElementById("resetBtn");
const elTreeContent = document.getElementById("treeContent");
const elTreeView = document.getElementById("treeView");
const elToggleAllBtn = document.getElementById("toggleAllBtn");

let schema = null;
let nodeById = new Map();
let parentIndex = new Map(); // childId -> Set(parentIds)

/** Set of node IDs that are currently expanded in the tree */
let expandedNodes = new Set();
/** Currently highlighted node in tree (from search) */
let highlightedTreeNode = null;
/** Currently selected node (for inspector) */
let selectedTreeNode = null;

/* ───── Indexing ───── */

function buildIndexes() {
  nodeById = new Map(schema.nodes.map(n => [n.id, n]));
  parentIndex = new Map();

  for (const n of schema.nodes) {
    for (const child of (n.children || [])) {
      if (!parentIndex.has(child)) parentIndex.set(child, new Set());
      parentIndex.get(child).add(n.id);
    }
  }
}

/* ───── Inspector (metadata sidebar) ───── */

function nodeKindChip(kind) {
  const k = kind || "entity";
  return `<span class="kchip">${k}</span>`;
}

function setInspector(nodeId) {
  if (!nodeId) {
    elInspector.innerHTML = `<div class="muted">Click a class to see metadata.</div>`;
    return;
  }
  const n = nodeById.get(nodeId);
  if (!n) return;

  const children = (n.children || []).length;

  // Parent info
  const parents = parentIndex.get(nodeId);
  const parentLabel = parents && parents.size
    ? [...parents].map(p => escapeHtml(nodeById.get(p)?.label || p)).join(", ")
    : "—";

  const desc = n.description ? `<div style="margin-top:8px">${escapeHtml(n.description)}</div>` : "";
  const link = n.url
    ? `<div style="margin-top:8px"><a href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer" class="doc-link">📖 View official buildingSMART documentation ↗</a></div>`
    : "";
  const raw = `<div class="pre">${escapeHtml(JSON.stringify(n, null, 2))}</div>`;

  elInspector.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
      <div style="font-size:14px; font-weight:700;">${escapeHtml(n.label || n.id)}</div>
      ${nodeKindChip(n.kind)}
      <div class="badge">${children} child${children === 1 ? "" : "ren"}</div>
    </div>
    <div style="margin-top:6px; font-size:12px;" class="muted">Parent: ${parentLabel}</div>
    ${desc}
    ${link}
    ${raw}
  `;
}

function renderSchemaInfo() {
  const m = schema.meta || {};
  elSchemaInfo.innerHTML = `
    <div><b>Name:</b> ${escapeHtml(m.name || "-")}</div>
    <div><b>Schema:</b> ${escapeHtml(m.schema || "-")}</div>
    <div><b>Version:</b> ${escapeHtml(m.version || "-")}</div>
  `;
}

/* ───── Path finding (for search) ───── */

function findPathFromRoots(targetId) {
  const roots = new Set(schema.roots || []);
  if (roots.has(targetId)) return [targetId];

  const queue = [targetId];
  const prev = new Map();
  const visited = new Set([targetId]);

  while (queue.length) {
    const cur = queue.shift();
    const parents = parentIndex.get(cur);
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

/* ───── Hierarchy Tree ───── */

/** Sort children: abstract first, then alphabetically */
function sortedChildren(nodeId) {
  const n = nodeById.get(nodeId);
  if (!n) return [];
  const children = n.children || [];
  return [...children].sort((a, b) => {
    const na = nodeById.get(a); const nb = nodeById.get(b);
    const ka = (na?.kind === "abstract") ? 0 : 1;
    const kb = (nb?.kind === "abstract") ? 0 : 1;
    if (ka !== kb) return ka - kb;
    return (na?.label || a).localeCompare(nb?.label || b);
  });
}

/**
 * Recursively flatten the tree into a list of rows with depth & guide info,
 * but only include children of expanded nodes.
 */
function flattenTree(nodeId, depth, guidesPrefix, isLast) {
  const rows = [];
  const n = nodeById.get(nodeId);
  if (!n) return rows;

  const guides = [...guidesPrefix];
  if (depth > 0) {
    guides.push(isLast ? "corner" : "branch");
  }

  const children = sortedChildren(nodeId);
  const hasChildren = children.length > 0;
  const isExpanded = expandedNodes.has(nodeId);

  rows.push({ id: nodeId, depth, guides, kind: n.kind || "entity", hasChildren, isExpanded });

  if (isExpanded) {
    for (let i = 0; i < children.length; i++) {
      const childIsLast = (i === children.length - 1);
      const childPrefix = [...guidesPrefix];
      if (depth > 0) {
        childPrefix.push(isLast ? "blank" : "line");
      }
      rows.push(...flattenTree(children[i], depth + 1, childPrefix, childIsLast));
    }
  }

  return rows;
}

function toggleTreeNode(nodeId) {
  if (expandedNodes.has(nodeId)) {
    expandedNodes.delete(nodeId);
  } else {
    expandedNodes.add(nodeId);
  }
  updateToggleAllBtn();
  renderTree();
}

function initTreeExpansion() {
  expandedNodes.clear();
  for (const r of (schema.roots || [])) {
    expandedNodes.add(r);
  }
  updateToggleAllBtn();
}

function getAllExpandableIds() {
  const ids = [];
  for (const n of schema.nodes) {
    if ((n.children || []).length > 0) ids.push(n.id);
  }
  return ids;
}

function expandAll() {
  for (const id of getAllExpandableIds()) expandedNodes.add(id);
  updateToggleAllBtn();
  renderTree();
}

function collapseAll() {
  expandedNodes.clear();
  for (const r of (schema.roots || [])) expandedNodes.add(r);
  updateToggleAllBtn();
  renderTree();
}

function updateToggleAllBtn() {
  if (!elToggleAllBtn) return;
  const allExpandable = getAllExpandableIds();
  const allExpanded = allExpandable.every(id => expandedNodes.has(id));
  elToggleAllBtn.textContent = allExpanded ? "Collapse All" : "Expand All";
}

function renderTree() {
  if (!elTreeContent) return;
  const roots = schema.roots || [];
  let allRows = [];

  for (let i = 0; i < roots.length; i++) {
    allRows.push(...flattenTree(roots[i], 0, [], i === roots.length - 1));
  }

  elTreeContent.innerHTML = allRows.map(row => {
    const n = nodeById.get(row.id);
    const label = n?.label || row.id;
    const isRoot = row.depth === 0;
    const isAbstract = row.kind === "abstract";

    let barClass = "bar-light";
    if (isRoot) barClass = "bar-root";
    else if (isAbstract) barClass = "bar-dark";

    const guidesHtml = row.guides.map(g =>
      `<div class="tree-guide ${g}"></div>`
    ).join("");

    let chevron = "";
    if (row.hasChildren) {
      chevron = `<span class="tree-chevron ${row.isExpanded ? "open" : ""}">\u25B6</span>`;
    }

    const isHighlighted = (highlightedTreeNode === row.id);
    const isSelected = (selectedTreeNode === row.id);

    return `
      <div class="tree-row${isHighlighted ? ' highlighted' : ''}${isSelected ? ' selected' : ''}" data-node="${row.id}" ${row.hasChildren ? `data-toggle="${row.id}"` : ""}>
        <div class="tree-guides">${guidesHtml}</div>
        <div class="tree-bar ${isHighlighted ? 'bar-highlight' : barClass}${isSelected && !isHighlighted ? ' bar-selected' : ''}${row.hasChildren ? ' clickable' : ''}">
          ${chevron}<span class="bar-label">${escapeHtml(label)}</span>
        </div>
      </div>
    `;
  }).join("");

  elTreeContent.querySelectorAll(".tree-row").forEach(row => {
    row.addEventListener("click", () => {
      if (row.dataset.node) {
        selectedTreeNode = row.dataset.node;
        setInspector(row.dataset.node);
      }
      if (row.dataset.toggle) {
        toggleTreeNode(row.dataset.toggle);
      } else {
        // Re-render to update selected styling for leaf nodes
        renderTree();
      }
    });
  });
}

/* ───── Search ───── */

function setupSearch() {
  elSearch.addEventListener("input", () => {
    const q = (elSearch.value || "").trim();
    if (q.length === 0) {
      highlightedTreeNode = null;
      renderTree();
      return;
    }

    const exact = nodeById.get(q);
    let hit = exact ? exact.id : null;

    if (!hit) {
      const lower = q.toLowerCase();
      const ids = [...nodeById.keys()];
      hit = ids.find(id => id.toLowerCase() === lower)
        || ids.find(id => id.toLowerCase().startsWith(lower))
        || ids.find(id => (nodeById.get(id)?.label || id).toLowerCase().includes(lower))
        || null;
    }

    if (!hit) return;

    // Expand all ancestors so the hit node is visible
    const path = findPathFromRoots(hit);
    if (path) {
      for (const id of path) expandedNodes.add(id);
    }
    highlightedTreeNode = hit;
    selectedTreeNode = hit;
    setInspector(hit);
    updateToggleAllBtn();
    renderTree();

    requestAnimationFrame(() => {
      const el = elTreeContent.querySelector(".tree-row.highlighted");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  elReset.addEventListener("click", () => {
    elSearch.value = "";
    highlightedTreeNode = null;
    selectedTreeNode = null;
    setInspector(null);
    initTreeExpansion();
    renderTree();
  });
}

/* ───── Utility ───── */

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ───── Bootstrap ───── */

async function main() {
  const res = await fetch("schema.json", { cache: "no-store" });
  schema = await res.json();

  buildIndexes();
  renderSchemaInfo();
  setupSearch();

  // Tree is always active — apply tree-mode theme
  document.body.classList.add("tree-mode");

  // Expand/Collapse All button
  if (elToggleAllBtn) {
    elToggleAllBtn.addEventListener("click", () => {
      const allExpandable = getAllExpandableIds();
      const allExpanded = allExpandable.every(id => expandedNodes.has(id));
      if (allExpanded) collapseAll(); else expandAll();
    });
  }

  initTreeExpansion();
  renderTree();
}

main().catch(err => {
  console.error(err);
  const el = document.getElementById("treeContent");
  if (el) el.innerHTML = `<div style="padding:12px" class="muted">Failed to load schema.json. Make sure you run a local server (not file://).</div>`;
});
