import React, { useEffect } from 'react'
import { ButtonForms } from '../../../widgets/buttons/buttons'
import ItemLayout from '../../../widgets/items/itemLayout'
import './views.css'

const MethodView = props =>{

  const{
    items,
    select_method,
    item_active,
    siguiente,
    title,
    subtitle,
    withdraw
  } = props

  let movil_viewport = window.innerWidth<768
  
  useEffect(() => {
    select_method("Transferencia bancaria", "bankaccount")
  }, [])

  return(
    <div id="DLsteps" className="DLsteps method">

      <div className="DLcontains">
        <p className="fuente DLtitles2" >{title ? title : 'Title'}</p>
        <p className="fuente DLstitles" >{subtitle ? subtitle : 'Subtitle:'}</p>
      </div>

      <div className={`${!movil_viewport ? 'DLItemSelectionContainers' :  'ItemSelectionContainerMovil'}`}>
        <div className={`${!movil_viewport ? (!withdraw ? 'DLcontainerItems' : 'DLcontainerItems DLcontainerItems2') :  'containerItems'} chooseMethod`}>
          {
            items.map(item=>{
              if(withdraw && item.code === 'debit'){return false}
              return <ItemLayout actualizarEstado={select_method} actives={item_active === item.code && true } primarySelect={movil_viewport} {...item} key={item.id}/>
            })
          }
        </div>
      </div>

      <ButtonForms type="primary" active={item_active ? true : false} siguiente={siguiente}>Continuar</ButtonForms>

    </div>
  )
}

export default MethodView
