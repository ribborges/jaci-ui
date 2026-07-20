"use client";

import { Form as BaseForm } from "@base-ui/react/form";
import { createContext, forwardRef } from "react";
import type { ReactElement, ReactNode, RefAttributes } from "react";
import type { FormProps as BaseFormProps } from "@base-ui/react/form";

import { cx } from "../../styled-system/css";
import { form } from "../../styled-system/recipes";

export type FormErrors = Record<string, string | string[]>;

interface JaciFormContextValue {
  errors: FormErrors;
}

export const JaciFormContext = createContext<JaciFormContextValue>({ errors: {} });

export interface FormProps<FormValues extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<BaseFormProps<FormValues>, "children" | "errors" | "className"> {
  className?: string;
  /** External errors keyed by each field's `name`. */
  errors?: FormErrors;
  children?: ReactNode;
}

const FormRoot = forwardRef<HTMLFormElement, FormProps>(function Form(
  { children, className, errors, ...props },
  ref,
) {
  return (
    <JaciFormContext.Provider value={{ errors: errors ?? {} }}>
      <BaseForm
        {...props}
        ref={ref}
        className={cx(form(), className)}
        data-jaci-component="form"
        data-slot="form"
        errors={errors}
      >
        {children}
      </BaseForm>
    </JaciFormContext.Provider>
  );
});

export const Form = FormRoot as <
  FormValues extends Record<string, unknown> = Record<string, unknown>,
>(
  props: FormProps<FormValues> & RefAttributes<HTMLFormElement>,
) => ReactElement | null;
