/**Tree rendering, expand/collapse state, and interaction */

import { state } from "./state.js";
import { escapeHtml } from "./utils.js";
import { setInspector } from "./inspector.js";

const elTreeContent = document.getElementById("treeContent");
const elToggleAllBtn = document.getElementById("toggleAllBtn");

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function sortedChildren(nodeId) {
  const n = state.nodeById.get(nodeId);
  if (!n) return [];
  return [...(n.children || [])].sort((a, b) => {
    const na = state.nodeById.get(a);
    const nb = state.nodeById.get(b);
    const ka = na?.kind === "abstract" ? 0 : 1;
    const kb = nb?.kind === "abstract" ? 0 : 1;
    if (ka !== kb) return ka - kb;
    return (na?.label || a).localeCompare(nb?.label || b);
  });
}

function flattenTree(nodeId, depth, guidesPrefix, isLast) {
  const rows = [];
  const n = state.nodeById.get(nodeId);
  if (!n) return rows;

  const guides = [...guidesPrefix];
  if (depth > 0) guides.push(isLast ? "corner" : "branch");

  const children = sortedChildren(nodeId);
  const hasChildren = children.length > 0;
  const isExpanded = state.expandedNodes.has(nodeId);

  rows.push({ id: nodeId, depth, guides, kind: n.kind || "entity", hasChildren, isExpanded });

  if (isExpanded) {
    for (let i = 0; i < children.length; i++) {
      const childIsLast = i === children.length - 1;
      const childPrefix = [...guidesPrefix];
      if (depth > 0) childPrefix.push(isLast ? "blank" : "line");
      rows.push(...flattenTree(children[i], depth + 1, childPrefix, childIsLast));
    }
  }
  return rows;
}

/* ── Exported expand/collapse helpers ────────────────────────────────────── */

export function getAllExpandableIds() {
  return state.schema.nodes.filter((n) => (n.children || []).length > 0).map((n) => n.id);
}

export function updateToggleAllBtn() {
  if (!elToggleAllBtn) return;
  const allExpanded = getAllExpandableIds().every((id) => state.expandedNodes.has(id));
  elToggleAllBtn.textContent = allExpanded ? "Collapse All" : "Expand All";
}

export function toggleTreeNode(nodeId) {
  if (state.expandedNodes.has(nodeId)) {
    state.expandedNodes.delete(nodeId);
  } else {
    state.expandedNodes.add(nodeId);
  }
  updateToggleAllBtn();
  renderTree();
}

export function initTreeExpansion() {
  state.expandedNodes.clear();
  for (const r of state.schema.roots || []) state.expandedNodes.add(r);
  updateToggleAllBtn();
}

export function expandAll() {
  for (const id of getAllExpandableIds()) state.expandedNodes.add(id);
  updateToggleAllBtn();
  renderTree();
}

export function collapseAll() {
  state.expandedNodes.clear();
  for (const r of state.schema.roots || []) state.expandedNodes.add(r);
  updateToggleAllBtn();
  renderTree();
}

/* ── Render ───────────────────────────────────────────────────────────────── */

export function renderTree() {
  if (!elTreeContent) return;
  const allRows = [];
  const roots = state.schema.roots || [];
  for (let i = 0; i < roots.length; i++) {
    allRows.push(...flattenTree(roots[i], 0, [], i === roots.length - 1));
  }

  elTreeContent.innerHTML = allRows
    .map((row) => {
      const n = state.nodeById.get(row.id);
      const label = n?.label || row.id;
      const isHighlighted = state.highlighted === row.id;
      const isSelected = state.selected === row.id;

      let barClass = "bar-light";
      if (row.depth === 0) barClass = "bar-root";
      else if (row.kind === "abstract") barClass = "bar-dark";

      const guidesHtml = row.guides
        .map((g) => `<div class="tree-guide ${g}" aria-hidden="true"></div>`)
        .join("");

      const chevron = row.hasChildren
        ? `<span class="tree-chevron ${row.isExpanded ? "open" : ""}" aria-hidden="true">\u25B6</span>`
        : "";

      const ariaExpanded = row.hasChildren ? `aria-expanded="${row.isExpanded}"` : "";

      return `<div
          class="tree-row${isHighlighted ? " highlighted" : ""}${isSelected ? " selected" : ""}"
          role="treeitem"
          ${ariaExpanded}
          tabindex="-1"
          data-node="${escapeHtml(row.id)}"
          ${row.hasChildren ? `data-toggle="${escapeHtml(row.id)}"` : ""}
          aria-label="${escapeHtml(label)}"
        >
          <div class="tree-guides" aria-hidden="true">${guidesHtml}</div>
          <div class="tree-bar ${isHighlighted ? "bar-highlight" : barClass}${isSelected && !isHighlighted ? " bar-selected" : ""}${row.hasChildren ? " clickable" : ""}">
            ${chevron}<span class="bar-label">${escapeHtml(label)}</span>
          </div>
        </div>`;
    })
    .join("");

  // Roving tabindex: exactly one treeitem is reachable via Tab at a time.
  const tabTarget =
    elTreeContent.querySelector(`[data-node="${state.selected}"]`) ||
    elTreeContent.querySelector("[role='treeitem']");
  if (tabTarget) tabTarget.setAttribute("tabindex", "0");
}

/* ── Event wiring (called once from main.js) ─────────────────────────────── */

export function initTree() {
  elTreeContent.addEventListener("click", (e) => {
    const row = e.target.closest("[data-node]");
    if (!row) return;

    const id = row.dataset.node;
    state.selected = id;
    setInspector(id);

    if (row.dataset.toggle) {
      toggleTreeNode(row.dataset.toggle);
    } else {
      renderTree();
    }

    // Re-focus after innerHTML rebuild
    requestAnimationFrame(() => {
      const el = elTreeContent.querySelector(`[data-node="${id}"]`);
      if (el) { el.setAttribute("tabindex", "0"); el.focus(); }
    });
  });

  // ── WAI-ARIA Tree keyboard pattern ────────────────────────────────────────
  elTreeContent.addEventListener("keydown", (e) => {
    const rows = [...elTreeContent.querySelectorAll("[role='treeitem']")];
    const current = document.activeElement?.closest("[role='treeitem']");
    if (!current || !elTreeContent.contains(current)) return;

    const idx = rows.indexOf(current);

    const moveFocus = (target) => {
      if (!target) return;
      current.setAttribute("tabindex", "-1");
      target.setAttribute("tabindex", "0");
      target.focus();
    };

    const refocusAfterRender = (nodeId) => {
      requestAnimationFrame(() => {
        const el = elTreeContent.querySelector(`[data-node="${nodeId}"]`);
        if (el) { el.setAttribute("tabindex", "0"); el.focus(); }
      });
    };

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveFocus(rows[idx + 1]);
        break;

      case "ArrowUp":
        e.preventDefault();
        moveFocus(rows[idx - 1]);
        break;

      case "ArrowRight": {
        e.preventDefault();
        const nodeId = current.dataset.toggle;
        if (!nodeId) break;
        if (!state.expandedNodes.has(nodeId)) {
          toggleTreeNode(nodeId);
          refocusAfterRender(nodeId);
        } else {
          moveFocus(rows[idx + 1]); // already expanded: descend
        }
        break;
      }

      case "ArrowLeft": {
        e.preventDefault();
        const nodeId = current.dataset.toggle;
        if (nodeId && state.expandedNodes.has(nodeId)) {
          toggleTreeNode(nodeId);
          refocusAfterRender(nodeId);
        } else {
          moveFocus(rows[idx - 1]); // already collapsed or leaf: ascend
        }
        break;
      }

      case "Enter":
      case " ": {
        e.preventDefault();
        const id = current.dataset.node;
        if (!id) break;
        state.selected = id;
        setInspector(id);
        if (current.dataset.toggle) {
          toggleTreeNode(current.dataset.toggle);
        } else {
          renderTree();
        }
        refocusAfterRender(id);
        break;
      }
    }
  });
}
