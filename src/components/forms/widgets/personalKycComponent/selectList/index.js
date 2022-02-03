import React, { useEffect, useState } from 'react'

// import components
import ItemList from './itemList'

// import styles
import { ListContainer, SelectListMain } from './styles'

// import Hooks
import useHeight from '../../../hooks/useHeight'
 

const SelectList = ({ list, name, state, handleAction }) => {

  let [ height ] = useHeight(list)
  const [ searchList, setSearchList ] = useState(list || {})
  const [ currentItemTagExist, setCurrentItemTagExist ] = useState(null)
  // console.log('state - SelectList:  ', state, currentItemTagExist)
  
  useEffect(() => {
    if(Object.keys(searchList).length === 1 && state[name]){
      setCurrentItemTagExist(true)
    }else{
      setCurrentItemTagExist(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, name])



  useEffect(() => {
    if(list){
      const itemList = filterElement(list, state[name])
      setSearchList(itemList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state[name], list])

  let isMovilHeight = document.body.clientWidth < 768 ? `25vh` : `0px`
  

  return(
    <SelectListMain
      id="selectListMain"
      height={(list && !currentItemTagExist) ? height : isMovilHeight}
      >
      {
        (list && !currentItemTagExist) &&
        <ListContainer>
          {
            Object.keys(searchList).map((itemKey, id) => {
              return <ItemList
                key={id}
                item={list[itemKey]}
                onClick={() => handleAction({target:{value:itemKey}})}
              />
            })
          }
        </ListContainer>
      }
    </SelectListMain>
  )

}

export default SelectList


const filterElement = (list, query) => {
  let result = {}
  Object.keys(list).filter(itemList => {
    if(itemList.includes(query?.toLowerCase())){
      return result = { ...result, [itemList]:list[itemList] }
    }
    return itemList
  })
    return Object.keys(result).length ? result : list
}
