import { WebService } from "../actions/API/WebService";

export class PushNotificationService extends WebService {

     async initPushNotificator (item, payload) {

       if( ! ('Notification' in window) || ! ('serviceWorker' in navigator) ){
         return alert('Tu browser no soporta notificaciones')
       }

       if (!('PushManager' in window)) {
          throw new Error('No Push API Support!')
      }

       if( Notification.permission === 'default' ) {
         await Notification.requestPermission()
       }

       if( Notification.permission === 'blocked' ) {
         // return alert('bloqueaste las notificaciones')
       }

       if( Notification.permission === 'granted' ) {
         // return alert('Permitiste las notificaciones en este browser')
       }

     }

     async showNotification (title, body) {
       const registration = await navigator.serviceWorker.getRegistration()
       if(!registration){return console.log('Ups, algo ha sucedido con la notificación. ', title)}
       registration.showNotification(title, {
         body
       })
     }

}
