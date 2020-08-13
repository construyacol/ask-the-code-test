import { WebService } from "../actions/API/WebService";

export class PushNotificationService extends WebService {

     async initPushNotificator (item, payload) {

       if( ! ('Notification' in window) || ! ('serviceWorker' in navigator) ){
         return alert('Tu browser no soporta notificaciones')
       }

       if( Notification.permission === 'default' ) {
         await Notification.requestPermission()
       }

       if( Notification.permission === 'blocked' ) {
         return alert('bloqueaste las notificaciones')
       }

       if( Notification.permission === 'granted' ) {
         return alert('bloqueaste las notificaciones')
       }

     }

     async showNotification () {
       const registration = await navigator.serviceWorker.getRegistration()
       if( ! registration ){alert('no hay service worker')}
       registration.showNotification('Titulo notificación', {
         body:'ding ding ding'
       })
     }

}
