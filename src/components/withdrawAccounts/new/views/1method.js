import React, { useEffect } from 'react'
import useNavigationKeyActions from '../../../../hooks/useNavigationKeyActions'
import { ButtonForms } from '../../../widgets/buttons/buttons'
import NewItemsLayout from '../../../widgets/items/new-items-layout'
import './views.css'

const MethodView = props => {

  const {
    items,
    select_method,
    item_active,
    siguiente,
    title,
    subtitle,
    withdraw
  } = props

  let movil_viewport = window.innerWidth < 768
  const [setCurrentSelection] = useNavigationKeyActions({
    items,
    loader: false,
    uniqueIdForElement: 'pay-method-item-',
    modalRestriction: false,
  })

  useEffect(() => {
    select_method("Transferencia bancaria", "bankaccount")
  }, [])

  return (
    <div id="DLsteps" className="DLsteps method">

      <div className="DLcontains">
        <p className="fuente DLtitles2" >{title ? title : 'Title'}</p>
        <p className="fuente DLstitles" >{subtitle ? subtitle : 'Subtitle:'}</p>
      </div>

      <div className={`${!movil_viewport ? 'DLItemSelectionContainers' : 'ItemSelectionContainerMovil'}`}>
        <div className={`${!movil_viewport ? (!withdraw ? 'DLcontainerItems' : 'DLcontainerItems DLcontainerItems2') : 'containerItems'} chooseMethod`}>
          {
            items.filter(item => (!withdraw && item.code !== 'debit')).map((item, index) => {
              return <NewItemsLayout
                setCurrentSelection={setCurrentSelection}
                focusedId={`pay-method-item-${index}`}
                number={index}
                handleClick={siguiente}
                actualizarEstado={select_method} 
                actives={item_active === item.code && true} 
                primarySelect={movil_viewport} 
                {...item} 
                key={item.id} 
              />
            })
          }
        </div>
      </div>

      <ButtonForms type="primary" active={item_active ? true : false} siguiente={siguiente}>Continuar</ButtonForms>

    </div>
  )
}

export default MethodView
