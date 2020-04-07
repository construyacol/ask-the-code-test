import Enviroment from "../environment"

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
export const WITHDRAW_PROVIDERS_URL = `${WithdrawApiUrl}withdrawProviders`
export const UPDATE_WITHDRAW_URL = `${WithdrawApiUrl}withdraws/add-update-withdraw`
export const NEW_WITHDRAW_URL = `${WithdrawApiUrl}withdraws/add-new-withdraw`
export const DELETE_WITHDRAW_URL = `${ApiUrl}withdraws`
export const NEW_WITHDRAW_ACCOUNT_URL = `${WithdrawApiUrl}withdrawAccounts/add-new-withdraw-account`

export const DEPOSITS_URL = `${DepositApiUrl}`
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
