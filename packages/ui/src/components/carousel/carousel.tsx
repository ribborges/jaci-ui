"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  Ref,
} from "react";

import { cx } from "../../styled-system/css";
import { carousel } from "../../styled-system/recipes";

export type CarouselOrientation = "horizontal" | "vertical";

interface CarouselContextValue {
  currentIndex: number;
  disabled: boolean;
  getNextIndex: (direction: -1 | 1) => number;
  indexCount: number;
  loop: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  registerIndex: (index: number) => () => void;
  setIndex: (index: number) => void;
  startSwipe: (event: PointerEvent<HTMLElement>) => void;
  moveSwipe: (event: PointerEvent<HTMLElement>) => void;
  endSwipe: (event: PointerEvent<HTMLElement>) => void;
  orientation: CarouselOrientation;
  styles: ReturnType<typeof carousel>;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarouselContext() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("Carousel parts must be rendered inside Carousel.Root.");
  return context;
}

export interface CarouselRootProps extends ComponentPropsWithoutRef<"section"> {
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  orientation?: CarouselOrientation;
  loop?: boolean;
  swipeable?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  disabled?: boolean;
}

export const CarouselRoot = forwardRef<HTMLElement, CarouselRootProps>(function CarouselRoot(
  {
    autoplay = false,
    autoplayInterval = 5000,
    children,
    className,
    defaultIndex = 0,
    disabled = false,
    index,
    onBlur,
    onFocus,
    loop = true,
    onIndexChange,
    onKeyDown,
    onPointerEnter,
    onPointerLeave,
    orientation = "horizontal",
    pauseOnFocus = true,
    pauseOnHover = true,
    style,
    swipeable = true,
    ...props
  },
  ref,
) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(Math.max(0, defaultIndex));
  const [registered, setRegistered] = useState<Set<number>>(() => new Set());
  const [paused, setPaused] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const swipeRef = useRef<{ pointerId: number; startX: number; startY: number } | null>(null);
  const isControlled = index !== undefined;
  const indexCount = registered.size ? Math.max(...registered) + 1 : 0;
  const currentIndex = Math.max(
    0,
    Math.min(indexCount ? indexCount - 1 : 0, index ?? uncontrolledIndex),
  );
  const styles = carousel({ orientation, active: true });

  const setIndex = useCallback(
    (nextIndex: number) => {
      if (disabled || !indexCount) return;
      const next = loop
        ? (nextIndex + indexCount) % indexCount
        : Math.max(0, Math.min(indexCount - 1, nextIndex));
      if (!isControlled) setUncontrolledIndex(next);
      if (next !== currentIndex) onIndexChange?.(next);
    },
    [currentIndex, disabled, indexCount, isControlled, loop, onIndexChange],
  );

  const getNextIndex = useCallback((direction: -1 | 1) => currentIndex + direction, [currentIndex]);

  const registerIndex = useCallback((itemIndex: number) => {
    setRegistered((previous) => {
      if (previous.has(itemIndex)) return previous;
      const next = new Set(previous);
      next.add(itemIndex);
      return next;
    });
    return () =>
      setRegistered((previous) => {
        if (!previous.has(itemIndex)) return previous;
        const next = new Set(previous);
        next.delete(itemIndex);
        return next;
      });
  }, []);

  const onRootKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      const forward =
        orientation === "horizontal" ? event.key === "ArrowRight" : event.key === "ArrowDown";
      const backward =
        orientation === "horizontal" ? event.key === "ArrowLeft" : event.key === "ArrowUp";
      if (forward || backward) {
        event.preventDefault();
        setIndex(getNextIndex(forward ? 1 : -1));
      } else if (event.key === "Home") {
        event.preventDefault();
        setIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setIndex(indexCount - 1);
      }
      onKeyDown?.(event);
    },
    [disabled, getNextIndex, indexCount, onKeyDown, orientation, setIndex],
  );

  const startSwipe = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!swipeable || disabled || event.pointerType === "mouse") return;
      swipeRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
      };
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [disabled, swipeable],
  );

  const moveSwipe = useCallback(() => undefined, []);

  const endSwipe = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const start = swipeRef.current;
      swipeRef.current = null;
      if (!start || start.pointerId !== event.pointerId) return;
      const delta =
        orientation === "horizontal" ? event.clientX - start.startX : event.clientY - start.startY;
      if (Math.abs(delta) < 40) return;
      setIndex(getNextIndex(delta < 0 ? 1 : -1));
    },
    [getNextIndex, orientation, setIndex],
  );

  useEffect(() => {
    if (!autoplay || paused || disabled || indexCount < 2) return;
    const interval =
      Number.isFinite(autoplayInterval) && autoplayInterval > 0 ? autoplayInterval : 5000;
    const timer = window.setInterval(() => setIndex(getNextIndex(1)), interval);
    return () => window.clearInterval(timer);
  }, [autoplay, autoplayInterval, disabled, getNextIndex, indexCount, paused, setIndex]);

  const value = useMemo<CarouselContextValue>(
    () => ({
      currentIndex,
      disabled,
      endSwipe,
      getNextIndex,
      indexCount,
      loop,
      moveSwipe,
      onKeyDown: onRootKeyDown,
      orientation,
      registerIndex,
      setIndex,
      startSwipe,
      styles,
    }),
    [
      currentIndex,
      disabled,
      endSwipe,
      getNextIndex,
      indexCount,
      loop,
      moveSwipe,
      onRootKeyDown,
      orientation,
      registerIndex,
      setIndex,
      startSwipe,
      styles,
    ],
  );

  return (
    <CarouselContext.Provider value={value}>
      <section
        {...props}
        ref={ref}
        aria-roledescription="carousel"
        className={cx(styles.root, className)}
        data-jaci-component="carousel"
        data-orientation={orientation}
        data-slot="carousel"
        data-state={paused ? "paused" : "running"}
        role="region"
        tabIndex={disabled ? -1 : 0}
        onBlur={(event: FocusEvent<HTMLElement>) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocusWithin(false);
            if (pauseOnFocus) setPaused(false);
          }
          onBlur?.(event);
        }}
        onFocus={(event: FocusEvent<HTMLElement>) => {
          setFocusWithin(true);
          if (pauseOnFocus) {
            setPaused(true);
          }
          onFocus?.(event);
        }}
        onKeyDown={onRootKeyDown}
        onPointerCancel={endSwipe}
        onPointerDown={startSwipe}
        onPointerEnter={(event) => {
          if (pauseOnHover) setPaused(true);
          onPointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          if (pauseOnHover && !(pauseOnFocus && focusWithin)) setPaused(false);
          onPointerLeave?.(event);
        }}
        onPointerMove={moveSwipe}
        onPointerUp={endSwipe}
        style={{ "--jaci-carousel-index": currentIndex, ...style } as CSSProperties}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
});

export type CarouselViewportProps = ComponentPropsWithoutRef<"div">;
export const CarouselViewport = forwardRef<HTMLDivElement, CarouselViewportProps>(
  function CarouselViewport({ className, ...props }, ref) {
    const { styles } = useCarouselContext();
    return (
      <div
        {...props}
        ref={ref}
        className={cx(styles.viewport, className)}
        data-slot="carousel-viewport"
      />
    );
  },
);

export type CarouselTrackProps = ComponentPropsWithoutRef<"div">;
export const CarouselTrack = forwardRef<HTMLDivElement, CarouselTrackProps>(function CarouselTrack(
  { className, style, ...props },
  ref,
) {
  const { currentIndex, orientation, styles } = useCarouselContext();
  const transform =
    orientation === "horizontal"
      ? `translateX(-${currentIndex * 100}%)`
      : `translateY(-${currentIndex * 100}%)`;
  return (
    <div
      {...props}
      ref={ref}
      className={cx(styles.track, className)}
      data-slot="carousel-track"
      style={{ transform, ...style }}
    />
  );
});

export interface CarouselItemProps extends ComponentPropsWithoutRef<"article"> {
  index: number;
}
export const CarouselItem = forwardRef<HTMLElement, CarouselItemProps>(function CarouselItem(
  { children, className, index, ...props },
  ref,
) {
  const { currentIndex, registerIndex, styles } = useCarouselContext();
  useEffect(() => registerIndex(index), [index, registerIndex]);
  const active = currentIndex === index;
  return (
    // biome-ignore lint/a11y/useSemanticElements: carousel slides use the ARIA group role.
    <article
      {...props}
      ref={ref}
      aria-hidden={!active}
      aria-roledescription="slide"
      className={cx(styles.item, className)}
      data-index={index}
      data-jaci-component="carousel-item"
      data-selected={active || undefined}
      data-slot="carousel-item"
      role="group"
      tabIndex={active ? 0 : -1}
    >
      {children}
    </article>
  );
});

function createSimpleSlot(slot: "media" | "caption" | "title" | "description") {
  return forwardRef<HTMLElement, ComponentPropsWithoutRef<"div">>(function CarouselSlot(
    { className, ...props },
    ref,
  ) {
    const { styles } = useCarouselContext();
    if (slot === "title")
      return (
        <h3
          {...props}
          ref={ref as Ref<HTMLHeadingElement>}
          className={cx(styles.title, className)}
          data-slot={`carousel-${slot}`}
        />
      );
    if (slot === "description")
      return (
        <p
          {...props}
          ref={ref as Ref<HTMLParagraphElement>}
          className={cx(styles.description, className)}
          data-slot={`carousel-${slot}`}
        />
      );
    return (
      <div
        {...props}
        ref={ref as Ref<HTMLDivElement>}
        className={cx(styles[slot], className)}
        data-slot={`carousel-${slot}`}
      />
    );
  });
}

export const CarouselMedia = createSimpleSlot("media");
export const CarouselCaption = createSimpleSlot("caption");
export const CarouselTitle = createSimpleSlot("title");
export const CarouselDescription = createSimpleSlot("description");

export interface CarouselControlProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
}
export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselControlProps>(
  function CarouselPrevious(
    { "aria-label": ariaLabel = "Previous slide", children = "‹", className, disabled, ...props },
    ref,
  ) {
    const { disabled: contextDisabled, getNextIndex, setIndex, styles } = useCarouselContext();
    return (
      <button
        {...props}
        ref={ref}
        aria-label={ariaLabel}
        className={cx(styles.control, className)}
        data-slot="carousel-previous"
        disabled={disabled ?? contextDisabled}
        onClick={() => setIndex(getNextIndex(-1))}
        type="button"
      >
        {children}
      </button>
    );
  },
);

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselControlProps>(
  function CarouselNext(
    { "aria-label": ariaLabel = "Next slide", children = "›", className, disabled, ...props },
    ref,
  ) {
    const { disabled: contextDisabled, getNextIndex, setIndex, styles } = useCarouselContext();
    return (
      <button
        {...props}
        ref={ref}
        aria-label={ariaLabel}
        className={cx(styles.control, className)}
        data-slot="carousel-next"
        disabled={disabled ?? contextDisabled}
        onClick={() => setIndex(getNextIndex(1))}
        type="button"
      >
        {children}
      </button>
    );
  },
);

export interface CarouselIndicatorProps extends ComponentPropsWithoutRef<"button"> {
  index: number;
}
export const CarouselIndicator = forwardRef<HTMLButtonElement, CarouselIndicatorProps>(
  function CarouselIndicator({ "aria-label": ariaLabel, className, index, ...props }, ref) {
    const { currentIndex, disabled, setIndex, styles } = useCarouselContext();
    return (
      <button
        {...props}
        ref={ref}
        aria-label={ariaLabel ?? `Go to slide ${index + 1}`}
        aria-selected={currentIndex === index}
        className={cx(styles.indicator, className)}
        data-selected={currentIndex === index || undefined}
        data-slot="carousel-indicator"
        disabled={disabled}
        onClick={() => setIndex(index)}
        role="tab"
        type="button"
      />
    );
  },
);

export const CarouselIndicators = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function CarouselIndicators({ children, className, ...props }, ref) {
    const { indexCount, styles } = useCarouselContext();
    return (
      <div
        {...props}
        ref={ref}
        aria-label="Slides"
        className={cx(styles.indicators, className)}
        data-slot="carousel-indicators"
        role="tablist"
      >
        {children ??
          Array.from({ length: indexCount }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: indicators are stable by slide index.
            <CarouselIndicator index={index} key={`indicator-${index}`} />
          ))}
      </div>
    );
  },
);

export const Carousel = {
  Root: CarouselRoot,
  Viewport: CarouselViewport,
  Track: CarouselTrack,
  Item: CarouselItem,
  Media: CarouselMedia,
  Caption: CarouselCaption,
  Title: CarouselTitle,
  Description: CarouselDescription,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  Indicators: CarouselIndicators,
  Indicator: CarouselIndicator,
};
