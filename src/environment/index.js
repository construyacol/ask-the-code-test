let Environment

if(process.env.NODE_ENV === 'development'){
  // Environment = {
  //   ApiUrl:'https://tx1.devsertec.com/api/',
  //   SocketUrl:'https://tx1.devsertec.com/',
  //   IdentityApIUrl:'https://identity1.devsertec.com/api/',
  //   CountryApIUrl:'https://info1.devsertec.com/api/',
  //   AccountApiUrl:'https://account1.devsertec.com/api/',
  //   DepositApiUrl:'https://deposit1.devsertec.com/api/',
  //   WithdrawApiUrl:'https://withdraw1.devsertec.com/api/' ,
  //   SwapApiUrl:'https://swap1.devsertec.com/api/',
  //   CountryUrl:'https://info1.devsertec.com/'
  // }
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


// Environment = {
//   ApiUrl:'https://sendatx.ngrok.io/api/',
//   SocketUrl:'https://sendatx.ngrok.io/',
//   IdentityApIUrl:'https://sendaidentity.ngrok.io/api/',
//   CountryApIUrl:'https://countrylistapi.ngrok.io/api/',
//   AccountApiUrl:'https://sendaaccount.ngrok.io/api/',
//   DepositApiUrl:'https://sendadeposit.ngrok.io/api/',
//   WithdrawApiUrl:'https://sendawithdraw.ngrok.io/api/' ,
//   SwapApiUrl:'https://sendaswap.ngrok.io/api/',
//   CountryUrl:'https://countrylistapi.ngrok.io/'
// }

// construyacol+6464a@gmail.com
// http://auth1.devsertec.com/signin?clientId=5e79471764dcdb016a369cd8



// eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbnN0cnV5YWNvbCs2NDY0YUBnbWFpbC5jb20iLCJsYW5ndWFnZSI6ImVzIiwiaXNzIjoiNWU3OTQ3MTc2NGRjZGIwMTZhMzY5Y2Q4IiwidXNyIjoiNWU3YWIyNGJhNDNkOTcwMGNiMDc0MjUxIiwianRpIjoidTc2YlFUWEMxYW56QTRaSTEwdWxsa0o1bEFGSHBaQTUyU3VvREpuYVA0bHNGc1FDZkhJaWlqRDFXUUpFUDhzQSIsImF1ZCI6InRyYW5zYWN0aW9uLGF1dGgsaWRlbnRpdHkiLCJtZXRhZGF0YSI6IntcInVpZFwiOlwiNWU3YWIyNGJhNDNkOTcwMGNiMDc0MjUxXCIsXCJjbGllbnRJZFwiOlwiNWU3OTQ3MTc2NGRjZGIwMTZhMzY5Y2Q4XCIsXCJ0b2tlblwiOlwiOTdkNDA4MjJmNWQ3MGI0YzI3MmU3NzM4NTlkZmU4ZTZiNTNjNTFhZTcwYWRiNzdlZGFjNTQ3ZWRlNGZmMGQ1MzYyZjQzZmYwZTc2NjE5ZTBiNGNhZWRmMjlmZmY3OGRhZDgyYTc2ZTk2ZTNmMWVlNmJiODNhNWJlMDMyYTI5NzdcIn0iLCJpYXQiOjE1ODUxODIyNDUsImV4cCI6MTU4NTE5MzA0NX0.Gv4z1ODo259QO3fBc1F2ifg6mD9M93Iizi-ZZsDjef41y3maXU-E3709TIuapYi1hoa7PSmsBUdQx9xhV6k7pA
