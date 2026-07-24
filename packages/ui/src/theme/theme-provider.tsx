"use client";

import {
  createContext,
  createElement,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode, Ref } from "react";

export type ThemeMode = "light" | "dark" | "system";

/** A leaf value accepted by the theme variable mapper. */
export type JaciThemeTokenValue = string | number;

/**
 * Semantic theme values. The groups intentionally accept additional keys so
 * applications can extend the token vocabulary without waiting for a package
 * release. Known semantic groups are documented in the public README.
 */
export type JaciThemeTokenGroup = {
  readonly [key: string]: JaciThemeTokenValue | JaciThemeTokenGroup | undefined;
};

export interface JaciThemeColorTokens extends JaciThemeTokenGroup {
  surface?: JaciThemeTokenGroup;
  fg?: JaciThemeTokenGroup;
  border?: JaciThemeTokenGroup;
  accent?: JaciThemeTokenGroup;
  success?: JaciThemeTokenValue;
  warning?: JaciThemeTokenValue;
  danger?: JaciThemeTokenValue;
  info?: JaciThemeTokenValue;
  link?: JaciThemeTokenGroup;
  focus?: JaciThemeTokenValue;
  disabled?: JaciThemeTokenValue;
  selected?: JaciThemeTokenValue;
}

export interface JaciThemeTokens {
  colors?: JaciThemeColorTokens;
  radii?: JaciThemeTokenGroup;
  shadows?: JaciThemeTokenGroup;
  durations?: JaciThemeTokenGroup;
  easings?: JaciThemeTokenGroup;
  transitions?: JaciThemeTokenGroup;
  spacing?: JaciThemeTokenGroup;
  fontSizes?: JaciThemeTokenGroup;
  lineHeights?: JaciThemeTokenGroup;
  typography?: JaciThemeTokenGroup;
  textStyles?: JaciThemeTokenGroup;
  fonts?: JaciThemeTokenGroup;
}

export interface ThemeProviderProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** The controlled color mode. */
  theme?: ThemeMode;
  /** The initial color mode for an uncontrolled provider. */
  defaultTheme?: ThemeMode;
  /** The deterministic mode used for `system` while rendering on the server. */
  ssrTheme?: "light" | "dark";
  /** Scoped semantic token overrides. */
  tokens?: JaciThemeTokens;
  /** Called when a controlled provider requests a mode change. */
  onThemeChange?: (theme: ThemeMode) => void;
  /** The element that owns the theme scope. */
  as?: ElementType;
  children?: ReactNode;
}

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
}

const defaultThemeContext: ThemeContextValue = {
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => undefined,
};

const ThemeContext = createContext<ThemeContextValue>(defaultThemeContext);

function kebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function flattenTokens(
  group: JaciThemeTokenGroup | undefined,
  path: string[],
  output: Record<string, string>,
) {
  if (!group) return;

  for (const [key, value] of Object.entries(group)) {
    if (value === undefined) continue;
    const nextPath = [...path, kebabCase(key)];

    if (typeof value === "object") {
      flattenTokens(value, nextPath, output);
    } else {
      output[`--jaci-${nextPath.join("-")}`] = String(value);
    }
  }
}

function tokenStyles(tokens: JaciThemeTokens | undefined): CSSProperties {
  if (!tokens) return {};

  const variables: Record<string, string> = {};
  for (const [group, values] of Object.entries(tokens)) {
    flattenTokens(values, [kebabCase(group)], variables);
  }

  return variables as CSSProperties;
}

function initialSystemTheme(ssrTheme: "light" | "dark" | undefined) {
  return ssrTheme ?? "light";
}

export const ThemeProvider = forwardRef<HTMLElement, ThemeProviderProps>(function ThemeProvider(
  {
    as = "div",
    children,
    defaultTheme = "light",
    onThemeChange,
    ssrTheme,
    style,
    theme,
    tokens,
    ...props
  },
  ref,
) {
  const [uncontrolledTheme, setUncontrolledTheme] = useState<ThemeMode>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
    initialSystemTheme(ssrTheme),
  );
  const currentTheme = theme ?? uncontrolledTheme;

  useEffect(() => {
    if (currentTheme !== "system") return;

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemTheme(media.matches ? "dark" : "light");
    update();
    if (typeof media.addEventListener === "function") media.addEventListener("change", update);
    else media.addListener?.(update);

    return () => {
      if (typeof media.removeEventListener === "function")
        media.removeEventListener("change", update);
      else media.removeListener?.(update);
    };
  }, [currentTheme]);

  const resolvedTheme = currentTheme === "system" ? systemTheme : currentTheme;
  const setTheme = useCallback(
    (nextTheme: ThemeMode) => {
      if (theme === undefined) setUncontrolledTheme(nextTheme);
      onThemeChange?.(nextTheme);
    },
    [onThemeChange, theme],
  );
  const contextValue = useMemo(
    () => ({ theme: currentTheme, resolvedTheme, setTheme }),
    [currentTheme, resolvedTheme, setTheme],
  );
  const mergedStyle = useMemo(() => ({ ...style, ...tokenStyles(tokens) }), [style, tokens]);
  const Root = as;

  return (
    <ThemeContext.Provider value={contextValue}>
      {createElement(
        Root,
        {
          ...props,
          "data-jaci-theme": resolvedTheme,
          "data-jaci-component": "theme-provider",
          "data-slot": "theme-provider",
          ref: ref as Ref<HTMLElement>,
          style: mergedStyle,
        },
        children,
      )}
    </ThemeContext.Provider>
  );
});

export function useTheme() {
  return useContext(ThemeContext);
}
