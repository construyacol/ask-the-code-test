import localForage from "localforage";
import { COINSENDA_URL, GET_PUBLIC_KEY_URL, REFRESH_TOKEN_EXP_TIME } from "../const/const";
import jwt from "jsonwebtoken";
import KeyEncoder from 'key-encoder'
import { mainService } from '../services/MainService'

let _keyEncoder = new KeyEncoder('secp256k1');
export const saveUserToken = async(userToken, refreshToken) => {
  try {
    let decodeJwt = await verifyUserToken(userToken)
    let jwtExpTime = (decodeJwt.exp - 60) - decodeJwt.iat
    await localForage.setItem("user_token", userToken);
    await localForage.setItem("refresh_token", refreshToken);
    await localForage.setItem("jwt_expiration_time", jwtExpTime);
    await localForage.setItem('created_at', Date());
    return decodeJwt
  } catch (err) {
    handleError(err)
  }
}


export const getToken = async() => {
  try {
    let userToken = await localForage.getItem("user_token");
    let decodedToken = await jwt.decode(userToken);
    return {
      userToken,
      ...decodedToken
    }
  } catch (err) {
    console.log('from getToken ==> ', err)
    handleError(err)
  }
  // let userToken = await localForage.getItem("user_token");
  // if(!userToken){throw Error('notFindUserToken')}
  // let decodedToken = await jwt.decode(userToken);
  // return {
  //   userToken,
  //   ...decodedToken
  // }
}

export const verifyTokensValidity = () => {
  setInterval(() => {getUserToken()}, 20000)
}

export const getUserToken = async() => {
  try {
    await validateExpTime()
    let userToken = await localForage.getItem("user_token");
    const refreshToken = await localForage.getItem("refresh_token");
    let decodedToken = await verifyUserToken(userToken)
    return {
      userToken,
      refreshToken,
      decodedToken
    }
  } catch (err) {
    err.source = 'Error dispatched from getUserToken function'
    return handleError(err, doLogout)
  }
}




export const verifyUserToken = async(_jwToken) => {
  let publicKey = await getPublicKey()
  let userToken = await localForage.getItem("user_token");
  let JWToken = _jwToken ||  userToken
  let pemPublicKey = _keyEncoder.encodePublic(publicKey, 'raw', 'pem')
  let res = jwt.verify(JWToken, pemPublicKey);
  console.log('--------  TOKEN VERIFICADO  --------')
  return res
}


export const getExpTimeData = async() => {
  let createdAt = await localForage.getItem('created_at');
  let jwtExpTime = await localForage.getItem('jwt_expiration_time');
  let registerDate = new Date(createdAt).getTime();
  var currentDate = new Date().getTime();
  var currentTime = (currentDate - registerDate) / (1000);
  return {
    jwtExpTime,
    currentTime,
    REFRESH_TOKEN_EXP_TIME
  }
}


export const validateExpTime = async() => {

    const { jwtExpTime, currentTime } = await getExpTimeData()


    if(jwtExpTime && currentTime){
      console.log('Tiempo transcurrido en sesión:', `${currentTime} segs`)
      // console.log('Vigencia user token:', `${jwtExpTime+60}(${jwtExpTime}) segs`)
      console.log('Vigencia user token:', `${jwtExpTime}(${jwtExpTime}) segs`)
      console.log('Vigencia refresh token:', `${REFRESH_TOKEN_EXP_TIME} segs`)
 
      if(currentTime<=jwtExpTime){ //Si ha transcurrido menos de 4 minutos, el token actual sigue vigente
        console.log('::::::::: -- El userToken sigue vigente hasta el momento')
        return true
      }else if(currentTime>=jwtExpTime && currentTime<=REFRESH_TOKEN_EXP_TIME){ // Si ha transcurrido mas de 4 min y menos de 150 min se debe de pedir nuevo token
        console.log('::::::::: -- El userToken caducó pero el refreshToken sigue vigente, getJWToken()')
        const refreshToken = await localForage.getItem("refresh_token");
        return await mainService.getJWToken(refreshToken)
      }else{
        console.log('::::::::: -- El userToken y el refreshToken Caducaron, doLogout')
        throw new Error('El token ha caducado')
      }
    }
    throw Error('No hay token y/o refresh_token almacenado, o ingresaste un JWT expirado')
}



const getPublicKey = async() => {
  let publicKey = await localForage.getItem('public_key');
  if(!publicKey){
    let response = await mainService.GetWithOutHeaders(GET_PUBLIC_KEY_URL)
    if(!response){throw new Error('No se pudo obtener el publicKey')}
    const { data } = response
    await localForage.setItem("public_key", data);
    publicKey = data
  }
  return publicKey
}

export const doLogout = async (queryString) => {
  // mainService.destroySesion()
  await localForage.removeItem("user_token");
  await localForage.removeItem("refresh_token");
  await localForage.removeItem("jwt_expiration_time");
  await localForage.removeItem("created_at");
  await localForage.removeItem("public_key");
  await localForage.removeItem("sessionState");
  window.location.href = queryString ? `${COINSENDA_URL}${queryString}` : COINSENDA_URL;
};

export const handleError = async(err, callback) => {

// TODO: add handle sentry here
  switch (err.name || err.message) {
    // case 'notFindUserToken':
        // return console.log('<=========== notFindUserToken ===========>')
    case 'JsonWebTokenError': 
        console.log('JsonWebTokenError: ', err)
      return doLogout('?message=Tu session ha caducado')
      // return
    case 'TokenExpiredError':
        console.log('|||||||||||||||| El token ha expirado:', err)
        const refreshToken = await localForage.getItem("refresh_token");
      return await mainService.getJWToken(refreshToken)
      // return
    case 465:
        console.log('__error__', err)
      return
    default:
      console.log('handleError: ', err)
      if(err.message === 'No hay token y/o refresh_token almacenado'){
        return doLogout('?message=No tienes credenciales, inicia sesión')
      }
      callback && callback()
  }
}

