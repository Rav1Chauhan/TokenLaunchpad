import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptAccount,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import AnimatedButton from "./AnimatedButton";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export function TokenLaunchpad() {
  const wallet = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");
  async function createToken() {
    console.log("Creating Token...");

    const name = document.getElementById("name").value;
    const symbol = document.getElementById("symbol").value;
    const imageurl = document.getElementById("imageurl").value;
    const initialSupply = Number(
      document.getElementById("initialSupply").value,
    );
    // createMint();
    const lamports = await getMinimumBalanceForRentExemptAccount(connection);
    const keypair = Keypair.generate();
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: keypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        keypair.publicKey,
        6,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID,
      ),
    );
    transaction.feePayer = wallet.publicKey;

    const {blockhash} = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    transaction.partialSign(keypair);
    const signature = await wallet.sendTransaction(transaction, connection);
    console.log(signature);
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
            placeholder="Name"
          />

          <input
            id="symbol"
            className="inputText"
            type="text"
            placeholder="Symbol"
          />

          <input
            id="imageurl"
            className="inputText"
            type="text"
            placeholder="Image URL"
          />

          <input
            id="initialSupply"
            className="inputText"
            type="text"
            placeholder="Initial Supply"
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
