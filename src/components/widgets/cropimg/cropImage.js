const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 */
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  // console.log('getCroppedImg', image)
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');
let urlImg = await new Promise((resolve, reject) => {
  canvas.toBlob(file => {
    resolve(URL.createObjectURL(file))
  }, 'image/jpeg')
})

// retornamos el base 64 para enviar en el microservicio y el urlImg para actualizar en redux, ya que tiene un tamaño menor es recomendable hacerlo así

  // console.log('createImage base64', canvas.toDataURL('image/png'))
  // alert('img')

  return{
    base64:canvas.toDataURL('image/jpeg'),
    urlImg: urlImg
  }



  // As a blob
  // return new Promise((resolve, reject) => {
  //   canvas.toBlob(file => {
  //     resolve(URL.createObjectURL(file))
  //   }, 'image/jpeg')
  // })
}
