"use client";

import { forwardRef, useId, useState } from "react";
import type { ChangeEventHandler, ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { optionSelector } from "../../styled-system/recipes";

export interface OptionSelectorOption {
  /** Stable value submitted by the option. */
  value: string;
  /** Optional visible text. Use `children` for a richer option body. */
  label?: ReactNode;
  /** Custom content such as an icon, preview or illustration. */
  children?: ReactNode;
  /** Disables only this option. */
  disabled?: boolean;
  /** Explicit id for the native input and its label. */
  id?: string;
}

export type OptionSelectorValue = string | string[];

export interface OptionSelectorProps
  extends Omit<ComponentPropsWithoutRef<"fieldset">, "children" | "onChange"> {
  /** Optional icon displayed next to the legend. */
  icon?: ReactNode;
  /** Accessible and visible group label. */
  label?: ReactNode;
  /** Supporting text announced with the group. */
  description?: ReactNode;
  /** Options rendered as custom selectable cards. */
  options?: OptionSelectorOption[];
  /** Name used by the native radio/checkbox inputs and form submission. */
  name?: string;
  /** Select multiple options with checkboxes instead of one radio option. */
  multiple?: boolean;
  /** Controlled selection. A string is used for one option and an array for many. */
  value?: OptionSelectorValue;
  /** Initial selection for an uncontrolled selector. */
  defaultValue?: OptionSelectorValue;
  /** Called with the next selected value after an option changes. */
  onValueChange?: (value: OptionSelectorValue) => void;
  /** Native change event callback. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Layout of the option cards. Defaults to the horizontal layout. */
  orientation?: "horizontal" | "vertical";
  /** Responsive number of columns in the option grid. */
  columns?: 1 | 2 | 3 | 4;
  children?: ReactNode;
}

function getMultipleValues(value: OptionSelectorValue | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  return value === undefined ? [] : [value];
}

function getSingleValue(value: OptionSelectorValue | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isSelected(value: string, selected: OptionSelectorValue | undefined, multiple: boolean) {
  return multiple
    ? getMultipleValues(selected).includes(value)
    : getSingleValue(selected) === value;
}

export const OptionSelector = forwardRef<HTMLFieldSetElement, OptionSelectorProps>(
  function OptionSelector(
    {
      children,
      className,
      columns = 1,
      defaultValue,
      description,
      disabled = false,
      icon,
      id,
      label,
      multiple = false,
      name,
      onChange,
      onValueChange,
      options = [],
      orientation = "horizontal",
      value: controlledValue,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const baseId = id ?? generatedId;
    const descriptionId = description ? `${baseId}-description` : undefined;
    const inputName = name ?? `${baseId}-options`;
    const [uncontrolledValue, setUncontrolledValue] = useState<OptionSelectorValue>(() =>
      multiple ? getMultipleValues(defaultValue) : (getSingleValue(defaultValue) ?? ""),
    );
    const selectedValue = controlledValue === undefined ? uncontrolledValue : controlledValue;
    const styles = optionSelector({
      orientation,
      columns: String(columns) as "1" | "2" | "3" | "4",
    });

    return (
      <fieldset
        {...props}
        ref={ref}
        aria-describedby={props["aria-describedby"] ?? descriptionId}
        className={cx(styles.root, className)}
        data-disabled={disabled || undefined}
        data-jaci-component="option-selector"
        data-slot="option-selector"
        disabled={disabled}
        id={id}
      >
        {label || icon ? (
          <legend className={styles.legend} data-slot="option-selector-legend">
            {icon ? (
              <span aria-hidden="true" className={styles.icon} data-slot="option-selector-icon">
                {icon}
              </span>
            ) : null}
            <span className={styles.label} data-slot="option-selector-label">
              {label}
            </span>
          </legend>
        ) : null}
        {description ? (
          <p
            className={styles.description}
            data-slot="option-selector-description"
            id={descriptionId}
          >
            {description}
          </p>
        ) : null}
        <div className={styles.options} data-slot="option-selector-options">
          {options.map((option, index) => {
            const optionDisabled = disabled || Boolean(option.disabled);
            const selected = isSelected(option.value, selectedValue, multiple);
            const optionId = option.id ?? `${baseId}-option-${index}`;

            return (
              <label
                className={styles.option}
                data-disabled={optionDisabled || undefined}
                data-selected={selected || undefined}
                data-slot="option-selector-option"
                htmlFor={optionId}
                key={option.value}
              >
                <input
                  aria-label={typeof option.label === "string" ? option.label : undefined}
                  checked={selected}
                  className={styles.input}
                  data-slot="option-selector-input"
                  disabled={optionDisabled}
                  id={optionId}
                  name={inputName}
                  onChange={(event) => {
                    const nextValue = multiple
                      ? event.currentTarget.checked
                        ? [...getMultipleValues(selectedValue), option.value]
                        : getMultipleValues(selectedValue).filter(
                            (current) => current !== option.value,
                          )
                      : option.value;

                    setUncontrolledValue(nextValue);
                    onValueChange?.(nextValue);
                    onChange?.(event);
                  }}
                  type={multiple ? "checkbox" : "radio"}
                  value={option.value}
                />
                <span className={styles.content}>
                  {option.children}
                  {option.label ? (
                    <span className={styles.optionLabel} data-slot="option-selector-option-label">
                      {option.label}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
          {children}
        </div>
      </fieldset>
    );
  },
);
