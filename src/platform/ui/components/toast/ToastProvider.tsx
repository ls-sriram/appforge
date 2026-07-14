import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { haptics } from "../../primitives/haptics";
import { Toast } from "./Toast";
import type { ToastItem, ToastOptions, ToastVariant } from "./toast.contract";

const DEFAULT_DURATION = 3000;

interface ToastContextValue {
  show(message: string, options?: ToastOptions): string;
  dismiss(id: string): void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast() must be called within a ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const insets = useSafeAreaInsets();

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const variant: ToastVariant = options?.variant ?? "info";
      const duration = options?.duration ?? DEFAULT_DURATION;

      setItems((prev) => [...prev, { id, message, variant, duration }]);

      if (variant === "success" || variant === "warning" || variant === "error") {
        void haptics.notification(variant);
      }

      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);

      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Modal visible={items.length > 0} transparent animationType="none" statusBarTranslucent>
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            top: insets.top + 12,
            left: 12,
            right: 12,
            gap: 8,
          }}
        >
          {items.map((item) => (
            <Toast key={item.id} item={item} />
          ))}
        </View>
      </Modal>
    </ToastContext.Provider>
  );
}
