import {
  NavbarBar,
  NavbarCenter,
  NavbarClose,
  NavbarCreateHandle,
  NavbarDrawer,
  NavbarEnd,
  NavbarItem,
  NavbarRoot,
  NavbarStart,
  NavbarToggle,
} from "./navigation";

/**
 * Compound namespace for the responsive navigation bar.
 *
 * This file intentionally stays server-safe. Its values are client component
 * references imported from `navigation.tsx`, which lets Next.js App Router
 * consume `<Navbar.Root>` from a Server Component without losing the nested
 * properties during the RSC transform.
 */
export const Navbar: {
  Root: typeof NavbarRoot;
  Bar: typeof NavbarBar;
  Start: typeof NavbarStart;
  Center: typeof NavbarCenter;
  End: typeof NavbarEnd;
  Toggle: typeof NavbarToggle;
  Drawer: typeof NavbarDrawer;
  Close: typeof NavbarClose;
  Item: typeof NavbarItem;
  createHandle: typeof NavbarCreateHandle;
} = {
  Root: NavbarRoot,
  Bar: NavbarBar,
  Start: NavbarStart,
  Center: NavbarCenter,
  End: NavbarEnd,
  Toggle: NavbarToggle,
  Drawer: NavbarDrawer,
  Close: NavbarClose,
  Item: NavbarItem,
  createHandle: NavbarCreateHandle,
};
