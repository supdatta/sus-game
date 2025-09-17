import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const pixelButtonVariants = cva(
  "pixel-button-base font-pixel uppercase tracking-wide cursor-pointer inline-block",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground border-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground border-secondary-foreground",
        accent: "bg-accent text-accent-foreground border-accent-foreground",
        outline: "bg-transparent text-foreground border-foreground hover:bg-foreground hover:text-background",
        hero: "bg-primary/80 backdrop-blur-sm text-white border-primary hover:bg-primary animate-pixel-glow",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        default: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pixelButtonVariants> {}

const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(pixelButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

PixelButton.displayName = "PixelButton";

export { PixelButton, pixelButtonVariants };