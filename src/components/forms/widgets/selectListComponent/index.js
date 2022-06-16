import { useState, useEffect } from 'react'
import { filterElement } from '../../utils'
import styled from 'styled-components'
import { IndicatorHover } from '../../../widgets/accountList/listView'
import { 
    HeaderMainContainer,
    IconAccount,
    LabelContainer,
    AccountLabel
} from '../../../widgets/headerAccount/styles'
import loadable from "@loadable/component";
import useViewport from "../../../../hooks/useWindowSize"

const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));


const SelectListComponent = ({ 
    stageData, 
    selectList = stageData?.selectList,
    state, 
    onChange
  }) => {
  
    const [ searchList, setSearchList ] = useState()
    const { isMovilViewport } = useViewport();
  
    useEffect(() => {
      if(selectList){
        const itemList = filterElement(selectList, state[stageData?.key])
        setSearchList(itemList)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state[stageData?.key], selectList])
  
    const handleAction = (data) => {
      onChange({target:{value:data.value}});
      // console.log('handleAction', data, selectList[data.value])
    }
  
    return(
      <SelectListContainer>
        {
          searchList && Object.keys(searchList).map((key, index) => {
            return <ItemListComponent 
              key={index}
              itemList={selectList[key]}
              firstIndex={index === 0}
              lastIndex={(Object.keys(searchList)?.length - 1) === index}
              isSelectedItem={Object.keys(searchList)?.length === 1}
              isMovilViewport={isMovilViewport}
              handleAction={handleAction}
            />
          })
        }
      </SelectListContainer>
    )
  
  }
  
  export const ItemListComponent = ({ 
    itemList,
    firstIndex,
    lastIndex,
    isMovilViewport,
    isSelectedItem,
    handleAction,
  }) => {

    const uiName = itemList?.uiName?.toLowerCase()

    return(
      <ItemProviderBankContainer 
        onClick={() => handleAction(itemList)}
        className={`${firstIndex ? 'firstItem' : ''} ${lastIndex ? 'lastItem' : ''} ${isSelectedItem ? 'isSelectedItem' : ''}`}
      >
        <IndicatorHover>
            <div className="indicator" >
                <div className="indicatorSon" ></div>
            </div>
        </IndicatorHover>
        <HeaderMainContainer>
          <IconAccount className="onAccountList">
                <IconSwitch
                    icon={itemList?.icon || itemList?.value}
                    size={isMovilViewport ? 22 : 25}
                />
          </IconAccount>
          <LabelContainer className="_header__labelContainer">
              <AccountLabel>{uiName}</AccountLabel>
          </LabelContainer> 
        </HeaderMainContainer>
      </ItemProviderBankContainer>
    )
  } 

  export default SelectListComponent



  export const SelectListContainer = styled.div`
  display:grid;
  grid-template-rows: repeat(auto-fill, minmax(auto, 105px));
  max-width: 700px;
`




export const ItemProviderBankContainer = styled.div`

  background:white;
  height:105px;
  border:1px solid #E7E7E7;
  border-bottom: 1px solid transparent;
  border-left: 5px solid #E9E9E9;
  cursor:pointer;
  column-gap: 14px;

  ${HeaderMainContainer}{
    place-self: flex-start;
  }

  ${AccountLabel}{
    text-transform: capitalize;
  }

  display: grid;
  grid-template-columns: auto 1fr;
  padding: 0 35px 0 20px;
  

  &.firstItem{
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &.lastItem{
    border-bottom: 1px solid #E7E7E7;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  &.isSelectedItem{
    border-radius:4px;
    border:1px solid #E7E7E7;
    p{
      color:var(--primary);
    }
  }

  &:hover, &.isSelectedItem{
      border-left:5px solid var(--primary);
      opacity: 1;
      .indicatorSon {
          transform: scale(0.85);
      }
      .indicator {
          transform: scale(0.85);
      }
  }

`