import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { haptics } from "../../primitives/haptics";
import { Sheet } from "./Sheet";
import type { SheetOptions } from "./sheet.contract";

interface SheetContextValue {
  open(content: ReactNode, options?: SheetOptions): void;
  close(): void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function useSheet(): SheetContextValue {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("useSheet() must be called within a SheetProvider");
  }
  return ctx;
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);
  const [options, setOptions] = useState<SheetOptions>({ dismissOnScrimPress: true });
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next: ReactNode, nextOptions?: SheetOptions) => {
    setContent(next);
    setOptions({ dismissOnScrimPress: nextOptions?.dismissOnScrimPress ?? true });
    setIsOpen(true);
    void haptics.impact("light");
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <SheetContext.Provider value={value}>
      {children}
      <Sheet open={isOpen} onClose={close} dismissOnScrimPress={options.dismissOnScrimPress} content={content} />
    </SheetContext.Provider>
  );
}
