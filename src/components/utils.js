import localForage from "localforage";
import { COINSENDA_URL } from "../const/const";
import jwt from "jsonwebtoken";
import config from '../actions/API/config'
import KeyEncoder from 'key-encoder'
let _keyEncoder = new KeyEncoder('secp256k1');


export const getUserToken = async() => {
  try {
    const userToken = await localForage.getItem("user_token");
    let decodedToken = verifyUserToken(userToken)
    await isValidToken(1)
    return {
      userToken,
      decodedToken
    }
  } catch (err) {
    return handleError(err)
  }
}

export const isValidToken = async(expiredTime = 4) => {
    let createdAt = await localForage.getItem("token_created_at");
    if(createdAt){
      const registerDate = new Date(createdAt).getTime();
      var currentDate = new Date().getTime();
      var diff = (currentDate - registerDate) / (1000 * 60);
      console.log('Transcurrido:', diff, ' mins')
      console.log('Vigencia:', expiredTime, ' mins')
      // Si el tiempo transcurrido entre el registro del token y el momento actual es mayor al expiredTime de validación, el token ha expirado
      if(diff>=expiredTime){throw new Error('El token ha caducado')}
      return true
    }
    throw new Error('No hay token almacenado')
}

export const verifyUserToken = (userToken) => {
  const { aplicationInstance } = config
  let pemPublicKey = _keyEncoder.encodePublic(aplicationInstance.publicKey, 'raw', 'pem')
  return jwt.verify(userToken, pemPublicKey);
}


export const registerUserToken = async(userToken) => {
  try {
    verifyUserToken(userToken)
    await localForage.setItem("user_token", userToken);
    await localForage.setItem("token_created_at", Date());
    return true
  } catch (err) {
    handleError(err)
  }
}


export const doLogout = async (queryString) => {
  await localForage.removeItem("user_token");
  await localForage.removeItem("token_created_at");
  window.location.href = queryString ? `${COINSENDA_URL}${queryString}` : COINSENDA_URL;
};


export const handleError = async(err) => {

  switch (err.name) {
    case 'JsonWebTokenError':
      return  console.log('||| |||| ||| JsonWebTokenError ||| ||| |||  ', err)
      // if(err.message === "invalid algorithm"){
        // doLogout('?message=Tu session ha caducado')
      // }
      return
    default:
      console.log('handleError: ', err)
      doLogout('?message=Tu session ha caducado')
  }
}
