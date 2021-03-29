let Environment;

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
    BASE_URL:"https://bitsenda.com/"
  };
} else if (process.env.NODE_ENV === "development" || process.env.REACT_APP_BUILD_CONFIG === 'development') {
  Environment = {
    ApiUrl: "https://tx.bitsenda.com/api/",
    SocketUrl: "https://tx.bitsenda.com/",
    IdentityApIUrl: "https://identity.bitsenda.com/api/",
    CountryApIUrl: "https://info.bitsenda.com/api/",
    AccountApiUrl: "https://account.bitsenda.com/api/",
    DepositApiUrl: "https://deposit.bitsenda.com/api/",
    WithdrawApiUrl: "https://withdraw.bitsenda.com/api/",
    SwapApiUrl: "https://swap.bitsenda.com/api/",
    CountryUrl: "https://info.bitsenda.com/",
    BASE_URL:"https://bitsenda.com/"
  };
} else {
  Environment = {
    ApiUrl: "https://tx.coinsenda.com/api/",
    SocketUrl: "https://tx.coinsenda.com/",
    IdentityApIUrl: "https://identity.coinsenda.com/api/",
    CountryApIUrl: "https://info.coinsenda.com/api/",
    AccountApiUrl: "https://account.coinsenda.com/api/",
    DepositApiUrl: "https://deposit.coinsenda.com/api/",
    WithdrawApiUrl: "https://withdraw.coinsenda.com/api/",
    SwapApiUrl: "https://swap.coinsenda.com/api/",
    CountryUrl: "https://info.coinsenda.com/",
    BASE_URL:"https://coinsenda.com/"
  };
}



export default Environment;
