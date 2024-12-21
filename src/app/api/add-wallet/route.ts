import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58"
 

export async function POST(
  req: Request
) {
    const {walletNumber,mnemonic} = await req.json()
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${walletNumber}'/0'`
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const privateKey = bs58.encode(Keypair.fromSecretKey(secret).secretKey)
    return Response.json(
        {
            mnemonic : mnemonic,
            publicKey,
            privateKey : privateKey
        }
    )
}