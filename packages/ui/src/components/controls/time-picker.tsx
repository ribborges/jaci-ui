"use client";

import { forwardRef } from "react";

import { Input } from "./input";
import type { InputProps } from "./input";

export interface TimePickerProps extends Omit<InputProps, "defaultValue" | "type" | "value"> {
  /** Initial local time in the native input format, such as `09:30`. */
  defaultValue?: string;
  /** Controlled local time in the native input format, such as `09:30`. */
  value?: string;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  function TimePicker(props, ref) {
    return <Input {...props} ref={ref} type="time" />;
  },
);
