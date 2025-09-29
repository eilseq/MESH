import * as React from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const DockPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full min-h-[220px] flex-1 flex-col gap-5",
      className
    )}
    {...props}
  />
));
DockPanel.displayName = "DockPanel";

interface DockPanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const DockPanelHeader = ({
  title,
  description,
  action,
  className,
  ...props
}: DockPanelHeaderProps) => (
  <div
    className={cn("flex flex-shrink-0 items-center justify-between", className)}
    {...props}
  >
    <div className="space-y-1">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);

const DockPanelContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col overflow-hidden", className)}
    {...props}
  />
));
DockPanelContent.displayName = "DockPanelContent";

const DockScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  React.ComponentPropsWithoutRef<typeof ScrollArea>
>(({ className, children, ...props }, ref) => (
  <ScrollArea
    ref={ref}
    className={cn("flex-1 overflow-hidden bg-muted/40", className)}
    {...props}
  >
    <div className="p-4 text-sm text-muted-foreground">{children}</div>
  </ScrollArea>
));
DockScrollArea.displayName = "DockScrollArea";

interface DockLogOutputProps {
  value: string;
}

const DockLogOutput = ({ value }: DockLogOutputProps) => (
  <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
    {value}
  </pre>
);

const DockForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-5", className)} {...props} />
));
DockForm.displayName = "DockForm";

const DockFormGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid gap-4 sm:grid-cols-2", className)}
    {...props}
  />
));
DockFormGrid.displayName = "DockFormGrid";

const DockFormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
));
DockFormField.displayName = "DockFormField";

const DockFormFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
      className
    )}
    {...props}
  />
));
DockFormFooter.displayName = "DockFormFooter";

const DockFormStatus = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
DockFormStatus.displayName = "DockFormStatus";

const DockFormNote = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
DockFormNote.displayName = "DockFormNote";

export {
  DockPanel,
  DockPanelHeader,
  DockPanelContent,
  DockScrollArea,
  DockLogOutput,
  DockForm,
  DockFormGrid,
  DockFormField,
  DockFormFooter,
  DockFormStatus,
  DockFormNote,
};
