function loadDynamicScript(callback, url, id) {
  const existingScript = document.getElementById(id)

  if (!existingScript) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.id = id
    script.async = true 
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (callback)
        callback()
    }
  }

  if (existingScript && callback){
    callback()
  }
}

export default loadDynamicScript
