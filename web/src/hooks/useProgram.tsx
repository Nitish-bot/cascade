import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "target/idl/cascade.json";
import { type Cascade } from "target/types/cascade"

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export function useProgram() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    
    if (!wallet) {
      return null;
    }
    
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    setProvider(provider);
    
    const program = new Program<Cascade>(idl as Cascade, provider);
    const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ID);
    const pubkey = wallet.publicKey;

    return { program, programId, pubkey, provider, connection };
}