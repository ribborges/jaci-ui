"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { createContext, forwardRef, useCallback, useContext, useId, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import type { FieldRoot as BaseFieldRoot } from "@base-ui/react/field";

import { cx } from "../../styled-system/css";
import { field } from "../../styled-system/recipes";
import { JaciFormContext } from "../form";

export type FieldValidationMode = "onSubmit" | "onBlur" | "onChange";

interface FieldContextValue {
  controlId: string | undefined;
  descriptionId: string | undefined;
  dirty: boolean;
  errorId: string | undefined;
  errors: ReactNode[];
  insideField: boolean;
  invalid: boolean;
  labelId: string | undefined;
  name: string | undefined;
  pending: boolean;
  touched: boolean;
  valid: boolean | null;
}

const FieldContext = createContext<FieldContextValue>({
  controlId: undefined,
  descriptionId: undefined,
  dirty: false,
  errorId: undefined,
  errors: [],
  insideField: false,
  invalid: false,
  labelId: undefined,
  name: undefined,
  pending: false,
  touched: false,
  valid: null,
});

function normalizeErrors(errors: ReactNode | ReactNode[] | undefined): ReactNode[] {
  if (errors === undefined || errors === null || errors === false) {
    return [];
  }

  return Array.isArray(errors) ? errors : [errors];
}

function renderErrors(errors: ReactNode[]) {
  if (errors.length <= 1) {
    return errors[0];
  }

  return (
    <ul>
      {errors.map((error, index) => (
        <li key={typeof error === "string" ? error : index}>{error}</li>
      ))}
    </ul>
  );
}

export interface FieldProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Marks the field invalid when an external validator owns its state. */
  invalid?: boolean;
  /** Field name used to resolve errors supplied to the parent Form. */
  name?: string;
  /** Direct error content, useful outside a Form or with custom validation. */
  errors?: ReactNode | ReactNode[];
  /** Disables the field and its Base UI validation state. */
  disabled?: boolean;
  /** Native/Base UI validation callback. */
  validate?: BaseFieldRoot.Props["validate"];
  /** Validation timing used by the parent Form. */
  validationMode?: FieldValidationMode;
  /** Debounce duration for `validationMode="onChange"`. */
  validationDebounceTime?: number;
  /** Controlled dirty/touched state for integrations with external form state. */
  dirty?: boolean;
  touched?: boolean;
  /** Marks the field as awaiting asynchronous validation. */
  pending?: boolean;
  /** Imperative field validation actions. */
  actionsRef?: BaseFieldRoot.Props["actionsRef"];
  children?: ReactNode;
}

export interface FieldLabelProps extends ComponentPropsWithoutRef<"label"> {
  htmlFor?: string;
}

const FieldRoot = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    actionsRef,
    children,
    className,
    dirty,
    disabled = false,
    errors: directErrors,
    invalid: invalidProp = false,
    name,
    pending: pendingProp = false,
    touched,
    validate,
    validationDebounceTime,
    validationMode,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const controlId = `${generatedId}-control`;
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const [pendingValidation, setPendingValidation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ReactNode[]>([]);
  const [validationValid, setValidationValid] = useState<boolean | null>(null);
  const validationSequence = useRef(0);
  const { errors: formErrors } = useContext(JaciFormContext);
  const formError = name ? formErrors[name] : undefined;
  const externalErrors =
    directErrors === undefined ? normalizeErrors(formError) : normalizeErrors(directErrors);
  const errors =
    directErrors !== undefined || formError !== undefined ? externalErrors : validationErrors;
  const invalid = invalidProp || errors.length > 0;
  const pending = pendingProp || pendingValidation;
  const wrappedValidate = useCallback<NonNullable<BaseFieldRoot.Props["validate"]>>(
    (value, formValues) => {
      const sequence = ++validationSequence.current;
      if (!validate) return null;
      const result = validate(value, formValues);
      if (!result || typeof result !== "object" || !("then" in result)) {
        const resultErrors = normalizeErrors(result);
        setValidationErrors(resultErrors);
        setValidationValid(resultErrors.length === 0);
        setPendingValidation(false);
        return result;
      }
      setValidationErrors([]);
      setValidationValid(null);
      setPendingValidation(true);
      return Promise.resolve(result)
        .then((validationResult) => {
          if (sequence !== validationSequence.current) return null;
          const resultErrors = normalizeErrors(validationResult);
          setValidationErrors(resultErrors);
          setValidationValid(resultErrors.length === 0);
          return validationResult;
        })
        .finally(() => {
          if (sequence === validationSequence.current) setPendingValidation(false);
        });
    },
    [validate],
  );
  const styles = field({ invalid });

  return (
    <FieldContext.Provider
      value={{
        controlId,
        descriptionId,
        dirty: dirty ?? false,
        errorId,
        errors,
        insideField: true,
        invalid,
        labelId,
        name,
        pending,
        touched: touched ?? false,
        valid: invalid ? false : validationValid,
      }}
    >
      <BaseField.Root
        {...props}
        ref={ref}
        actionsRef={actionsRef}
        className={cx(styles.root, className)}
        aria-busy={pending || undefined}
        data-dirty={dirty || undefined}
        data-invalid={invalid || undefined}
        data-jaci-component="field"
        data-pending={pending || undefined}
        data-slot="field"
        data-touched={touched || undefined}
        disabled={disabled}
        dirty={dirty}
        invalid={invalid}
        name={name}
        touched={touched}
        {...(validate ? { validate: wrappedValidate } : {})}
        validationDebounceTime={validationDebounceTime}
        validationMode={validationMode}
      >
        {children}
      </BaseField.Root>
    </FieldContext.Provider>
  );
});

export interface FieldControlProps extends ComponentPropsWithoutRef<typeof BaseField.Control> {}

export const FieldControl = forwardRef<HTMLElement, FieldControlProps>(function FieldControl(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-errormessage": ariaErrorMessage,
    "aria-invalid": ariaInvalid,
    "aria-labelledby": ariaLabelledBy,
    className,
    id,
    ...props
  },
  ref,
) {
  const { controlId, descriptionId, errorId, invalid, labelId, pending, insideField } =
    useContext(FieldContext);
  const describedBy =
    [ariaDescribedBy, descriptionId, invalid ? errorId : undefined].filter(Boolean).join(" ") ||
    undefined;
  const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(" ") || undefined;
  const controlProps = {
    ...props,
    "aria-busy": pending || undefined,
    "aria-describedby": describedBy,
    "aria-errormessage": ariaErrorMessage ?? (invalid ? errorId : undefined),
    "aria-invalid": ariaInvalid ?? (invalid || undefined),
    "aria-labelledby": labelledBy,
    className,
    "data-pending": pending || undefined,
    id: id ?? controlId,
  };
  if (!insideField) return <BaseField.Control {...controlProps} ref={ref} />;
  return <BaseField.Control {...controlProps} ref={ref} />;
});

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { children, className, htmlFor, ...props },
  ref,
) {
  const { controlId, insideField, invalid, labelId } = useContext(FieldContext);

  const labelProps = {
    ...props,
    className: cx(field({ invalid }).label, className),
    "data-slot": "field-label",
    htmlFor: htmlFor ?? controlId,
    id: props.id ?? labelId,
  };

  if (!insideField) {
    return (
      <label {...labelProps} ref={ref} htmlFor={htmlFor ?? controlId}>
        {children}
      </label>
    );
  }

  return (
    <BaseField.Label {...labelProps} ref={ref as Ref<HTMLElement>}>
      {children}
    </BaseField.Label>
  );
});

export const FieldDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(
  function FieldDescription({ className, ...props }, ref) {
    const { descriptionId, insideField, invalid } = useContext(FieldContext);
    const descriptionProps = {
      ...props,
      className: cx(field({ invalid }).description, className),
      "data-slot": "field-description",
      id: props.id ?? descriptionId,
    };

    if (!insideField) {
      return <p {...descriptionProps} ref={ref} />;
    }

    return <BaseField.Description {...descriptionProps} ref={ref} />;
  },
);

export interface FieldErrorProps extends Omit<ComponentPropsWithoutRef<"p">, "children"> {
  children?: ReactNode;
  match?: boolean | keyof ValidityState;
}

export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(function FieldError(
  { children, className, match, ...props },
  ref,
) {
  const { errorId, errors, insideField, invalid } = useContext(FieldContext);
  const content = children ?? renderErrors(errors);

  if (!insideField) {
    if (content === undefined || content === null || content === false) {
      return null;
    }

    return (
      <p
        {...props}
        ref={ref}
        className={cx(field({ invalid }).error, className)}
        data-slot="field-error"
        id={props.id ?? errorId}
        role="alert"
      >
        {content}
      </p>
    );
  }

  return (
    <BaseField.Error
      {...props}
      ref={ref as Ref<HTMLDivElement>}
      className={cx(field({ invalid }).error, className)}
      data-slot="field-error"
      id={props.id ?? errorId}
      match={match ?? (invalid ? true : undefined)}
      render={<p />}
      role="alert"
    >
      {content}
    </BaseField.Error>
  );
});

export function useFieldState() {
  return useContext(FieldContext);
}

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Control: FieldControl,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
});
