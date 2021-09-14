let Environment;

export const getHostName = () => {
  const hostId = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 
  const nodeList = {
    development:'bitsenda',
    staging:'bitsenda',
    pre_prod:'cryptosenda',
    production:'coinsenda'
  }
  return nodeList[hostId]
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
  Oauth: {
    url: `https://auth.${getHostName()}.com/`
  }
};




if (process.env.REACT_APP_LOCAL_CONFIG === "local") {
  Environment = {
    ApiUrl: "http://localhost:3001/api/",
    SocketUrl: "http://localhost:3001/",
    IdentityApIUrl: "http://localhost:3002/api/",
    CountryApIUrl: "https://info1.bitsenda.com/api/",
    AccountApiUrl: "http://localhost:4007/api/",
    DepositApiUrl: "http://localhost:4006/api/",
    WithdrawApiUrl: "http://localhost:4005/api/",
    SwapApiUrl: "http://localhost:4008/api/",
    CountryUrl: "https://info1.bitsenda.com/",
    BASE_URL:"https://bitsenda.com/",
    Oauth: {
      url: "https://auth.bitsenda.com/",
      clientId: "6067f5a9bdd72d00d1076365"
    }
  };
} 

console.log('||||||||||||| Environment ====>|', Environment)

export default Environment;
