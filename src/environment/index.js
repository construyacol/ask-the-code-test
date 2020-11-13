let Environment;

if (process.env.NODE_ENV === "development") {
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
} else if (process.env.NODE_ENV === "local") {
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

// font-family: Gilroy, Arial, sans-serif;
// userId: 5d234a113035be2e18a953ca
// userID staging: 5e9543697410260066675479

// construyacol+zz21@gmail.com
// construyacol+douglas@gmail.com

// https://auth1.devsertec.com/signin?clientId=5e79471764dcdb016a369cd8

// eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbnN0cnV5YWNvbCs0NDV4QGdtYWlsLmNvbSIsImxhbmd1YWdlIjoiZXMiLCJpc3MiOiI1ZTc5NDcxNzY0ZGNkYjAxNmEzNjljZDgiLCJ1c3IiOiI1ZTk3NTJmOGFkZGJhZTAwZTIyNGE0OWYiLCJqdGkiOiJSWFJtWmQzVXNyeDhXQm04SU1sak9KYmU2cVFKQzNMRE1QbmhuVU0zNTZiaVhXQUZHYXVOZlczWEFqMldYazBEIiwiYXVkIjoidHJhbnNhY3Rpb24sYXV0aCxpZGVudGl0eSxpbmZvLGRlcG9zaXQsYWNjb3VudCx3aXRoZHJhdyxzd2FwIiwibWV0YWRhdGEiOiJ7XCJ1aWRcIjpcIjVlOTU0MzY5NzQxMDI2MDA2NjY3NTQ3OVwiLFwiY2xpZW50SWRcIjpcIjVlNzk0NzE3NjRkY2RiMDE2YTM2OWNkOFwiLFwidG9rZW5cIjpcImMyNjUyNDdiNDBjNWQwYjU0NTAxMTI5NTdlYWU1NWM2YjdjZjAxY2MxOWJlOTFlZTY0ZjZiOWY0NTk5MzU3NGMwZDM0YTBhN2E4NDE0NDRlNTM1NjRmYjkyMGJiMWY3NWE3OTRkY2ZiMGVmYzMxYjJiZjY2ODM5ZGI5M2EwNTdkXCJ9IiwiaWF0IjoxNTg2OTc1NTA3LCJleHAiOjE1ODY5ODYzMDd9.TWhv5eXv8wd64O9DajUmgM7SlzRy_wS9gj2XTPEu1q20DoG-5xvUP7Ejzao5csri63bFuQTIzto5x0dRlItkvA

//
