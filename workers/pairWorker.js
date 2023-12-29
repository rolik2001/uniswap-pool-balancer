const ethers = require("ethers");
const {abi: poolAbi} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {parseTicks} = require("../helpers/tickCalculator");
const {calcInputLiquidity} = require("../helpers/liquidityCalculator");
const {getTicksLiquidityNet} = require("../helpers/subgraph");
const {workerData} = require("worker_threads")
const {swapTokens} = require("../helpers/swapTokens");
require('dotenv').config()


const {PRIVATE_KEY} = process.env;
const {nodeWssUrl, subgraphUrl, mainPoolData, comparisonPoolData} = workerData


const provider = new ethers.getDefaultProvider(nodeWssUrl);

provider.on("block", async (blockNumber) => {
    console.log("New Block : ", blockNumber);
    checkPools();
});



async function checkPools(){
    const mainPoolContract = new ethers.Contract(
        mainPoolData.contract,
        poolAbi,
        provider
    )
    let {tick: mainTick} = await mainPoolContract.slot0();
    console.log("Main Pool tick : ", mainTick);

    for (let i = 0; i < comparisonPoolData.length; i++) {
        let {contract, pairName, tickSpacing, token0, token1} = comparisonPoolData[i];

        const secondPoolContract = new ethers.Contract(
            contract,
            poolAbi,
            provider
        )

        let {tick: secondTick} = await secondPoolContract.slot0();
        console.log(`${pairName} Pool tick : `, secondTick);

        if (Math.abs(parseInt(mainTick)) !== Math.abs(parseInt(secondTick))) {
            console.log("Got price different for pair : ", pairName)
            let tickInfo = parseTicks(mainTick, secondTick);
            tickInfo.initialLiquidity = (await secondPoolContract.liquidity()).toString();
            tickInfo.ticksLiquidity = await getTicksLiquidityNet(
                subgraphUrl,
                contract,
                tickInfo.currentTick,
                tickInfo.aimTick
            )
            tickInfo.tickSpacing = tickSpacing;

            let liquidityToBuy = calcInputLiquidity(tickInfo);

            await swapTokens(
                provider,
                token0,
                token1,
                tickInfo.aimTick,
                tickSpacing,
                liquidityToBuy,
                PRIVATE_KEY
            )

        }
    }
}

