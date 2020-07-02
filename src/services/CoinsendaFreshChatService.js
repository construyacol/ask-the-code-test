import { WebService } from "../actions/API/WebService";
import { REFERRALS_URL } from "../const/const";

export class FreshChatService extends WebService {

    async freshChatInitUser() {

      await window.fcWidget.init({
        token: "86e166f6-5421-4aaf-bdf6-746ac7a54525",
        host: "https://wchat.freshchat.com",
        locale: "es-LA",
        externalId: this.user.id,
        restoreId: (this.user && this.user.restore_id) || null,
      });

      window.fcWidget.user.get((resp) => {
        var status = resp && resp.status

        if (status !== 200) {
          // Si el usuario no existe y recibimos los datos del mismo desde el dashboard, enviamos esta información a freshChat
            window.fcWidget.user.setProperties({
              firstName:this.user.name,
              lastName:this.user.surname,
              email: this.user.email,
              phone:this.user.phone,
              "country":this.user.country
            });
          window.fcWidget.on('user:created', (resp) => {
            // El usuario se crea cuando inicia el chat
            var status = resp && resp.status,
            data = resp && resp.data;
            if (status === 200) {
              if (data.restoreId) {
                this.addRestoreId(data.restoreId)
              }
            }
          });
        }
      });

    }


    // const user_update = async(user) => {
    //   let load = await isLoaded()
    //   if(load){
    //     let verify_status = await store.dispatch(get_verification_state())
    //     // console.log('||||||||||||||°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°|||| ||||||||||||||||||user_update', user)
    //       window.fcWidget.user.update({
    //         firstName:user.name,
    //         lastName:user.surname,
    //         email:user.email,
    //         phone:user.phone,
    //         meta:{
    //           twofactor:user.security_center.authenticator.auth,
    //           deposits:user.deposits.length,
    //           withdraws:user.withdrawals.length,
    //           verify_status:verify_status ? verify_status : 'without verify',
    //           id_type:user.id_type,
    //           city:user.city
    //         }
    //       });
    //   }
    // }
    //
    //
    //
    // const track = async(item, payload) => {
    //   // @param item:string
    //   // @param payload:object
    //   let load = await isLoaded()
    //   if(load){
    //     console.log('|||||||||||||||______________________- tracking____', item, payload)
    //     window.fcWidget.track(item, payload);
    //   }
    // }
    //
    //
    // const show_channels = async(channels) => {
    //   // @param channels:array
    //   let load = await isLoaded()
    //   if(load){
    //     window.fcWidget.setTags(channels)
    //   }
    // }
    //
    //
    // const show_tags = async(tags, filterType) => {
    //   // @Params
    //   // tags:array
    //   // filterType:string
    //   let load = await isLoaded()
    //   if(load){
    //     window.fcWidget.setFaqTags({
    //       tags,
    //       filterType
    //     });
    //   }
    // }
    //
    //
    // const destroy = async() => {
    //   let load = await isLoaded()
    //   alert()
    //   if(load){
    //     return window.fcWidget.destroy()
    //   }
    // }
    //
    //
    //
    //
    //
    //
    //
    // const isLoaded = () => {
    //   return new Promise(async(resolve, reject) => {
    //     if (window.fcWidget.isLoaded() === true) {
    //       return resolve(true)
    //     }else{
    //       tryLoad(resolve)
    //     }
    //   })
    //  }
    //
    //
    //
    //
    //  const tryLoad = (resolve) => {
    //     let intervalLoad = setInterval(()=>{
    //      console.log('No Cargado')
    //      if (window.fcWidget.isLoaded() === true) {
    //        clearInterval(intervalLoad)
    //        console.log('_________ load success')
    //        return resolve(true)
    //      }
    //    }, 500)
    //  }




}
