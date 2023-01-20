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
import { device } from "const/const"
import { UI_STATE_NAME } from 'const/uiNames'
import { deletedOrderAnim, newOrderStyleAnim, selectorAnim } from "components/widgets/animations";
import { UiStateCont } from 'components/settings/styles'


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
    auxUiState,
    ...props
  }) => {

    // const uiName = itemList?.uiName?.toLowerCase()
    let UiName = itemList?.uiName

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
                  size={isMovilViewport ? 22 : 24}
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
              <AccountLabel>

                {
                  typeof UiName === "function" ?
                    <UiName/>
                    :
                    capitalizeWord(UiName)
                }

                

                {
                  auxUiState &&
                    <UiStateCont className={`${auxUiState}`}>{UI_STATE_NAME[auxUiState] || auxUiState}</UiStateCont>
                }

              </AccountLabel> 

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
    perspective: 2000px;
    perspective-origin: center top;
    
    &.skeleton{
      width: 100%;
      align-self: flex-start;
      justify-self: flex-start;
    }

    @media ${device.mobile} {
        width: 100%;
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
  position:relative;

  .button_item--nextCta{
    fill: var(--paragraph_color);
    align-self: center;
    justify-self: end;
    opacity: 1;
  }

 
  &.rejected,
  &.canceled{
    pointer-events:none;
    opacity: .5;
    filter: grayscale(1);
  }



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

  .deleteButton__{
    opacity:0;
    transform: translateX(5px);
    @media ${device.mobile} {
      opacity:1;
      transform: translateX(0px);
    }
  }

  &:hover{
    &.createButton{
      ._header__labelContainer p{
        color:var(--primary);
      }
    }

    .deleteButton__{
      transition:.2s;
      opacity:1;
      transform: translateX(0px);
    }
  }

  &.withAuxComp{
      grid-template-columns: auto 2fr 1fr;
  }

  &.withControls{
    grid-template-columns: auto 1fr auto;
    align-items:center;
  }

  &.__withdrawAccount{
    grid-template-columns: auto 3fr 1fr;
  }

  @media ${device.mobile} {
    &.withAuxComp{
      grid-template-columns: 1fr auto;
    }
    &.withControls{
      grid-template-columns: auto 1fr auto;
      column-gap:0;
      padding:0 15px;
      .arrowControl{
        justify-self: flex-end;
      }
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

  &.deleting{
    opacity:.8;
    transform:scale(.95);
    transition:.3s;
    pointer-events:none;
  }
  

  &.deleted {
    animation-name: ${deletedOrderAnim};
    animation-duration: 0.3s;
    animation-timing-function: cubic-bezier(1, 1, 1, 1);
    animation-fill-mode: forwards;
    pointer-events:none;
  }

  &.new__ {
    animation: ${newOrderStyleAnim} .4s, ${selectorAnim} 1.5s;
    animation-timing-function: cubic-bezier(1, 1, 1, 1);
    animation-fill-mode: forwards;
  }
`