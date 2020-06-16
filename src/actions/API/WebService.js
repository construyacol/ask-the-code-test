export class WebService {
    async doFetch(url, params) {
      // console.log('|||||||||||||||||||||| GET SERVICE:: ', url, params.headers)
        try {
            const response = await fetch(url, params)
            // console.log('get res ::', response)
            if (!response.ok && response.status === 465) {
                throw response.status
            }

            return await response.json();
        } catch (_) {
            // TODO: return an action to get feedback about errors
            console.log(_, _.response)
            return false;
        }
    }

    Get(url) {
        const headers = {
            'Authorization': `Bearer ${this.token}`,
        }
        return this.doFetch(url, {
            method: `GET`,
            headers
        })
    }

    getHeaders(token) {
        return {
            'Authorization': `Bearer ${token}`,
        }
    }

    isEmpty(data) {
        return !data || (data && data.lenght === 0)
    }

    Post(url, body, withAuth = true) {
        const params = {
            method: `POST`,
            headers: withAuth ? {
                Accept: `*/*`,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            } : {},
            body: JSON.stringify(body)
        }

        return this.doFetch(url, params)
    }

    Delete(url) {
        return this.doFetch(url, {
            method: 'DELETE'
        })
    }
}
