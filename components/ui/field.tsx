import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const fieldStackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1.5",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
    grow: {
      false: "",
      true: "flex-1 min-h-0",
    },
  },
  defaultVariants: {
    gap: "sm",
    grow: false,
  },
});

interface FieldStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fieldStackVariants> {}

const FieldStack = React.forwardRef<HTMLDivElement, FieldStackProps>(
  ({ className, gap, grow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(fieldStackVariants({ gap, grow }), className)}
      {...props}
    />
  )
);
FieldStack.displayName = "FieldStack";

const FieldGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid gap-4 sm:grid-cols-2", className)} {...props} />
  )
);
FieldGrid.displayName = "FieldGrid";

const FieldRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    />
  )
);
FieldRow.displayName = "FieldRow";

const FieldStatus = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
);
FieldStatus.displayName = "FieldStatus";

const FieldNote = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
);
FieldNote.displayName = "FieldNote";

export { FieldStack, FieldGrid, FieldRow, FieldStatus, FieldNote };
