import React from "react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { perpsName } from "@bera/config";
import { type Market } from "@bera/proto/src";
import { type Address } from "viem";

import { MarketImages } from "~/utils/marketImages";
import { MarketTokenNames } from "~/utils/marketTokenNames";
import {
  getDailyPriceChange,
  getGlobalParams,
  getHistoricalSummary,
  getMarkets,
} from "~/endpoints";
import { type IMarket } from "~/types/market";
import { GeneralInfoBanner } from "./components/general-info-banner";
import { InstrumentDropdown } from "./components/instrument-dropdown";
import { OneClickBanner } from "./components/one-click-banner";
import OrderWrapper from "./components/order-wrapper";
import { ReferralModal } from "./components/referral-modal";

const DEFAULT_MARKET = "ETH-USDC";
export const revalidate = 30;

export function generateMetadata(): Metadata {
  return {
    title: `${DEFAULT_MARKET} | ${perpsName}`,
  };
}

export default async function Home({
  searchParams: { ref },
}: {
  searchParams: {
    ref: Address | undefined;
  };
}) {
  const m = getMarkets();
  const p = getGlobalParams();
  const pc = getDailyPriceChange();
  const hs = getHistoricalSummary();
  const data: any = await Promise.all([m, p, pc, hs]).then(
    ([markets, params, priceChange, historicalSummary]) => ({
      markets,
      params,
      priceChange,
      historicalSummary,
    }),
  );

  const markets: IMarket[] = data.markets.map((m: Market) => {
    const historicalInfo = data.historicalSummary.find(
      (h: any) => h.pair_index.toString() === m.pair_index,
    );
    return {
      ...m,
      imageUri: MarketImages[m.name],
      tokenName: MarketTokenNames[m.name],
      dailyVolume: historicalInfo === undefined ? 0 : historicalInfo.volume,
      dailyNumOfTrades:
        historicalInfo === undefined ? 0 : historicalInfo.num_trades,
    };
  });

  const defaultMarket = markets.find((m: Market) => m.name === DEFAULT_MARKET);

  if (!data || !defaultMarket || !data.params) {
    // notFound();
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <ReferralModal referralAddress={ref} />
      <div className="flex h-fit w-full flex-col lg:flex-row">
        <OneClickBanner className="mb-0 flex lg:hidden" />
        <div className="mx-2 mt-2 h-fit w-[calc(100%-16px)] flex-shrink-0 flex-grow-0 rounded-md border border-border lg:mr-0 lg:w-[400px]">
          <InstrumentDropdown
            markets={markets}
            selectedMarket={defaultMarket as IMarket}
            priceChange={data.priceChange}
          />
        </div>
        <GeneralInfoBanner
          market={defaultMarket as IMarket}
          priceChange={data.priceChange}
        />
        <OneClickBanner className="hidden lg:flex" />
      </div>
      <OrderWrapper
        markets={markets}
        defaultMarket={defaultMarket as IMarket}
        params={data?.params}
      />
    </div>
  );
}
