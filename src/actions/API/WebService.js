export class WebService {
    async doFetch(url, params) {
      // console.log('|||||||||||||||||||||| GET SERVICE:: ', url, params.headers)
        try {
            const response = await fetch(url, params)
            const finalResponse = await response.json()
            // console.log('get res ::', response)
            if (!response.ok && response.status === 465) {
                if(finalResponse.error.message.includes('Invalid signature')) {
                    window.location.href = 'https://auth1.devsertec.com/signin?clientId=5e79471764dcdb016a369cd8'
                }
                throw response.status
            }

            return await finalResponse;
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

    GetWithOutHeaders(url){
        return this.doFetch(url, {
            method: `GET`
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
