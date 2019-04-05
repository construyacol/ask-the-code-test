import React, { Component, Fragment } from 'react'
import IconSwitch from '../icons/iconSwitch'
import CopyContainer from '../copy/copyContainer'

const ItemTicket = payload => {

  const {
    ui_name,
    value,
    icon,
    type,
    copy,
    url_explorer
  } = payload

  // console.log('||||||| ITEM ticket ', url_explorer)

  return(
    <div className="TicketDetailItem">
      <p className="fuente TicketItemTitle" >{ui_name}</p>
      <span className="fuentePrin fuenteTicket value">
        {
          copy ?
          <CopyContainer
            valueToCopy={value}
            color="white"
            max_width="200"
          />
          :
          <p>{value}</p>
        }
        {
          icon &&
        <IconSwitch
          icon={icon}
          size={20}
          color="white"
        />
        }
        {
          url_explorer &&
          <a href={`${url_explorer}/tx/${value}`} target="_blank" className="explorerBlock copy tooltip" >
            <IconSwitch
              icon="arrow_right"
              size={20}
              color="white"
            />
            <span className=" p tooltiptext fuente"> Explorador </span>
          </a>

        }
      </span>
    </div>
  )

}

export default ItemTicket
