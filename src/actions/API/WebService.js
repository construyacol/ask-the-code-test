import { GET_JWT_URL, DESTROY_SESSION_URL } from "../../const/const";
import { setAuthData } from "../auth";
import { SentryCaptureException } from '../../utils'
import { getExpTimeData, validateExpTime } from '../../utils/handleSession'
import {
  doLogout,
  handleError,
  verifyUserToken,
  saveUserToken,
  getToken,
  openLoginMobile
} from 'utils/handleSession'
import { CAPACITOR_PLATFORM } from 'const/const'


export class WebService { 


  async GetWithOutHeaders(url) {
    try {
      const response = await fetch(url, {method: `GET`});
      const finalResponse = await response.json();
      return finalResponse;
    } catch (_) {
      handleError(_)
      return false;
    }
  }



  async getJWToken(refreshToken) {

    const tokenData = await getToken()
    if(!tokenData){return}
    const { auth_client_id } = tokenData

    const params = {
      method: `POST`,
      headers: {
          client_id: auth_client_id,
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
      }
    };

    const response = await fetch(GET_JWT_URL, params);
    if(!response)return ;

    const res = await response.json()
    if(!res?.data || (res?.data && !res?.data?.jwt)){ 
      if (CAPACITOR_PLATFORM !== 'web') openLoginMobile();
      throw new Error('No se pudo obtener el nuevo jwt')
    };

    const { data:{ jwt, refresh_token } } = res
    const decodedToken = await saveUserToken(jwt, refresh_token)

    let userData = {
        userToken:jwt,
        userEmail: decodedToken.email,
        userId: decodedToken.usr
    }
    await this.dispatch(setAuthData(userData));
    return {...userData, decodedToken }
  }




  isEmpty(data) {
    return !data || (data && data.lenght === 0);
  }


  async destroySesion(url) {
    
    const tokenData = await getToken()
    if(!tokenData){return}
    const { userToken } = tokenData

      let body = {
        data:{
          destroy_all:false, 
          jwt:userToken
        }
      }
      let res = await this.Post(DESTROY_SESSION_URL, body )
      console.log('|||||||||||||||||||||||||||||||||| destroySesion:  ', res)
  }


  async Post(url, body, withAuth = true) {
    // La función getUserToken() integra los metodos validateExpTime, getToken
    await validateExpTime()
    const tokenData = await getToken() 
    if(!tokenData){return}
    const { userToken } = tokenData
    let params = {
      method: `POST`,
      headers: withAuth
        ? {
            Accept: `*/*`,
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          }
        : {
          Accept: `*/*`,
          "Content-Type": "application/json"
        },
      body: JSON.stringify(body),
    };

    return this.doFetch(url, params);
  }



  async Get(url) { 
    // La función getUserToken() integra los metodos validateExpTime, getToken
    await validateExpTime()
    const tokenData = await getToken()
    if(!tokenData){return}
    const { userToken } = tokenData
    let headers = {
      Authorization: `Bearer ${userToken}`,
    };
    return this.doFetch(url, {
      method: `GET`,
      headers,
    });
  }

  async _Get(url) { 
    // La función getUserToken() integra los metodos validateExpTime, getToken
    await validateExpTime()
    const tokenData = await getToken()
    if(!tokenData){return}
    const { userToken } = tokenData
    let headers = {
      Authorization: `Bearer ${userToken}`,
    };
    return this._doFetch(url, {
      method: `GET`,
      headers,
    });
  }


  async _Post(url, body, withAuth = true) {
    // La función getUserToken() integra los metodos validateExpTime, getToken
    await validateExpTime()
    const tokenData = await getToken() 
    if(!tokenData){return}
    const { userToken } = tokenData
    let params = {
      method: `POST`,
      headers: withAuth
        ? {
            Accept: `*/*`,
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          }
        : {
          Accept: `*/*`,
          "Content-Type": "application/json"
        },
      body: JSON.stringify(body),
    };

    return this._doFetch(url, params);
  }



  async doFetch(url, params) {
    const { jwtExpTime, currentTime, refreshTokenExpirationTime } = await getExpTimeData()
    try {
      await verifyUserToken()
      const response = await fetch(url, params);
      const finalResponse = await response.json(); 
      if (!response.ok && response.status === 465) {
        if (finalResponse.error.message.includes("Invalid signature")) {
          SentryCaptureException(finalResponse?.error, {
            currentTime,
            jwtExpTime,
            refreshTokenExpirationTime,
            url
          })
          // TODO: add refresh_token flow to get a new jwt
          doLogout('?message=Invalid signature')
        }
        throw response.status;
      }
      return await finalResponse;
    } catch (err) {
      handleError(err)
      SentryCaptureException(err, {
        url, 
        params,
        currentTime,
        jwtExpTime
      })
      return false;
    }
  }


  async _doFetch(url, params) {
    const { jwtExpTime, currentTime, refreshTokenExpirationTime } = await getExpTimeData()
    let finalResponse
    try {
      await verifyUserToken()
      const response = await fetch(url, params);
      finalResponse = await response.json(); 
      if (!response.ok && response.status === 465) {
        if (finalResponse.error.message.includes("Invalid signature")) {
          SentryCaptureException(finalResponse?.error, {
            currentTime,
            jwtExpTime,
            refreshTokenExpirationTime,
            url
          })
          // TODO: add refresh_token flow to get a new jwt
          doLogout('?message=Invalid signature')
        }
        throw response.status;
      }
      return finalResponse;
    } catch (err) {
      handleError(err)
      SentryCaptureException(err, {
        url, 
        params,
        currentTime,
        jwtExpTime
      })
      return finalResponse;
    }
  }



  Delete(url) {
    return this.doFetch(url, {
      method: "DELETE",
    });
  }
}
