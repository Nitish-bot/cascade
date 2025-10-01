import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { type Cascade } from "../target/types/cascade";
import fs from "fs";

const idl = JSON.parse(fs.readFileSync(
    "../target/idl/cascade.json",
    "utf-8"
)) as Cascade;

const programId = new anchor.web3.PublicKey(
  "HQ8ejrFMtoNsShZRqkH842BRDqpzh7Xy7b5iqc1U9ffA"
);

const secret = JSON.parse(fs.readFileSync(
  "/home/nitishc/.config/solana/id.json",
  "utf-8"
));

const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const provider = new anchor.AnchorProvider(
  connection,
  new anchor.Wallet(keypair),
  { commitment: "confirmed" }
);

anchor.setProvider(provider);
const program = new anchor.Program<Cascade>(idl, provider);

const [campaignCounter] = PublicKey.findProgramAddressSync(
[Buffer.from("campaign_counter")],
program.programId
);

const [config] = PublicKey.findProgramAddressSync(
[Buffer.from("config")],
program.programId
);

const treasury = new PublicKey("7hC5HoU81sjaFVaoGmM1bdKnSxbR6oWP1koBzKzBqKx8");


async function init() {
    try {
        await program.methods
            .initialize()
            .accounts({
                signer: provider.wallet.publicKey,
                treasury,
            })
            .rpc()
    } catch (err) {
        console.error("Error during initialization:", err);
        console.log(err.getLogs())
        throw err;
    }
}

init()