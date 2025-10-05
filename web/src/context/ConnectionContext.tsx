import { createContext } from "react";
import { connect } from "solana-kite";

// Define the type for our context
export type ConnectionContextType = {
  connection: ReturnType<typeof connect>;
};

// Create default values
const defaultConnectionContext: ConnectionContextType = {
  connection: connect("devnet"),
};

// Create the context
export const ConnectionContext = createContext<ConnectionContextType>(defaultConnectionContext);
