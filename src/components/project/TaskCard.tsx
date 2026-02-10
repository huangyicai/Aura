"use client";

import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TaskItem, TaskStatus } from "@/types";
import { useLanguage } from "@/lib/i18n";

interface TaskCardProps {
  task: TaskItem;
  onUpdate: (id: string, updates: { title?: string; status?: TaskStatus }) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<TaskStatus, string> = {
  pending: "bg-yellow-500",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
};

const nextStatus: Record<TaskStatus, TaskStatus> = {
  pending: "in_progress",
  in_progress: "completed",
  completed: "pending",
  failed: "pending",
};

function formatTime(dateStr: string, t: (key: string, params?: Record<string, string | number>) => string): string {
  const date = new Date(dateStr.includes("T") ? dateStr : dateStr + "Z");
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return t("project.justNow");
  if (diffMin < 60) return t("project.minAgo", { diffMin });
  if (diffHr < 24) return t("project.hrAgo", { diffHr });
  return date.toLocaleDateString();
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleStatusClick = () => {
    onUpdate(task.id, { status: nextStatus[task.status] });
  };

  const handleTitleSubmit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate(task.id, { title: trimmed });
    } else {
      setEditTitle(task.title);
    }
    setEditing(false);
  };

  return (
    <div
      className="group flex items-start gap-2 rounded-md border border-border p-2 transition-colors hover:bg-accent/50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Status dot */}
      <button
        onClick={handleStatusClick}
        className="mt-1 shrink-0"
        title={t("project.statusTooltip", { status: task.status })}
      >
        <span
          className={cn(
            "block h-2.5 w-2.5 rounded-full transition-transform hover:scale-125",
            statusColors[task.status]
          )}
        />
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSubmit();
              if (e.key === "Escape") {
                setEditTitle(task.title);
                setEditing(false);
              }
            }}
            className="w-full rounded border-none bg-transparent p-0 text-xs font-medium outline-none ring-1 ring-ring/30 px-1"
          />
        ) : (
          <p
            className={cn(
              "cursor-pointer truncate text-xs font-medium",
              task.status === "completed" && "text-muted-foreground line-through"
            )}
            onDoubleClick={() => setEditing(true)}
          >
            {task.title}
          </p>
        )}
        {task.description && (
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {task.description}
          </p>
        )}
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {formatTime(task.updated_at, t)}
        </p>
      </div>

      {/* Delete button */}
      {hovered && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onDelete(task.id)}
          className="shrink-0 text-muted-foreground hover:text-destructive"
        >
          <HugeiconsIcon icon={Delete02Icon} className="h-3 w-3" />
          <span className="sr-only">{t("project.deleteTask")}</span>
        </Button>
      )}
    </div>
  );
}
