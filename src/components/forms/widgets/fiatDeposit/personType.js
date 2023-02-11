import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { AiFillBank } from "react-icons/ai";
import { isEmpty } from 'lodash'
import { P } from 'components/widgets/typography';
import withCoinsendaServices from 'components/withCoinsendaServices'



function PersonTypeComponent({ 
    stageManager:{ 
      stageData,
      setStageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children,
    currentWallet,
    ...props
  }){  

    const { selectList } = stageData 

    console.log('stageData', selectList)

    const { isMovilViewport } = useViewport();
    // const [ depositAccounts ] = useSelector((state) => selectDepositAccounts(state));
    // const actions = useActions()

    const selectPersonType = (personType) => {
      console.log('selectPersonType', stageData?.key, personType)
      // setState(prevState => ({ ...prevState, [stageData?.key]: provider }))
      // setStageStatus('success')
    }

    // const createDepositProvider = async(wallet) => {
    //   await props.coinsendaServices.createAndInsertDepositProvider(wallet)
    // }

    // useEffect(() => {
    //   if(state[stageData?.key]) selectProvider(state[stageData?.key]);
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    // useEffect(() => {
    //   if(currentWallet && isEmpty(currentWallet?.dep_prov)){
    //     createDepositProvider(currentWallet)
    //   }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [currentWallet])

    return(
      <StageContainer className="_identityComponent">
      {children} 
      <OptionInputContainer>
        <P className="fuente _pLabel _inputLabelP">{stageData?.uiName}</P>
        <SelectListContainer>
          {
            selectList && Object.keys(selectList).map((key, index) => {
              const isSelected = [selectList[key]?.value].includes(state[stageData?.key]?.value)
              return <ItemListComponent 
                key={index} 
                // className={`auxNumber`}
                itemList={selectList[key]}
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
