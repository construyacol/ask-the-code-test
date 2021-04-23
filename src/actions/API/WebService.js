import { COINSENDA_URL } from "../../const/const";
import { doLogout, handleError, verifyToken } from '../../components/utils'


export class WebService {




  async doFetch(url, params) {
    try {
      verifyToken(this.token)
      const response = await fetch(url, params);
      const finalResponse = await response.json();
      if (!response.ok && response.status === 465) {
        if (finalResponse.error.message.includes("Invalid signature")) {
          // TODO: add refresh_token flow to get a new jwt
          doLogout()
        }
        throw response.status;
      }

      return await finalResponse;
    } catch (_) {
      handleError(_)
      return false;
    }
  }

  Get(url) {
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };
    return this.doFetch(url, {
      method: `GET`,
      headers,
    });
  }

  GetWithOutHeaders(url) {
    return this.doFetch(url, {
      method: `GET`,
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
    const params = {
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
