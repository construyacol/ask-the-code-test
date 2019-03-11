import React from 'react'
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

  return(
    <div className="DLsteps method">

      <div className="DLcontains">
        <p className="fuente DLtitles2" >{title ? title : 'Title'}</p>
        <p className="fuente DLstitles" >{subtitle ? subtitle : 'Subtitle:'}</p>
      </div>

      <div className={`${window.innerWidth>768 ? 'DLItemSelectionContainers' :  'ItemSelectionContainerMovil'}`}>
        <div className={`${window.innerWidth>768 ? (!withdraw ? 'DLcontainerItems' : 'DLcontainerItems DLcontainerItems2') :  'containerItems'} chooseMethod`}>
          {
            items.map(item=>{
              if(withdraw && item.code === 'debit'){return false}
              return <ItemLayout actualizarEstado={select_method} actives={item_active === item.code && true } {...item} key={item.id}/>
            })
          }
        </div>
      </div>

      <ButtonForms type="primary" active={item_active ? true : false} siguiente={siguiente}>Continuar</ButtonForms>

    </div>
  )
}

export default MethodView
