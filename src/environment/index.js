let Environment

if(process.env.NODE_ENV === 'development'){
  Environment = {
    ApiUrl:'https://sendatx.ngrok.io/api/',
    SocketUrl:'https://sendatx.ngrok.io/',
    IdentityApIUrl:'https://sendaidentity.ngrok.io/api/',
    CountryApIUrl:'https://countrylistapi.ngrok.io/api/',
    AccountApiUrl:'https://sendaaccount.ngrok.io/api/',
    DepositApiUrl:'https://sendadeposit.ngrok.io/api/',
    WithdrawApiUrl:'https://sendawithdraw.ngrok.io/api/' ,
    SwapApiUrl:'https://sendaswap.ngrok.io/api/',
    CountryUrl:'https://countrylistapi.ngrok.io/'
  }
}else{
  Environment = {
    ApiUrl:'https://sendatx.ngrok.io/api/',
    SocketUrl:'https://sendatx.ngrok.io/',
    IdentityApIUrl:'https://sendaidentity.ngrok.io/api/',
    CountryApIUrl:'https://countrylistapi.ngrok.io/api/',
    AccountApiUrl:'https://sendaaccount.ngrok.io/api/',
    DepositApiUrl:'https://sendadeposit.ngrok.io/api/',
    WithdrawApiUrl:'https://sendawithdraw.ngrok.io/api/' ,
    SwapApiUrl:'https://sendaswap.ngrok.io/api/',
    CountryUrl:'https://countrylistapi.ngrok.io/'
  }
}

export default Environment
