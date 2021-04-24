import localForage from "localforage";
import { COINSENDA_URL } from "../const/const";
import jwt from "jsonwebtoken";
import KeyEncoder from 'key-encoder'
import config from '../actions/API/config'
import { mainService } from '../services/MainService'

const { aplicationInstance } = config
let _keyEncoder = new KeyEncoder('secp256k1');

export const saveUserToken = async(userToken) => {
  try {
    verifyUserToken(userToken)
    await localForage.setItem("user_token", userToken);
    await localForage.setItem("user_token_created_at", Date());
    return true
  } catch (err) {
    handleError(err)
  }
}


export const getUserToken = async() => {
  try {
    const userToken = await localForage.getItem("user_token");
    let decodedToken = verifyUserToken(userToken)
    await isValidToken()
    return {
      userToken,
      decodedToken
    }
  } catch (err) {
    return handleError(err)
  }
}



export const isValidToken = async() => {
    let createdAt = await localForage.getItem('user_token_created_at');
    const { expiredUserTokenTime, expiredRefreshTokenTime } = aplicationInstance
    if(createdAt){
      const registerDate = new Date(createdAt).getTime();
      var currentDate = new Date().getTime();
      var diff = (currentDate - registerDate) / (1000 * 60);
      console.log('Tiempo transcurrido en sesión:', `${diff} mins`)
      console.log('Vigencia user token:', `${expiredUserTokenTime} mins`)
      console.log('Vigencia refresh token:', `${expiredRefreshTokenTime} mins`)


      if(diff<=expiredUserTokenTime){ //Si ha transcurrido menos de 4 minutos, el token actual sigue vigente
        console.log('::::::::: -- El userToken sigue vigente hasta el momento')
        return true
      }else if(diff>=expiredUserTokenTime && diff<=expiredRefreshTokenTime){ // Si ha transcurrido mas de 4 min y menos de 150 min se debe de pedir nuevo token
        console.log('::::::::: -- El userToken caducó pero el refreshToken sigue vigente, getAuthToken()')
        return await mainService.getAuthToken()
      }else{
        console.log('::::::::: -- El userToken y el refreshToken Caducaron, doLogout')
        throw new Error('El token ha caducado')
      }
    }
    throw new Error('No hay token almacenado')
}




export const verifyUserToken = (userToken) => {
  let pemPublicKey = _keyEncoder.encodePublic(aplicationInstance.publicKey, 'raw', 'pem')
  return jwt.verify(userToken, pemPublicKey);
}





export const doLogout = async (queryString) => {
  await localForage.removeItem("user_token");
  await localForage.removeItem("user_token_created_at");
  window.location.href = queryString ? `${COINSENDA_URL}${queryString}` : COINSENDA_URL;
};


export const handleError = async(err) => {

// TODO: add handle sentry here

  switch (err.name || err) {
    case 'JsonWebTokenError':
        console.log('handleError: ', err)
      // if(err.message === "invalid algorithm"){
        // doLogout('?message=Tu session ha caducado')
      // }
      return
    case 465:
        console.log('__error__', err)
      return
    default:
      console.log('handleError: ', err)
      // doLogout('?message=Ha ocurrido un error')
  }

}
