"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageItem = {
  id: string;
  label: string;
};

type PageMenuProps = {
  pages: PageItem[];
  activePage: string;
  onSelect: (page: string) => void;
  "aria-label"?: string;
};

export function PageMenu({
  pages,
  activePage,
  onSelect,
  "aria-label": ariaLabel,
}: PageMenuProps) {
  return (
    <nav
      className="ml-auto flex items-center gap-2"
      aria-label={ariaLabel}
    >
      {pages.map(({ id, label }) => {
        const isActive = activePage === id;
        return (
          <Button
            key={id}
            size="sm"
            variant="ghost"
            onClick={() => onSelect(id)}
            aria-current={isActive ? "page" : undefined}
            type="button"
            className={cn(
              "px-4 text-sm font-medium",
              isActive && "underline underline-offset-4"
            )}
          >
            {label}
          </Button>
        );
      })}
    </nav>
  );
}
