import localForage from "localforage";
import { COINSENDA_URL } from "../const/const";
import jwt from "jsonwebtoken";
import config from '../actions/API/config'
import KeyEncoder from 'key-encoder'
let _keyEncoder = new KeyEncoder('secp256k1');



export const verifyToken = (token) => {
  const { aplicationInstance } = config
  let pemPublicKey = _keyEncoder.encodePublic(aplicationInstance.publicKey, 'raw', 'pem')
  return jwt.verify(token, pemPublicKey);
}


export function isValidToken(createAt) {
  if(typeof createAt === 'string' || !createAt){return}
  const initialDate = createAt.getTime();
  var endDate = new Date().getTime();
  var diff = (endDate - initialDate) / (1000 * 60);
  return !(parseInt(diff) >= 150);
}

export const doLogout = async (queryString) => {
  await localForage.removeItem("user_token");
  window.location.href = queryString ? `${COINSENDA_URL}${queryString}` : COINSENDA_URL;
};


export const handleError = async(err) => {

  switch (err.name) {
    case 'JsonWebTokenError':
      if(err.message === "invalid algorithm"){
        doLogout('?message=Tu session ha caducado')
      }
      return
    default:
      console.log(err)
  }
}
