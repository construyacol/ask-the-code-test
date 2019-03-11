import React from 'react'

const DropDownLayout = (props) =>{

  const { elements, label, open, active, placeholder } = props

  // console.log('eeeeeeeeeeeeeeste es el    -- D R O P _ D O W N --', props)

  return(
    <div className="containerInputComponent">
      <p className="labelText fuente">{ label}</p>
      <div  className={`inputContainer2 ${ active ? 'inputActivado' : '' }`}>
        <div className="InputDropDown" onClick={props.abrir}>
          {placeholder}
          <div className={`InputDesplegable ${ open ? 'Idesplegado' : '' }`} style={{ height: open ? `${elements.length*45}px` : '0px'}}>
            {
              elements.map(element=>{
                return <p key={element.id} title={element.name} onClick={props.selectItem} >{element.name} </p>
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropDownLayout
