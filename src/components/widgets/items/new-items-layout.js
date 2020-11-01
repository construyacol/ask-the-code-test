import React, { useEffect } from 'react'
import { useItemsInteractions } from '../../../hooks/useNavigationKeyActions'
import { InputKeyActionHandler } from '../accountList/styles'
import IconSwitch from '../icons/iconSwitch'

let timerId;
function NewItemsLayout(props) {

    const {
        type,
        actives,
        name,
        code,
        placeholder,
        primarySelect,
        format,
        itemType,
        currency_type,
        pair_id,
        actualizarEstado,
        handleClick,
        specialMode = false
    } = props

    const doSelectionForItem = () => {
        if(timerId) {
            clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
            actualizarEstado && actualizarEstado(name, code, currency_type, pair_id)
        }, 100)
    }
    const _handleClick = specialMode ? doSelectionForItem : handleClick
    const [isSelected, setFocus] = useItemsInteractions(props, { suprKeyAction: () => false, enterKeyAction: _handleClick }, false)

    useEffect(() => {
        specialMode && actives && setFocus()
    }, [])

    useEffect(() => {
        if(!specialMode && isSelected && !actives) {
            doSelectionForItem(false)
        }
    }, [isSelected, actives])

    const _activated = specialMode ? isSelected : actives
    return (
        <div id={`${primarySelect ? 'primarySelect' : ''}`} className={`${type === 'payment_method' ? 'ILtuvieja' : ''} `}>
            <InputKeyActionHandler name="itemFromList" autoComplete="off" id={props.focusedId} />
            <div className={`item ${_activated ? 'itemSelection' : ''}`} onClick={(!actives) || itemType === 'banks' ? doSelectionForItem : null}>

                {
                    !format && code && type ?
                        (
                            (type === "coins" || type === "payment_method" || type === "service_mode") ?
                                _activated ?
                                    <div title={name} id={code}>
                                        {
                                            type === 'bank' &&
                                            <img className="itemSobre activaos" src={require(`./assets/bank/${code}.png`)} alt="" width="60" />
                                        }
                                        <img className="itemSobre activaos" src={require(`./assets/${type}/${code}2.png`)} alt="" width="60" />
                                    </div>
                                    :
                                    <div title={name} id={code}>
                                        <img className="itemFuera" src={require(`./assets/${type}/${code}.png`)} width="60" alt="" id={code} title={name} />
                                        <img className="itemSobre" src={require(`./assets/${type}/${code}2.png`)} width="60" alt="" id={code} title={name} />
                                    </div>
                                :
                                <img className={`banquis ${_activated ? 'itemVisible' : ''}`} src={require(`./assets/${type}/${code}.png`)} alt="" id={code} title={name} width="85" />
                        )
                        :
                        <IconSwitch
                            icon={code}
                            size={45}
                        />
                }
                {
                    primarySelect ?
                        <div id="primarySelectText" className="primarySelectText">
                            <p title={name}>{name}</p>
                            {placeholder &&
                                placeholder.map(item => {
                                    return <p id="ILplaceholder2" className="fuente" key={item.id}>{item.name}</p>
                                })
                            }
                        </div>
                        :
                        <p title={name}>{name}</p>
                }
            </div>
            {
                (placeholder && !primarySelect) &&
                <div className="placeHoldCont">
                    {
                        placeholder.map(item => {
                            return <p className="ILplaceholder fuente" key={item.id}>{item.name}</p>
                        })
                    }
                </div>
            }
        </div>
    )


}

export default React.memo(NewItemsLayout)
