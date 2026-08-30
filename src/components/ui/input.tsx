import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, type, ...props }, ref) {
    return <input type={type} className={cn("flex min-h-[48px] h-12 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring shadow-sm focus:shadow-md disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />;
  }
);
