// console.log('ENV:', process.env.NODE_ENV)
// console.log('R_CONFIG:', process.env.REACT_APP_BUILD_CONFIG)
let defaultConfig = {
  site: {
    host: "https://coinsenda.com",
    // host: "https://senda.devsertec.com"
  },
  oauth: {
    host: "https://auth.coinsenda.com",
    // host: "https://auth.devsertec.com",
    signin: "public/signin",
    signup: "public/signup",
    profile: "account/profile",
    logout: "oauth/session/destroy",
    key: "5a0a4435fc221f362f9e3e7f",
  },
  identity: {
    host: "https://id.coinsenda.com",
    // host: 'https://identity.devsertec.com'
  },
  api: {
    // host: "https://192.168/0.3:"
    host: "https://tx.coinsenda.com",
    // host: "https://api.devsertec.com",
    profile: "api/profiles",
    market: "api/pairs",
  },
  notifications: {
    host: "https://notification.coinsenda.com",
    // host: "https://notification.devsertec.com"
  },
  pairsUpdateInterval: 60000,
  minimunBtcAmount: 0.002,
  btcNetwork: "bitcoin",
};

if (
  process.env.NODE_ENV === "development" ||
  process.env.REACT_APP_BUILD_CONFIG === "local"
) {
  defaultConfig = {
    site: {
      host: "http://localhost:3000",
    },
    oauth: {
      host: "https://auth.devsertec.com",
      // host: "http://192.168.0.3:3000",
      signin: "public/signin",
      signup: "public/signup",
      profile: "account/profile",
      logout: "oauth/session/destroy",
      key: "5b48b14c7d417e003d9a16c3",
    },
    identity: {
      host: "https://identity.devsertec.com",
    },
    api: {
      // host: "https://192.168/0.3:"
      host: "https://api.devsertec.com",
      profile: "api/profiles",
      market: "api/pairs",
    },
    notifications: {
      host: "https://notification.devsertec.com",
    },
    pairsUpdateInterval: 60000,
    minimunBtcAmount: 0.002,
    btcNetwork: "testnet",
  };
}

if (process.env.REACT_APP_BUILD_CONFIG === "staging") {
  defaultConfig = {
    site: {
      host: "https://senda.devsertec.com",
    },
    oauth: {
      host: "https://auth.devsertec.com",
      signin: "public/signin",
      signup: "public/signup",
      profile: "account/profile",
      logout: "oauth/session/destroy",
      key: "5b48b14c7d417e003d9a16d3",
    },
    identity: {
      host: "https://identity.devsertec.com",
    },
    api: {
      host: "https://api.devsertec.com",
      profile: "api/profiles",
      market: "api/pairs",
    },
    notifications: {
      host: "https://notification.devsertec.com",
    },
    pairsUpdateInterval: 60000,
    minimunBtcAmount: 0.002,
    btcNetwork: "testnet",
  };
}
if (process.env.REACT_APP_LOCAL === "local") {
  defaultConfig = {
    site: {
      host: "http://localhost:3005",
    },
    oauth: {
      host: "http://localhost:3000",
      // host: "http://192.168.0.3:3000",
      signin: "public/signin",
      signup: "public/signup",
      profile: "account/profile",
      logout: "oauth/session/destroy",
      key: process.env.REACT_APP_AUTH_SERVICE_SENDA_CLIENT_ID,
    },
    identity: {
      host: "http://localhost:3002",
    },
    api: {
      // host: "https://192.168/0.3:"
      host: "http://localhost:3001",
      profile: "api/profiles",
      market: "api/pairs",
    },
    notifications: {
      host: "http://localhost:4002",
    },
    pairsUpdateInterval: 60000,
    minimunBtcAmount: 0.002,
    btcNetwork: "testnet",
  };
}

module.exports = defaultConfig;
