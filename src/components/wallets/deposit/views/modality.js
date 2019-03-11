import React from 'react'
import ItemLayout from '../../../widgets/items/itemLayout'
import { ButtonForms } from '../../../widgets/buttons/buttons'


const ModalityView = props =>{

  const {
    items,
    update_service_mode,
    service_mode,
    buttonActive,
    deposit_service,
    create_deposit_order,
    title,
    subtitle
  } = props

  return(
    <div className="DLstep modality">
      <div className="DLcontain">
        <p className="fuente DLtitle2" >{title} {deposit_service ? deposit_service : ''}</p>
        <p className="fuente DLstitle" >{subtitle}</p>
      </div>

          <div className={`${window.innerWidth>768 ? 'DLItemSelectionContainer' :  'ItemSelectionContainerMovil'}`}>
            <div className={`${window.innerWidth>768 ? 'DLcontainerItems' :  'containerItems'}`}>
          {
            items.map(item=>{
              return <ItemLayout actualizarEstado={update_service_mode} actives={service_mode === item.code && true } {...item} key={item.id}/>
            })
          }
        </div>
      </div>
      <ButtonForms type="primary" active={buttonActive} siguiente={create_deposit_order}>CREAR ORDEN</ButtonForms>
    </div>
  )

}

export default ModalityView
