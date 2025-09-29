"use client";

import { Button } from "@/components/ui/button";
import {
  DockPanel,
  DockPanelHeader,
  DockPanelContent,
  DockScrollArea,
  DockLogOutput,
} from "@/components/ui/dock-panel";
import { useEditor } from "@/context/EditorContext";

export default function Console() {
  const { logs, clearLogs } = useEditor();
  const output = logs.length ? logs.join("\n") : "Console ready.";

  return (
    <DockPanel>
      <DockPanelHeader
        title="Console Output"
        description="Logs emitted from your sketch runtime."
        action={
          <Button size="sm" variant="outline" onClick={clearLogs}>
            Clear
          </Button>
        }
      />
      <DockPanelContent>
        <DockScrollArea>
          <DockLogOutput value={output} />
        </DockScrollArea>
      </DockPanelContent>
    </DockPanel>
  );
}
