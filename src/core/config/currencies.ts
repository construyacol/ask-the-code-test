import BigNumber from "bignumber.js";

const env = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 

const SYMBOL_CURRENCIES = {
    cop:{
        regex:/\bCOP\b|\bcop\b/,
        replaceFor:"DCOP"
    }
}

export const parseSymbolCurrency = (symbolCurrency:string):string => {
   const symbolCurrencyData = SYMBOL_CURRENCIES[symbolCurrency?.toLowerCase() as keyof typeof SYMBOL_CURRENCIES]
   if(!symbolCurrencyData)return symbolCurrency
   const { regex, replaceFor } = symbolCurrencyData;
   return symbolCurrency.replace(regex, replaceFor);
}

export const DEFAULT_CURRENCY = {
    currency: env !== 'production' ? 'bitcoin_testnet' : 'bitcoin',
    symbol:env !== 'production' ? 'btct' : 'btc',
}

// export const DEFAULT_CURRENCY = {
//     currency: 'bitcoin',
//     symbol:'btc'
// }


export const FIAT_PROVIDER_TYPES = {
    bank:true,
    efecty_network:true,
}

const FIAT_CRITERIALS = {
    cop:true,
    fiat:true
}

export const checkIfFiat = (currency:string) => FIAT_CRITERIALS[currency?.toLocaleLowerCase() as keyof typeof FIAT_CRITERIALS];

// export const DEFAULT_CURRENCY = {
//     currency: 'bitcoin',
//     symbol:'btc'
// }

export const BLOCKCHAIN_EXPLORER_URL = {
    bitcoin:{
        bitcoin:"https://blockstream.info/tx/"
    },
    bitcoin_testnet:{
        bitcoin_testnet:"https://blockstream.info/tx/"
    },
    litecoin:{
        litecoin:"https://blockchair.com/es/litecoin/transaction/"
    },
    litecoin_testnet:{
        litecoin_testnet:"https://blockexplorer.one/litecoin/testnet/tx/"
    },
    ethereum:{
        ethereum:"https://etherscan.io/tx/"
    },
    tron:{
        tron:"https://tronscan.org/#/transaction/",
    },
    cop:{
        ethereum_testnet:"https://goerli.etherscan.io/tx/",
        ethereum:"https://etherscan.io/tx/"
    },
    ethereum_testnet:{
        ethereum_testnet:"https://goerli.etherscan.io/tx/"
    },
    usdt:{
        ethereum:"https://blockchair.com/es/ethereum/transaction/",
        tron:"https://tronscan.org/#/transaction/",
        bsc:"https://bscscan.com/tx/"
    },
    usdt_testnet:{
        ethereum_testnet:"https://blockchair.com/es/ethereum/transaction/",
        tron_testnet:"https://tronscan.org/#/transaction/"
    },
    tron_testnet:{
        tron_testnet:"https://tronscan.org/#/transaction/",
    },
    fau_testnet:{
        ethereum_testnet:"https://blockchair.com/es/ethereum/transaction/"
    },
    bnb:{
        bsc:"https://bscscan.com/tx/"
    }
}

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
        }),
        blockchainExplorer:"https://blockstream.info/tx/"
    },
    bnb:{
        prod:'bnb',
        test:'bnb_testnet',
        prodName:'BNB',
        testName:'BNB Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 8,
        }),
        prod_fee:'bnb_fee',
        test_fee:'bnb_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_UP,
            DECIMAL_PLACES: 6,
        }),
        blockchainExplorer:"https://blockstream.info/tx/"
    },
    litecoin:{
        prod:'litecoin',
        test:'litecoin_testnet',
        prodName:'Litecoin',
        testName:'Litecoin Test',
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
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 8,
        }),
        prod_fee:'ethereum_fee',
        test_fee:'ethereum_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 6,
        })
    },
    busd:{
        prod:'busd',
        test:'busd_testnet',
        prodName:'BUSD',
        testName:'BUSD Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 8,
        }),
        prod_fee:'busd_fee',
        test_fee:'busd_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 6,
        })
    },
    tron:{
        prod:'tron',
        test:'tron_testnet',
        prodName:'Tron',
        testName:'Tron Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 6,
        }),
        prod_fee:'tron_fee',
        test_fee:'tron_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 6,
        })
    },
    usdt:{
        prod:'usdt',
        test:'usdt_testnet',
        prodName:'USDT',
        testName:'USDT Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 4,
        }),
        prod_fee:'usdt_fee',
        test_fee:'fau_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 4,
        })
    },
    usdc:{
        prod:'usdc',
        test:'usdc_testnet',
        prodName:'USDC',
        testName:'USDC Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 4,
        }),
        prod_fee:'usdc_fee',
        test_fee:'usdc_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 4,
        })
    },
    fau_testnet:{
        test:'fau_testnet',
        testName:'Fau Test',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN, 
            DECIMAL_PLACES: 4
        }),
        test_fee:'fau_testnet_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_DOWN,
            DECIMAL_PLACES: 4,
        })
    },
    usd:{
        prod:'usd',
        test:'fau_testnet',
        prodName:'Usd',
        testName:'Fau Test',
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
    dcop:{
        prod:'dcop',
        test:'dcop',
        prodName:'DCOP',
        testName:'DCOP',
        currencyConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
            DECIMAL_PLACES: 2,
        }),
        prod_fee:'cop_fee',
        currencyFeeConfig:BigNumber.clone({
            ROUNDING_MODE: BigNumber.ROUND_UP,
            DECIMAL_PLACES: 2,
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

    [CURRENCIES.usdt.prod]: CURRENCIES.usdt.currencyConfig,
    [CURRENCIES.usdt.test]: CURRENCIES.usdt.currencyConfig,

    [CURRENCIES.usdc.prod]: CURRENCIES.usdc.currencyConfig,
    [CURRENCIES.usdc.test]: CURRENCIES.usdc.currencyConfig,


    [CURRENCIES.bnb.prod]: CURRENCIES.bnb.currencyConfig,
    [CURRENCIES.bnb.test]: CURRENCIES.bnb.currencyConfig,

    [CURRENCIES.busd.prod]: CURRENCIES.busd.currencyConfig,
    [CURRENCIES.busd.test]: CURRENCIES.busd.currencyConfig,
    
    [CURRENCIES.tron.prod]: CURRENCIES.tron.currencyConfig,
    [CURRENCIES.tron.test]: CURRENCIES.tron.currencyConfig,

    [CURRENCIES.ethereum.prod]: CURRENCIES.ethereum.currencyConfig,
    [CURRENCIES.ethereum.test]: CURRENCIES.ethereum.currencyConfig,
    [CURRENCIES.ethereum.prod_fee]: CURRENCIES.ethereum.currencyFeeConfig,
    [CURRENCIES.ethereum.test_fee]: CURRENCIES.ethereum.currencyFeeConfig,

    [CURRENCIES.fau_testnet.test]: CURRENCIES.fau_testnet.currencyConfig,
    [CURRENCIES.fau_testnet.test_fee]: CURRENCIES.fau_testnet.currencyFeeConfig,

    [CURRENCIES.usd.prod]: CURRENCIES.usd.currencyConfig,
    [CURRENCIES.usd.prod_fee]: CURRENCIES.usd.currencyFeeConfig,

    [CURRENCIES.cop.prod]: CURRENCIES.cop.currencyConfig,
    [CURRENCIES.cop.prod_fee]: CURRENCIES.cop.currencyFeeConfig,

    [CURRENCIES.referred.prod]: CURRENCIES.referred.currencyConfig,
};

export default CURRENCY_CONFIG

export const NEW_CURRENCIES = [
    "usdt",
    "ethereum"
] 
 
export let DEFAULT_CURRENCIES = [
    "cop",
    "bitcoin",
    "litecoin",
    ...NEW_CURRENCIES
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