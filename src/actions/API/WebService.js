import { COINSENDA_URL, GET_JWT_URL, GET_CLIENT_ID } from "../../const/const";
import { setAuthData } from "../auth";
import {
  doLogout,
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


  async Get(url) {
    const userToken = await getToken()
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

  async Post(url, body, withAuth = true) {
    const userToken = await getToken()
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
