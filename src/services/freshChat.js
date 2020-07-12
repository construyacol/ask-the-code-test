// // import localForage from 'localforage'
// import { get_verification_state, add_restoreid } from '../actions/APIactions'
// import store from '../'
//
//
// export const freshchat_init_user = (user, externalId = null) => {
//
// return async(dispatch) => {
//
//   let external_id = externalId
//
//   if(!external_id){
//     external_id = user === 'anonymous' ? Date.now() : user.id
//   }
//
//   // localStorage.setItem('RESTORE_ID', 'restore_id_from_panel_user')
//
//   await window.fcWidget.init({
//     token: "86e166f6-5421-4aaf-bdf6-746ac7a54525",
//     host: "https://wchat.freshchat.com",
//     locale: "es-LA",
//     externalId: external_id,
//     restoreId: (user && user.restore_id) || null,
//     // externalId: null,
//     // restoreId:null,
//   });
//
//
//
//   window.fcWidget.user.get(function(resp) {
//     var status = resp && resp.status
//
//     if (status !== 200) {
//       // Si el usuario no existe y recibimos los datos del mismo desde el dashboard, enviamos esta información a freshChat
//       if((user && user !== 'anonymous') && (user && user.email)){
//         window.fcWidget.user.setProperties({
//           email: user.email
//         });
//       }
//       // Creamos el usuario y guardamos el storeId en el profile del tx
//       window.fcWidget.on('user:created', function(resp) {
//         // El usuario se crea cuando inicia el chat
//         var status = resp && resp.status,
//         data = resp && resp.data;
//         if (status === 200) {
//           if (data.restoreId) {
//             // add_restoreid(data.restoreId, user)
//           }
//         }
//       });
//     }
//   });
//
//   }
// }
//
//
//
//
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
//
//
// export default {
//   isLoaded,
//   track,
//   show_channels,
//   show_tags,
//   destroy,
//   user_update
// }
