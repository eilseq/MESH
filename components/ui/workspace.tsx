import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const WorkspaceShell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-screen flex-col overflow-hidden", className)}
    {...props}
  />
));
WorkspaceShell.displayName = "WorkspaceShell";

const WorkspaceHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <header
    ref={ref}
    className={cn("flex-shrink-0 border-b bg-card/80 backdrop-blur", className)}
    {...props}
  >
    <div className="flex w-full flex-wrap items-center gap-4 px-6 py-4">
      {children}
    </div>
  </header>
));
WorkspaceHeader.displayName = "WorkspaceHeader";

const WorkspaceHeaderMeta = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-xs uppercase tracking-[0.3em] text-muted-foreground",
      className
    )}
    {...props}
  />
));
WorkspaceHeaderMeta.displayName = "WorkspaceHeaderMeta";

const WorkspaceHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "text-2xl font-semibold tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
WorkspaceHeaderTitle.displayName = "WorkspaceHeaderTitle";

const WorkspaceHeaderStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
));
WorkspaceHeaderStack.displayName = "WorkspaceHeaderStack";

const WorkspaceHeaderSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    orientation="vertical"
    className={cn("hidden h-12 lg:block", className)}
    {...props}
  />
));
WorkspaceHeaderSeparator.displayName = "WorkspaceHeaderSeparator";

const WorkspaceSearchArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-auto flex w-full max-w-xl items-center gap-3", className)}
    {...props}
  />
));
WorkspaceSearchArea.displayName = "WorkspaceSearchArea";

const WorkspaceSearchInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn(
      "h-11 rounded-lg border-muted bg-muted/40 text-base",
      className
    )}
    {...props}
  />
));
WorkspaceSearchInput.displayName = "WorkspaceSearchInput";

const WorkspaceMain = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col overflow-hidden", className)}
    {...props}
  />
));
WorkspaceMain.displayName = "WorkspaceMain";

const WorkspaceColumns = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full flex-1 flex-col overflow-hidden lg:flex-row",
      className
    )}
    {...props}
  />
));
WorkspaceColumns.displayName = "WorkspaceColumns";

const workspacePaneVariants = cva(
  "flex h-full w-full min-h-0 flex-col overflow-hidden",
  {
    variants: {
      size: {
        editor: "lg:w-[40%]",
        preview: "lg:w-[60%]",
      },
    },
    defaultVariants: {
      size: "editor",
    },
  }
);

interface WorkspacePaneProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof workspacePaneVariants> {}

const WorkspacePane = React.forwardRef<HTMLElement, WorkspacePaneProps>(
  ({ className, size, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(workspacePaneVariants({ size }), className)}
      {...props}
    />
  )
);
WorkspacePane.displayName = "WorkspacePane";

const WorkspacePaneCard = React.forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentPropsWithoutRef<typeof Card>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
    {...props}
  />
));
WorkspacePaneCard.displayName = "WorkspacePaneCard";

interface WorkspacePaneCardHeaderProps {
  title: string;
  description?: string;
  meta?: React.ReactNode;
  className?: string;
}

const WorkspacePaneCardHeader = ({
  title,
  description,
  meta,
  className,
}: WorkspacePaneCardHeaderProps) => (
  <CardHeader
    className={cn(
      "flex flex-row items-center justify-between gap-4",
      className
    )}
  >
    <div className="space-y-1">
      <CardTitle className="text-xl">{title}</CardTitle>
      {description ? (
        <CardDescription className="text-base text-muted-foreground">
          {description}
        </CardDescription>
      ) : null}
    </div>
    {meta}
  </CardHeader>
);

const WorkspacePaneCardContent = React.forwardRef<
  React.ElementRef<typeof CardContent>,
  React.ComponentPropsWithoutRef<typeof CardContent>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn("flex flex-1 flex-col gap-4 overflow-hidden", className)}
    {...props}
  />
));
WorkspacePaneCardContent.displayName = "WorkspacePaneCardContent";

const WorkspacePaneCardFooter = React.forwardRef<
  React.ElementRef<typeof CardFooter>,
  React.ComponentPropsWithoutRef<typeof CardFooter>
>(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn(
      "border-t px-6 py-4 text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
));
WorkspacePaneCardFooter.displayName = "WorkspacePaneCardFooter";

const WorkspaceDock = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-h-[390px] flex-col overflow-hidden border bg-card",
      className
    )}
    {...props}
  />
));
WorkspaceDock.displayName = "WorkspaceDock";

interface WorkspaceDockHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  action?: React.ReactNode;
}

const WorkspaceDockHeader = ({
  title,
  action,
  className,
  ...props
}: WorkspaceDockHeaderProps) => (
  <div
    className={cn(
      "flex flex-shrink-0 items-center justify-between border-b px-4 py-3",
      className
    )}
    {...props}
  >
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
      {title}
    </span>
    {action}
  </div>
);

const WorkspaceDockContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 overflow-hidden px-4 py-4", className)}
    {...props}
  />
));
WorkspaceDockContent.displayName = "WorkspaceDockContent";

const WorkspaceFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn("flex-shrink-0 border-t bg-card", className)}
    {...props}
  >
    <div className="flex w-full items-center gap-2 px-4 py-3">
      {children}
    </div>
  </footer>
));
WorkspaceFooter.displayName = "WorkspaceFooter";

export {
  WorkspaceShell,
  WorkspaceHeader,
  WorkspaceHeaderMeta,
  WorkspaceHeaderTitle,
  WorkspaceHeaderStack,
  WorkspaceHeaderSeparator,
  WorkspaceSearchArea,
  WorkspaceSearchInput,
  WorkspaceMain,
  WorkspaceColumns,
  WorkspacePane,
  WorkspacePaneCard,
  WorkspacePaneCardHeader,
  WorkspacePaneCardContent,
  WorkspacePaneCardFooter,
  WorkspaceDock,
  WorkspaceDockHeader,
  WorkspaceDockContent,
  WorkspaceFooter,
};
