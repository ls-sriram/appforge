import { z } from "zod";

export const ToastVariantSchema = z.enum(["info", "success", "warning", "error"]);
export type ToastVariant = z.infer<typeof ToastVariantSchema>;

export const ToastSchema = z.object({
  id: z.string(),
  message: z.string(),
  variant: ToastVariantSchema.default("info"),
  duration: z.number().optional(),
});

export type ToastItem = z.infer<typeof ToastSchema>;

export const ToastOptionsSchema = z.object({
  variant: ToastVariantSchema.optional(),
  duration: z.number().optional(),
});

export type ToastOptions = z.infer<typeof ToastOptionsSchema>;
