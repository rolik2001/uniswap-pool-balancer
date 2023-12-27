module.exports.parseTicks = (mainTick, secondTick, tickSpacing) => {
    mainTick = parseInt(mainTick);
    secondTick = parseInt(secondTick);
    tickSpacing = parseInt(tickSpacing);

    const mainTickParsed = parseTick(mainTick);
    const secondTickParsed = parseTick(secondTick);


    let differenceTick = mainTickParsed - secondTickParsed;
    if (secondTick < 0) {
        differenceTick = -1 * differenceTick;
    }

    let amountOfTickSpacing = parseInt(secondTick / tickSpacing);
    if(secondTick < 0){
        amountOfTickSpacing--;
    }

    const initialTick = amountOfTickSpacing * tickSpacing;
    const ticks = [];
    const aimTick = secondTick + differenceTick;


    let firstTick = initialTick
    let isContinue = true;
    while (isContinue) {
        const secondTick = firstTick + (Math.sign(differenceTick) * tickSpacing);

        const [minTick, maxTick] = firstTick < secondTick ? [firstTick, secondTick] : [secondTick, firstTick];
        const isInRange = minTick <= aimTick && maxTick >= aimTick;
        if (!isInRange) {
            firstTick = secondTick;
        } else {
            isContinue = false;
        }

        ticks.push({
            minTick,
            maxTick
        })
    }


    return {
        ticks,
        aimTick,
        initialTick,
        currentTick:secondTick
    }

}


function parseTick(tick) {
    return parseInt(tick) > 0 ? parseInt(tick) : -1 * parseInt(tick);
}