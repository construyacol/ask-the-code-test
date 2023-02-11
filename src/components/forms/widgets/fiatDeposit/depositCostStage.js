import { useEffect } from 'react'
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { MetaDataContainer } from '../sharedStyles'
// import styled from 'styled-components'

export default function DepositSourceComponent({ 
    stageManager:{ 
      stageData,
      setStageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children,
    costList,
    // depositProvider
    // ...props
  }){  

    const { isMovilViewport } = useViewport();
    // const actions = useActions()

    const selectWithdrawAccount = (withdrawAccount) => {
      setState(prevState => {
        return { ...prevState, [stageData?.key]: withdrawAccount }
      })
      setStageStatus('success')
    }

    useEffect(() => {
      if(state[stageData?.key]){
        selectWithdrawAccount(state[stageData?.key])
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const currentMetadata = costList && costList[state[stageData?.key]?.value]?.metaData
    
    return(
      <StageContainer className="_identityComponent">
        {children} 
        <OptionInputContainer>
          <p className="fuente _pLabel _inputLabelP">{stageData?.uiName}</p>
          <SelectListContainer>
            {
              costList && Object.keys(costList).map((key, index) => {

                const isSelected = [costList[key]?.value].includes(state[stageData?.key]?.value)
                return <ItemListComponent 
                  key={index} 
                  // className={`auxNumber`}
                  itemList={costList[key]}
                  // auxUiName={isSelected && withdrawAccount?.account_number?.value}
                  firstIndex={index === 0}
                  lastIndex={(Object.keys(costList)?.length - 1) === index}
                  isSelectedItem={isSelected}
                  isMovilViewport={isMovilViewport}
                  handleAction={selectWithdrawAccount}
                />
              })
            }
          </SelectListContainer>
        </OptionInputContainer>
        {
          currentMetadata &&
          <MetaDataContainer>
            <ul>
            {
              currentMetadata?.map((depositItem, key) => {
                return <li className="fuente" key={key}>{depositItem}</li>
              })
            }
            </ul>
          </MetaDataContainer>
        }

      </StageContainer>
    )
  }


