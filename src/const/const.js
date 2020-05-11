import { createBrowserHistory } from "history";
import Enviroment from "../environment"
import BigNumber from "bignumber.js";

const {
    AccountApiUrl,
    ApiUrl,
    WithdrawApiUrl,
    DepositApiUrl,
    SwapApiUrl,
    IdentityApIUrl
} = Enviroment

export const loadLabels = {
    IMPORTANDO_PARES: 'Importando pares',
    OBTENIENDO_TUS_BILLETERAS_Y_BALANCES: 'Obteniendo tus billeteras y balances',
    OBTENIENDO_REGISTRO_DE_INTERCAMBIOS: 'Obteniendo tus registros de intercambios',
    OBTENIENDO_CUENTAS_DE_RETIRO: 'Obteniendo cuentas de retiro',
    OBTENIENDO_PROVEEDORES_DE_RETIRO : 'Obteniendo proveedores de retiro',
    OBTENIENDO_TUS_REGISTROS_DE_RETIROS: 'Obteniendo tus registros de retiros',
    OBTENIENDO_TODAS_LAS_DIVISAS: 'Obteniendo todas las divisas',
    CARGANDO_TU_INFORMACION: 'Cargando tu información',
    OBTENIENDO_PROVEEDORES_DE_DEPOSITO: 'Obteniendo proveedores de deposito'
}

export const ACCOUNT_URL = `${AccountApiUrl}users`
export const CREATE_WALLET_URL = `${AccountApiUrl}accounts/add-new-account`
export const DELETE_WALLET_URL = `${AccountApiUrl}accounts/update-visibility`

export const LOCAL_CURRENCIES_URL = `${ApiUrl}countries?filter=`
export const CURRENCIES_URL = `${ApiUrl}currencies?filter=`
export const ADD_RESTORE_ID_URL = `${ApiUrl}profiles/add-restoreid`
export const CURRENCIES_URL_ALT = `${ApiUrl}currencies`
export const GET_PROFILE_URL = `${ApiUrl}users`
export const ADD_PROFILE_URL = `${ApiUrl}profiles/add-new-profile`

export const DELETE_WITHDRAW_ACCOUNT_URL = `${WithdrawApiUrl}withdrawAccounts/update-visibility`
export const GET_WITHDRAW_BY_USER_URL = `${WithdrawApiUrl}users`
export const GET_WITHDRAWS_BY_ACCOUNT_ID = `${WithdrawApiUrl}users`
export const WITHDRAW_PROVIDERS_URL = `${WithdrawApiUrl}withdrawProviders`
export const UPDATE_WITHDRAW_URL = `${WithdrawApiUrl}withdraws/add-update-withdraw`
export const NEW_WITHDRAW_URL = `${WithdrawApiUrl}withdraws/add-new-withdraw`
export const DELETE_WITHDRAW_URL = `${ApiUrl}withdraws`
export const NEW_WITHDRAW_ACCOUNT_URL = `${WithdrawApiUrl}withdrawAccounts/add-new-withdraw-account`

export const DEPOSITS_URL = `${DepositApiUrl}`
export const GET_DEPOSIT_BY_USERS_URL = `${DepositApiUrl}users`
export const UPDATE_DEPOSIT_URL = `${DepositApiUrl}deposits/add-update-deposit`
export const NEW_DEPOSIT_URL = `${DepositApiUrl}deposits/add-new-deposit`

export const SWAP_URL = `${SwapApiUrl}pairs`
export const PAIRS_URL = `${SwapApiUrl}pairs?filter=`
export const ADD_NEW_SWAP = `${SwapApiUrl}swaps/add-new-swap`
export const GET_SWAPS_BY_USERS_URL = `${SwapApiUrl}users`

export const INDETITY_URL = `${IdentityApIUrl}countryvalidators/findOne`
export const INDENTITY_USERS_URL = `${IdentityApIUrl}users`
export const INDETITY_COUNTRY_VALIDATORS_URL = `${IdentityApIUrl}countryvalidators`
export const INDETITY_UPDATE_PROFILE_URL = `${IdentityApIUrl}profiles/add-new-profile`

export const REFERRALS_URL = `${ApiUrl}referrals`

export const GET_URLS = {
    withdraws: GET_WITHDRAW_BY_USER_URL,
    swaps: GET_SWAPS_BY_USERS_URL,
    deposits: GET_DEPOSIT_BY_USERS_URL
}

export const history = createBrowserHistory();
export const COINSENDA_URL = process.env.NODE_ENV === 'development' ? "https://devsertec.com/" : "https://www.coinsenda.com/";

export const currencyFormatByCoin = {
    "bitcoin":BigNumber.clone({ROUNDING_MODE:BigNumber.ROUND_HALF_UP, DECIMAL_PLACES:8}),
    "bitcoin_testnet":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_HALF_UP, DECIMAL_PLACES: 8}),
    "usd":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_HALF_UP, DECIMAL_PLACES: 3}),
    "ethereum":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_HALF_UP, DECIMAL_PLACES: 8}),
    "cop":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_HALF_UP, DECIMAL_PLACES: 3}),
    "bitcoin_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 6}),
    "bitcoin_testnet_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 6}),
    "usd_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 2}),
    "ethereum_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 6}),
    "cop_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 0})
  }
