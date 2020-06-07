import React, { Fragment } from 'react'


const CopyLayout = (props) => {

  const { valor, copy, color, max_width, onlyIcon } = props

  return(
    <Fragment>
      <div onClick={copy} id={valor} className="nWaddress">
        {
          (valor && !onlyIcon) &&
          <p id={valor} className="nWaddressTxt fuentePrin" style={{maxWidth:max_width ? `${max_width}px` : 'auto' }} >{valor}</p>
        }
        <i style={{color: color}} className="copy far fa-clone tooltip" id={valor} >
          <span className="tooltiptext fuente">Copiar</span>
        </i>
      </div>
    </Fragment>
  )
}


export default CopyLayout
