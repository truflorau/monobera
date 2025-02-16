"use client";

import React, { type PropsWithChildren } from "react";
import { BeraWagmi } from "@bera/wagmi";

import { ThemeProvider } from "~/components/theme-provider";

export default function Providers({ children }: PropsWithChildren<any>) {
  return (
    <BeraWagmi>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </BeraWagmi>
  );
}
