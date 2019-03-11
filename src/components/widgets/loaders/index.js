import React, { Fragment } from 'react'
import './loader.css'

export const SimpleLoader = (props) => {
  const { label, color, grid, loader } = props
  return(
    <Fragment>
      {
        !loader ?
        <div className={`SimpleLoader ${grid === 'Msuperior' ? 'Msuperior' : 'grillaComun'}`}>
          <div className="lds-ellipsis">
            <div className={`${color === 'white' ? 'blanquito' : color === 'green' ? 'verdecito' : 'azulito' }`}></div>
            <div className={`${color === 'white' ? 'blanquito' : color === 'green' ? 'verdecito' : 'azulito' }`}></div>
            <div className={`${color === 'white' ? 'blanquito' : color === 'green' ? 'verdecito' : 'azulito' }`}></div>
            <div className={`${color === 'white' ? 'blanquito' : color === 'green' ? 'verdecito' : 'azulito' }`}></div>
          </div>
          {
            label &&
            <p className={`fuente simpleType ${color === 'white' ? 'blanquitoText' : 'azulitoText'}`} >{label}</p>
          }
        </div>
        :
        loader === 2 &&
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      }
    </Fragment>
  )
}

export default SimpleLoader
