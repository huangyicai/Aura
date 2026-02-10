"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface ClaudeStatus {
  connected: boolean;
  version: string | null;
}

export function ConnectionStatus() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<ClaudeStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/claude-status");
      if (res.ok) {
        const data: ClaudeStatus = await res.json();
        setStatus(data);
      }
    } catch {
      setStatus({ connected: false, version: null });
    }
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const connected = status?.connected ?? false;

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className={cn(
          "flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium transition-colors",
          status === null
            ? "bg-muted text-muted-foreground"
            : connected
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              : "bg-red-500/15 text-red-700 dark:text-red-400"
        )}
      >
        <span
          className={cn(
            "block h-1.5 w-1.5 shrink-0 rounded-full",
            status === null
              ? "bg-muted-foreground/40"
              : connected
                ? "bg-emerald-500"
                : "bg-red-500"
          )}
        />
        {status === null
          ? t("connection.checking")
          : connected
            ? t("connection.connected")
            : t("connection.disconnected")}
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {connected ? t("connection.titleConnected") : t("connection.titleDisconnected")}
            </DialogTitle>
            <DialogDescription>
              {connected
                ? t("connection.connectedDesc", { version: status?.version || "" })
                : t("connection.disconnectedDesc")}
            </DialogDescription>
          </DialogHeader>

          {connected ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 px-4 py-3">
                <span className="block h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">{t("connection.active")}</p>
                  <p className="text-xs text-muted-foreground">v{status?.version}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 rounded-lg bg-red-500/10 px-4 py-3">
                <span className="block h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
                <p className="font-medium text-red-700 dark:text-red-400">{t("connection.notDetected")}</p>
              </div>

              <div>
                <h4 className="font-medium mb-1.5">{t("connection.installStep")}</h4>
                <code className="block rounded-md bg-muted px-3 py-2 text-xs">
                  npm install -g @anthropic-ai/claude-code
                </code>
              </div>

              <div>
                <h4 className="font-medium mb-1.5">{t("connection.authStep")}</h4>
                <code className="block rounded-md bg-muted px-3 py-2 text-xs">
                  claude login
                </code>
              </div>

              <div>
                <h4 className="font-medium mb-1.5">{t("connection.verifyStep")}</h4>
                <code className="block rounded-md bg-muted px-3 py-2 text-xs">
                  claude --version
                </code>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                checkStatus();
              }}
            >
              {t("common.refresh")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
