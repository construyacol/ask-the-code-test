import { COINSENDA_URL, GET_JWT_URL, GET_CLIENT_ID } from "../../const/const";
import { doLogout, handleError, verifyUserToken, saveUserToken } from '../../components/utils'
import { setAuthData } from "../auth";


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
      return await finalResponse;
    } catch (_) {
      handleError(_)
      return false;
    }
  }

  async getJWToken(refreshToken) {

    const params = {
      method: `POST`,
      headers: {
          client_id: GET_CLIENT_ID,
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
      }
    };

    const response = await fetch(GET_JWT_URL, params);
    if(!response){throw new Error('No se pudo obtener el nuevo jwt')}
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


  Get(url) {
    let headers = {
      Authorization: `Bearer ${this.token}`,
    };
    return this.doFetch(url, {
      method: `GET`,
      headers,
    });
  }



  getHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  isEmpty(data) {
    return !data || (data && data.lenght === 0);
  }

  Post(url, body, withAuth = true) {
    let params = {
      method: `POST`,
      headers: withAuth
        ? {
            Accept: `*/*`,
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
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
