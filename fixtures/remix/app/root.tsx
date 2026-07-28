import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import "jaci-ui/styles.css";

export const meta: MetaFunction = () => [
  { title: "Jaci UI Remix fixture" },
  { name: "description", content: "Jaci UI Remix Vite compatibility fixture" },
];

export const links: LinksFunction = () => [];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
