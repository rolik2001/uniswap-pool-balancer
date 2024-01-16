import axios from "axios";

function generateTicksLiquidityQuery(address: string, lowerTick: number, upperTick: number) {
    return `{
    ticks(where: {
      poolAddress:  "${address.toLowerCase()}",
      tickIdx_gte:  ${lowerTick},
      tickIdx_lte:  ${upperTick}
    }) {
      tickIdx
      liquidityNet
    }
  }`
}

export interface TickLiquidityNetInfo {
    tick: string;
    liquidityNet: string;
}

export const getTicksLiquidityNet = async (url: string,
                                           address: string,
                                           firstTick: number,
                                           secondTick: number
):Promise<TickLiquidityNetInfo[]> => {
    [firstTick, secondTick] = firstTick < secondTick ? [firstTick, secondTick] : [secondTick, firstTick];
    const {ticks} = (
        await axios.post(url, {
            query: generateTicksLiquidityQuery(address, firstTick, secondTick)
        })
    ).data.data;


    const allTicksLiquidityNets: TickLiquidityNetInfo[] = [];
    for (let i = 0; i < ticks.length; i++) {
        allTicksLiquidityNets.push({
            tick : ticks[i].tickIdx,
            liquidityNet: ticks[i].liquidityNet
        })
    }

    return allTicksLiquidityNets;
}
