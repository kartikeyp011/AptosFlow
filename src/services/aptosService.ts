import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { Account, InputTransactionData } from "@aptos-labs/wallet-adapter-core";

// Initialize Aptos SDK client
const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

// Central Aptos Service
export const aptosService = {
  // ----------------------------
  // Fetch account balance
  // ----------------------------
  getAccountBalance: async (address: string): Promise<number> => {
    try {
      const balance = await aptos.getAccountCoinAmount({
        accountAddress: address,
        coinType: "0x1::aptos_coin::AptosCoin",
      });
      return Number(balance) / 1e8; // Octas → APT
    } catch (err) {
      console.error("Balance fetch error:", err);
      return 0;
    }
  },

  // ----------------------------
  // Sign and submit transaction
  // ----------------------------
  signAndSubmitTransaction: async (
    account: Account | null,
    txnData: InputTransactionData
  ) => {
    if (!account) throw new Error("No wallet account connected");

    try {
      // `signAndSubmitTransaction` comes from useWallet
      const response = await account.signAndSubmitTransaction(txnData);
      // Wait for confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });
      return response;
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err;
    }
  },

  // ----------------------------
  // Sign a message
  // ----------------------------
  signMessage: async (account: Account | null, message: string, nonce?: string) => {
    if (!account) throw new Error("No wallet account connected");
    try {
      return await account.signMessage({ message, nonce });
    } catch (err) {
      console.error("Sign message failed:", err);
      throw err;
    }
  },

  // ----------------------------
  // Verify a signed message
  // ----------------------------
  signMessageAndVerify: async (
    account: Account | null,
    message: string,
    nonce?: string
  ): Promise<boolean> => {
    if (!account) throw new Error("No wallet account connected");
    try {
      return await account.signMessageAndVerify({ message, nonce });
    } catch (err) {
      console.error("Verify message failed:", err);
      return false;
    }
  },

  // ----------------------------
  // Change network (only supported wallets)
  // ----------------------------
  changeNetwork: async (account: Account | null, network: Network) => {
    if (!account) throw new Error("No wallet account connected");
    try {
      return await account.changeNetwork(network);
    } catch (err) {
      console.error("Network change failed:", err);
      throw err;
    }
  },
};
