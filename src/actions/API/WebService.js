import { GET_JWT_URL, DESTROY_SESSION_URL } from "../../const/const";
import { setAuthData } from "../auth";
import {
  // doLogout,
  handleError,
  verifyUserToken,
  saveUserToken,
  getToken
} from '../../components/utils'


export class WebService {

  async doFetch(url, params) {
    try {
      await verifyUserToken()
      const response = await fetch(url, params);
      const finalResponse = await response.json();
      if (!response.ok && response.status === 465) {
        if (finalResponse.error.message.includes("Invalid signature")) {
          // TODO: add refresh_token flow to get a new jwt
          // doLogout('?message=Invalid signature')
        }
        throw response.status;
      }
      return await finalResponse;
    } catch (_) {
      handleError(_)
      return false;
    }
  }


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

    
    if(!response){
      console.log('||||||| getJWToken ===> ', response)
      debugger
      throw new Error('No se pudo obtener el nuevo jwt')
    }
    const res = await response.json()
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

  async Get(url) {
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



  async Post2(url, body, withAuth = true) {
    const tokenData = await getToken()
    if(!tokenData){return}
    const { userToken } = tokenData
    let params = {
      method: `POST`,
      mode: 'no-cors',
      headers: withAuth
        ? {
            Accept: `*/*`,
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          }
        : {},
      body: JSON.stringify(body),
    };

    return this.doFetch(url, params);
  }


  async Post(url, body, withAuth = true) {
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
        : {},
      body: JSON.stringify(body),
    };

    return this.doFetch(url, params);
  }

  Delete(url) {
    return this.doFetch(url, {
      method: "DELETE",
    });
  }
}
