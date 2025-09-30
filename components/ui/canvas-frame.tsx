import * as React from "react";

import { cn } from "@/lib/utils";

const CanvasFrame = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full min-h-[220px] items-center justify-center overflow-hidden bg-black [&>canvas]:max-h-full [&>canvas]:max-w-full [&>canvas]:object-contain",
      className
    )}
    {...props}
  />
));
CanvasFrame.displayName = "CanvasFrame";

export { CanvasFrame };
