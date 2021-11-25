import { useEffect, useState } from 'react'

const useHeight = (listener) => {

  const [ height, setHeight ] = useState()

  useEffect(()=>{
    const heightMainContainer = document.querySelector("#stickyGroup__")?.clientHeight || 0
    const heightTitleContainer = document.querySelector("#titleContainer__")?.clientHeight || 0
    setHeight(`0px`)
    if(heightMainContainer && heightTitleContainer && listener){
      let sum = heightMainContainer + heightTitleContainer
      setHeight(`calc(100vh - (${sum}px + 30px))`)
      // 30px margin
    }
  }, [listener])

  return [height]

}

export default useHeight
