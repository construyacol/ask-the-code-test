import localForage from "localforage";
import { COINSENDA_URL, GET_PUBLIC_KEY_URL, REFRESH_TOKEN_EXP_TIME } from "const/const";
import jwt from "jsonwebtoken";
import KeyEncoder from 'key-encoder'
import { mainService } from 'services/MainService'
import {STORAGE_KEYS} from "const/storageKeys";
import { store } from '../index'
import Environment from 'environment'
import actions from "actions";
import { CAPACITOR_PLATFORM } from 'const/const'
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
const { Oauth, APPLE_CLIENT_ID, APPLE_CALLBACK_URL, APPLE_SCOPES, COINSENDA_CLIENT_ID } = Environment
const SIGNIN_EVENT_MESSAGE = 'signinApple';
const APPLE_STATE_PARAM = JSON.stringify({ "clientId": COINSENDA_CLIENT_ID , "third_party": true });
let _keyEncoder = new KeyEncoder('secp256k1');

export const saveUserToken = async(userToken, refreshToken) => {
  try {
    let decodeJwt = await verifyUserToken(userToken)
    await localForage.setItem(STORAGE_KEYS.user_token, userToken);
    await localForage.setItem(STORAGE_KEYS.refresh_token, refreshToken);
    await localForage.setItem(STORAGE_KEYS.jwt_expiration_time, decodeJwt.exp);
    await localForage.setItem(STORAGE_KEYS.refresh_token_expiration_time, (decodeJwt.iat) + REFRESH_TOKEN_EXP_TIME);
    return decodeJwt
  } catch (err) {
    handleError(err)
  }
}


export const getToken = async() => {
  try {
    let userToken = await localForage.getItem(STORAGE_KEYS.user_token);
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
  // setInterval(logs_, 20000)
}

function messageCallback(iab, { message, jwt, refresh_token }, callback){
    iab.close();
    // If click appleId in auth hub, it will start the native flow for the app
    SIGNIN_EVENT_MESSAGE === message && appleIdLogin(iab, callback);
    // HACK: in order to reuse the browser logic
    callback && callback(`?token=${jwt}&refresh_token=${refresh_token}`)
}

function openIab(url, callback) {
  const iab = window.cordova.InAppBrowser.open(url, '_blank', 'location=no,zoom=no,footer=no,toolbar=no,hidenavigationbuttons=no')
  iab.show();
  iab.addEventListener('loadstart', e => console.log("EVENT_LOADING_IAB", e));
  iab.addEventListener('loadstop', e => console.log("EVENT_LOADING_IAB", e));
  iab.addEventListener('loaderror', (err) => {
    console.log("EVENT_LOADING_IAB", err)
    iab.close()
    setTimeout(() => {
      openLoginMobile()
    }, 1000);
  });
  iab.addEventListener('message',({ data }) => messageCallback(iab, data, callback));
}

export function openLoginMobile(callback) {
  openIab(`${Oauth.url}signin`, callback);
}

async function appleIdLogin(iab, callback) {
  const randonNumber = new Date().getTime();
  const options = {
    clientId: APPLE_CLIENT_ID,
    redirectURI: APPLE_CALLBACK_URL,
    scopes: APPLE_SCOPES,
    state: randonNumber,
    nonce: randonNumber,
  };
  try {
   const result = await SignInWithApple.authorize(options);
   const callbackUrl = `${APPLE_CALLBACK_URL}?state=${APPLE_STATE_PARAM}&id_token=${result.response.identityToken}&code=${result.response.authorizationCode}`;
   openIab(encodeURI(callbackUrl), callback);
   console.log(callbackUrl);
  } catch {
    alert("Hubo un error, por favor comunicate con soporte si el error persiste");
    openLoginMobile();
  }
}
// const logs_ = async() => {
  //   const { refreshTokenExpirationTime, currentTime, jwtExpTime } = await getExpTimeData()
  //   console.log('Tiempo transcurrido en sesión:', new Date(currentTime*1000))
  //   console.log('Vigencia user token:', new Date(jwtExpTime*1000))
  //   console.log('refreshTokenExpirationTime:', new Date(refreshTokenExpirationTime*1000))
// }

export const getUserToken = async() => {
  try {
    await validateExpTime()
    const userToken = await localForage.getItem(STORAGE_KEYS.user_token);
    const refreshToken = await localForage.getItem(STORAGE_KEYS.refresh_token);
    const decodedToken = await verifyUserToken(userToken)
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
  let userToken = await localForage.getItem(STORAGE_KEYS.user_token);
  let JWToken = _jwToken ||  userToken
  let pemPublicKey = _keyEncoder.encodePublic(publicKey, 'raw', 'pem')
  let res = jwt.verify(JWToken, pemPublicKey);
  console.log('--------  TOKEN VERIFICADO  --------')
  return res
}


export const getExpTimeData = async() => {
  const jwtExpTime = await localForage.getItem(STORAGE_KEYS.jwt_expiration_time);
  const currentDate = new Date().getTime();
  const refreshTokenExpirationTime = await localForage.getItem(STORAGE_KEYS.refresh_token_expiration_time);
  const currentTime = currentDate / 1000;
  return {
    jwtExpTime,
    currentTime,
    refreshTokenExpirationTime,
    REFRESH_TOKEN_EXP_TIME
  }
} 


 
export const validateExpTime = async() => { 

  const { refreshTokenExpirationTime, currentTime, jwtExpTime } = await getExpTimeData()
  const userToken = await localForage.getItem(STORAGE_KEYS.user_token);
  const refreshToken = await localForage.getItem(STORAGE_KEYS.refresh_token);
  const publicKey = await getPublicKey()
  const JWToken = userToken
  const pemPublicKey = _keyEncoder.encodePublic(publicKey, 'raw', 'pem')

  // console.log('Tiempo transcurrido en sesión:', new Date(currentTime*1000))
  // console.log('Vigencia user token:', new Date(jwtExpTime*1000))
  // console.log('refreshTokenExpirationTime:', new Date(refreshTokenExpirationTime*1000))

  return new Promise((resolve, reject) => {
    jwt.verify(JWToken, pemPublicKey, async function(err, _) {
      if (err) {
        if(currentTime <= refreshTokenExpirationTime) {
          console.log('JWT EXPIRED ==> OBTENIENDO NUEVO REFRESH TOKEN')
          await mainService.getJWToken(refreshToken)
          resolve(true)
          return;
        } else {
          console.log('--------  TOKEN INVALIDO  --------')
          return handleError(err, () => {
            doLogout()
            reject(false)
          })
        }
      }
      console.log('--------  TOKEN VALIDO  --------')
      resolve(true)
    });
  })

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
  await localForage.removeItem(STORAGE_KEYS.user_token);
  await localForage.removeItem(STORAGE_KEYS.refresh_token);
  await localForage.removeItem(STORAGE_KEYS.jwt_expiration_time);
  await localForage.removeItem(STORAGE_KEYS.refresh_token_expiration_time);
  await localForage.removeItem("public_key");
  await localForage.removeItem("sessionState");

  if (CAPACITOR_PLATFORM === 'web') {
    window.location.href = queryString ? `${COINSENDA_URL}${queryString}` : COINSENDA_URL;
  } else {
    // HACK: This to logout in mobile app, we should have either authData or isLoading, not both
    store.dispatch(actions.setAuthData({}));
    store.dispatch(actions.isAppLoaded(false));
  }
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
        return doLogout('?message=Vuelve a iniciar sesión')
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

