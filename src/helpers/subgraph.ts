const axios = require("axios");

function generateTicksLiquidityQuery(address, lowerTick, upperTick) {
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


module.exports.getTicksLiquidityNet = async (url,address, firstTick,secondTick) => {
    [firstTick,secondTick] = firstTick < secondTick ? [firstTick, secondTick] : [secondTick, firstTick];
    let {ticks} = (
        await axios.post(url, {
            query: generateTicksLiquidityQuery(address, firstTick, secondTick)
        })
    ).data.data;

    return ticks;
}
