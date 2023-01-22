import { useState, useEffect, Fragment } from 'react'

import {
  DropDown,
  DropDownList
} from './styles'

import IconSwitch from 'components/widgets/icons/iconSwitch'
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'

const DropDownComponent = (props) => {

  const { selectedItem, list } = props
  const [ filterSwitch, setFilterSwitch ] = useState(false)

  useEffect(() => {
      window.addEventListener('click', (e => eventHandle(e)))
      return () => {
        window.removeEventListener('click', e => eventHandle(e))
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  const currentFilter = list[selectedItem]
  const Component = currentFilter?.component

  return(
      <DropDown data-drop_down className="DropDown" width="100%" height="40px">
        <div data-drop_down className={`currentFilter ${currentFilter?.icon ? 'withIcon' : ''}`} onClick={toggleFilter}>
          {
            typeof Component === 'function' ?
              <Component/>
            :
            <>
              {
                currentFilter?.icon &&
                  <IconSwitch
                    icon={currentFilter?.icon}
                    size={16}
                  />
              }
              <p data-drop_down>{currentFilter?.name}</p>
            </>
          }
          <IconDropDown data-drop_down/>
        </div>
        {
          filterSwitch &&
          <DropDownList data-drop_down className="DropDownList">
            {
              Object.keys(list).map((itemName, key) => {
                const ItemComponent = list[itemName]?.component
                return (
                  <Fragment key={key}>
                    {
                      typeof ItemComponent === 'function' ?
                      <li data-filter_name={list[itemName].name} data-filter_param={list[itemName].value} key={key} className="itemFilter" onClick={changeFilter}>
                        <ItemComponent/>
                      </li>
                      :
                      <>
                      <li data-filter_name={list[itemName].name} data-filter_param={list[itemName].value} key={key} className="itemFilter" onClick={changeFilter}>
                        {
                          list[itemName].icon &&
                            <IconSwitch
                              icon={list[itemName].icon}
                              size={16}
                            />
                        }
                        {list[itemName].name}
                      </li>
                      </>
                    }
                  </Fragment>
                )
              })
            }
          </DropDownList>
        }
      </DropDown>

  )

}


export default DropDownComponent
