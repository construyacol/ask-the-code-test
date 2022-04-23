import { createBrowserHistory } from "history";
import Enviroment from "../environment";
import BigNumber from "bignumber.js";

const {
  AccountApiUrl,
  ApiUrl,
  WithdrawApiUrl,
  DepositApiUrl,
  SwapApiUrl,
  IdentityApIUrl,
  CountryUrl,
  Oauth,
  BASE_URL
} = Enviroment;

export const MAIN_COLOR = "#0e95f8";
export const FONT_COLOR = "#50667a";
  
export const ENVIRONMENT_VAR = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 

export const ORDER_TYPE_UI_NAME = {
  deposits:{
    ui_name:"Depósito", 
    value:"deposits"
  }, 
  withdraws: {
    ui_name:"Retiro", 
    value:"withdraws"
  }, 
  swaps:{
    ui_name:"Intercambio", 
    value:"swaps"
  }
}


export const TOTAL_ORDER_AMOUNT_COPYS = {
  withdraws:{
    accepted:"Total recibido",
    rejected:"Saldo sin debitar",
    canceled:"Saldo sin debitar",
    ui_name:"Total a recibir"
  },
  deposits:{
    accepted:"Total acreditado",
    canceled:"Saldo sin acreditar",
    rejected:"Saldo sin acreditar",
    ui_name:"Total depositado"
  },
  swaps:{
    ui_name:"Total adquirido"
  },
  deposit:{
    ui_name:"Flujo depósito?"
  },
  withdraw:{
    ui_name:"Total para retirar ?"
  }
}

export const WALLET_FILTER_LIST = { 
  deposits:{
    name:"Depósitos", 
    value:"deposits"
  }, 
  withdraws: {
    name:"Retiros", 
    value:"withdraws"
  }, 
  swaps:{
    name:"Intercambios", 
    value:"swaps"
  }
};

export const WITHDRAW_ACCOUNT_FILTER_LIST = {
  withdraws: {
  name:"Retiros", 
  value:"withdraws"
  }
}

export const PRIORITY_ENTITIES = [
  "bancolombia",
  "bbva_colombia",
  "banco_davivienda_sa",
  "nequi",
  "banco_falabella_sa",
  "efecty"
]

export const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg"
];

export let TRANSACTION_SECURITY = {
  "2fa":null,
  "biometric":null
}

export const BIOMETRIC_FIAT_LITMIT_AMOUNT = "900000"

export const loadLabels = {
  IMPORTANDO_PARES: "Importando pares",
  OBTENIENDO_TUS_BILLETERAS_Y_BALANCES: "Obteniendo tus billeteras y balances",
  OBTENIENDO_REGISTRO_DE_INTERCAMBIOS:
    "Obteniendo tus registros de intercambios",
  OBTENIENDO_CUENTAS_DE_RETIRO: "Obteniendo cuentas de retiro",
  OBTENIENDO_PROVEEDORES_DE_RETIRO: "Obteniendo proveedores de retiro",
  OBTENIENDO_TUS_REGISTROS_DE_RETIROS: "Obteniendo tus registros de retiros",
  OBTENIENDO_TODAS_LAS_DIVISAS: "Obteniendo todas las divisas",
  CARGANDO_TU_INFORMACION: "Cargando tu información",
  OBTENIENDO_PROVEEDORES_DE_DEPOSITO: "Obteniendo proveedores de deposito",
};

export const REFRESH_TOKEN_EXP_TIME = 43000
export const DESTROY_SESSION_URL = `${Oauth.url}auth/oauth/destroy/session`;
export const GET_JWT_URL = `${Oauth.url}auth/oauth/grant/refresh-token`;
export const GET_PUBLIC_KEY_URL = `${Oauth.url}auth/applications/get-public-key`;

export const ACCOUNT_URL = `${AccountApiUrl}users`;
export const CREATE_WALLET_URL = `${AccountApiUrl}accounts/add-new-account`;
export const DELETE_WALLET_URL = `${AccountApiUrl}accounts/update-visibility`;

export const LOCAL_CURRENCIES_URL = `${ApiUrl}countries?filter=`;
export const CURRENCIES_URL = `${ApiUrl}currencies?filter=`;
export const ADD_RESTORE_ID_URL = `${ApiUrl}profiles/add-restoreid`;
export const CURRENCIES_URL_ALT = `${ApiUrl}currencies`;
export const GET_PROFILE_URL = `${ApiUrl}users`;
export const ADD_PROFILE_URL = `${ApiUrl}profiles/add-new-profile`;
export const TWO_FACTOR_URL = `${ApiUrl}transactionSecuritys`;
export const TWO_FACTOR_BASE_URL = `${ApiUrl}`;


export const DELETE_WITHDRAW_ACCOUNT_URL = `${WithdrawApiUrl}withdrawAccounts/update-visibility`;
export const GET_WITHDRAW_BY_USER_URL = `${WithdrawApiUrl}users`;
export const GET_WITHDRAWS_BY_ACCOUNT_ID = `${WithdrawApiUrl}users`;
export const WITHDRAW_PROVIDERS_URL = `${WithdrawApiUrl}withdrawProviders`;
export const UPDATE_WITHDRAW_URL = `${WithdrawApiUrl}withdraws/add-update-withdraw`;
export const NEW_WITHDRAW_URL = `${WithdrawApiUrl}withdraws/add-new-withdraw`;
export const NEW_WITHDRAW_ACCOUNT_URL = `${WithdrawApiUrl}withdrawAccounts/add-new-withdraw-account`;

export const DEPOSITS_URL = `${DepositApiUrl}`;
export const GET_DEPOSIT_BY_USERS_URL = `${DepositApiUrl}users`;
export const UPDATE_DEPOSIT_URL = `${DepositApiUrl}deposits/add-update-deposit`;
export const NEW_DEPOSIT_URL = `${DepositApiUrl}deposits/add-new-deposit`;
export const SUBSCRIBE_TO_DEPOSITS_URL = `${DepositApiUrl}depositProviders/subscribe-to-new-deposits`;


export const SWAP_CONVERT_CURRENCIES = `${SwapApiUrl}swaps/convert-currencies`; 
export const SWAP_URL = `${SwapApiUrl}`;
export const POST_PAIRS_URL = `${SwapApiUrl}pairs/get-all-pairs-for-public`;
// export const PAIRS_URL = `${SwapApiUrl}pairs?filter=`;
export const ADD_NEW_SWAP = `${SwapApiUrl}swaps/add-new-swap`;
export const GET_SWAPS_BY_USERS_URL = `${SwapApiUrl}users`;
 
export const INDETITY_URL = `${IdentityApIUrl}countryvalidators/findOne`;
export const INDENTITY_USERS_URL = `${IdentityApIUrl}users`;
export const INDENTITY_ADD_BIOMETRIC_DATA_URL = `${IdentityApIUrl}biometricDatas/add-new-biometric-data`;
export const INDETITY_COUNTRY_VALIDATORS_URL = `${IdentityApIUrl}countryvalidators`;
export const INDETITY_UPDATE_PROFILE_URL = `${IdentityApIUrl}profiles/add-new-profile`;

export const REFERRALS_URL = `${ApiUrl}referrals`;
export const GET_REFERRAL_URL = `${ApiUrl}users`;


export const GET_CHART_DATA_URL = `${CountryUrl}api/cryptoCompares/get-daily-historical-data`;

export const GET_URLS = {
  withdraws: GET_WITHDRAW_BY_USER_URL,
  swaps: GET_SWAPS_BY_USERS_URL,
  deposits: GET_DEPOSIT_BY_USERS_URL,
};

export const history = createBrowserHistory();
export const COINSENDA_URL = BASE_URL

export const currencyFormatByCoin = {
  bitcoin: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
    DECIMAL_PLACES: 8,
  }),
  litecoin: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
    DECIMAL_PLACES: 8,
  }),
  bitcoin_testnet: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
    DECIMAL_PLACES: 8,
  }),
  usd: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
    DECIMAL_PLACES: 3,
  }),
  ethereum: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
    DECIMAL_PLACES: 8,
  }),
  cop: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
    DECIMAL_PLACES: 0,
  }),
  bitcoin_fee: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_UP,
    DECIMAL_PLACES: 6,
  }),
  bitcoin_testnet_fee: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_UP,
    DECIMAL_PLACES: 6,
  }),
  usd_fee: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_UP,
    DECIMAL_PLACES: 2,
  }),
  ethereum_fee: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_UP,
    DECIMAL_PLACES: 6,
  }),
  cop_fee: BigNumber.clone({
    ROUNDING_MODE: BigNumber.ROUND_UP,
    DECIMAL_PLACES: 0,
  }),
};

const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  tabletL: "900px",
  laptop: "1024px",
  laptopM: "1366px",
  laptopL: "1440px",
  desktop: "2560px",
};

export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  tabletL: `(max-width: ${size.tabletL})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopM: `(max-width: ${size.laptopM})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};

export const currencyLabels = {
  usd: {symbol:"USD"},
  bitcoin: {bitcoin:"USD"},
  cop: {cop:"USD"}, 
  bitcoin_testnet: {bitcoin_testnet:"USD"}
};

export const BLOCKCHAIN_EXPLORER_URL = {
  bitcoin:"https://blockstream.info/tx/",
  bitcoin_testnet:"https://blockstream.info/tx/",
  litecoin:"https://blockchair.com/es/litecoin/transaction/"
}


export const orderStateColors = {
  accepted: "linear-gradient(to bottom right, #11998e, #48c778);",
  canceled: "linear-gradient(to bottom right, gray, gray);",
  rejected: "linear-gradient(to bottom right, gray, gray);",
  confirmed: "linear-gradient(to bottom right, gray, gray);",
};

export const chartOptions = {
  lang: {
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    weekdays: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ],
    shortMonths: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    rangeSelectorFrom: "Desde",
    rangeSelectorTo: "hasta",
    loading: "Cargando...",
  },
};

export const ACCEPT_FILE_TYPE = ["image/jpeg", "image/png", ".pdf"];

export const ACCEPT_FILE_TYPE_ADVANCE_KYC = ["image/jpeg", "image/png"];



export const CDN_PATH_ASSETS = {
  highstock:'cdn/libs/highstock.js',
  d3:'cdn/libs/d3.js',
  faceApi:"cdn/libs/faceApi.js",
  assets:'cdn/assets/',
  tensor:'cdn/tensor/models'
}


export const COLOR_FEES = {
  low_priority:{
      color:"#FF4A4A"
  },
  medium_priority:{
      color:"#FF9900"
  },
  high_priority:{
      color:"#05EC00"
  }
}

export const WITHDRAW_PRIORITY_FEE = {
  low_priority:{
      ui_name:"Baja",
      ui_color:COLOR_FEES?.low_priority?.color,
      value:"low_priority"
  },
  medium_priority:{
      ui_name:"Media",
      ui_color:COLOR_FEES?.medium_priority?.color,
      value:"medium_priority"
  },
  high_priority:{
      ui_name:"Alta",
      ui_color:COLOR_FEES?.high_priority?.color,
      value:"high_priority"
  }
}



export const fileTest = "data:image/png;base64,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"