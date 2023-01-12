const INFURA_ID = "7d741d1857b244669b740c0411b2fc55"
// const URI_PROD = `https://mainnet.infura.io/v3/${INFURA_ID}`
// const URI_TEST = `https://goerli.infura.io/v3/${INFURA_ID}"`
// const env = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 
// export const INFURA_URI = env !== 'production' ? URI_TEST : URI_PROD
export const INFURA_URI = `https://mainnet.infura.io/v3/${INFURA_ID}`


export const PRIORITY_CONFIG = {
  high:{
    uiName:"Alta",
    color:"#04c100",
    description:"El retiro se procesará de inmediato"
  },
  medium:{
    uiName:"Media",
    color:"orange",
    description:"El retiro tomará hasta 15 minutos en procesarse"
  },
  low:{
    uiName:"Baja",
    color:"red",
    description:"El retiro tomará hasta 30 minutos en procesarse"
  }
}