import { createBrowserHistory } from "history";
import Enviroment from "../environment";
import { Capacitor } from '@capacitor/core';

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


export const NETWORK_LABELS = {
  internal_network:{
    user_friendly:{
      network:"mainnet"
    },
    uiName:"Coinsenda",
    auxUiName:"Transfiere de forma instantánea y gratuita",
    icon:"coinsenda"
  }
} 

export const CAPACITOR_PLATFORM = Capacitor.getPlatform();
export const CAPACITOR_PLATFORMS = {
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
}
export const MAIN_COLOR = "#0e95f8";
export const FONT_COLOR = "#50667a";

export const DEFAULT_FISRT_CRITERIAL = "tron"
  
export const ENVIRONMENT_VAR = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 

export const ORDER_TYPE_UI_NAME = {
  deposits:{
    ui_name:"Depósito", 
    value:"deposits"
  }, 
  withdraws: {
    ui_name:"Envío", 
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
    name:"Envíos", 
    value:"withdraws"
  }, 
  swaps:{
    name:"Intercambios", 
    value:"swaps"
  }
};

export const WITHDRAW_ACCOUNT_FILTER_LIST = {
  withdraws: {
  name:"Envíos", 
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
  OBTENIENDO_TUS_REGISTROS_DE_RETIROS: "Obteniendo tus registros de envíos",
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
export const ADD_NEW_DELETE_REQUEST_URL = `${ApiUrl}deleteRequests/add-new-delete-request`;
export const TWO_FACTOR_URL = `${ApiUrl}transactionSecuritys`;
export const TWO_FACTOR_BASE_URL = `${ApiUrl}`;
export const USER_DNS_URL = `${ApiUrl}userDns/resolve-identifier`;

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

export const size = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  mobile: 768,
  tablet: 768,
  tabletL: 900,
  laptop: 1440,
  laptopM: 1440,
  laptopL: 1440,
  desktop: 4000
};

export const device = {
  mobileS: `(max-width: ${size.mobileS}px)`,
  mobileM: `(max-width: ${size.mobileM}px)`,
  mobileL: `(max-width: ${size.mobileL}px)`,
  mobile: `(max-width: ${size.mobile}px)`,
  tablet: `(max-width: ${size.tablet}px)`,
  tabletL: `(max-width: ${size.tabletL}px)`,
  laptop: `(max-width: ${size.laptop}px)`,
  laptopM: `(max-width: ${size.laptopM}px)`,
  laptopL: `(max-width: ${size.laptopL}px)`,
  desktop: `(max-width: ${size.desktop}px)`,
  desktopL: `(max-width: ${size.desktop}px)`
};

export const fontSize = {
  p:{
    mobile:"0.0875 rem",
    tablet:"0.9375 rem",
    laptop:"0.9375 rem",
    desktop:"0.9 rem"
  }
}
// Para poder convertir una medida de pixeles a rem solo tienes que multiplicar el tamaño que quieres obtener por el número 0.0625
// export const size = {
//   mobile: 768,
//   laptop: 1025,
//   desktop: 1281
// };
// export const device = {
//   mobile: `(max-width: ${size.mobile}px)`,
//   tablet: `(min-width: ${size.mobile}px) and (max-width:${size.laptop}`,
//   laptop: `(min-width: ${size.laptop}px) and (max-width:${size.desktop}`,
//   desktop: `(min-width: ${size.desktop}px)`,
// };
// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488

export const currencyLabels = {
  usd: {symbol:"USD"},
  bitcoin: {bitcoin:"USD"},
  cop: {cop:"USD"}, 
  bitcoin_testnet: {bitcoin_testnet:"USD"}
};

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
  tensor:'cdn/tensor/models',
  appVersion:'version.js'
}

export const COLOR_FEES = {
  low:{
      color:"#FF4A4A"
  },
  medium:{
      color:"#FF9900"
  },
  high:{
      color:"#05EC00"
  }
}

const HIGH_PROIORITY = {
  ui_name:"Alta",
  ui_color:COLOR_FEES?.high?.color,
  value:"high"
}

const NONE_PROIORITY = {
  ui_name:"Alta",
  ui_color:COLOR_FEES?.high?.color,
  value:"none"
}

export const WITHDRAW_PRIORITY_FEE = {
  low:{
      ui_name:"Baja",
      ui_color:COLOR_FEES?.low?.color,
      value:"low"
  },
  medium:{
      ui_name:"Media",
      ui_color:COLOR_FEES?.medium?.color,
      value:"medium"
  },
  high:HIGH_PROIORITY,
  none:NONE_PROIORITY
}


export const DEFAULT_COST_ID = {
  default:WITHDRAW_PRIORITY_FEE.medium.value,
  internal_network:WITHDRAW_PRIORITY_FEE.none.value,
}
// export const DEFAULT_COST_ID = WITHDRAW_PRIORITY_FEE.medium.value
export const SUPPORT_EMAIL = "soporte@coinsenda.com"