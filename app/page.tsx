"use client";

import { useCallback, useMemo, useState } from "react";

import Editor from "@/components/Editor";
import Canvas from "@/components/Canvas";
import Console from "@/components/Console";
import BlueskyPost from "@/components/BlueskyPost";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
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
} from "@/components/ui/workspace";
import { EditorProvider, useEditor } from "@/context/EditorContext";
import { Play, Share2, Square, Terminal, X, Zap } from "lucide-react";

export default function Page() {
  return (
    <EditorProvider>
      <Workspace />
    </EditorProvider>
  );
}

type PanelKey = "console" | "share" | null;

type FooterAction = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  toggle?: Exclude<PanelKey, null>;
  active?: boolean;
  disabled?: boolean;
};

function Workspace() {
  const { run, stop, autoRun, toggleAutoRun } = useEditor();
  const [activePanel, setActivePanel] = useState<PanelKey>(null);

  const handleRun = useCallback(() => {
    run?.();
  }, [run]);

  const handleStop = useCallback(() => {
    stop?.();
  }, [stop]);

  const handleTogglePanel = useCallback((panel: Exclude<PanelKey, null>) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  const footerActions: FooterAction[] = useMemo(
    () => [
      {
        id: "run",
        label: "Run sketch",
        icon: Play,
        onClick: handleRun,
        disabled: !run,
      },
      {
        id: "stop",
        label: "Stop sketch",
        icon: Square,
        onClick: handleStop,
        disabled: !stop,
      },
      {
        id: "autorun",
        label: autoRun ? "Disable auto-run" : "Enable auto-run",
        icon: Zap,
        onClick: toggleAutoRun,
        active: autoRun,
      },
      {
        id: "console",
        label: activePanel === "console" ? "Hide console" : "Show console",
        icon: Terminal,
        toggle: "console",
        active: activePanel === "console",
      },
      {
        id: "share",
        label:
          activePanel === "share" ? "Hide Bluesky tools" : "Open Bluesky tools",
        icon: Share2,
        toggle: "share",
        active: activePanel === "share",
      },
    ],
    [activePanel, autoRun, handleRun, handleStop, run, stop, toggleAutoRun]
  );

  return (
    <TooltipProvider
      delayDuration={150}
      skipDelayDuration={80}
      disableHoverableContent
    >
      <WorkspaceShell>
        <Header />
        <WorkspaceMain>
          <WorkspaceColumns>
            <EditorPane />
            <PreviewPane
              activePanel={activePanel}
              onClose={() => setActivePanel(null)}
            />
          </WorkspaceColumns>
        </WorkspaceMain>
        <FooterBar actions={footerActions} onTogglePanel={handleTogglePanel} />
      </WorkspaceShell>
    </TooltipProvider>
  );
}

function Header() {
  return (
    <WorkspaceHeader>
      <WorkspaceHeaderStack>
        <WorkspaceHeaderMeta>Creative Coding Zine</WorkspaceHeaderMeta>
        <WorkspaceHeaderTitle>MESH</WorkspaceHeaderTitle>
      </WorkspaceHeaderStack>
      <WorkspaceHeaderSeparator />
      <WorkspaceSearchArea>
        <WorkspaceSearchInput placeholder="Search your sketch" />
      </WorkspaceSearchArea>
    </WorkspaceHeader>
  );
}

function EditorPane() {
  return (
    <WorkspacePane size="editor">
      <WorkspacePaneCard>
        <WorkspacePaneCardHeader
          title="sketch.js"
          meta={<Badge variant="outline">Autosave</Badge>}
        />
        <WorkspacePaneCardContent>
          <Editor />
        </WorkspacePaneCardContent>
      </WorkspacePaneCard>
    </WorkspacePane>
  );
}

function PreviewPane({
  activePanel,
  onClose,
}: {
  activePanel: PanelKey;
  onClose: () => void;
}) {
  return (
    <WorkspacePane size="preview">
      <Canvas />
      {activePanel && (
        <WorkspaceDock>
          <WorkspaceDockHeader
            title={activePanel === "console" ? "Console" : "Bluesky Tools"}
            action={
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                aria-label="Close panel"
              >
                <X size={20} />
              </Button>
            }
          />
          <WorkspaceDockContent>
            {activePanel === "console" ? <Console /> : <BlueskyPost />}
          </WorkspaceDockContent>
        </WorkspaceDock>
      )}
    </WorkspacePane>
  );
}

function FooterBar({
  actions,
  onTogglePanel,
}: {
  actions: FooterAction[];
  onTogglePanel: (panel: Exclude<PanelKey, null>) => void;
}) {
  return (
    <WorkspaceFooter>
      {actions.map(
        ({ id, label, icon: Icon, onClick, toggle, active, disabled }) => {
          const handleClick = () => {
            if (disabled) return;
            if (toggle) {
              onTogglePanel(toggle);
            } else {
              onClick?.();
            }
          };

          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={resolveButtonVariant(id, active)}
                  onClick={handleClick}
                  aria-label={label}
                  aria-pressed={active ? true : undefined}
                  disabled={disabled}
                >
                  <Icon size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{label}</TooltipContent>
            </Tooltip>
          );
        }
      )}
    </WorkspaceFooter>
  );
}

function resolveButtonVariant(actionId: string, active?: boolean) {
  if (active) return "outline" as const;
  return "ghost" as const;
}
