import { useEffect } from 'react'
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { P } from 'components/widgets/typography';
import withCoinsendaServices from 'components/withCoinsendaServices'
import { AiFillBank } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";


function PersonTypeComponent({ 
    stageManager:{ 
      stageData,
      setStageStatus
    },
    handleState:{ state, setState },
    // handleDataForm:{ dataForm },
    children,
    // currentWallet,
    // ...props
  }){  

    const { selectList } = stageData 
    const { isMovilViewport } = useViewport();

    const selectPersonType = (personType) => {
      setState(prevState => ({ ...prevState, [stageData?.key]: personType }))
      setStageStatus('success')
    }

    useEffect(() => {
      if(state[stageData?.key]) selectPersonType(state[stageData?.key]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
      <StageContainer className="_identityComponent">
      {children} 
      <OptionInputContainer>
        <P className="fuente _pLabel _inputLabelP">{stageData?.uiName}</P>
        <SelectListContainer>
          {
            selectList && Object.keys(selectList).map((key, index) => {
              const isSelected = [selectList[key]?.value].includes(state[stageData?.key]?.value)
              const Icon = selectList[key]?.value === "juridica" ? AiFillBank : BsFillPersonFill
              return <ItemListComponent 
                key={index}  
                // className={`auxNumber`}
                itemList={{...selectList[key], Icon}}
                // auxUiName={isSelected && withdrawAccount?.account_number?.value}
                firstIndex={index === 0}
                lastIndex={(Object.keys(selectList)?.length - 1) === index}
                isSelectedItem={isSelected}
                isMovilViewport={isMovilViewport}
                handleAction={selectPersonType}
              />
            })
          }
        </SelectListContainer>
      </OptionInputContainer>
    </StageContainer>
    )


  }

  export default withCoinsendaServices(PersonTypeComponent)
