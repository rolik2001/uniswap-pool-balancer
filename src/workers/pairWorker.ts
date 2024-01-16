const ethers = require("ethers");
const {abi: poolAbi} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {parseTicks} = require("../helpers/tickCalculator");
const {calcInputLiquidity} = require("../helpers/liquidityCalculator");
const {getTicksLiquidityNet} = require("../helpers/subgraph");
const {workerData} = require("worker_threads")
const {swapTokens} = require("../helpers/swapTokens");
require('dotenv').config();
