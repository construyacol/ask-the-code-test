import BigNumber from "bignumber.js";

export const CURRENCIES = {
    bitcoin:{
        prod:'bitcoin',
        test:'bitcoin_testnet',
        prodName:'Bitcoin',
        testName:'Bitcoin Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 8,
        }),
        prod_fee:'bitcoin_fee',
        test_fee:'bitcoin_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_UP,
            DECIMAL_PLACES: 6,
        })
    },
    litecoin:{
        prod:'litecoin',
        test:'litecoin_testnet',
        prodName:'Litecoin',
        testName:'litecoin Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 8,
        }),
        prod_fee:'litecoin_fee',
        test_fee:'litecoin_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_UP,
            DECIMAL_PLACES: 8,
        })
    },
    ethereum:{
        prod:'ethereum',
        test:'ethereum_testnet',
        prodName:'Ethereum',
        testName:'Ethereum Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 18,
        }),
        prod_fee:'ethereum_fee',
        test_fee:'ethereum_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_UP,
            DECIMAL_PLACES: 6,
        })
    },
    usdt:{
        prod:'usdt',
        test:'usdt_testnet',
        prodName:'Usdt',
        testName:'Usdt Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 6,
        }),
        prod_fee:'usdt_fee',
        test_fee:'usdt_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_UP,
            DECIMAL_PLACES: 6,
        })
    },
    usd:{
        prod:'usd',
        test:'usd',
        prodName:'Usdt',
        testName:'Usdt Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 2,
        }),
        prod_fee:'usd_fee',
        test_fee:'usd_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_UP,
            DECIMAL_PLACES: 2,
        })
    },
    cop:{
        prod:'cop',
        test:'cop',
        prodName:'COP',
        testName:'COP',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 0,
        }),
        prod_fee:'cop_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_UP,
            DECIMAL_PLACES: 0,
        })
    },
    referred:{
        prod:'referred',
        prodName:'Referido',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 6,
        })
    }
}


const CURRENCY_CONFIG = {
    [CURRENCIES.bitcoin.prod]: CURRENCIES.bitcoin.currencyConfig,
    [CURRENCIES.bitcoin.test]: CURRENCIES.bitcoin.currencyConfig,
    [CURRENCIES.bitcoin.prod_fee]: CURRENCIES.bitcoin.currencyFeeConfig,
    [CURRENCIES.bitcoin.test_fee]: CURRENCIES.bitcoin.currencyFeeConfig,

    [CURRENCIES.litecoin.prod]: CURRENCIES.litecoin.currencyConfig,
    [CURRENCIES.litecoin.test]: CURRENCIES.litecoin.currencyConfig,
    [CURRENCIES.litecoin.prod_fee]: CURRENCIES.litecoin.currencyFeeConfig,
    [CURRENCIES.litecoin.test_fee]: CURRENCIES.litecoin.currencyFeeConfig,

    [CURRENCIES.ethereum.prod]: CURRENCIES.ethereum.currencyConfig,
    [CURRENCIES.ethereum.test]: CURRENCIES.ethereum.currencyConfig,
    [CURRENCIES.ethereum.prod_fee]: CURRENCIES.ethereum.currencyFeeConfig,
    [CURRENCIES.ethereum.test_fee]: CURRENCIES.ethereum.currencyFeeConfig,

    [CURRENCIES.usdt.prod]: CURRENCIES.usdt.currencyConfig,
    [CURRENCIES.usdt.test]: CURRENCIES.usdt.currencyConfig,
    [CURRENCIES.usdt.prod_fee]: CURRENCIES.usdt.currencyFeeConfig,
    [CURRENCIES.usdt.test_fee]: CURRENCIES.usdt.currencyFeeConfig,

    [CURRENCIES.usd.prod]: CURRENCIES.usd.currencyConfig,
    [CURRENCIES.usd.prod_fee]: CURRENCIES.usd.currencyFeeConfig,

    [CURRENCIES.cop.prod]: CURRENCIES.cop.currencyConfig,
    [CURRENCIES.cop.prod_fee]: CURRENCIES.cop.currencyFeeConfig,

    [CURRENCIES.referred.prod]: CURRENCIES.referred.currencyConfig,
};

export default CURRENCY_CONFIG




export const DEFAULT_CURRENCIES = [
    "cop",
    "bitcoin",
    "litecoin",
    "ethereum",
    "usdt"
]


export const CURRENCY_INDEX_IMG = {
    usdt_testnet:"usdt",
    usdtt:"usdt",
    usdtt2:"usdt",
    usdt:"usdt",
    usdt2:"usdt",
    litecoin_testnet:"litecoin",
    ltct:"ltc",
    ltct2:"ltc2",
    litecoin:"litecoin",
    ltc:"ltc",
    ltc2:"ltc2",
    ethereum_testnet:"ethereum",
    etht:"eth",
    etht2:"eth2",
    ethereum:"ethereum",
    eth:"eth",
    eth2:"eth2"
  }