import { COINSENDA_URL } from "../../const/const";
import { doLogout } from '../../components/utils'


export class WebService {
  async doFetch(url, params) {
    // console.log('|||||||||||||||||||||| GET SERVICE:: ', url, params.headers)
    try {
      const response = await fetch(url, params);
      const finalResponse = await response.json();
      // console.log('get res ::', response)
      if (!response.ok && response.status === 465) {
        if (finalResponse.error.message.includes("Invalid signature")) {
          // TODO: this rutine send the refresh token or logout
          doLogout()
        }
        throw response.status;
      }

      return await finalResponse;
    } catch (_) {
      // TODO: return an action to get feedback about errors
      console.log(_, _.response);
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
