import React, { useState, useEffect } from 'react'

import {
  DropDown,
  DropDownList
} from './styles'

import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'


const DropDownComponent = (props) => {

  const { selectedItem, list } = props
  const [ filterSwitch, setFilterSwitch ] = useState(false)
  const [ currentFilter, setCurrentFilter ] = useState(list[selectedItem])

  useEffect(() => {
      window.addEventListener('click', (e => eventHandle(e)))
      return () => {
        window.removeEventListener('click', e => eventHandle(e))
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(selectedItem){
      setCurrentFilter(list[selectedItem])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem])

  const eventHandle = (e) => {
    if(!e.target.dataset.drop_down){
      setFilterSwitch(false)
    }
  }

  const toggleFilter = () => {
    setFilterSwitch(!filterSwitch)
  }

  const changeFilter = e => {
    const { filter_name, filter_param } = e.target.dataset

    let payload = {
      name:filter_name,
      value:filter_param
    }

    props.actionHandle(payload, props)
  }

  let IconDropDown = filterSwitch ? MdArrowDropUp : MdArrowDropDown
  return(
      <DropDown data-drop_down className="DropDown" width="100%" height="40px">
        <div data-drop_down className="currentFilter" onClick={toggleFilter}>
          <p data-drop_down>{currentFilter?.name}</p>
          <IconDropDown data-drop_down/>
        </div>
        {
          filterSwitch &&
          <DropDownList data-drop_down className="DropDownList">
            {
              Object.keys(list).map((itemName, key) => {
                return <li data-filter_name={list[itemName].name} data-filter_param={list[itemName].value} key={key} className="itemFilter" onClick={changeFilter}>{list[itemName].name}</li>
              })
            }
          </DropDownList>
        }

      </DropDown>

  )

}


export default DropDownComponent
