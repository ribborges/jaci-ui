"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import type { FieldRoot as BaseFieldRoot } from "@base-ui/react/field";

import { cx } from "../../styled-system/css";
import { field } from "../../styled-system/recipes";
import { JaciFormContext } from "../form";

export type FieldValidationMode = "onSubmit" | "onBlur" | "onChange";

interface FieldContextValue {
  errors: ReactNode[];
  insideField: boolean;
  invalid: boolean;
  name: string | undefined;
}

const FieldContext = createContext<FieldContextValue>({
  errors: [],
  insideField: false,
  invalid: false,
  name: undefined,
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
  /** Imperative field validation actions. */
  actionsRef?: BaseFieldRoot.Props["actionsRef"];
  children?: ReactNode;
}

export interface FieldLabelProps extends ComponentPropsWithoutRef<"label"> {
  htmlFor: string;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    actionsRef,
    children,
    className,
    dirty,
    disabled = false,
    errors: directErrors,
    invalid: invalidProp = false,
    name,
    touched,
    validate,
    validationDebounceTime,
    validationMode,
    ...props
  },
  ref,
) {
  const { errors: formErrors } = useContext(JaciFormContext);
  const formError = name ? formErrors[name] : undefined;
  const errors =
    directErrors === undefined ? normalizeErrors(formError) : normalizeErrors(directErrors);
  const invalid = invalidProp || errors.length > 0;
  const styles = field({ invalid });

  return (
    <FieldContext.Provider value={{ errors, insideField: true, invalid, name }}>
      <BaseField.Root
        {...props}
        ref={ref}
        actionsRef={actionsRef}
        className={cx(styles.root, className)}
        data-invalid={invalid || undefined}
        data-jaci-component="field"
        data-slot="field"
        disabled={disabled}
        dirty={dirty}
        invalid={invalid}
        name={name}
        touched={touched}
        validate={validate}
        validationDebounceTime={validationDebounceTime}
        validationMode={validationMode}
      >
        {children}
      </BaseField.Root>
    </FieldContext.Provider>
  );
});

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { children, className, htmlFor, ...props },
  ref,
) {
  const { insideField, invalid } = useContext(FieldContext);

  const labelProps = {
    ...props,
    className: cx(field({ invalid }).label, className),
    "data-slot": "field-label",
    htmlFor,
  };

  if (!insideField) {
    return (
      <label {...labelProps} ref={ref} htmlFor={htmlFor}>
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
    const { insideField, invalid } = useContext(FieldContext);
    const descriptionProps = {
      ...props,
      className: cx(field({ invalid }).description, className),
      "data-slot": "field-description",
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
  const { errors, insideField, invalid } = useContext(FieldContext);
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
