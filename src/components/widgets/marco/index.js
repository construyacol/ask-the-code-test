import React from 'react'
import './marco.css'

const Marco = props =>{
  const { type } = props
  return(
    <div className={`${type==='green' ? 'imgDashFramework'  : 'imgDashFramework2 MarcoPolo' }  `}>

      <i className={`${type === 'green' ? 'fas fa-check-circle green' : 'fas fa-times-circle reds'}  IconMarco`}></i>

      <div className={`top_left ${type==='green' ? 'green corner' : 'reds corner2'}`}/>
      <div className={`top_right   ${type==='green' ? 'green corner' : 'reds corner2'}`}/>
      <div className={`bottom_right  ${type==='green' ? 'green corner' : 'reds corner2'} `}/>
      <div className={`bottom_left  ${type==='green' ? 'green corner' : 'reds corner2'} `}/>

      {props.children}

      <p className={`textMarc ${type === "green" ? 'green' : 'reds'}`} >{type==="green" ? '' : 'EJEMPLO INCORRECTO'}</p>
    </div>
  )
}

export default Marco
