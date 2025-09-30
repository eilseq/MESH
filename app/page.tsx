"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  WorkspaceShell,
  WorkspaceHeader,
  WorkspaceHeaderMeta,
  WorkspaceHeaderTitle,
  WorkspaceHeaderStack,
  WorkspaceHeaderSeparator,
  WorkspaceMain,
  WorkspaceColumns,
  WorkspacePane,
  WorkspacePaneCard,
  WorkspacePaneCardHeader,
  WorkspacePaneCardContent,
  WorkspaceDock,
  WorkspaceDockHeader,
  WorkspaceDockContent,
  WorkspaceFooter,
} from "@/components/ui/workspace";
import { PageMenu } from "@/components/PageMenu";
import { EditorProvider, useEditor } from "@/context/EditorContext";
import { Play, Share2, Square, Terminal, X, Zap } from "lucide-react";
import AboutPage from "@/components/AboutPage";
import ArchivePage from "@/components/ArchivePage";

export default function Page() {
  return (
    <EditorProvider>
      <Workspace />
    </EditorProvider>
  );
}

type PanelKey = "console" | "share" | null;

type WorkspacePage = "editor" | "archive" | "about";

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
  const [activePage, setActivePage] = useState<WorkspacePage>("editor");

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
          activePanel === "share"
            ? "Hide publishing tools"
            : "Open publishing tools",
        icon: Share2,
        toggle: "share",
        active: activePanel === "share",
      },
    ],
    [activePanel, autoRun, handleRun, handleStop, run, stop, toggleAutoRun]
  );

  const handleSelectPage = useCallback((page: WorkspacePage) => {
    setActivePage(page);
    if (page !== "editor") {
      setActivePanel(null);
    }
    if (typeof window !== "undefined") {
      const hash = page === "editor" ? "" : `#${page}`;
      const baseUrl = `${window.location.pathname}${window.location.search}`;
      const nextUrl = hash ? `${baseUrl}${hash}` : baseUrl;
      window.history.replaceState(null, "", nextUrl);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#about") {
        setActivePage("about");
        setActivePanel(null);
      } else if (hash === "#archive") {
        setActivePage("archive");
        setActivePanel(null);
      } else if (!hash || hash === "#editor") {
        setActivePage("editor");
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <TooltipProvider
      delayDuration={150}
      skipDelayDuration={80}
      disableHoverableContent
    >
      <WorkspaceShell>
        <Header activePage={activePage} onSelectPage={handleSelectPage} />
        {activePage === "editor" ? (
          <>
            <WorkspaceMain>
              <WorkspaceColumns>
                <EditorPane />
                <PreviewPane
                  activePanel={activePanel}
                  onClose={() => setActivePanel(null)}
                />
              </WorkspaceColumns>
            </WorkspaceMain>
            <FooterBar
              actions={footerActions}
              onTogglePanel={handleTogglePanel}
            />
          </>
        ) : (
          <WorkspaceMain className="overflow-y-auto">
            {activePage === "about" ? <AboutPage /> : <ArchivePage />}
          </WorkspaceMain>
        )}
      </WorkspaceShell>
    </TooltipProvider>
  );
}

function Header({
  activePage,
  onSelectPage,
}: {
  activePage: WorkspacePage;
  onSelectPage: (page: WorkspacePage) => void;
}) {
  return (
    <WorkspaceHeader>
      <WorkspaceHeaderStack>
        <WorkspaceHeaderMeta>Creative Coding Zine</WorkspaceHeaderMeta>
        <WorkspaceHeaderTitle>MESH</WorkspaceHeaderTitle>
      </WorkspaceHeaderStack>
      <WorkspaceHeaderSeparator />
      <PageMenu
        pages={[
          { id: "editor", label: "Editor" },
          { id: "archive", label: "Archive" },
          { id: "about", label: "About" },
        ]}
        activePage={activePage}
        onSelect={onSelectPage}
        aria-label="Primary pages"
      />
    </WorkspaceHeader>
  );
}

function EditorPane() {
  return (
    <WorkspacePane size="editor">
      <Editor />
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
            title={activePanel === "console" ? "Console" : "Publishing Tools"}
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
          <WorkspaceDockContent className="h-20">
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
      <div className="flex items-center gap-2">
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
      </div>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </WorkspaceFooter>
  );
}

function resolveButtonVariant(actionId: string, active?: boolean) {
  if (active) return "outline" as const;
  return "ghost" as const;
}
