import { cloneElement, forwardRef } from "react";
import type {
  ComponentPropsWithoutRef,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";

import { cx } from "../../styled-system/css";
import { button } from "../../styled-system/recipes";
import { Spinner } from "../layout";

type RenderableButtonProps = Record<string, unknown> & {
  children?: ReactNode | undefined;
  className?: string | undefined;
  href?: string | undefined;
  onClick?: MouseEventHandler<HTMLElement> | undefined;
};

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "color" | "children"> {
  children?: ReactNode;
  variant?: "outline" | "solid" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  render?: ReactElement<RenderableButtonProps>;
}

function content(children: ReactNode, loading: boolean, startIcon: ReactNode, endIcon: ReactNode) {
  return (
    <>
      {loading ? <Spinner aria-hidden="true" label="" size="sm" /> : startIcon}
      {children}
      {!loading ? endIcon : undefined}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = "outline",
    size = "md",
    fullWidth = false,
    loading = false,
    startIcon,
    endIcon,
    disabled,
    onClick: buttonOnClick,
    render,
    type = "button",
    ...props
  },
  ref,
) {
  const buttonClassName = cx(button({ variant, size, fullWidth }), className);
  const childrenWithIcons = content(children, loading, startIcon, endIcon);

  if (render) {
    // Keep the render path tolerant of framework-rendered elements and avoid
    // adding a synthetic client handler when the composed element has none.
    const renderedProps = render.props ?? {};
    const renderedOnClick = renderedProps.onClick as MouseEventHandler<HTMLElement> | undefined;
    const handleRenderedClick: MouseEventHandler<HTMLElement> | undefined =
      renderedOnClick || buttonOnClick
        ? disabled || loading
          ? (event) => event.preventDefault()
          : (event) => {
              renderedOnClick?.(event);
              if (!event.defaultPrevented) {
                buttonOnClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
              }
            }
        : undefined;

    // A server component can compose Button with a native anchor. Remove its
    // href while disabled/loading instead of attaching a client-only event
    // handler during the server render.
    const renderedHref =
      disabled || loading
        ? render.type === "a"
          ? undefined
          : renderedProps.href
        : renderedProps.href;

    return cloneElement(render, {
      ...props,
      "aria-busy": loading || undefined,
      "aria-disabled": disabled || loading || undefined,
      className: cx(buttonClassName, renderedProps.className),
      "data-jaci-component": "button",
      "data-slot": "button",
      children: childrenWithIcons,
      onClick: handleRenderedClick,
      ...(render.type === "a" && (disabled || loading) ? { href: renderedHref, tabIndex: -1 } : {}),
    });
  }

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={buttonClassName}
      data-jaci-component="button"
      data-slot="button"
      disabled={disabled || loading}
      onClick={buttonOnClick}
      ref={ref}
      type={type}
    >
      {childrenWithIcons}
    </button>
  );
});
