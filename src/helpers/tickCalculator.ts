export const calcAimTick = (mainTick: number,
                            secondTick: number,
                            tickSecondToCompare: number,
                            isActiveTokenSame: boolean) => {
    let differenceTick = mainTick - tickSecondToCompare;
    if (!isActiveTokenSame && secondTick < 0) {
        differenceTick = -1 * differenceTick;
    }

    const aimTick = secondTick + differenceTick;

    return {
        aimTick,
        currentTick: secondTick,
    }

}

