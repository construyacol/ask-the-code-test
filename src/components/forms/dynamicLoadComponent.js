/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react'

const DynamicLoadComponent = ({ component, Fallback, ...props }) => {

 const [ RenderComponent, setRenderComponent ] = useState()

 const initialize = async() => {
   if(!component){return}
   const loadedComponent = await import(`./widgets/${component}`)
   setRenderComponent(loadedComponent)
 }

  useEffect(()=>{
      initialize()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component])

  if(Fallback && !RenderComponent){
    return (<Fallback/>)
  }

  return(
    <>
      { RenderComponent && <RenderComponent.default {...props} /> }
    </>
  )
}

export default DynamicLoadComponent
