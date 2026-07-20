import { cx } from "../styled-system/css";

export type StatefulClassName<State> = string | ((state: State) => string | undefined) | undefined;

/**
 * Keeps Base UI's state-aware `className` API while always applying the Jaci
 * recipe class. Consumers can still provide either a string or a callback.
 */
export function withRecipeClassName<State>(
  recipeClassName: string,
  className: StatefulClassName<State>,
): StatefulClassName<State> {
  if (typeof className === "function") {
    return (state) => cx(recipeClassName, className(state));
  }

  return cx(recipeClassName, className);
}
