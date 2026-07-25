"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type {
  ClipboardEvent,
  CompositionEvent,
  ComponentPropsWithoutRef,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
} from "react";

import { cx } from "../../styled-system/css";
import { pinInput } from "../../styled-system/recipes";

interface PinInputContextValue {
  disabled: boolean;
  id: string;
  invalid: boolean;
  inputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  length: number;
  onInput: (index: number, value: string) => void;
  onCompositionEnd: (index: number, event: CompositionEvent<HTMLInputElement>) => void;
  onCompositionStart: () => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (index: number, event: ClipboardEvent<HTMLInputElement>) => void;
  otp: boolean;
  styles: ReturnType<typeof pinInput>;
  type: "text" | "password";
  value: string;
}

const PinInputContext = createContext<PinInputContextValue | null>(null);

function digitKey(index: number) {
  return `digit-${index}`;
}

function usePinInputContext() {
  const context = useContext(PinInputContext);
  if (!context) throw new Error("PinInput parts must be rendered inside PinInput.Root.");
  return context;
}

export interface PinInputRootProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "defaultValue"> {
  length: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: "text" | "password";
  otp?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  children?: ReactNode;
}

export const PinInputRoot = forwardRef<HTMLDivElement, PinInputRootProps>(function PinInputRoot(
  {
    autoFocus = false,
    children,
    className,
    defaultValue = "",
    disabled = false,
    id: providedId,
    invalid = false,
    length,
    name,
    onValueChange,
    onComplete,
    otp = false,
    type = "text",
    value: controlledValue,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const styles = pinInput();
  const safeLength = Math.max(1, Math.floor(length));
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValue.slice(0, safeLength),
  );
  const value = (controlledValue ?? uncontrolledValue).slice(0, safeLength);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const composingRef = useRef(false);
  const updateValue = useCallback(
    (next: string) => {
      const normalized = next.slice(0, safeLength);
      if (controlledValue === undefined) setUncontrolledValue(normalized);
      onValueChange?.(normalized);
      if (normalized.length === safeLength) onComplete?.(normalized);
    },
    [controlledValue, onComplete, onValueChange, safeLength],
  );
  const normalize = useCallback(
    (next: string) => {
      const characters = Array.from(next);
      return (otp ? characters.filter((character) => /[0-9]/u.test(character)) : characters)
        .join("")
        .slice(0, safeLength);
    },
    [otp, safeLength],
  );
  const focusIndex = useCallback(
    (index: number) => {
      inputRefs.current[Math.max(0, Math.min(safeLength - 1, index))]?.focus();
    },
    [safeLength],
  );
  const onInput = useCallback(
    (index: number, nextCharacter: string) => {
      if (composingRef.current) return;
      const characters = Array.from(value);
      const next = normalize(nextCharacter).slice(-1);
      characters[index] = next;
      const nextValue = characters.join("").slice(0, safeLength);
      updateValue(nextValue);
      if (next) focusIndex(index + 1);
    },
    [focusIndex, normalize, safeLength, updateValue, value],
  );
  const onCompositionStart = useCallback(() => {
    composingRef.current = true;
  }, []);
  const onCompositionEnd = useCallback(
    (index: number, event: CompositionEvent<HTMLInputElement>) => {
      composingRef.current = false;
      onInput(index, event.currentTarget.value);
    },
    [onInput],
  );
  const onPaste = useCallback(
    (index: number, event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pasted = normalize(event.clipboardData.getData("text"));
      if (!pasted) return;
      const characters = Array.from(value);
      Array.from(pasted).forEach((character, offset) => {
        if (index + offset < safeLength) characters[index + offset] = character;
      });
      const nextValue = characters.join("").slice(0, safeLength);
      updateValue(nextValue);
      focusIndex(Math.min(safeLength - 1, index + pasted.length));
    },
    [focusIndex, normalize, safeLength, updateValue, value],
  );
  const onKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
        event.preventDefault();
        const characters = Array.from(value);
        characters[index - 1] = "";
        updateValue(characters.join(""));
        focusIndex(index - 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusIndex(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        focusIndex(index + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        focusIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        focusIndex(safeLength - 1);
      }
    },
    [focusIndex, safeLength, updateValue, value],
  );
  const context: PinInputContextValue = {
    disabled,
    id,
    invalid,
    inputRefs,
    length: safeLength,
    onInput,
    onCompositionEnd,
    onCompositionStart,
    onKeyDown,
    onPaste,
    otp,
    styles,
    type,
    value,
  };

  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
  }, [autoFocus]);

  return (
    <div
      {...props}
      className={cx(styles.root, className)}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      data-jaci-component="pin-input"
      data-slot="pin-input"
      id={id}
      ref={ref}
    >
      <PinInputContext.Provider value={context}>{children}</PinInputContext.Provider>
      {name ? (
        <input
          aria-hidden="true"
          className={styles.hiddenInput}
          disabled={disabled}
          name={name}
          tabIndex={-1}
          value={value}
          readOnly
        />
      ) : null}
    </div>
  );
});

export type PinInputLabelProps = ComponentPropsWithoutRef<"label">;
export const PinInputLabel = forwardRef<HTMLLabelElement, PinInputLabelProps>(
  function PinInputLabel({ className, ...props }, ref) {
    const { id, styles } = usePinInputContext();
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: the generated Inputs slot supplies the control.
      <label
        {...props}
        className={cx(styles.label, className)}
        data-slot="pin-input-label"
        htmlFor={props.htmlFor ?? `${id}-0`}
        ref={ref}
      />
    );
  },
);

export type PinInputControlProps = ComponentPropsWithoutRef<"div">;
export const PinInputControl = forwardRef<HTMLDivElement, PinInputControlProps>(
  function PinInputControl({ className, ...props }, ref) {
    const { styles } = usePinInputContext();
    return (
      <div
        {...props}
        className={cx(styles.control, className)}
        data-slot="pin-input-control"
        ref={ref}
      />
    );
  },
);

export type PinInputInputsProps = ComponentPropsWithoutRef<"div">;
export const PinInputInputs = forwardRef<HTMLDivElement, PinInputInputsProps>(
  function PinInputInputs({ className, ...props }, ref) {
    const { length, styles } = usePinInputContext();
    return (
      <div
        {...props}
        className={cx(styles.inputs, className)}
        data-slot="pin-input-inputs"
        ref={ref}
      >
        {Array.from({ length }, (_, index) => (
          <PinInputInput index={index} key={digitKey(index)} />
        ))}
      </div>
    );
  },
);

export interface PinInputInputProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "defaultValue" | "onChange" | "onKeyDown" | "onPaste" | "type" | "value"
  > {
  index: number;
}
export const PinInputInput = forwardRef<HTMLInputElement, PinInputInputProps>(
  function PinInputInput(
    {
      className,
      index,
      id,
      onCompositionEnd: onInputCompositionEnd,
      onCompositionStart: onInputCompositionStart,
      ...props
    },
    ref,
  ) {
    const {
      disabled,
      id: rootId,
      inputRefs,
      invalid,
      length,
      onInput,
      onCompositionEnd,
      onCompositionStart,
      onKeyDown,
      onPaste,
      otp,
      styles,
      type,
      value,
    } = usePinInputContext();
    return (
      <input
        {...props}
        aria-label={props["aria-label"] ?? `Digit ${index + 1} of ${length}`}
        aria-invalid={invalid || undefined}
        autoComplete={otp ? "one-time-code" : props.autoComplete}
        className={cx(styles.input, className)}
        data-slot="pin-input-input"
        disabled={disabled || props.disabled}
        id={id ?? `${rootId}-${index}`}
        inputMode={otp ? "numeric" : props.inputMode}
        maxLength={1}
        onChange={(event) => onInput(index, event.currentTarget.value)}
        onCompositionEnd={(event) => {
          onCompositionEnd(index, event);
          onInputCompositionEnd?.(event);
        }}
        onCompositionStart={(event) => {
          onCompositionStart();
          onInputCompositionStart?.(event);
        }}
        onKeyDown={(event) => onKeyDown(index, event)}
        onPaste={(event) => onPaste(index, event)}
        ref={(node) => {
          inputRefs.current[index] = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type={type}
        value={Array.from(value)[index] ?? ""}
      />
    );
  },
);

export type PinInputDescriptionProps = ComponentPropsWithoutRef<"p">;
export const PinInputDescription = forwardRef<HTMLParagraphElement, PinInputDescriptionProps>(
  function PinInputDescription({ className, ...props }, ref) {
    const { styles } = usePinInputContext();
    return (
      <p
        {...props}
        className={cx(styles.description, className)}
        data-slot="pin-input-description"
        ref={ref}
      />
    );
  },
);
export type PinInputErrorProps = ComponentPropsWithoutRef<"p">;
export const PinInputError = forwardRef<HTMLParagraphElement, PinInputErrorProps>(
  function PinInputError({ className, ...props }, ref) {
    const { styles } = usePinInputContext();
    return (
      <p
        {...props}
        className={cx(styles.error, className)}
        data-slot="pin-input-error"
        role="alert"
        ref={ref}
      />
    );
  },
);
export type PinInputHiddenInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "name" | "type" | "value"
>;
export const PinInputHiddenInput = forwardRef<HTMLInputElement, PinInputHiddenInputProps>(
  function PinInputHiddenInput(props, ref) {
    const { disabled, styles, value } = usePinInputContext();
    return (
      <input
        {...props}
        aria-hidden="true"
        className={styles.hiddenInput}
        disabled={disabled || props.disabled}
        readOnly
        ref={ref}
        tabIndex={-1}
        type="hidden"
        value={value}
      />
    );
  },
);

export const PinInput = {
  Root: PinInputRoot,
  Label: PinInputLabel,
  Control: PinInputControl,
  Inputs: PinInputInputs,
  Input: PinInputInput,
  Description: PinInputDescription,
  Error: PinInputError,
  HiddenInput: PinInputHiddenInput,
};
