"use client";

import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { TranslateIcon } from "@hugeicons/core-free-icons";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="h-7 w-7 relative"
        >
          <HugeiconsIcon icon={TranslateIcon} className="h-4 w-4" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
            {locale === "en" ? "中" : "En"}
          </span>
          <span className="sr-only">{t("language.toggle")}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="font-medium">
          {locale === "en" ? "切换到中文" : "Switch to English"}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("language.en")} / {t("language.zh")}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
