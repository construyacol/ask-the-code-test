import { useState, useEffect } from 'react'

// Utils
import loadDynamicScript from '../utils/loadDynamicScript'

const isString = value => typeof value === 'string'

const FreshChat = ({ user = 'anonymous', id = undefined }) => {
  const [externalId, setExternalId] = useState(id)

  useEffect(() => {
    const init = async () => {
      if (!externalId) {
        setExternalId(isString(user) ? Date.now() : user.id)
      }

      await window.fcWidget.init({
        token: '86e166f6-5421-4aaf-bdf6-746ac7a54525',
        host: 'https://wchat.freshchat.com',
        locale: 'es-LA',
        externalId,
        restoreId: !isString(user) ? user.restoreId : null
      })

      window.fcWidget.user.get(resp => {
        const status = resp && resp.status

        if (status !== 200) {
          // Si el usuario no existe y recibimos los datos del mismo desde el dashboard,
          // enviamos esta información a freshChat
          if (!isString(user) && user.email) {
            window.fcWidget.user.setProperties({
              email: user.email
            })
          }
          // Creamos el usuario y guardamos el storeId en el profile del tx
          window.fcWidget.on('user:created', res => {
            // El usuario se crea cuando inicia el chat
            const resstatus = res && res.status
            const data = res && res.data
            if (resstatus === 200) {
              if (data.restoreId) {
                // console.log({ data })
              }
            }
          })
        }
      })
    }
    loadDynamicScript(init, 'https://wchat.freshchat.com/js/widget.js', 'freshchat')
  }, [externalId, user])

  return null
}

export default FreshChat
