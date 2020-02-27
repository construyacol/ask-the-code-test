export const Environment = {
  ApiUrl:process.env.NODE_ENV === 'development' ? 'https://sendatx.ngrok.io/api/' : 'https://sendatx.ngrok.io/api/',
  SocketUrl:process.env.NODE_ENV === 'development' ? 'https://sendatx.ngrok.io/' : 'https://sendatx.ngrok.io/',
  IdentityApIUrl:process.env.NODE_ENV === 'development' ? 'https://sendaidentity.ngrok.io/api/' : 'https://sendaidentity.ngrok.io/api/',
  CountryApIUrl:process.env.NODE_ENV === 'development' ? 'https://countrylistapi.ngrok.io/api/' : 'https://countrylistapi.ngrok.io/api/',
  AccountApiUrl:process.env.NODE_ENV === 'development' ? 'https://sendaaccount.ngrok.io/api/' : 'https://sendaaccount.ngrok.io/api/',
  DepositApiUrl:process.env.NODE_ENV === 'development' ? 'https://sendadeposit.ngrok.io/api/' : 'https://sendadeposit.ngrok.io/api/',
  WithdrawApiUrl:process.env.NODE_ENV === 'development' ? 'https://sendawithdraw.ngrok.io/api/' : 'https://sendawithdraw.ngrok.io/api/',
  SwapApiUrl:process.env.NODE_ENV === 'development' ? 'https://sendaswap.ngrok.io/api/' : 'https://sendaswap.ngrok.io/api/',
  CountryUrl:'https://countrylistapi.ngrok.io/'
}

export default Environment
