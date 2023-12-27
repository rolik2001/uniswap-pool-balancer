const {ethers} = require("ethers");
const sdk = require("@uniswap/v3-sdk")
const {SwapRouter, TickSpacingTable} = require("./constants");
const {BigNumber} = require("@ethersproject/bignumber");
const erc20Abi = require('erc-20-abi')
const {all} = require("axios");
const {abi: routerAbi} = require("../abi/RouterAbi.json");


module.exports.swapTokens = async (provider, token0, token1, tickSpacing, balances, privateKey) => {
    const signer = new ethers.Wallet(privateKey, provider)
    const router = new ethers.Contract(
        SwapRouter,
        routerAbi,
        signer)

    const deadline = ((new Date().getTime()/1000)+600).toFixed(0) // 5 minutes deadline

    const {tokenIn, tokenOut,amountIn,amountOutMin} = generateSwapParams(token0,token1,balances);


    let params = {
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: TickSpacingTable[tickSpacing] * 10000,
        recipient: await signer.getAddress(),
        deadline,
        amountIn: amountIn,
        amountOutMinimum: amountOutMin,
        sqrtPriceLimitX96: 0
    }

    let isEnoughAllowance = await checkAllowance(provider,tokenIn,SwapRouter,await signer.getAddress(),amountIn);

    if(!isEnoughAllowance){
        await approve(signer,tokenIn,SwapRouter)
    }

    await router.exactInputSingle(params)
}



function generateSwapParams(token0, token1, balances) {
    if(Math.sign(balances.token0) === -1) {
        return {
            tokenIn:token0,
            tokenOut:token1,
            amountIn: Math.abs(balances.token0).toString(),
            amountOutMin: BigNumber.from(Math.abs(balances.token1)).mul("999").div("1000").toString()
        }
    } else {
        return {
            tokenIn:token1,
            tokenOut:token0,
            amountIn: Math.abs(balances.token1).toString(),
            amountOutMin: BigNumber.from(Math.abs(balances.token0)).mul("999").div("1000").toString()
        }
    }
}

async function checkAllowance(provider, token, contract, owner,amount) {
    const erc20Token = new ethers.Contract(
        token,
        erc20Abi,
        provider);

    const allowance = await erc20Token.allowance(owner,contract);

    return BigNumber.from(allowance.toString()).gte(amount.toString());
}

async function approve(signer, token, contract) {
    const erc20Token = new ethers.Contract(
        token,
        erc20Abi,
        signer);

    await erc20Token.approve(contract, ethers.MaxUint256);
}