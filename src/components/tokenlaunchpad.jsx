import {
  ExtensionType,
  createInitializeMetadataPointerInstruction,
  LENGTH_SIZE,
  TYPE_SIZE,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";

import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import AnimatedButton from "./AnimatedButton";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export function TokenLaunchpad() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [uri, setUri] = useState("");
  const [supply, setSupply] = useState("");

  const wallet = useWallet();

  const connection = new Connection("https://api.devnet.solana.com");

  async function createToken() {
    if (!wallet.publicKey) {
      alert("Connect wallet first");
      return;
    }
    console.log("Creating Token...");
    const mintKeypair = Keypair.generate();

    const metadata = {
      mint: mintKeypair.publicKey,
      name,
      symbol,
      uri,
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen,
    );
    const associatedToken = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log({
      mintLen,
      metadataLen,
      total: mintLen + metadataLen,
    });
    console.log(pack(metadata).length);
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID,
      ),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        wallet.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID,
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name,
        symbol,
        uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      }),
    );
    transaction.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedToken,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID,
      ),
    );
    transaction.add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedToken,
        wallet.publicKey,
        Number(supply) * Math.pow(10, 9),
        [],
        TOKEN_2022_PROGRAM_ID,
      ),
    );
    transaction.feePayer = wallet.publicKey;

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    transaction.partialSign(mintKeypair);

    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");
    console.log("Confirmed:", signature);
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div className="card">
        <div className="card-content">
          <h2>Solana Token Launchpad</h2>

          <input
            id="name"
            className="inputText"
            type="text"
            placeholder="Token name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            id="symbol"
            className="inputText"
            type="text"
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />

          <input
            id="imageurl"
            className="inputText"
            type="text"
            placeholder="Image URL"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
          />

          <input
            id="initialSupply"
            className="inputText"
            type="text"
            placeholder="Initial Supply"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
          />

          <AnimatedButton
            text="Create Token"
            color="#34342e"
            onClick={createToken}
          />
        </div>
      </div>
    </div>
  );
}
