"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "@/context/EditorContext";

export default function Console() {
  const { logs } = useEditor();
  const output = logs.length ? logs.join("\n") : "Console ready.";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Console</CardTitle>
        <CardDescription>Logs emitted from your sketch runtime.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
          <pre className="whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
