import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function RequestAirdrop() {
    const [amount, setAmount] = useState(0);
    const wallet = useWallet();
    const { connection } = useConnection();

    async function requestAirdrop() {
        await connection.requestAirdrop(
            wallet.publicKey,
            amount * LAMPORTS_PER_SOL
        )

        alert("Airdrop requested");
    }

    return (
        <div>
            <br />
            <br />
            <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={requestAirdrop}>Request Airdrop</button>
        </div>
    )
}