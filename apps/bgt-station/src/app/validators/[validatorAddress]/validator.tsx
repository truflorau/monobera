"use client";

import React from "react";
import Link from "next/link";
import {
  truncateHash,
  usePollActiveValidators,
  usePollGlobalValidatorBribes,
} from "@bera/berajs";
import { Tooltip, ValidatorIcon } from "@bera/shared-ui";
import { Badge } from "@bera/ui/badge";
import { Icons } from "@bera/ui/icons";
import { Skeleton } from "@bera/ui/skeleton";
import { formatUnits, type Address } from "viem";

import BribesAndEmissions from "./bribes-and-emissions";
import ValidatorActivitiesTable from "./validator-activities-table";
import ValidatorDetails from "./validator-details";
import ValidatorGaugeWeightInfo from "./validator-gauge-weight";

export default function Validator({
  validatorAddress,
}: {
  validatorAddress: Address;
}) {
  const prices = undefined;
  const { usePolValidator } = usePollGlobalValidatorBribes(prices);
  const validator = usePolValidator(validatorAddress);
  const { usePercentageDelegated } = usePollActiveValidators();
  const percentageDelegated = usePercentageDelegated(validatorAddress);

  return (
    <div className="relative flex flex-col gap-16">
      <div>
        <div className="flex flex-col gap-3">
          <Link
            className="flex items-center gap-1 text-sm font-medium leading-[14px] text-muted-foreground hover:cursor-pointer"
            href="/validators"
          >
            <Icons.arrowLeft className="relative h-4 w-4" />
            Validators
          </Link>
          <div className="text-center">
            {validator?.status === "BOND_STATUS_BONDED" ? (
              <Badge
                variant="success"
                className="border-none bg-success px-2 py-1 text-xs"
              >
                Active
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="border-none bg-muted px-2 py-1 text-xs"
              >
                Inactive
              </Badge>
            )}
          </div>
          <div className="flex w-full items-center justify-center gap-2 text-3xl font-bold leading-[48px] md:text-5xl ">
            <ValidatorIcon
              address={validatorAddress}
              description={validator?.description?.identity ?? undefined}
              className="h-12 w-12"
            />
            {validator?.description.moniker ?? (
              <Skeleton className="inline-block h-12 w-[100px]" />
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-sm font-medium leading-none text-muted-foreground">
              Operator address:{" "}
              {validator ? (
                truncateHash(validator?.operatorAddr, 6)
              ) : (
                <Skeleton className="inline-block h-[14px] w-[100px]" />
              )}
            </div>
            <div className="text-sm font-medium leading-none text-muted-foreground">
              Consensus address:{" "}
              {validator ? (
                truncateHash(validator?.consAddr, 6)
              ) : (
                <Skeleton className="inline-block h-[14px] w-[100px]" />
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-16 lg:flex-row lg:gap-4">
          <ValidatorDetails
            address={validatorAddress}
            decription={
              validator ? validator?.description.details ?? "" : undefined
            }
            commissions={`${(
              Number(
                formatUnits(
                  validator?.commission.commissionRates.rate ?? 0n,
                  18,
                ),
              ) * 100
            ).toString()}%`}
            votingPower={`${percentageDelegated?.toFixed(2) ?? 0}%`}
            website={validator?.description.website ?? ""}
            vApy={validator?.vApy ? validator.vApy.toFixed(2) : "0"}
          />
          {/* <Uptime address={validatorAddress} /> */}
        </div>
      </div>

      <BribesAndEmissions
        // historicalBribes={
        //   (data as any)?.historicalBribes as FormattedHistoricalBribes[]
        // }
        // cumulativeBribeValue={(data as any)?.cumulativeBribeTotal}
        currentBribeValue={validator?.totalActiveBribeUsdAmount}
        validatorAddress={validatorAddress}
      />

      <div className="">
        <div className="mb-4 flex items-center gap-1 text-lg font-semibold leading-7">
          Reward Distribution{" "}
          <Tooltip text="Validator block reward allocation towards pools & addresses" />
        </div>
        <ValidatorGaugeWeightInfo validatorAddress={validatorAddress} />
      </div>

      <ValidatorActivitiesTable validatorAddress={validatorAddress} />
    </div>
  );
}
