// This file is https://github.com/Uniswap/v3-periphery/blob/main/contracts/libraries/LiquidityAmounts.sol transformed
// into js for saving eth_requests

const {FullMath} = require("@uniswap/v3-sdk");
const {BigInt,leftShift,subtract, divide} = require("jsbi")

module.exports.getAmount0ForLiquidity = (sqrtRatioAX96,sqrtRatioBX96, liquidity) => {
    if (sqrtRatioAX96 > sqrtRatioBX96)
        [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];


    return divide(FullMath.mulDivRoundingUp(
        leftShift(BigInt(liquidity.toString()),BigInt('96')),
        subtract(BigInt(sqrtRatioBX96.toString()),BigInt(sqrtRatioAX96.toString())),
        BigInt(sqrtRatioBX96.toString())
    ),BigInt(sqrtRatioAX96));
}

module.exports.getAmount1ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    if (sqrtRatioAX96 > sqrtRatioBX96)
        [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];

    return FullMath.mulDivRoundingUp(
        BigInt(liquidity.toString()),
        subtract(BigInt(sqrtRatioBX96.toString()),BigInt(sqrtRatioAX96.toString())),
        BigInt(0x1000000000000000000000000)
    )
}


module.exports.getAmountsForLiquidity = (sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    let amount0 = 0,amount1 = 0;

    if (sqrtRatioAX96 > sqrtRatioBX96)
        [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];

    if (sqrtRatioX96 <= sqrtRatioAX96) {
        amount0 = this.getAmount0ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
    } else if (sqrtRatioX96 < sqrtRatioBX96) {
        amount0 = this.getAmount0ForLiquidity(sqrtRatioX96, sqrtRatioBX96, liquidity);
        amount1 = this.getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioX96, liquidity);
    } else {
        amount1 = this.getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
    }

    return {amount0,amount1}
}