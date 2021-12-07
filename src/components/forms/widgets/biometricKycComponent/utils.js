
export const getDisplaySize = () => {
  const video = document.querySelector("#streamingVideo")
  return { width: video.clientWidth, height: video.clientHeight }
}


export const getFrame = () => {
  const { width, height } = getDisplaySize()
  const canvas = document.querySelector("#faceApiCanvas")
  canvas.width = width
  canvas.height = height
  const video = document.querySelector("#streamingVideo")
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0,0, width, height)
  let dataURL = canvas.toDataURL('image/jpeg')
  return dataURL
}