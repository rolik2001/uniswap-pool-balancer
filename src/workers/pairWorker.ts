import {getDefaultProvider, AbstractProvider, Contract} from "ethers";
import {abi as poolAbi} from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import {workerData} from "node:worker_threads";
import dotenv from 'dotenv';
import {calcAimTick} from "../helpers/tickCalculator";
import {getTicksLiquidityNet, TickLiquidityNetInfo} from "../helpers/subgraph";
import {SwapTokenInfo, swapTokens} from "../helpers/swapTokens";


dotenv.config()

const {PRIVATE_KEY} = process.env;
const {netName, nodeWssUrl, subgraphUrl, mainPoolData, comparisonPoolData,uniswapBalancerContract} = workerData


const provider: AbstractProvider = getDefaultProvider(nodeWssUrl);

console.log("Worker Started for net : ", netName)
provider.on("block", async (blockNumber) => {
    console.log("New Block : ", blockNumber);
    if (PRIVATE_KEY === undefined) {
        console.log("Not private key found");
        process.exit(1);
    }
    checkPools();

});


async function checkPools() {
    const mainPoolContract = new Contract(
        mainPoolData.contract,
        poolAbi,
        provider
    )
    const {tick: mainTick} = await mainPoolContract.slot0();
    console.log("Main Pool tick : ", mainTick);

    for (let i = 0; i < comparisonPoolData.length; i++) {
        const {contract, pairName, token0, token1, isActiveTokenSame} = comparisonPoolData[i];

        const secondPoolContract = new Contract(
            contract,
            poolAbi,
            provider
        )

        const {tick: secondTick} = await secondPoolContract.slot0();
        console.log(`${pairName} Pool tick : `, secondTick);

        const tickSecondToCompare = isActiveTokenSame ? parseInt(secondTick) :
            Math.abs(parseInt(secondTick));

        if (Math.abs(parseInt(mainTick)) !== tickSecondToCompare) {
            console.log("Got price different for pair : ", pairName)
            const tickInfo: {
                currentTick: number;
                aimTick: number
            } = calcAimTick(parseInt(mainTick), parseInt(secondTick), tickSecondToCompare, isActiveTokenSame);
            console.log(tickInfo);
            const allTicksLiquidityNets: TickLiquidityNetInfo[] = await getTicksLiquidityNet(
                subgraphUrl,
                contract,
                tickInfo.currentTick,
                tickInfo.aimTick
            )

            const swapInfo: SwapTokenInfo = {
                mainPool: mainPoolData.contract,
                secondPool: contract,
                secondPoolToken0: token0,
                secondPoolToken1: token1,
                isActiveTokenSame
            }


            await swapTokens(
                provider,
                swapInfo,
                allTicksLiquidityNets,
                uniswapBalancerContract,
                PRIVATE_KEY
            )

        }
    }
}