module.exports.parseTicks = (mainTick, secondTick) => {
    mainTick = parseInt(mainTick);
    secondTick = parseInt(secondTick);

    const mainTickParsed = parseTickToNumber(mainTick);
    const secondTickParsed = parseTickToNumber(secondTick);


    let differenceTick = mainTickParsed - secondTickParsed;
    if (secondTick < 0) {
        differenceTick = -1 * differenceTick;
    }

    const ticks = [];
    const aimTick = secondTick + differenceTick;

    return {
        ticks,
        aimTick,
        currentTick:secondTick
    }

}


function parseTickToNumber(tick) {
    return parseInt(tick) > 0 ? parseInt(tick) : -1 * parseInt(tick);
}
