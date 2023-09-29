"use client"

import React, { createContext, useEffect, useState } from "react";

export const MetaMaskContext = createContext<{ account: string; connectWallet: () => void; error: string } | undefined>(undefined);

const MetaMaskProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  const checkEthereumExists = () => {
    if (!window.ethereum) {
      setError("Please Install MetaMask.");
      return false;
    }
    return true;
  };
  const getConnectedAccounts = async () => {
    setError("");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts);
      setAccount(accounts[0]);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };
  const connectWallet = async () => {
    setError("");
    if (checkEthereumExists()) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setAccount(accounts[0]);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (checkEthereumExists()) {
      window.ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
    }
    return () => {
      if (checkEthereumExists()) {
        window.ethereum.removeListener("accountsChanged", getConnectedAccounts);
      }
    };
  }, []);

  return (
    <MetaMaskContext.Provider value={{ account, connectWallet, error }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export default MetaMaskProvider;