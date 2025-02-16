import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils/cn";

const buttonVariants = cva(
  "inline-flex h-fit items-center justify-center transition-duration-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary:
          "bg-muted border border-border text-muted-foreground hover:text-foreground",
        outline:
          "bg-transparent text-secondary-foreground border border-secondary-foreground hover:bg-secondary",
        ghost: "text-muted-foreground hover:bg-muted",
        link: "underline-offset-4 hover:underline text-primary",
        destructive:
          "bg-destructive-foreground text-accent-foreground hover:opacity-90",
        warning:
          "bg-warning-foreground text-accent-foreground hover:opacity-90",
        success:
          "bg-success-foreground text-accent-foreground hover:opacity-90",
        info: "bg-info-foreground text-accent-foreground hover:opacity-90",
      },
      size: {
        lg: "px-4 py-3 rounded-md text-lg font-semibold",
        md: "px-4 py-2 rounded-md text-lg font-semibold leading-7",
        sm: "px-2 py-1 rounded-sm text-sm font-semibold leading-tight",
        xs: "px-1 py-1/2 rounded-sm text-xs font-medium leading-tight",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    as?: React.ElementType;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, as, ...props }, ref) => {
    const Component = as || "button";
    return React.createElement(Component, {
      className: cn(buttonVariants({ variant, size, className })),
      ref,
      ...props,
    });
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
