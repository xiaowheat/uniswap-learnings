const UNISWAP = require('@uniswap/sdk')
console.log(`The chainId of mainnet is ${UNISWAP.ChainId.MAINNET}.`)

const chainId = UNISWAP.ChainId.MAINNET;
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // must be checksummed
const decimals = 18;

const DAI = new UNISWAP.Token(chainId, tokenAddress, decimals);

console.log('DAI', DAI);

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
(async () => {
  try {
    const DAI_from_lookup = await UNISWAP.Fetcher.fetchTokenData(chainId, tokenAddress);
    console.log('DAI_from_lookup', DAI_from_lookup);

    const pair = await UNISWAP.Fetcher.fetchPairData(DAI, UNISWAP.WETH[DAI.chainId])
    console.log('pair', pair);

    const route = new UNISWAP.Route([pair], UNISWAP.WETH[DAI.chainId])

    console.log(route.midPrice.toSignificant(6)) // 201.306
    console.log(route.midPrice.invert().toSignificant(6)) // 0.00496756

    const trade = new UNISWAP.Trade(route, new UNISWAP.TokenAmount(UNISWAP.WETH[DAI.chainId], '1000000000000000000'), UNISWAP.TradeType.EXACT_INPUT)

    console.log(trade.executionPrice.toSignificant(6))
    console.log(trade.nextMidPrice.toSignificant(6))

  } catch (error) {
    console.log(error);
  }
})();
