import { type ReactNode, useContext, useMemo } from "react";
import { ChainContext } from "./ChainContext";
import { type ConnectionContextType, ConnectionContext } from "./ConnectionContext";
import { connect } from "solana-kite";

// Define the props type
type ConnectionContextProviderProps = {
  children: ReactNode;
};

// Create the provider component
export function ConnectionContextProvider({ children }: ConnectionContextProviderProps) {
  const { solanaRpcSubscriptionsUrl, solanaRpcUrl } = useContext(ChainContext);

  // Create the context value
  const contextValue: ConnectionContextType = useMemo(() => {
    return {
      connection: connect(solanaRpcUrl, solanaRpcSubscriptionsUrl),
    };
  }, [solanaRpcSubscriptionsUrl, solanaRpcUrl]);

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
}
