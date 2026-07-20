"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { forwardRef } from "react";
import type { Ref } from "react";
import type { SwitchRoot as BaseSwitchRoot } from "@base-ui/react/switch";

import { cx } from "../../styled-system/css";
import { toggleSwitch } from "../../styled-system/recipes";

export interface SwitchProps
  extends Omit<BaseSwitchRoot.Props, "children" | "className" | "onCheckedChange" | "render"> {
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, className, disabled, onCheckedChange, ...props },
  ref,
) {
  return (
    <BaseSwitch.Root
      {...props}
      checked={checked}
      disabled={disabled}
      nativeButton
      render={<button type="button" />}
      ref={ref as Ref<HTMLElement>}
      className={(state) => cx(toggleSwitch({ checked: state.checked }).root, className)}
      onCheckedChange={(nextChecked) => onCheckedChange?.(nextChecked)}
      data-jaci-component="switch"
      data-slot="switch"
    >
      <BaseSwitch.Thumb
        aria-hidden="true"
        className={(state) => cx(toggleSwitch({ checked: state.checked }).thumb)}
        data-slot="switch-thumb"
      />
    </BaseSwitch.Root>
  );
});
