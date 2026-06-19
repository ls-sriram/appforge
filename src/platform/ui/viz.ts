import React from "react";

/**
 * ui(id, element) — stamps a deterministic node ID onto a JSX element.
 *
 * Stamps two things:
 *   • __uiid prop — read by the visualizer barrel's wrapped components for
 *     selection and prop-override support (phase 2 / barrel-swap build).
 *   • data-uiid DOM attribute — used by useLiveNodeSelection for reliable
 *     click-to-select via DOM attribute lookup (no fragile text matching).
 *
 * In production the real UI barrel's components ignore both; overhead is one
 * cloneElement call per stamped element.
 *
 * Usage in layout files:
 *   import { ui } from '../../../../ui/viz';
 *   {ui('login.title', <Heading>{appName}</Heading>)}
 */
export function ui(id: string, element: React.ReactElement): React.ReactElement {
  return React.cloneElement(element, { __uiid: id, "data-uiid": id } as object);
}
