import { http, createConfig } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";

import { type Chain } from "viem";

export const testnet = {
  id: 89359,
  name: "MetaDAP Enterprise Moonnet",
  nativeCurrency: { name: "DAP", symbol: "DAP", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.moonnet.chain.metadap.io"] },
  },
  blockExplorers: {
    default: {
      name: "MetaDAP Enterprise Moonnet Explorer",
      url: "https://explorer.moonnet.chain.metadap.io",
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

export const documentWalletAddress =
  "0x8334Ab6247785AD39EdE8B8fA770f003Df800F0b";
