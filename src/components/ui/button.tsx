import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", ...props }, ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] shadow-sm",
        { "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md": variant === "default", "border bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline", "hover:bg-accent hover:text-accent-foreground": variant === "ghost", "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md": variant === "destructive", "min-h-[48px] px-4 py-3": size === "default", "min-h-[44px] h-9 rounded-md px-3": size === "sm", "min-h-[52px] h-11 px-8": size === "lg", "min-h-[48px] h-12 w-12": size === "icon" },
        className
      )}
      {...props}
    />
  );
});
