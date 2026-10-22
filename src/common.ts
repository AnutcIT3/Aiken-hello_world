import {
  BlockfrostProvider,
  MeshTxBuilder,
  MeshWallet,
  serializePlutusScript,
  UTxO,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";
import blueprint from "../plutus.json";
 
export const blockchainProvider = new BlockfrostProvider('previewYo2MqgqvZgJC8L6HW9p8YVnV2LYrVaSQ');
 
// wallet for signing transactions
export const wallet = new MeshWallet({
    networkId: 0, // Mạng Cardano: 0 là Testnet (Preview)
    fetcher: blockchainProvider, // Provider để truy vấn blockchain
    submitter: blockchainProvider, // Provider để gửi giao dịch
    key: {
        type: 'mnemonic', // loai 24 ki tu
        words: [
            "enable", "moment", "educate", "sense", "sponsor", "casual", "twist", "rapid", "almost", "announce", "allow", "floor", "slab", "imitate", "finger", "poem", "stool", "attack", "original", "pledge", "head", "physical", "demand", "alley"
        ], // Danh sách các từ mnemonic
    },
});
 
export function getScript() {
  const scriptCbor = applyParamsToScript(
     blueprint.validators[0].compiledCode,
    []
  );
 
  const scriptAddr = serializePlutusScript(
    { code: scriptCbor, version: "V3" },
  ).address;
 
  return { scriptCbor, scriptAddr };
}
 
// reusable function to get a transaction builder
export function getTxBuilder() {
  return new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
  });
}
 
// reusable function to get a UTxO by transaction hash
export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
  const utxos = await blockchainProvider.fetchUTxOs(txHash);
  if (utxos.length === 0) {
    throw new Error("UTxO not found");
  }
  return utxos[0];
}