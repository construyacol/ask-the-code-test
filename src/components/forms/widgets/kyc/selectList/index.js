import { useEffect, useState } from 'react'
import { filterElement } from '../../../utils'
import { isEmpty } from 'lodash'

// import components
import ItemList from './itemList'

// import styles
import { ListContainer, SelectListMain } from './styles'

// import Hooks
import useHeight from '../../../hooks/useHeight'
 

const SelectList = ({ list, name, state, handleAction, exactResult = true, ...props }) => {
  
  let [ height ] = useHeight(list)
  const [ searchList, setSearchList ] = useState(list || {})
  const [ currentItemTagExist, setCurrentItemTagExist ] = useState(false)
  // console.log('state - SelectList:  ', state, currentItemTagExist)
  
  useEffect(() => {
    if(Object.keys(searchList).length === 1 && state[name]){
      setCurrentItemTagExist(true)
    }else{
      setCurrentItemTagExist(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, name, searchList])
 
  useEffect(() => {
    if(list){
      console.log('exactResult', exactResult)
      const itemList = filterElement(list, state[name], exactResult)
      setSearchList(itemList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state[name], list])

  // console.log('exactResult', exactResult)
  console.log('SelectList =>', name, state, list)

  let isMovilHeight = document.body.clientWidth < 768 ? `25vh` : `0px`

  return(
    <SelectListMain
      id="selectListMain"
      height={(!isEmpty(list) && !currentItemTagExist) ? height : isMovilHeight}
      >
      {
        (list && !currentItemTagExist) &&
        <ListContainer>
          {
            Object.keys(searchList).map((itemKey, id) => {
              if(["key", "uiType", "uiName"].includes(itemKey))return null;
              //console.log('searchList', itemKey)
              return <ItemList 
                key={id}
                item={list[itemKey]}
                onClick={() => handleAction({target:{value:itemKey}})}
                {...props}
              />
            })
          }
        </ListContainer>
      }
    </SelectListMain>
  )

}

export default SelectList



