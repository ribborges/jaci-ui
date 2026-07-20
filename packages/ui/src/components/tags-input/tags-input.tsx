"use client";

import { forwardRef, useCallback, useId, useMemo, useRef, useState } from "react";
import type {
  ChangeEvent,
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  FocusEvent,
  MouseEvent,
  ReactNode,
} from "react";

import { cx } from "../../styled-system/css";
import { tagsInput } from "../../styled-system/recipes";

export interface TagsInputProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "children" | "defaultValue" | "onChange" | "type" | "value"
  > {
  /** Current tags. Omit this prop to use the uncontrolled API. */
  tags?: readonly string[];
  /** Initial tags for the uncontrolled API. */
  defaultTags?: readonly string[];
  /** Called whenever a tag is added or removed. */
  onTagsChange?: (tags: string[]) => void;
  /** Optional suggestions. A tag is accepted after a comma only when it is in this list. */
  data?: readonly string[];
  /** Visible label for the input. */
  label?: ReactNode;
  /** Current text query. This is the native input value, not the selected tags. */
  value?: string;
  /** Initial text query for an uncontrolled input. */
  defaultValue?: string;
  /** Native input change callback. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Optional callback useful when a controlled query is cleared by selecting a tag. */
  onInputValueChange?: (value: string) => void;
}

function changedEvent(event: ChangeEvent<HTMLInputElement>, value: string) {
  const target = event.target;
  const nextTarget = {
    checked: target.checked,
    id: target.id,
    name: target.name,
    value,
  } as HTMLInputElement;

  return {
    ...event,
    currentTarget: nextTarget,
    target: nextTarget,
  } as ChangeEvent<HTMLInputElement>;
}

export const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(function TagsInput(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    className,
    data = [],
    defaultTags = [],
    defaultValue = "",
    disabled = false,
    id: providedId,
    label,
    onBlur,
    onChange,
    onFocus,
    onInputValueChange,
    onTagsChange,
    placeholder,
    tags: controlledTags,
    value: controlledInputValue,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [uncontrolledTags, setUncontrolledTags] = useState<string[]>(() => [...defaultTags]);
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const styles = tagsInput();
  const selectedTags = controlledTags === undefined ? uncontrolledTags : [...controlledTags];
  const inputValue =
    controlledInputValue === undefined ? uncontrolledInputValue : controlledInputValue;

  const updateTags = useCallback(
    (nextTags: string[]) => {
      if (controlledTags === undefined) setUncontrolledTags(nextTags);
      onTagsChange?.(nextTags);
    },
    [controlledTags, onTagsChange],
  );

  const clearInput = useCallback(
    (event?: ChangeEvent<HTMLInputElement>) => {
      if (controlledInputValue === undefined) setUncontrolledInputValue("");
      onInputValueChange?.("");
      if (event) onChange?.(changedEvent(event, ""));
    },
    [controlledInputValue, onChange, onInputValueChange],
  );

  const addTag = useCallback(
    (rawTag: string, event?: ChangeEvent<HTMLInputElement>) => {
      const tag = rawTag.trim();
      if (tag && !selectedTags.includes(tag) && data.includes(tag)) {
        updateTags([...selectedTags, tag]);
      }
      clearInput(event);
    },
    [clearInput, data, selectedTags, updateTags],
  );

  const suggestions = useMemo(() => {
    const query = inputValue.trim().toLocaleLowerCase();
    return data.filter(
      (item) =>
        !selectedTags.includes(item) &&
        (query.length === 0 || item.toLocaleLowerCase().includes(query)),
    );
  }, [data, inputValue, selectedTags]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;
    if (nextValue.trim() === "") {
      clearInput(event);
      onChange?.(event);
      return;
    }

    if (nextValue.endsWith(",")) {
      addTag(nextValue.slice(0, -1), event);
      return;
    }

    if (controlledInputValue === undefined) setUncontrolledInputValue(nextValue);
    onInputValueChange?.(nextValue);
    onChange?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function removeTag(index: number) {
    updateTags(selectedTags.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div
      className={styles.root}
      data-jaci-component="tags-input"
      data-slot="tags-input"
      ref={rootRef}
    >
      {label ? (
        <label className={styles.label} data-slot="tags-input-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div
        className={cx(styles.control, className)}
        data-disabled={disabled || undefined}
        data-focus={focused || undefined}
        data-slot="tags-input-control"
      >
        <div className={styles.tagList} data-slot="tags-input-tag-list">
          {selectedTags.map((tag, index) => (
            <span className={styles.tag} data-slot="tags-input-tag" key={tag}>
              <span className={styles.tagLabel} data-slot="tags-input-tag-label">
                {tag}
              </span>
              <button
                aria-label={`Remove ${tag}`}
                className={styles.tagRemove}
                data-slot="tags-input-tag-remove"
                disabled={disabled}
                onClick={() => removeTag(index)}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          {...props}
          {...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {})}
          {...(ariaInvalid !== undefined ? { "aria-invalid": ariaInvalid } : {})}
          {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
          autoComplete="off"
          className={styles.input}
          disabled={disabled}
          id={id}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholder={placeholder}
          ref={ref}
          type="text"
          value={inputValue}
        />
      </div>
      {focused && data.length > 0 ? (
        <div className={styles.positioner} data-slot="tags-input-positioner">
          <div
            aria-label="Suggestions"
            className={styles.list}
            data-slot="tags-input-list"
            role="listbox"
          >
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <button
                  aria-selected={false}
                  className={styles.item}
                  data-slot="tags-input-item"
                  key={item}
                  onClick={() => addTag(item)}
                  onMouseDown={(event: MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                  role="option"
                  type="button"
                >
                  {item}
                </button>
              ))
            ) : (
              <div className={styles.empty} data-slot="tags-input-empty">
                No options
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
});
