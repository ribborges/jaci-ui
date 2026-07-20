"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { ToggleGroup as BaseToggleGroupType } from "@base-ui/react/toggle-group";

import { cx } from "../../styled-system/css";
import { toggleGroup } from "../../styled-system/recipes";
import type { ToggleProps, ToggleSize, ToggleVariant } from "../toggle";
import { withRecipeClassName } from "../base-ui";

export interface ToggleGroupRootProps
  extends Omit<BaseToggleGroupType.Props<string>, "children" | "className" | "onValueChange"> {
  children?: ReactNode;
  className?: string;
  onValueChange?: (value: string[]) => void;
  size?: ToggleSize;
  variant?: ToggleVariant;
}

export const ToggleGroupRoot = forwardRef<HTMLDivElement, ToggleGroupRootProps>(
  function ToggleGroupRoot(
    {
      children,
      className,
      onValueChange,
      orientation = "horizontal",
      size = "md",
      variant = "outline",
      ...props
    },
    ref,
  ) {
    const styles = toggleGroup({ size, variant });

    return (
      <BaseToggleGroup
        {...props}
        ref={ref}
        className={cx(styles.root, className)}
        data-jaci-component="toggle-group"
        data-orientation={orientation}
        data-slot="toggle-group"
        onValueChange={(value) => onValueChange?.(value)}
        orientation={orientation}
      >
        {children}
      </BaseToggleGroup>
    );
  },
);

export interface ToggleGroupItemProps extends Omit<ToggleProps, "className"> {
  className?: string;
  value: string;
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  function ToggleGroupItem(
    { children, className, onPressedChange, size = "md", value, variant = "outline", ...props },
    ref,
  ) {
    const styles = toggleGroup({ size, variant });

    return (
      <BaseToggle
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.item, className)}
        data-jaci-component="toggle-group"
        data-slot="toggle-group-item"
        onPressedChange={(pressed) => onPressedChange?.(pressed)}
        value={value}
      >
        {children}
      </BaseToggle>
    );
  },
);

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};
