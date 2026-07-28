"use client";

import { createContext, useContext } from "react";
import type { RefObject } from "react";

export type ThemePortalContainer =
  | HTMLElement
  | ShadowRoot
  | null
  | RefObject<HTMLElement | ShadowRoot | null>;

export interface ThemeScopeValue {
  container: HTMLElement | null;
}

export const ThemeScopeContext = createContext<ThemeScopeValue>({ container: null });

export function useThemePortalContainer() {
  return useContext(ThemeScopeContext).container;
}

export function useThemePortalProps<T extends { container?: ThemePortalContainer | undefined }>(
  props: T,
): T {
  const scopedContainer = useThemePortalContainer();

  if (props.container !== undefined || scopedContainer === null) return props;

  return { ...props, container: scopedContainer };
}
