"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { withRecipeClassName } from "../base-ui";
import { tabs } from "../../styled-system/recipes";

export type TabsVariant = "underline" | "pills";

const TabsVariantContext = createContext<TabsVariant>("underline");

function useTabsStyles() {
  return tabs({ variant: useContext(TabsVariantContext) });
}

export interface TabsRootProps extends ComponentPropsWithoutRef<typeof BaseTabs.Root> {
  variant?: TabsVariant;
}

export const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  { className, variant = "underline", ...props },
  ref,
) {
  const styles = tabs({ variant });

  return (
    <TabsVariantContext.Provider value={variant}>
      <BaseTabs.Root
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.root, className)}
        data-jaci-component="tabs"
        data-slot="tabs"
      />
    </TabsVariantContext.Provider>
  );
});

export type TabsListProps = ComponentPropsWithoutRef<typeof BaseTabs.List>;

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, ...props },
  ref,
) {
  const styles = useTabsStyles();

  return (
    <BaseTabs.List
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.list, className)}
      data-slot="tabs-list"
    />
  );
});

export type TabsTabProps = ComponentPropsWithoutRef<typeof BaseTabs.Tab>;

export const TabsTab = forwardRef<HTMLElement, TabsTabProps>(function TabsTab(
  { className, ...props },
  ref,
) {
  const styles = useTabsStyles();

  return (
    <BaseTabs.Tab
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.tab, className)}
      data-slot="tabs-tab"
    />
  );
});

export type TabsPanelProps = ComponentPropsWithoutRef<typeof BaseTabs.Panel>;

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { className, ...props },
  ref,
) {
  const styles = useTabsStyles();

  return (
    <BaseTabs.Panel
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.panel, className)}
      data-slot="tabs-panel"
    />
  );
});

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
};
