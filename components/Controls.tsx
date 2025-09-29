"use client";

import { Play, Square } from "lucide-react";
import { useId } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEditor } from "@/context/EditorContext";

export default function Controls() {
  const { autoRun, toggleAutoRun, run, stop } = useEditor();
  const switchId = useId();

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Runtime controls</CardTitle>
          <CardDescription>Toggle autorun or trigger sketch execution manually.</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor={switchId} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Auto-run
          </Label>
          <Switch id={switchId} checked={autoRun} onCheckedChange={toggleAutoRun} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button onClick={() => run && run()} className="gap-2">
          <Play className="h-4 w-4" />
          Run
        </Button>
        <Button variant="secondary" onClick={() => stop && stop()} className="gap-2">
          <Square className="h-4 w-4" />
          Stop
        </Button>
      </CardContent>
    </Card>
  );
}
