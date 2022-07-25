import { CAPACITOR_PLATFORM } from 'const/const'


const smile = (detections, frame) => {
  return detections?.expressions?.happy > 0.97 && frame;
}

const surprised = (detections, frame) => {
  const score = CAPACITOR_PLATFORM !== "web" ? 0.05 : 0.4
  return detections?.expressions?.surprised > score && frame;
}

const validations = {
  smile,
  surprised
};

export default validations;

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