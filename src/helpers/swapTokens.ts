import {AbstractProvider, Contract, Wallet} from "ethers";
import {TickLiquidityNetInfo} from "./subgraph";
import routerAbi from "../../abi/UniswapBalancer.json";

export interface SwapTokenInfo {
    mainPool: string;
    secondPool: string;
    secondPoolToken0: string;
    secondPoolToken1: string;
    isActiveTokenSame: boolean;
}


export const swapTokens = async (provider: AbstractProvider,
                                 swapInfo: SwapTokenInfo,
                                 ticksLiquidityNets: TickLiquidityNetInfo[],
                                 uniswapBalancerAddress: string,
                                 privateKey: string | undefined) => {
    console.log(ticksLiquidityNets);
    const signer = new Wallet(privateKey || "", provider)
    const UniswapBalancerContract = new Contract(
        uniswapBalancerAddress,
        routerAbi,
        signer)


    await UniswapBalancerContract.swapTokens(swapInfo, ticksLiquidityNets)
}


