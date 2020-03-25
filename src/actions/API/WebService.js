export class WebService {
    async doFetch(url, params) {
        try {
            const response = await fetch(url, params)

            if (!response.ok && response.status === 465) {
                throw response.status
            }

            return await response.json();
        } catch (_) {
            // TODO: return an action to get feedback about errors
            return false;
        }
    }

    Get(url, headers) {
        return this.doFetch(url, {
            method: `GET`,
            headers
        })
    }

    Post(url, body, token) {
        const params = {
            method: `POST`,
            headers: {
                Accept: `*/*`,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
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