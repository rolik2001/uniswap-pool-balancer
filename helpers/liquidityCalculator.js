const {getAmountsForLiquidity} = require("./liquidityAmounts");
const sdk = require("@uniswap/v3-sdk");
const {BigNumber} = require("@ethersproject/bignumber");
const JSBI = require("jsbi")
const {TickSpacingTable} = require("./constants");
const {Tick} = require("@uniswap/v3-sdk");

module.exports.calcInputLiquidity = (tickInfo) => {
        const {
        ticks,
        aimTick,
        currentTick,
        initialLiquidity,
        ticksLiquidity,
        tickSpacing
    } = tickInfo;

    let activeTick = currentTick;
    let activeLiquidity = initialLiquidity;

    let token0 = BigNumber.from("0");
    let token1 = BigNumber.from("0");
    let zeroForOne;

    for (let i = 0; i < ticks.length; i++) {
        let element = ticks[i];
        let nextTick = getNextTick(element.minTick, element.maxTick, aimTick);
        let balancesAfterSwap = calcLiquidityInTickSpacing(
            activeLiquidity,
            element.minTick,
            element.maxTick,
            activeTick,
            nextTick
        )

        token0 = token0.add(balancesAfterSwap.token0);
        token1 = token1.add(balancesAfterSwap.token1);

        if(!zeroForOne){
            zeroForOne = Math.sign(parseInt(token0.toString())) === -1;
        }

        activeTick = nextTick;
        let liquidityNet = checkIsInLiquidity(nextTick,ticksLiquidity)


        if(liquidityNet) {
            if (zeroForOne) {
                liquidityNet = -liquidityNet;
            }
            activeLiquidity = sdk.LiquidityMath.addDelta(JSBI.BigInt(activeLiquidity), JSBI.BigInt(liquidityNet));
        }

    }

    return {
        token0: token0.add(token0.mul(TickSpacingTable[parseInt(tickSpacing)]*10).div("1000")).toString(),
        token1: token1.add(token1.mul(TickSpacingTable[parseInt(tickSpacing)]*10).div("1000")).toString()
    }
}


function calcLiquidityInTickSpacing(liquidity, lowTick, highTick, currentTick, aimTick) {

    let resultBefore = getAmountsForLiquidity(
        sdk.TickMath.getSqrtRatioAtTick(currentTick).toString(),
        sdk.TickMath.getSqrtRatioAtTick(lowTick).toString(),
        sdk.TickMath.getSqrtRatioAtTick(highTick).toString(),
        liquidity);


    let resultAfter = getAmountsForLiquidity(
        sdk.TickMath.getSqrtRatioAtTick(aimTick).toString(),
        sdk.TickMath.getSqrtRatioAtTick(lowTick).toString(),
        sdk.TickMath.getSqrtRatioAtTick(highTick).toString(),
        liquidity);


    return {
        token0: BigNumber.from(resultBefore.amount0.toString()).sub(resultAfter.amount0.toString()).toString(),
        token1: BigNumber.from(resultBefore.amount1.toString()).sub(resultAfter.amount1.toString()).toString()
    }

}


function getNextTick(lowTick, highTick, aimTick) {
    let diff1 = Math.abs(aimTick - lowTick);
    let diff2 = Math.abs(aimTick - highTick);

    if (aimTick >= lowTick && aimTick <= highTick) {
        return aimTick;
    } else {
        return diff1 < diff2 ? lowTick : highTick;
    }
}


function checkIsInLiquidity(tick, ticksLiquidity) {
    let result;

    for (let i = 0; i < ticksLiquidity.length; i++) {
        let {tickIdx, liquidityNet} = ticksLiquidity[i];
        if(parseInt(tickIdx) === tick){
            result = parseInt(liquidityNet);
        }
    }

    return result;
}