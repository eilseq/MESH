"use client";

import { Button } from "@/components/ui/button";
import {
  DockPanel,
  DockPanelContent,
  DockScrollArea,
  DockLogOutput,
} from "@/components/ui/dock-panel";
import { useEditor } from "@/hooks/useEditor";

export default function Console() {
  const { logs, clearLogs } = useEditor();
  const output = logs.length ? logs.join("\n") : "Console ready.";

  return (
    <DockPanel>
      <Button size="sm" variant="outline" onClick={clearLogs}>
        Clear
      </Button>
      <DockPanelContent>
        <DockScrollArea>
          <DockLogOutput value={output} />
        </DockScrollArea>
      </DockPanelContent>
    </DockPanel>
  );
}
