import { useEffect, useState } from 'react'

const useHeight = (listener) => {

  const [ height, setHeight ] = useState()
  // infoPanel

  useEffect(()=>{
    const heightTitleContainer = document.querySelector("#titleContainer__")?.clientHeight || 0
    const heightMainContainer = document.querySelector("#stickyGroup__")?.clientHeight || 0
    const heightInfoState = document.querySelector("#infoStatemobile__")?.clientHeight || 0
    setHeight(`0px`)

    if(heightMainContainer && heightTitleContainer && listener){
      let sum = heightMainContainer + heightTitleContainer + heightInfoState
      setHeight(`calc(100vh - (${sum}px + 80px))`)
      // 30px margin
      // 50px layout top padding
    }

  }, [listener])

  return [height]

}

export default useHeight
