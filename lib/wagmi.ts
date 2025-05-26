import { http, createConfig } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";

import { type Chain } from "viem";

export const testnet = {
  id: 1,
  name: "MetaDAP Enterprise Testnet",
  nativeCurrency: { name: "DAP", symbol: "DAP", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.chain.metadap.io"] },
  },
  blockExplorers: {
    default: {
      name: "MetaDAP Enterprise Testnet Explorer",
      url: "https://explorer.testnet.chain.metadap.io",
    },
  },
} as const satisfies Chain;

export const config = createConfig({
  chains: [testnet],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "PDF Upload & Compare",
      appLogoUrl: "/logo-danang.png",
    }),
  ],
  transports: {
    [testnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
