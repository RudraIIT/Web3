import solonaWeb3 from '@solana/web3.js'
import fs from 'fs'
import { Keypair, Connection,SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'

const connection = new Connection(solonaWeb3.clusterApiUrl('devnet'),'confirmed')

const dataAccount = Keypair.generate()
const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('./payer.json'))))

async function createAccount() {
  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(100),
      space: 1000,
      programId: SystemProgram.programId
    })
  )

  const txId = await sendAndConfirmTransaction(connection, tx, [payer, dataAccount])

  console.log(`Created account with transaction ID: ${txId}`)
}

createAccount()