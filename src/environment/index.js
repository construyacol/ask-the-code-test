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


// construyacol+555@gmail.com
// http://auth1.devsertec.com/public/signup?clientId=5e79471764dcdb016a369cd8
// http://auth1.devsertec.com/public/signin?clientId=5e79471764dcdb016a369cd8
