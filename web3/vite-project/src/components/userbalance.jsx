import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function ShowSolBalance() {
    const {connection } = useConnection();
    const [balance, setBalance] = useState(0);
    const wallet = useWallet();

    async function getBalance() {
        if(wallet.publicKey) {
            const balance = await connection.getBalance(wallet.publicKey);
            setBalance(balance / LAMPORTS_PER_SOL);
        }
    }

    getBalance();

    return (
        <div>
            <p> 
                Sol balance: {balance}
            </p>
        </div>
    )
}