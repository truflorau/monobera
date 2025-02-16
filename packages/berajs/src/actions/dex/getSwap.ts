import { beraTokenAddress, nativeTokenAddress } from "@bera/config";
import { PublicClient, formatUnits, getAddress } from "viem";

import { multiswapAbi } from "~/abi";
import { SwapInfoV3 } from "~/hooks";
import { SwapRequest } from "~/types";
import { BeraConfig } from "~/types/global";
import { getRoute } from "./getRoute";

/**
 * Returns the optimal swap path and return amount for a given swap request
 */

export const getSwap = async ({
  args,
  config,
  publicClient,
}: {
  args: SwapRequest;
  config: BeraConfig;
  publicClient: PublicClient;
}): Promise<SwapInfoV3 | undefined> => {
  const { tokenIn, tokenOutDecimals } = args;
  if (!publicClient) {
    console.error("Public client not found");
    return undefined;
  }
  if (!config.contracts?.crocMultiSwapAddress) {
    console.error("Croc MultiSwap address not found");
    return undefined;
  }
  const swapInfo = await getRoute({
    args,
    config,
  });

  const batchSwapSteps = swapInfo.batchSwapSteps;

  if (batchSwapSteps?.length) {
    const previewBatchSwapSteps = [...batchSwapSteps];

    if (
      previewBatchSwapSteps[0] &&
      getAddress(tokenIn) === getAddress(nativeTokenAddress)
    ) {
      if (
        previewBatchSwapSteps[0].base.toLowerCase() ===
        nativeTokenAddress.toLowerCase()
      ) {
        previewBatchSwapSteps[0].base = beraTokenAddress;
      }

      if (
        previewBatchSwapSteps[0].quote.toLowerCase() ===
        nativeTokenAddress.toLowerCase()
      ) {
        previewBatchSwapSteps[0].quote = beraTokenAddress;
      }
    }

    try {
      const result = await publicClient.readContract({
        address: config.contracts.crocMultiSwapAddress,
        abi: multiswapAbi,
        functionName: "previewMultiSwap",
        args: [previewBatchSwapSteps, swapInfo.amountIn],
      });

      const amountOut = (result as bigint[])[0] as bigint;
      const formattedAmountOut = formatUnits(amountOut, tokenOutDecimals);
      const predictedAmountOut = (result as bigint[])[1] as bigint;
      const formattedPredictedAmountOut = formatUnits(
        predictedAmountOut,
        tokenOutDecimals,
      );

      return {
        ...swapInfo,
        returnAmount: amountOut,
        formattedReturnAmount: formattedAmountOut,
        predictedAmountOut,
        formattedPredictedAmountOut,
      };
    } catch (e) {
      console.error("Failed to get swap info", e);
      return swapInfo;
    }
  }

  return swapInfo;
};
