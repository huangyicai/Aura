'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { HugeiconsIcon } from "@hugeicons/react";
import { ServerStack01Icon, Wifi01Icon, GlobeIcon, CodeIcon } from "@hugeicons/core-free-icons";
import type { MCPServer } from '@/types';
import { useLanguage } from '@/lib/i18n';

type ServerType = 'stdio' | 'sse' | 'http';

interface McpServerEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name?: string;
  server?: MCPServer;
  onSave: (name: string, server: MCPServer) => void;
}

export function McpServerEditor({
  open,
  onOpenChange,
  name: initialName,
  server: initialServer,
  onSave,
}: McpServerEditorProps) {
  const { t } = useLanguage();
  const isEditing = !!initialName;
  const [name, setName] = useState(initialName || '');
  const [serverType, setServerType] = useState<ServerType>(
    initialServer?.type || 'stdio'
  );
  const [command, setCommand] = useState(initialServer?.command || '');
  const [args, setArgs] = useState(initialServer?.args?.join('\n') || '');
  const [url, setUrl] = useState(initialServer?.url || '');
  const [headersText, setHeadersText] = useState(
    initialServer?.headers ? JSON.stringify(initialServer.headers, null, 2) : '{}'
  );
  const [envText, setEnvText] = useState(
    initialServer?.env ? JSON.stringify(initialServer.env, null, 2) : '{}'
  );
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      setName(initialName || '');
      setServerType(initialServer?.type || 'stdio');
      setCommand(initialServer?.command || '');
      setArgs(initialServer?.args?.join('\n') || '');
      setUrl(initialServer?.url || '');
      setHeadersText(
        initialServer?.headers
          ? JSON.stringify(initialServer.headers, null, 2)
          : '{}'
      );
      setEnvText(
        initialServer?.env
          ? JSON.stringify(initialServer.env, null, 2)
          : '{}'
      );
      setJsonMode(false);
      setJsonText(
        initialServer
          ? JSON.stringify(initialServer, null, 2)
          : '{\n  "command": "",\n  "args": []\n}'
      );
      setError(null);
    }
  }, [open, initialName, initialServer]);

  function handleSave() {
    setError(null);

    if (!name.trim()) {
      setError(t('extensions.nameRequired'));
      return;
    }

    if (jsonMode) {
      try {
        const parsed = JSON.parse(jsonText);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          setError(t('extensions.invalidJson'));
          return;
        }
        onSave(name.trim(), parsed as MCPServer);
        onOpenChange(false);
      } catch {
        setError(t('extensions.invalidConfig'));
      }
      return;
    }

    // Validate based on server type
    if (serverType === 'stdio') {
      if (!command.trim()) {
        setError(t('extensions.commandRequired'));
        return;
      }
    } else {
      if (!url.trim()) {
        setError(t('extensions.urlRequired'));
        return;
      }
    }

    let env: Record<string, string> | undefined;
    try {
      const parsed = JSON.parse(envText);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        env = Object.keys(parsed).length > 0 ? parsed : undefined;
      } else {
        setError(t('extensions.invalidEnvJson'));
        return;
      }
    } catch {
      setError(t('extensions.invalidEnvFormat'));
      return;
    }

    let headers: Record<string, string> | undefined;
    if (serverType !== 'stdio') {
      try {
        const parsed = JSON.parse(headersText);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          headers = Object.keys(parsed).length > 0 ? parsed : undefined;
        } else {
          setError(t('extensions.invalidHeadersJson'));
          return;
        }
      } catch {
        setError(t('extensions.invalidHeadersFormat'));
        return;
      }
    }

    const serverArgs = args
      .split('\n')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const server: MCPServer = serverType === 'stdio'
      ? {
          command: command.trim(),
          ...(serverArgs.length > 0 ? { args: serverArgs } : {}),
          ...(env ? { env } : {}),
        }
      : {
          command: '',
          type: serverType,
          ...(url ? { url: url.trim() } : {}),
          ...(serverArgs.length > 0 ? { args: serverArgs } : {}),
          ...(env ? { env } : {}),
          ...(headers ? { headers } : {}),
        };

    onSave(name.trim(), server);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('extensions.editServer', { name: initialName || '' }) : t('extensions.addServerTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="server-name">{t('extensions.serverName')}</Label>
            <Input
              id="server-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder={t('extensions.serverNamePlaceholder')}
              disabled={isEditing}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="shrink-0">{t('extensions.editMode')}:</Label>
            <Button
              variant={jsonMode ? 'outline' : 'default'}
              size="sm"
              onClick={() => {
                setJsonMode(false);
                setError(null);
              }}
            >
              {t('extensions.formMode')}
            </Button>
            <Button
              variant={jsonMode ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => {
                // Build current config as JSON for the editor
                const currentConfig: Record<string, unknown> = {};
                if (serverType !== 'stdio') {
                  currentConfig.type = serverType;
                  if (url) currentConfig.url = url;
                } else {
                  currentConfig.command = command;
                }
                const argsArr = args.split('\n').map(s => s.trim()).filter(Boolean);
                if (argsArr.length > 0) currentConfig.args = argsArr;
                try {
                  const envParsed = JSON.parse(envText);
                  if (Object.keys(envParsed).length > 0) currentConfig.env = envParsed;
                } catch { /* ignore */ }
                try {
                  const headersParsed = JSON.parse(headersText);
                  if (Object.keys(headersParsed).length > 0) currentConfig.headers = headersParsed;
                } catch { /* ignore */ }
                setJsonText(JSON.stringify(currentConfig, null, 2));
                setJsonMode(true);
                setError(null);
              }}
            >
              <HugeiconsIcon icon={CodeIcon} className="h-3.5 w-3.5" />
              {t('extensions.jsonMode')}
            </Button>
          </div>

          {jsonMode ? (
            <div className="space-y-2">
              <Label>{t('extensions.serverConfigJson')}</Label>
              <Textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setError(null);
                }}
                className="font-mono text-sm min-h-[250px]"
                placeholder={t('extensions.jsonPlaceholder')}
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>{t('extensions.serverType')}</Label>
                <Tabs
                  value={serverType}
                  onValueChange={(v) => {
                    setServerType(v as ServerType);
                    setError(null);
                  }}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="stdio" className="flex-1 gap-1.5">
                      <HugeiconsIcon icon={ServerStack01Icon} className="h-3.5 w-3.5" />
                      {t('extensions.typeStdio')}
                    </TabsTrigger>
                    <TabsTrigger value="sse" className="flex-1 gap-1.5">
                      <HugeiconsIcon icon={Wifi01Icon} className="h-3.5 w-3.5" />
                      {t('extensions.typeSse')}
                    </TabsTrigger>
                    <TabsTrigger value="http" className="flex-1 gap-1.5">
                      <HugeiconsIcon icon={GlobeIcon} className="h-3.5 w-3.5" />
                      {t('extensions.typeHttp')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {serverType === 'stdio' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="server-command">{t('extensions.command')}</Label>
                    <Input
                      id="server-command"
                      value={command}
                      onChange={(e) => {
                        setCommand(e.target.value);
                        setError(null);
                      }}
                      placeholder={t('extensions.commandPlaceholder')}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="server-args">{t('extensions.args')}</Label>
                    <Textarea
                      id="server-args"
                      value={args}
                      onChange={(e) => setArgs(e.target.value)}
                      placeholder={t('extensions.argsPlaceholder')}
                      className="font-mono text-sm min-h-[80px]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="server-url">{t('extensions.url')}</Label>
                    <Input
                      id="server-url"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setError(null);
                      }}
                      placeholder={
                        serverType === 'sse'
                          ? t('extensions.urlSsePlaceholder')
                          : t('extensions.urlPlaceholder')
                      }
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="server-headers">{t('extensions.headers')}</Label>
                    <Textarea
                      id="server-headers"
                      value={headersText}
                      onChange={(e) => {
                        setHeadersText(e.target.value);
                        setError(null);
                      }}
                      placeholder={t('extensions.headersPlaceholder')}
                      className="font-mono text-sm min-h-[80px]"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="server-env">{t('extensions.envVars')}</Label>
                <Textarea
                  id="server-env"
                  value={envText}
                  onChange={(e) => {
                    setEnvText(e.target.value);
                    setError(null);
                  }}
                  placeholder={t('extensions.envVarsPlaceholder')}
                  className="font-mono text-sm min-h-[80px]"
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('extensions.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
