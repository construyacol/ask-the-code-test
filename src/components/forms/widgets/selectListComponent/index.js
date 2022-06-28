import { useState, useEffect } from 'react'
import { filterElement } from '../../utils'
import { capitalizeWord } from '../../../../utils'
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
import RenderAuxComponent from '../renderAuxComponent'
// import { MdSignalWifiStatusbarNull } from 'react-icons/md'
import { 
  StageContainer, 
  OptionInputContainer 
} from '../sharedStyles'
import {  StageIndicator } from '../stageManager/styles'
import { device } from "../../../../const/const"


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
    itemList:{ Icon, ...itemList},
    firstIndex,
    lastIndex,
    isMovilViewport,
    isSelectedItem,
    handleAction = () => null,
    auxUiName,
    className,
    ...props
  }) => {

    // const uiName = itemList?.uiName?.toLowerCase()
    const uiName = capitalizeWord(itemList?.uiName)
    // console.log(uiName, itemList)

    return(
      <ItemProviderBankContainer 
        onClick={() => handleAction(itemList)}
        className={`${className} ${props.AuxComponent ? 'withAuxComp' : ''} ${firstIndex ? 'firstItem' : ''} ${lastIndex ? 'lastItem' : ''} ${isSelectedItem ? 'isSelectedItem' : ''}`}
      >
        <IndicatorHover>
            <div className="indicator" >
                <div className="indicatorSon" ></div>
            </div>
        </IndicatorHover>
        <HeaderMainContainer>
          <IconAccount className="onAccountList">
              {
                Icon ? 
                <Icon
                  size={isMovilViewport ? 20 : 22}
                  color={"var(--primary)"}
                />
                :
                <IconSwitch
                    icon={itemList?.icon || itemList?.value}
                    size={isMovilViewport ? 22 : 25}
                />  
              }
          </IconAccount>
          <LabelContainer className="_header__labelContainer">
              <AccountLabel>{uiName}</AccountLabel>
              {
                auxUiName &&
                <AccountLabel className="_aux">{auxUiName}</AccountLabel>
              }
          </LabelContainer> 
        </HeaderMainContainer>

        {
          props.AuxComponent && 
          <RenderAuxComponent {...props} />
        }
      </ItemProviderBankContainer>
    )
  } 

  export default SelectListComponent


  export const SelectListContainer = styled.div`
    display:grid;
    grid-template-rows: repeat(auto-fill, minmax(auto, 105px));
    max-width: 700px;
    &.skeleton{
      width: 100vw;
      align-self: flex-start;
      justify-self: flex-start;
      @media ${device.mobile} {
        width: 100%;
      }
    }
  `



  export const SelectListSkeleton = props => {


    const itemList = new Array(3).fill({
      value:"createId",
      icon:"add",
      uiName:"Loading dataset..."
    })

    return(
      <StageContainer className="_bankNameList skeleton">
        <StageIndicator/>
        <OptionInputContainer>
          <p className="fuente _pLabel _inputLabelP">Loading skeleton awesome title for you my loba</p>
          <SelectListContainer className="skeleton">
            {
              itemList.map((item, index) => {
                  return <ItemListComponent 
                    className="skeleton"
                    key={index}
                    itemList={item}
                    firstIndex={index === 0}
                    lastIndex={(Object.keys(itemList)?.length - 1) === index}
                    isSelectedItem={Object.keys(itemList)?.length === 1}
                    // isMovilViewport={isMovilViewport}
                    // handleAction={() => null}
                  />
                })
            }
          </SelectListContainer>
        </OptionInputContainer>
      </StageContainer>
    )

  }




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
    ${'' /* text-transform: capitalize; */}
  }

  &.createButton{
    ${AccountLabel}{
      text-transform: none;
    } 
  }

  display: grid;
  grid-template-columns: auto 1fr;
  padding: 0 35px 0 20px;
  
  &.createButton{
    ._header__labelContainer p{
      font-size: 17px;
    }
  }

  &:hover{
    &.createButton{
      ._header__labelContainer p{
        color:var(--primary);
      }
    }
  }

  &.withAuxComp{
      grid-template-columns: auto 2fr 1fr;
      @media ${device.mobile} {
        grid-template-columns: 1fr auto;
      }
  }



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
      &._aux{
        color:var(--placeholder);
      }
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


  &.disabled,
  &.skeleton{
    opacity:0.7;
    border-left: 5px solid #E9E9E9;
    img{
      filter: grayscale(1);
    }
    &:hover{
      .indicatorSon {
            transform: scale(0);
      }
      .indicator {
          transform: scale(0);
      }
    }

  }

  &.auxNumber{
    p{
      &._aux{
        font-family: "Tomorrow", sans-serif;
        font-size: 12px;
      }
    }
  }

`