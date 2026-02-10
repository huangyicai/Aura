"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light" // Aura主题作为默认（使用light的配色）
      enableSystem={false} // 禁用系统主题，使用固定的Aura主题
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
