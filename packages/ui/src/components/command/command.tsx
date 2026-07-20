"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from "react";

import { command } from "../../styled-system/recipes";
import { cx } from "../../styled-system/css";

export type CommandFilter = (value: string, search: string, keywords: readonly string[]) => boolean;

interface CommandItemRecord {
  id: string;
  value: string;
  keywords: readonly string[];
  disabled: boolean;
  groupId: string | undefined;
  onSelect: ((value: string) => void) | undefined;
  element: HTMLDivElement | null;
}

interface CommandContextValue {
  search: string;
  setSearch: (search: string) => void;
  loading: boolean;
  shouldFilter: boolean;
  items: readonly CommandItemRecord[];
  highlighted: string | null;
  listId: string;
  matches: (item: Pick<CommandItemRecord, "value" | "keywords">) => boolean;
  registerItem: (item: CommandItemRecord) => () => void;
  setItemElement: (id: string, element: HTMLDivElement | null) => void;
  setHighlighted: (value: string | null) => void;
  selectItem: (value: string) => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);
const CommandGroupContext = createContext<string | undefined>(undefined);
const EMPTY_KEYWORDS: readonly string[] = [];

function useCommandContext() {
  const context = useContext(CommandContext);
  if (!context) throw new Error("Command parts must be rendered inside Command.Root.");
  return context;
}

function defaultFilter(value: string, search: string, keywords: readonly string[]) {
  const query = search.trim().toLocaleLowerCase();
  if (!query) return true;
  return [value, ...keywords].some((candidate) => candidate.toLocaleLowerCase().includes(query));
}

export interface CommandRootProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  filter?: CommandFilter;
  shouldFilter?: boolean;
  loopFocus?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export const CommandRoot = forwardRef<HTMLDivElement, CommandRootProps>(function CommandRoot(
  {
    children,
    className,
    defaultSearch = "",
    filter = defaultFilter,
    loading = false,
    onKeyDown,
    onSearchChange,
    search: controlledSearch,
    shouldFilter = true,
    loopFocus = true,
    ...props
  },
  ref,
) {
  const [uncontrolledSearch, setUncontrolledSearch] = useState(defaultSearch);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [, setVersion] = useState(0);
  const itemsRef = useRef(new Map<string, CommandItemRecord>());
  const listId = useId();
  const search = controlledSearch ?? uncontrolledSearch;
  const styles = command();

  const items = Array.from(itemsRef.current.values());
  const setSearch = useCallback(
    (next: string) => {
      if (controlledSearch === undefined) setUncontrolledSearch(next);
      onSearchChange?.(next);
    },
    [controlledSearch, onSearchChange],
  );
  const matches = useCallback(
    (item: Pick<CommandItemRecord, "value" | "keywords">) =>
      !shouldFilter || filter(item.value, search, item.keywords),
    [filter, search, shouldFilter],
  );
  const visibleItems = items.filter((item) => !item.disabled && matches(item));

  const registerItem = useCallback((item: CommandItemRecord) => {
    itemsRef.current.set(item.id, item);
    setVersion((current) => current + 1);
    return () => {
      itemsRef.current.delete(item.id);
      setVersion((current) => current + 1);
    };
  }, []);

  const setItemElement = useCallback((id: string, element: HTMLDivElement | null) => {
    const item = itemsRef.current.get(id);
    if (item) item.element = element;
  }, []);

  const selectItem = useCallback(
    (value: string) => {
      const item = itemsRef.current.get(value);
      if (item && !item.disabled && matches(item)) item.onSelect?.(item.value);
    },
    [matches],
  );

  useEffect(() => {
    if (!visibleItems.some((item) => item.value === highlighted)) {
      setHighlighted(visibleItems[0]?.value ?? null);
    }
  }, [highlighted, visibleItems]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const currentIndex = visibleItems.findIndex((item) => item.value === highlighted);
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && visibleItems.length > 0) {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      let nextIndex = currentIndex + direction;
      if (loopFocus) nextIndex = (nextIndex + visibleItems.length) % visibleItems.length;
      if (nextIndex >= 0 && nextIndex < visibleItems.length) {
        setHighlighted(visibleItems[nextIndex]?.value ?? null);
      }
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setHighlighted((event.key === "Home" ? visibleItems[0] : visibleItems.at(-1))?.value ?? null);
    } else if (event.key === "Enter" && highlighted) {
      event.preventDefault();
      selectItem(highlighted);
    } else if (event.key === "Escape") {
      event.preventDefault();
    }
  };

  const context = useMemo<CommandContextValue>(
    () => ({
      search,
      setSearch,
      loading,
      shouldFilter,
      items,
      highlighted,
      listId,
      matches,
      registerItem,
      setItemElement,
      setHighlighted,
      selectItem,
    }),
    [
      highlighted,
      items,
      listId,
      loading,
      matches,
      registerItem,
      search,
      selectItem,
      setItemElement,
      setSearch,
      shouldFilter,
    ],
  );

  return (
    <CommandContext.Provider value={context}>
      <div
        {...props}
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cx(styles.root, className)}
        data-disabled={props["aria-disabled"] || undefined}
        data-jaci-component="command"
        data-slot="command"
        onKeyDown={handleKeyDown}
        role="application"
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
});

export type CommandInputProps = ComponentPropsWithoutRef<"input">;
export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { className, onChange, ...props },
  ref,
) {
  const { highlighted, listId, search, setHighlighted, setSearch } = useCommandContext();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    const next = event.target.value;
    setHighlighted(null);
    setSearch(next);
  };

  return (
    <input
      {...props}
      ref={ref}
      aria-activedescendant={highlighted ? `command-item-${highlighted}` : undefined}
      aria-controls={listId}
      aria-haspopup="listbox"
      className={cx(command().input, className)}
      data-slot="command-input"
      onChange={(event) => {
        handleChange(event);
      }}
      value={search}
    />
  );
});

export type CommandListProps = ComponentPropsWithoutRef<"div">;
export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(function CommandList(
  { className, id, ...props },
  ref,
) {
  const { items, listId, matches } = useCommandContext();
  const hasVisibleItems = items.some((item) => !item.disabled && matches(item));
  return (
    <div
      {...props}
      ref={ref}
      id={id ?? listId}
      className={cx(command().list, className)}
      data-slot="command-list"
      role={hasVisibleItems ? "listbox" : undefined}
    />
  );
});

export interface CommandGroupProps extends ComponentPropsWithoutRef<"div"> {
  heading?: ReactNode;
}
export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup(
  { children, className, heading, ...props },
  ref,
) {
  const context = useCommandContext();
  const groupId = useId();
  const hasRegisteredItems = context.items.some((item) => item.groupId === groupId);
  const hasVisibleItems = context.items.some(
    (item) => item.groupId === groupId && context.matches(item),
  );
  return (
    <CommandGroupContext.Provider value={groupId}>
      <div
        {...props}
        ref={ref}
        aria-hidden={hasRegisteredItems && !hasVisibleItems ? true : undefined}
        className={cx(command().group, className)}
        data-slot="command-group"
        hidden={hasRegisteredItems && !hasVisibleItems}
      >
        {heading ? (
          <div className={command().groupHeading} data-slot="command-group-heading">
            {heading}
          </div>
        ) : null}
        {children}
      </div>
    </CommandGroupContext.Provider>
  );
});

export interface CommandItemProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  value: string;
  keywords?: readonly string[];
  disabled?: boolean;
  onSelect?: (value: string) => void;
}
export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  {
    children,
    className,
    disabled = false,
    keywords: itemKeywords,
    onClick,
    onMouseEnter,
    onSelect,
    value,
    ...props
  },
  ref,
) {
  const context = useCommandContext();
  const groupId = useContext(CommandGroupContext);
  const id = `command-item-${value}`;
  const keywords = itemKeywords ?? EMPTY_KEYWORDS;
  const visible = context.matches({ value, keywords });

  useEffect(
    () =>
      context.registerItem({
        id: value,
        value,
        keywords,
        disabled,
        groupId,
        onSelect,
        element: null,
      }),
    [context.registerItem, disabled, groupId, keywords, onSelect, value],
  );

  if (!visible) {
    return <div aria-hidden="true" hidden ref={ref} data-slot="command-item" />;
  }

  return (
    <div
      {...props}
      ref={(node) => {
        context.setItemElement(value, node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      aria-disabled={disabled || undefined}
      aria-selected={context.highlighted === value}
      className={cx(command().item, className)}
      data-disabled={disabled || undefined}
      data-highlighted={context.highlighted === value || undefined}
      data-slot="command-item"
      id={id}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) context.selectItem(value);
      }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!disabled) context.setHighlighted(value);
      }}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !disabled) {
          event.preventDefault();
          context.selectItem(value);
        }
      }}
      role="option"
      tabIndex={-1}
    >
      {children}
    </div>
  );
});

export type CommandItemIndicatorProps = ComponentPropsWithoutRef<"span">;
export const CommandItemIndicator = forwardRef<HTMLSpanElement, CommandItemIndicatorProps>(
  function CommandItemIndicator({ children = "✓", className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        className={cx(command().itemIndicator, className)}
        data-slot="command-item-indicator"
      >
        {children}
      </span>
    );
  },
);

export type CommandEmptyProps = ComponentPropsWithoutRef<"div">;
export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(function CommandEmpty(
  { className, ...props },
  ref,
) {
  const context = useCommandContext();
  if (
    context.loading ||
    context.items.length === 0 ||
    context.items.some((item) => context.matches(item))
  )
    return null;
  return (
    <div
      {...props}
      ref={ref}
      className={cx(command().empty, className)}
      aria-live="polite"
      data-slot="command-empty"
      role="presentation"
    />
  );
});

export type CommandLoadingProps = ComponentPropsWithoutRef<"div">;
export const CommandLoading = forwardRef<HTMLDivElement, CommandLoadingProps>(
  function CommandLoading({ className, ...props }, ref) {
    const context = useCommandContext();
    if (!context.loading) return null;
    return (
      <div
        {...props}
        ref={ref}
        className={cx(command().loading, className)}
        aria-live="polite"
        data-slot="command-loading"
        role="presentation"
      />
    );
  },
);

export type CommandSeparatorProps = ComponentPropsWithoutRef<"hr">;
export const CommandSeparator = forwardRef<HTMLHRElement, CommandSeparatorProps>(
  function CommandSeparator({ className, ...props }, ref) {
    return (
      <hr
        {...props}
        ref={ref}
        role="presentation"
        className={cx(command().separator, className)}
        data-slot="command-separator"
      />
    );
  },
);

export const Command = {
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Group: CommandGroup,
  Item: CommandItem,
  ItemIndicator: CommandItemIndicator,
  Empty: CommandEmpty,
  Loading: CommandLoading,
  Separator: CommandSeparator,
};
