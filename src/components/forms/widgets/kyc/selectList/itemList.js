import React from 'react'
import { ItemListGrid } from './styles'
import { useObserver } from "hooks/useObserver";
// import { useObserver } from 'hooks/intersectionObserver'

 

const ItemList = ({ item, onClick }) => {

  // const [ show, element ] = useObserver()
  const [show, setElement] = useObserver();

  const imgSrc = item?.img || item?.flag

  return(
    <ItemListGrid className={`itemListGrid ${item?.value || ''}`} onClick={onClick} ref={setElement}>
      <div className="itemList__icon" >
      {
          imgSrc &&
           <img alt="" src={show ? imgSrc : ''} width={35} height={35}></img>
      }
      </div>
      <p className="fuente itemListUiName" >{item?.uiName?.toLowerCase()}</p>
    </ItemListGrid>
  )
}

export default React.memo(ItemList)





