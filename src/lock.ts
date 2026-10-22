import { Asset, BlockfrostProvider, deserializeAddress, mConStr0 } from "@meshsdk/core";
import { getScript, getTxBuilder, wallet, blockchainProvider } from "./common";
 
async function main() {
    //const utxos = await blockchainProvider.fetchUTxOs("93cc8670c304dc9161d106c8f4c21fec7ace640664ccf03ffad21bb37e3da862");
   // console.log(utxos);
  // these are the assets we want to lock into the contract
  const assets: Asset[] = [
    {
      unit: "lovelace",
      quantity: "10000000",
    },
  ];
 
  // get utxo and wallet address
  const utxos = await wallet.getUtxos();
  const walletAddress = await wallet.getChangeAddress();
 
  const { scriptAddr } = getScript();
 
  // hash of the public key of the wallet, to be used in the datum
  const signerHash = deserializeAddress(walletAddress).pubKeyHash;
 
  // build transaction with MeshTxBuilder
  const txBuilder = getTxBuilder();
  await txBuilder
    .txOut(scriptAddr, assets) // send assets to the script address
    .txOutDatumHashValue(mConStr0([signerHash])) // provide the datum where `"constructor": 0`
    .changeAddress(walletAddress) // send change back to the wallet address
    .selectUtxosFrom(utxos)
    .complete();

  const unsignedTx = txBuilder.txHex;
 
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log(`10 tADA locked into the contract at Tx ID: ${txHash}`);
}
 
main();