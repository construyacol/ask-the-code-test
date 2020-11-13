let Environment;


if (process.env.REACT_APP_LOCAL_CONFIG === "local") {
  Environment = {
    ApiUrl: "http://localhost:3001/api/",
    SocketUrl: "http://localhost:3001/",
    IdentityApIUrl: "http://localhost:3002/api/",
    CountryApIUrl: "https://info1.devsertec.com/api/",
    AccountApiUrl: "http://localhost:4007/api/",
    DepositApiUrl: "http://localhost:4006/api/",
    WithdrawApiUrl: "http://localhost:4005/api/",
    SwapApiUrl: "http://localhost:4008/api/",
    CountryUrl: "https://info1.devsertec.com/",
  };

} else if (process.env.NODE_ENV === "development") {
  Environment = {
    ApiUrl: "https://tx1.devsertec.com/api/",
    SocketUrl: "https://tx1.devsertec.com/",
    IdentityApIUrl: "https://identity1.devsertec.com/api/",
    CountryApIUrl: "https://info1.devsertec.com/api/",
    AccountApiUrl: "https://account1.devsertec.com/api/",
    DepositApiUrl: "https://deposit1.devsertec.com/api/",
    WithdrawApiUrl: "https://withdraw1.devsertec.com/api/",
    SwapApiUrl: "https://swap1.devsertec.com/api/",
    CountryUrl: "https://info1.devsertec.com/",
  };
} else {
  Environment = {
    ApiUrl: "https://tx1.devsertec.com/api/",
    SocketUrl: "https://tx1.devsertec.com/",
    IdentityApIUrl: "https://identity1.devsertec.com/api/",
    CountryApIUrl: "https://info1.devsertec.com/api/",
    AccountApiUrl: "https://account1.devsertec.com/api/",
    DepositApiUrl: "https://deposit1.devsertec.com/api/",
    WithdrawApiUrl: "https://withdraw1.devsertec.com/api/",
    SwapApiUrl: "https://swap1.devsertec.com/api/",
    CountryUrl: "https://info1.devsertec.com/",
  };
}


export default Environment;
