"use client";

import React, { type PropsWithChildren } from "react";
import { formatUsd, type Token } from "@bera/berajs";
import { cn } from "@bera/ui";

import { TokenIcon } from "./token-icon";
import { getSafeNumber } from "../../../apps/bgt-station/src/utils/getSafeNumber";

interface PreviewToken {
  token: Token | undefined;
  weight?: number | string;
  value: number | string | undefined;
  price?: number;
}

export function PreviewToken({ token, value, price }: PreviewToken) {
  return (
    <li className={"flex w-full flex-row items-center  justify-between p-2"}>
      <div className="flex cursor-not-allowed items-center justify-center gap-2">
        <>
          <TokenIcon address={token?.address ?? ""} />
          <span className="text-sm font-medium">{token?.symbol}</span>
        </>
      </div>
      <div className="flex grow-0 cursor-not-allowed flex-col border-0 p-0 text-right text-sm text-muted-foreground outline-none">
        {value}
        {value !== undefined && price !== undefined && (
          <span className="text-xs">
            ({formatUsd(getSafeNumber(value as any) * price)})
          </span>
        )}
      </div>
    </li>
  );
}

interface TokenListProps extends PropsWithChildren {
  className?: string;
}
export function TokenList({ children, className }: TokenListProps) {
  return (
    <ul
      role="list"
      className={cn(
        "divide flex flex-col divide-y divide-border rounded-lg border",
        className,
      )}
    >
      {children}
    </ul>
  );
}
