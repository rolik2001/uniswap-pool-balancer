const sdk = require("@uniswap/v3-sdk");
const JSBI = require("jsbi")
const {TickSpacingTable} = require("./constants");

module.exports.calcInputLiquidity = (tickInfo) => {
    const {
        aimTick,
        currentTick,
        initialLiquidity,
        ticksLiquidity,
        tickSpacing
    } = tickInfo;


    let token0 = JSBI.BigInt("0");
    let token1 = JSBI.BigInt("0");
    let zeroForOne =
        JSBI.greaterThan(
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(currentTick).toString()),
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(aimTick).toString()));


    if (ticksLiquidity.length === 0) {
        token0 = sdk.SqrtPriceMath.getAmount0Delta(
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(currentTick).toString()),
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(aimTick).toString()),
            JSBI.BigInt(initialLiquidity),
            true
        );
        token1 = sdk.SqrtPriceMath.getAmount1Delta(
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(currentTick).toString()),
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(aimTick).toString()),
            JSBI.BigInt(initialLiquidity),
            true
        );
    } else {
        let activeLiquidity = initialLiquidity;
        let activeTick = currentTick;
        for(let i = 0; i < ticksLiquidity.length;i++){
            let {tickIdx,liquidityNet} = ticksLiquidity[i];
            tickIdx = parseInt(tickIdx);
            liquidityNet = JSBI.BigInt(liquidityNet);


            token0 = JSBI.add(token0,sdk.SqrtPriceMath.getAmount0Delta(
                JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(activeTick).toString()),
                JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(tickIdx).toString()),
                JSBI.BigInt(activeLiquidity),
                true
            ));
            token1 = JSBI.add(token1,sdk.SqrtPriceMath.getAmount1Delta(
                JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(activeTick).toString()),
                JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(tickIdx).toString()),
                JSBI.BigInt(activeLiquidity),
                true
            ));

            activeTick = tickIdx;

            if (zeroForOne) {
                liquidityNet = JSBI.multiply(liquidityNet,JSBI.BigInt("-1"));
            }
            activeLiquidity = sdk.LiquidityMath.addDelta(JSBI.BigInt(activeLiquidity), liquidityNet);
        }

        token0 = JSBI.add(token0,sdk.SqrtPriceMath.getAmount0Delta(
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(activeTick).toString()),
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(aimTick).toString()),
            JSBI.BigInt(activeLiquidity),
            true
        ));
        token1 = JSBI.add(token1,sdk.SqrtPriceMath.getAmount1Delta(
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(activeTick).toString()),
            JSBI.BigInt(sdk.TickMath.getSqrtRatioAtTick(aimTick).toString()),
            JSBI.BigInt(activeLiquidity),
            true
        ));

    }



    if(zeroForOne) {
        token0 = JSBI.add(token0,calcFee(token0,tickSpacing));
        token0 = JSBI.multiply(JSBI.BigInt("-1"),token0)
    } else {
        token1 = JSBI.add(token1,calcFee(token1,tickSpacing));
        token1 = JSBI.multiply(JSBI.BigInt("-1"),token1)
    }

    return {
        token0:token0.toString(),
        token1:token1.toString()
    }
}



function calcFee(amount,tickSpacing) {
    return sdk.FullMath.mulDivRoundingUp(
        amount,
        JSBI.BigInt(TickSpacingTable[tickSpacing]*10000),
        JSBI.subtract(JSBI.BigInt("1000000"),JSBI.BigInt(TickSpacingTable[tickSpacing]*10000)));

}