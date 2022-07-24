const smile = (detections, frame) => {
  return detections?.expressions?.happy > 0.97 && frame;
}

const surprised = (detections, frame) => {
  return detections?.expressions?.surprised > 0.5 && frame;
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