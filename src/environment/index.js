import { CDN_PATH_ASSETS, CDN_MAIN_PATH } from '../const/const'
let Environment;

export const environment = process.env.REACT_APP_LOCAL_CONFIG || process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 


export const getHostName = () => {
  const hostId = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 
  const nodeList = {
    development:'bitsenda',
    staging:'bitsenda',
    pre_prod:'cryptosenda',
    production:'coinsenda'
  }
  return nodeList[hostId]
  // return "coinsenda"
}
 
export const getCdnPath = (target) => {

  const nodeList = {
    ...CDN_PATH_ASSETS
  }

  return `https://app.${getHostName()}.com/${nodeList[target]}`
}

export const _getCdnPath = (target) => {
  const nodeList = {
    ...CDN_PATH_ASSETS 
  } 
  return `${CDN_MAIN_PATH}${nodeList[target]}`
}

// export const getBaseUrl = (prefix) => {
//   // let { hostname } = window.location
//   let _prefix = prefix ? `${prefix}.` : ''
//   // let BASE_URL = hostname.includes('localhost') ? `https://${_prefix}${getHostName()}.com` : `https://${_prefix}${hostname}`
//   const BASE_URL = `https://${_prefix}${getHostName()}.com`
//   console.log('|||||| BASE_URL', BASE_URL)
//   return BASE_URL 
// }

Environment = {
  ApiUrl: `https://tx.${getHostName()}.com/api/`,
  SocketUrl: `https://tx.${getHostName()}.com/`,
  IdentityApIUrl: `https://identity.${getHostName()}.com/api/`,
  CountryApIUrl: `https://info.${getHostName()}.com/api/`,
  AccountApiUrl: `https://account.${getHostName()}.com/api/`,
  DepositApiUrl: `https://deposit.${getHostName()}.com/api/`,
  WithdrawApiUrl: `https://withdraw.${getHostName()}.com/api/`,
  SwapApiUrl: `https://swap.${getHostName()}.com/api/`,
  CountryUrl: `https://info.${getHostName()}.com/`,
  BASE_URL:`https://${getHostName()}.com/`,
  APPLE_CLIENT_ID:`com.${getHostName()}`,
  APPLE_CALLBACK_URL:`https://auth.${getHostName()}.com/auth/apple/callback`,
  APPLE_SCOPES:`email name`,
  COINSENDA_CLIENT_ID: getHostName() === "coinsenda" ? "5a0a4435fc221f362f9e3e7f" : "613ffd54c8d76c00a9f626dc",
  Oauth: {
    url: `https://auth.${getHostName()}.com/`
  }
};

if (process.env.REACT_APP_LOCAL_CONFIG === "local") {
  Environment = {
    ApiUrl: "http://localhost:3001/api/",
    SocketUrl: "http://localhost:3001/",
    IdentityApIUrl: "http://localhost:3002/api/",
    CountryApIUrl: "http://localhost:3010/api/",
    AccountApiUrl: "http://localhost:4007/api/",
    DepositApiUrl: "http://localhost:4006/api/",
    WithdrawApiUrl: "http://localhost:4005/api/",
    SwapApiUrl: "http://localhost:4008/api/",
    CountryUrl: "http://localhost:3010/",
    BASE_URL:"https://bitsenda.com/",
    Oauth: {
      url: "http://127.0.0.1:3000/"
    }
  };
} 

export default Environment;
