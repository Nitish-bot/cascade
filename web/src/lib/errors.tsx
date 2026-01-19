import { Flex } from "@radix-ui/themes";
import {
  isWalletStandardError,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED,
} from "@wallet-standard/core";
import React from "react";

export const NO_ERROR = Symbol();

export function getErrorMessage(error: unknown, fallbackMessage: React.ReactNode): React.ReactNode {
  if (isWalletStandardError(error, WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED)) {
    return (
      <>
        This account does not support the {error.context.featureName} feature
      </>
    );
  } else if (isWalletStandardError(error, WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED)) {
    return (
      <Flex direction="column" gap="4">
        <p>
          The wallet '{error.context.walletName}' (
          {error.context.supportedChains.sort().map((chain, ii, { length }) => (
            <React.Fragment key={chain}>
              {chain}
              {ii === length - 1 ? null : ", "}
            </React.Fragment>
          ))}
          ) does not support the {error.context.featureName} feature.
        </p>
        <p>
          Features supported:
          <ul>
            {error.context.supportedFeatures.sort().map((featureName) => (
              <li key={featureName}>
                {featureName}
              </li>
            ))}
          </ul>
        </p>
      </Flex>
    );
  } else if (isWalletStandardError(error, WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED)) {
    return (
      <Flex direction="column" gap="4">
        <p>
          This account does not support the chain {error.context.chain}.
        </p>
        <p>
          Chains supported:
          <ul>
            {error.context.supportedChains.sort().map((chain) => (
              <li key={chain}>
                {chain}
              </li>
            ))}
          </ul>
        </p>
      </Flex>
    );
  } else if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return fallbackMessage;
}