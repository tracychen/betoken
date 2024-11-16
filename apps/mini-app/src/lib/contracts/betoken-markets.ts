import { base } from "viem/chains";

export const betokenMarketsContractAddress = {
  [base.id]: "0x5fa2160d4623794b545c4b8ef2d93621a2dfd8a3",
};

export const betokenMarketsABI = [
  {
    type: "function",
    name: "FEE_PERCENTAGE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MIN_LIQUIDITY",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "PRECISION",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buyTokens",
    inputs: [
      { name: "_marketId", type: "uint256", internalType: "uint256" },
      {
        name: "_optionIndex",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_minTokensOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      { name: "tokenAmount", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "claimWinnings",
    inputs: [
      { name: "_marketId", type: "uint256", internalType: "uint256" },
      { name: "_optionIndex", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createManualMarket",
    inputs: [
      { name: "_title", type: "string", internalType: "string" },
      { name: "_options", type: "string[]", internalType: "string[]" },
      {
        name: "_resolutionTime",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "createPriceMarket",
    inputs: [
      { name: "_title", type: "string", internalType: "string" },
      {
        name: "_resolutionTime",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_priceFeed", type: "address", internalType: "address" },
      {
        name: "_targetPrice",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_above", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getETHOutForExactTokens",
    inputs: [
      { name: "ethBalance", type: "uint256", internalType: "uint256" },
      {
        name: "tokenBalance",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "tokenIn", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getTokensOutForExactETH",
    inputs: [
      { name: "ethBalance", type: "uint256", internalType: "uint256" },
      {
        name: "tokenBalance",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "ethIn", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "marketCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "markets",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "title", type: "string", internalType: "string" },
      { name: "createdAt", type: "uint256", internalType: "uint256" },
      {
        name: "resolutionTime",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "creator", type: "address", internalType: "address" },
      { name: "resolved", type: "bool", internalType: "bool" },
      {
        name: "marketType",
        type: "uint8",
        internalType: "enum BetokenMarkets.MarketType",
      },
      {
        name: "resolver",
        type: "address",
        internalType: "contract IMarketResolver",
      },
      {
        name: "totalLiquidity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "resolveMarket",
    inputs: [
      { name: "_marketId", type: "uint256", internalType: "uint256" },
      {
        name: "inputWinningOptionIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sellTokens",
    inputs: [
      { name: "_marketId", type: "uint256", internalType: "uint256" },
      {
        name: "_optionIndex",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_tokenAmount",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_minEthOut", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "ethAmount", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "MarketCreated",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "title",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "options",
        type: "string[]",
        indexed: false,
        internalType: "string[]",
      },
      {
        name: "marketType",
        type: "uint8",
        indexed: false,
        internalType: "enum BetokenMarkets.MarketType",
      },
      {
        name: "resolver",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketResolved",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "winningOptionIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensPurchased",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "buyer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "optionIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "tokenAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "ethPaid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensSold",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "seller",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "optionIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "tokenAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "ethReceived",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
];
