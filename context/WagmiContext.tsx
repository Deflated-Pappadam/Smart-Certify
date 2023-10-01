"use client";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
import { polygonMumbai } from '@wagmi/core/chains'
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

export interface WagmiContextProps {
  children: React.ReactNode;
}

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  logger: {
    warn: (message) => console.warn(message),
  },
  connectors: [
    new InjectedConnector({
      chains: [polygonMumbai],
      options: {
        shimDisconnect: true,
      },
    }),
    new MetaMaskConnector({
      chains: [polygonMumbai],
      options: {
        shimDisconnect: false,
      },
    }),
  ]
})


export default function WagmiContext({ children }: WagmiContextProps) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}