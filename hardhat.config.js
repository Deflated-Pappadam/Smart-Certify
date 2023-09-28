require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.METAMASK_ACCOUNT_PRIVATE_KEY]
    }
  },
  paths: {
    artifacts: "./artifacts"
  },
  // etherscan: {
  //   apiKey: process.env.POLYGONSCAN_API_KEY
  // },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
