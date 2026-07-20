"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Children, isValidElement } from "react";
import type { ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { treeView } from "../../styled-system/recipes";

export type TreeViewSelectionMode = "none" | "single" | "multiple";
export type TreeViewSelection = string | readonly string[] | null;

interface TreeNodeRecord {
  id: string;
  parentId: string | undefined;
  disabled: boolean;
  selectable: boolean;
  order: number;
  element: HTMLDivElement | null;
}

interface TreeViewContextValue {
  disabled: boolean;
  loopFocus: boolean;
  selectionMode: TreeViewSelectionMode;
  expanded: ReadonlySet<string>;
  selected: ReadonlySet<string>;
  nodes: readonly TreeNodeRecord[];
  registerNode: (node: TreeNodeRecord) => () => void;
  setNodeElement: (id: string, element: HTMLDivElement | null) => void;
  isVisible: (id: string) => boolean;
  hasChildren: (id: string) => boolean;
  getDepth: (id: string) => number;
  getSiblings: (id: string) => readonly TreeNodeRecord[];
  toggleExpanded: (id: string) => void;
  selectNode: (id: string) => void;
  focusNode: (id: string) => void;
  handleKeyDown: (id: string, event: KeyboardEvent<HTMLDivElement>) => void;
  activeId: string | null;
  setActiveId: (id: string) => void;
}

const TreeViewContext = createContext<TreeViewContextValue | null>(null);
const TreeParentContext = createContext<string | undefined>(undefined);
const TreeItemContext = createContext<string | null>(null);

function useTreeViewContext() {
  const context = useContext(TreeViewContext);
  if (!context) throw new Error("TreeView parts must be rendered inside TreeView.Root.");
  return context;
}

function asSet(value: string | readonly string[] | null | undefined, mode: TreeViewSelectionMode) {
  if (mode === "multiple") return new Set(Array.isArray(value) ? value : value ? [value] : []);
  return new Set(typeof value === "string" ? [value] : []);
}

export interface TreeViewRootProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  expanded?: readonly string[];
  defaultExpanded?: readonly string[];
  onExpandedChange?: (expanded: string[]) => void;
  selected?: TreeViewSelection;
  defaultSelected?: TreeViewSelection;
  onSelectedChange?: (selected: TreeViewSelection) => void;
  selectionMode?: TreeViewSelectionMode;
  loopFocus?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export const TreeViewRoot = forwardRef<HTMLDivElement, TreeViewRootProps>(function TreeViewRoot(
  {
    children,
    className,
    defaultExpanded = [],
    defaultSelected = null,
    disabled = false,
    expanded: controlledExpanded,
    loopFocus = true,
    onExpandedChange,
    onSelectedChange,
    selected: controlledSelected,
    selectionMode = "single",
    ...props
  },
  ref,
) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(() => new Set(defaultExpanded));
  const [uncontrolledSelected, setUncontrolledSelected] = useState(() =>
    asSet(defaultSelected, selectionMode),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, setVersion] = useState(0);
  const nodesRef = useRef(new Map<string, TreeNodeRecord>());
  const orderRef = useRef(0);
  const styles = treeView();
  const expanded = useMemo(
    () => new Set(controlledExpanded ?? uncontrolledExpanded),
    [controlledExpanded, uncontrolledExpanded],
  );
  const selected = useMemo(
    () =>
      controlledSelected === undefined
        ? uncontrolledSelected
        : asSet(controlledSelected, selectionMode),
    [controlledSelected, selectionMode, uncontrolledSelected],
  );
  const nodes = Array.from(nodesRef.current.values()).sort((a, b) => a.order - b.order);

  const registerNode = useCallback((node: TreeNodeRecord) => {
    const registeredNode = { ...node, order: orderRef.current++ };
    nodesRef.current.set(node.id, registeredNode);
    setVersion((current) => current + 1);
    return () => {
      if (nodesRef.current.get(node.id) === registeredNode) nodesRef.current.delete(node.id);
      setVersion((current) => current + 1);
    };
  }, []);

  const setNodeElement = useCallback((id: string, element: HTMLDivElement | null) => {
    const node = nodesRef.current.get(id);
    if (node) node.element = element;
  }, []);

  const hasChildren = useCallback(
    (id: string) => nodes.some((node) => node.parentId === id),
    [nodes],
  );
  const isVisible = useCallback(
    (id: string) => {
      let current = nodes.find((node) => node.id === id);
      while (current?.parentId) {
        if (!expanded.has(current.parentId)) return false;
        current = nodes.find((node) => node.id === current?.parentId);
      }
      return true;
    },
    [expanded, nodes],
  );
  const getDepth = useCallback(
    (id: string) => {
      let depth = 1;
      let current = nodes.find((node) => node.id === id);
      while (current?.parentId) {
        depth += 1;
        current = nodes.find((node) => node.id === current?.parentId);
      }
      return depth;
    },
    [nodes],
  );
  const getSiblings = useCallback(
    (id: string) => {
      const node = nodes.find((candidate) => candidate.id === id);
      return nodes.filter((candidate) => candidate.parentId === node?.parentId);
    },
    [nodes],
  );

  const toggleExpanded = useCallback(
    (id: string) => {
      if (disabled || !hasChildren(id)) return;
      const next = new Set(expanded);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (controlledExpanded === undefined) setUncontrolledExpanded(next);
      onExpandedChange?.(Array.from(next));
    },
    [controlledExpanded, disabled, expanded, hasChildren, onExpandedChange],
  );

  const selectNode = useCallback(
    (id: string) => {
      const node = nodes.find((candidate) => candidate.id === id);
      if (disabled || !node || node.disabled || !node.selectable || selectionMode === "none")
        return;
      const next = new Set(selected);
      if (selectionMode === "single") {
        next.clear();
        next.add(id);
      } else if (next.has(id)) next.delete(id);
      else next.add(id);
      if (controlledSelected === undefined) setUncontrolledSelected(next);
      onSelectedChange?.(
        selectionMode === "multiple" ? Array.from(next) : (next.values().next().value ?? null),
      );
    },
    [controlledSelected, disabled, nodes, onSelectedChange, selected, selectionMode],
  );

  const visibleNodes = nodes.filter((node) => isVisible(node.id));
  const focusNode = useCallback(
    (id: string) => {
      const node = nodes.find((candidate) => candidate.id === id);
      if (!node || node.disabled || !isVisible(id)) return;
      setActiveId(id);
      node.element?.focus();
    },
    [isVisible, nodes],
  );

  const handleKeyDown = useCallback(
    (id: string, event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const index = visibleNodes.findIndex((node) => node.id === id);
      const node = nodes.find((candidate) => candidate.id === id);
      if (!node) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        let nextIndex = index + direction;
        if (loopFocus) nextIndex = (nextIndex + visibleNodes.length) % visibleNodes.length;
        const nextNode = visibleNodes[nextIndex];
        if (nextIndex >= 0 && nextIndex < visibleNodes.length && nextNode) focusNode(nextNode.id);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        focusNode((event.key === "Home" ? visibleNodes[0] : visibleNodes.at(-1))?.id ?? id);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (hasChildren(id) && !expanded.has(id)) toggleExpanded(id);
        else if (hasChildren(id))
          focusNode(nodes.find((candidate) => candidate.parentId === id)?.id ?? id);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (hasChildren(id) && expanded.has(id)) toggleExpanded(id);
        else if (node.parentId) focusNode(node.parentId);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectNode(id);
      }
    },
    [
      disabled,
      expanded,
      focusNode,
      hasChildren,
      loopFocus,
      nodes,
      selectNode,
      toggleExpanded,
      visibleNodes,
    ],
  );

  const context = useMemo<TreeViewContextValue>(
    () => ({
      disabled,
      loopFocus,
      selectionMode,
      expanded,
      selected,
      nodes,
      registerNode,
      setNodeElement,
      isVisible,
      hasChildren,
      getDepth,
      getSiblings,
      toggleExpanded,
      selectNode,
      focusNode,
      handleKeyDown,
      activeId,
      setActiveId,
    }),
    [
      activeId,
      disabled,
      expanded,
      focusNode,
      getDepth,
      getSiblings,
      handleKeyDown,
      hasChildren,
      isVisible,
      loopFocus,
      nodes,
      registerNode,
      selectNode,
      selected,
      selectionMode,
      setNodeElement,
      toggleExpanded,
    ],
  );

  return (
    <TreeViewContext.Provider value={context}>
      <div
        {...props}
        ref={ref}
        aria-multiselectable={selectionMode === "multiple" || undefined}
        className={cx(styles.root, className)}
        data-disabled={disabled || undefined}
        data-jaci-component="tree-view"
        data-slot="tree-view"
        role="tree"
      >
        {children}
      </div>
    </TreeViewContext.Provider>
  );
});

export interface TreeViewItemProps extends Omit<ComponentPropsWithoutRef<"div">, "id"> {
  id: string;
  disabled?: boolean;
  selectable?: boolean;
}

export const TreeViewItem = forwardRef<HTMLDivElement, TreeViewItemProps>(function TreeViewItem(
  {
    children,
    className,
    disabled = false,
    onClick,
    onFocus,
    onKeyDown,
    style,
    selectable = true,
    id,
    ...props
  },
  ref,
) {
  const context = useTreeViewContext();
  const parentId = useContext(TreeParentContext);
  const styles = treeView();
  useEffect(
    () => context.registerNode({ id, parentId, disabled, selectable, order: 0, element: null }),
    [context.registerNode, disabled, id, parentId, selectable],
  );
  const siblings = context.getSiblings(id);
  const registeredNode = context.nodes.find((candidate) => candidate.id === id);
  const selected = context.selected.has(id);
  const visible = context.isVisible(id);
  const siblingIndex = siblings.findIndex((candidate) => candidate.id === id);
  const tabIndex =
    context.activeId === id || (context.activeId === null && context.nodes[0]?.id === id) ? 0 : -1;
  const childNodes = Children.toArray(children);
  const groupNodes = childNodes.filter(
    (child) => isValidElement(child) && child.type === TreeViewGroup,
  );
  const rowNodes = childNodes.filter(
    (child) => !(isValidElement(child) && child.type === TreeViewGroup),
  );

  return (
    <TreeParentContext.Provider value={id}>
      <TreeItemContext.Provider value={id}>
        <div
          {...props}
          ref={(element) => {
            context.setNodeElement(id, element);
            if (typeof ref === "function") ref(element);
            else if (ref) ref.current = element;
          }}
          aria-disabled={disabled || undefined}
          aria-expanded={context.hasChildren(id) ? context.expanded.has(id) : undefined}
          aria-level={registeredNode ? context.getDepth(id) : parentId ? 2 : 1}
          aria-posinset={siblingIndex >= 0 ? siblingIndex + 1 : 1}
          aria-setsize={siblings.length || 1}
          aria-selected={context.selectionMode === "none" ? undefined : selected}
          className={styles.itemWrapper}
          data-disabled={disabled || undefined}
          data-expanded={context.expanded.has(id) || undefined}
          data-jaci-component="tree-view"
          data-selected={selected || undefined}
          data-slot="tree-view-item"
          onClick={(event) => {
            event.stopPropagation();
            onClick?.(event);
            if (!event.defaultPrevented) context.selectNode(id);
          }}
          onFocus={(event) => {
            context.setActiveId(id);
            onFocus?.(event);
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
            context.handleKeyDown(id, event);
            onKeyDown?.(event);
          }}
          role="treeitem"
          tabIndex={visible ? tabIndex : -1}
        >
          <div
            className={cx(styles.item, className)}
            data-disabled={disabled || undefined}
            data-expanded={context.expanded.has(id) || undefined}
            data-selected={selected || undefined}
            data-slot="tree-view-item-row"
            style={style}
          >
            {rowNodes}
          </div>
          {groupNodes}
        </div>
      </TreeItemContext.Provider>
    </TreeParentContext.Provider>
  );
});

export type TreeViewGroupProps = ComponentPropsWithoutRef<"div">;
export const TreeViewGroup = forwardRef<HTMLDivElement, TreeViewGroupProps>(function TreeViewGroup(
  { children, className, style, ...props },
  ref,
) {
  const context = useTreeViewContext();
  const parentId = useContext(TreeParentContext);
  const styles = treeView();
  const visible = parentId ? context.expanded.has(parentId) : true;
  return (
    // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA tree groups require role="group".
    <div
      {...props}
      ref={ref}
      aria-hidden={!visible || undefined}
      className={cx(styles.group, className)}
      data-jaci-component="tree-view"
      data-expanded={visible || undefined}
      data-slot="tree-view-group"
      hidden={!visible}
      role="group"
      style={{ ...style, display: visible ? style?.display : "none" }}
    >
      {children}
    </div>
  );
});

export type TreeViewToggleProps = ComponentPropsWithoutRef<"button">;
export const TreeViewToggle = forwardRef<HTMLButtonElement, TreeViewToggleProps>(
  function TreeViewToggle({ children, className, onClick, ...props }, ref) {
    const context = useTreeViewContext();
    const itemId = useContext(TreeItemContext);
    const id = itemId;
    return (
      <button
        {...props}
        ref={ref}
        aria-expanded={id ? context.expanded.has(id) : undefined}
        className={cx(treeView().toggle, className)}
        data-slot="tree-view-toggle"
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
          if (!event.defaultPrevented && id) context.toggleExpanded(id);
        }}
        tabIndex={-1}
        type="button"
      >
        {children ?? (id && context.expanded.has(id) ? "▾" : "▸")}
      </button>
    );
  },
);

export type TreeViewLabelProps = ComponentPropsWithoutRef<"span">;
export const TreeViewLabel = forwardRef<HTMLSpanElement, TreeViewLabelProps>(function TreeViewLabel(
  { className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx(treeView().label, className)}
      data-slot="tree-view-label"
    />
  );
});

export const TreeView = {
  Root: TreeViewRoot,
  Item: TreeViewItem,
  Group: TreeViewGroup,
  Toggle: TreeViewToggle,
  Label: TreeViewLabel,
};
