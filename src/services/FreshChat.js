import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { useCoinsendaServices } from "./useCoinsendaServices";
// Utils
import loadDynamicScript from '../utils/loadDynamicScript'



const isString = value => typeof value === 'string'

const useFreshChat = () => {

  const user = useSelector(({ modelData:{ user } }) => user);
  const [ coinsendaServices ] = useCoinsendaServices();

  const init = async () => {
    if(window?.fcWidget?.isLoaded() || window?.fcWidget?.isInitialized())return ;
    await window.fcWidget.init({
      token: '86e166f6-5421-4aaf-bdf6-746ac7a54525',
      host: 'https://wchat.freshchat.com',
      locale: 'es-LA',
      externalId:user?.id,
      restoreId: user?.restore_id
    })
    window.fcWidget.user.get(resp => {
      const status = resp && resp.status
      const email = resp?.data?.email
      if(!isString(email)){
        window.fcWidget.user.setProperties({
          firstName: user?.name,
          lastName: user?.surname,
          email: user.email
        })
      }
      if (status !== 200) {
        // Creamos el usuario y guardamos el storeId en el profile del tx
        window.fcWidget.on('user:created', res => {
          // El usuario se crea cuando inicia el chat
          const resstatus = res && res.status
          const data = res && res.data
          if (resstatus === 200) {
            if (data.restoreId) {
              coinsendaServices.addRestoreId(data.restoreId)
            }
          }
        })
      }
    })
  }
 
  useEffect(() => {
    if(user?.email){
      if(process.env.NODE_ENV !== 'development'){
        loadDynamicScript(init, 'https://wchat.freshchat.com/js/widget.js', 'freshchat')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email])

}

export default useFreshChat
