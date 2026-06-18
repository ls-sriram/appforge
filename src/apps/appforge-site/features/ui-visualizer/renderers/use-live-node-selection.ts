import { useCallback, useRef } from "react";
import type { UiDocument } from "../domain/ui-document.types";

export function useLiveNodeSelection(
  doc: UiDocument,
  onSelectNode: (nodeId: string) => void,
) {
  const containerRef = useRef<HTMLElement | null>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      // Walk up the DOM from the clicked element to find the nearest
      // element stamped with data-uiid (set by ui() in layout files).
      // This is reliable and fast — no text matching needed.
      let el = e.target as Element | null;
      while (el && el !== containerRef.current) {
        const id = el.getAttribute("data-uiid");
        if (id) {
          onSelectNode(id);
          return;
        }
        el = el.parentElement;
      }
      // Fallback: select document root
      onSelectNode(doc.rootId);
    },
    [doc.rootId, onSelectNode],
  );

  const attachRef = useCallback(
    (el: HTMLElement | null) => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("click", handleClick);
      }
      containerRef.current = el;
      if (el) {
        el.addEventListener("click", handleClick);
      }
    },
    [handleClick],
  );

  return { attachRef };
}
