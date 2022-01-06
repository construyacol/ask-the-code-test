
import {
    getFrame
  } from './utils'
  
  export const smile = (detections, data) => {
    let frame
    console.log('|||||| detections smile' , detections?.expressions?.happy)
    // if(detections?.expressions?.happy > 0.97 && !data.state[data.key]){
    if(detections?.expressions?.happy > 0.97){
      frame = getFrame()
    }
    return [ frame ]
  }
  
  export const surprised = (detections, data) => {
    let frame
    console.log('|||||| detections surprised' , detections?.expressions?.surprised)
    // if(detections?.expressions?.surprised > 0.7 && !data.state[data.key]){
    if(detections?.expressions?.surprised > 0.5){
      frame = getFrame()
    }
    return [ frame ]
  }



// // Incline la cabeza hacia el hombro derecho
// if(detections[0].angle.roll > 0.6 && !document.querySelector('.tiltHead.right').src){
//   console.log('Incline la cabeza hacia la derecha => ', detections[0].angle.roll)
//   emitFrame('.tiltHead.right')
// }

// // Incline la cabeza hacia la izquierda
// if(detections[0].angle.roll < -0.5 && !document.querySelector('.tiltHead.left').src){
//   console.log('Incline la cabeza hacia la derecha => ', detections[0].angle.roll)
//   emitFrame('.tiltHead.left')
// }