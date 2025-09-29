"use client";

import { EditorProvider } from "@/context/EditorContext";
import Editor from "@/components/Editor";
import Canvas from "@/components/Canvas";
import Controls from "@/components/Controls";
import Console from "@/components/Console";
import BlueskyPost from "@/components/BlueskyPost";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  return (
    <EditorProvider>
      <main className="container grid gap-6 py-6 lg:grid-cols-[1.1fr_1fr] lg:py-10">
        <Card className="self-start">
          <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg">sketch.js</CardTitle>
              <CardDescription>Write your p5.js sketch. Changes are saved automatically.</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit uppercase tracking-wide">
              Autosave
            </Badge>
          </CardHeader>
          <CardContent>
            <Editor />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 text-xs text-muted-foreground">
            Tip: your code stays in local storage between visits.
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Canvas Preview</CardTitle>
              <CardDescription>Live output rendered from your sketch.</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <Canvas />
            </CardContent>
          </Card>

          <Controls />
          <Console />
          <BlueskyPost />
        </div>
      </main>
    </EditorProvider>
  );
}
