import { useState, useEffect } from 'react'
import useStage from '../../hooks/useStage'
import styled from 'styled-components'
import InputComponent from '../kyc/InputComponent'
import { IndicatorHover } from '../../../widgets/accountList/listView'
import { 
  HeaderMainContainer,
  IconAccount,
  LabelContainer,
  AccountLabel
} from '../../../widgets/headerAccount/styles'
import loadable from "@loadable/component";
import useViewport from "../../../../hooks/useWindowSize";
import { MdArrowBackIosNew } from 'react-icons/md';




// import { useActions } from '../../../../hooks/useActions'
// import InputForm from "../../../widgets/inputs/inputForm";
// import ControlButton from "../../../widgets/buttons/controlButton";
// import useAvailableWalletCreator from "../../../hooks/useAvailableWalletCreator";
// import ItemLayout from "../../../widgets/items/itemLayout";
// import useKeyActionAsClick from '../../../../hooks/useKeyActionAsClick';
// import { useSelector } from "react-redux";
// import { useCoinsendaServices } from "../../../../services/useCoinsendaServices";
// import useToastMessage from "../../../../hooks/useToastMessage";
// import TagItem from './tagItem'
// import WalletSkeleton from './skeleton'
// import { history } from '../../../../const/const'
// import { capitalizeWord } from '../../../../utils'

// import {
//   ListContainer,
//   ButtonContainer
// } from './styles'

// import loadable from '@loadable/component'
// const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));


const NewWAccountComponent = ({ handleState, handleDataForm:{ dataForm }, ...props }) => {

//   const actions = useActions();
//   const [ availableCurrencies ] = useAvailableWalletCreator();
//   const [ searchList, setSearchList ] = useState()
//   const [ matchItem, setMatchItem ] = useState(null)
//   const [ loader, setLoader ] = useState(null)
//   const [ value, setValue ] = useState("")
//   const [coinsendaServices] = useCoinsendaServices();
//   const [toastMessage] = useToastMessage();

//   const idSubmitButton = useKeyActionAsClick(
//       true,
//       "next-stage-kyc",
//       13,
//       false,
//       "onkeypress",
//       true
//   );

//   const selectItem = (query) => {
//       // applys uniqueMatch when there are 2 or more currencies with the same nomenclature for example: bitcoin - bitcoin_testnet, matched over the currency clicked
//       const uniqueMatch = availableCurrencies.filter(currency => currency.currency.toLowerCase() === query);
//       searchMatch(query?.toLowerCase(), uniqueMatch)
//   }

//   const handleChange = (inputName, query) => {
//       searchMatch(query?.toLowerCase()) 
//   }

//   const loadDefaultState = () => {
//       setMatchItem(null)
//       setSearchList(availableCurrencies)
//       setValue("")
//       document.querySelector("[name='walletCurrency']").value = ""
//   }

//   const searchMatch = (query, uniqueMatch) => {
//       if(!searchList?.length) return;
//       setValue(query)
//       const matches = uniqueMatch || (query && availableCurrencies.filter(currency => currency.currency.toLowerCase().includes(query)));
//       matches?.length === 1 ? setMatchItem(matches[0]) : setMatchItem(null);
//       if(!matches?.length)return setSearchList(availableCurrencies);
//       setSearchList(matches)
//   }

//   const createWallet = async () => {
//       setLoader(true)
//       const newWallet = await coinsendaServices.createWallet({...matchItem, currency:capitalizeWord(matchItem?.currency)});
//       if (!newWallet) {
//         setLoader(false)
//         return toastMessage("Error al crear la billetera...", "error");
//       }
//       await coinsendaServices.getWalletsByUser();
//       const { account } = newWallet;
//       const dep_prov = await coinsendaServices.createAndInsertDepositProvider(account);

//       if (!dep_prov) {
//         setLoader(false)
//         return toastMessage("Error al crear el proveedor de deposito de la billetera...", "error");
//       }
//       let msg = `Nueva wallet ${account?.currency?.currency} creada!`;
//       toastMessage(msg, "success");
//       actions.success_sound();
//       actions.renderModal(null);
//       setLoader(false)
//       return history.push(`/wallets/deposit/${account.id}`);
//   };

//   useEffect(() => {
//       if(availableCurrencies && !loader){
//           console.log(availableCurrencies)
//           setSearchList(availableCurrencies)
//       }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [availableCurrencies])

const stageManager = useStage(
  // create the form stages
  Object.keys(dataForm?.handleError?.errors || dataForm.stages),
  dataForm.stages
)

const {
  // finalStage,
  nextStage,
  // prevStage,
  stageData,
  // currentStage
  // stageStatus,
  // setStageStatus
} = stageManager

  const RenderStageComponent = props => {
    const ToRender = {
      identity:<ProofComponent {...props} />,
      infoNeeded:<ProofComponent {...props} />,
      withdrawProviderBank:<WithdrawProviderBank {...props} />
    }
    return ToRender[stageData?.key] || <ProofComponent/>
  }

  return(
    <>
        <RenderStageComponent 
          stageManager={stageManager}
          handleState={handleState}
        >
          <StageManagerComponent stageManager={stageManager}/>
        </RenderStageComponent>

        <StatusPanelComponent>
          <p>DATA</p>
          <ButtonContainer onClick={() => nextStage()}>
            <button>
              Siguiente
            </button>
          </ButtonContainer>
        </StatusPanelComponent>
    </>                 
  )
}

const ButtonContainer = styled.div`
  position: sticky;
  bottom: 20px;
`

export default NewWAccountComponent

const WithdrawProviderBank = ({ 
  stageManager, 
  children,
  ...props 
}) => {

  const { isMovilViewport } = useViewport();

  const {
    stageData
  } = stageManager

  console.log('withdrawProviderBank', stageData)

  return(
    <StageContainer className="_withdrawProviderBank">
      {children}
      <InputComponent
        // onChange={onChange} 
        // inputStatus={stageStatus}
        // defaultValue={state[stageData?.key]}
        name={stageData?.key} 
        label={stageData?.uiName}
        // message={stageData?.settings?.defaultMessage}
        placeholder={stageData?.settings?.placeholder}
        type={stageData?.uiType}
        // setStageData={setStageData}
        // dataForm={dataForm}
        // state={state}
        // progressBar={{start:currentStage+1, end:stageController.length, showSteps:true}}
        // AuxComponent={[
        //   stageData?.settings?.auxComponent, 
        //   () => <NextButtom id={idNextStageKyc} onClick={nextStep} disabled={(currentStage >= stageController.length) || stageStatus !== 'success'} />
        // ]}
      />
      <SelectListContainer>
        {
          stageData?.selectList && Object.keys(stageData?.selectList).map((providerKey, index) => {
            return <ItemProviderBankComponent 
              key={index}
              withdrawProv={stageData?.selectList[providerKey]}
              firstIndex={index === 0}
              lastIndex={(Object.keys(stageData?.selectList)?.length - 1) === index}
              isMovilViewport={isMovilViewport}
            />
          })
        }
      </SelectListContainer>
    </StageContainer>
  )
}

const ItemProviderBankComponent = ({ 
  withdrawProv,
  firstIndex,
  lastIndex,
  isMovilViewport
}) => {

  // console.log('withdrawProv', withdrawProv)
  const uiName = withdrawProv?.uiName?.toLowerCase()

  return(
    <ItemProviderBankContainer 
      className={`${firstIndex ? 'firstItem' : ''} ${lastIndex ? 'lastItem' : ''}`}
    >
      <IndicatorHover>
          <div className="indicator" >
              <div className="indicatorSon" ></div>
          </div>
      </IndicatorHover>
      <HeaderMainContainer>
        <IconAccount className="onAccountList">
            <IconSwitch
                icon={withdrawProv?.value}
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

  &:hover{
      border-left:5px solid var(--primary);
      opacity: 1;
      .indicatorSon {
          transform: scale(0.85);
      }
      .indicator {
          transform: scale(0.85);
      }
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

`

export const SelectListContainer = styled.div`
  display:grid;
  grid-template-rows: repeat(auto-fill, minmax(auto, 105px));
  max-width: 700px;
`

export const StageContainer = styled.div`
  display:grid;
  input{
    font-size:15px;
  }
  &._withdrawProviderBank{
    grid-template-rows:auto auto 1fr;
    row-gap:20px;
  }
  .inputContainer__{
    height: 45px;
    max-width: 700px;
    margin:0;
  }
  .withLabel{
    margin-top:15px;
  }
`

const ProofComponent = ({ children, nextStage }) => {
  return(
    <StageContainer>
      {children}
    </StageContainer>
  )
}

const StageManagerComponent = ({ stageManager }) => {

  const {
    currentStage,
    stageController,
    prevStage
  } = stageManager

  return(
    <StageIndicator className={`fuente2`}>
      {
        (currentStage > 0 && currentStage <= stageController?.length) &&
          <BackButtom onClick={() => prevStage()}>
            <MdArrowBackIosNew size={15} color="var(--paragraph_color)"/>
          </BackButtom>
      }
      <p>
        {currentStage+1}/{stageController?.length}
      </p>
    </StageIndicator>
  )
}

const BackButtom = styled.button`
    cursor: pointer;
    height: 33px;
    display: flex;
    width: auto;
    width:33px;
    place-items: center;
    border-style: none;
    place-content: center;
`

const StageIndicator = styled.div`
  display: grid;
  grid-template-columns: 30px auto;
  column-gap: 15px;
  align-items: center;
  height:auto;
  height:33px;
  p{
    font-size: 14px;
    color: #979797;
    margin: 0;
  }
`



const StatusPanelComponent = ({ children }) => {
  return(
    <PanelContainerComponent>
      {children}
    </PanelContainerComponent>
  )
}

const PanelContainerComponent = styled.div`
  width:auto;
  max-width:calc(350px - 20px);
  background:#ededed;
  display:grid;
  grid-template-rows:1fr auto;
  padding:20px;
  row-gap:20px;
  position: sticky;
  top: 195px;
  max-height: 700px;
`

// {
//     searchList?.length ? 
//       <>
//           <h1 className="fuente">Crea una billetera</h1>
//           <InputForm 
//               autoFocus
//               type="text" 
//               placeholder={`Ej: Litecoin`}
//               name="walletCurrency"
//               value={value}
//               handleChange={handleChange}
//               label={`Elige la moneda de la billetera que deseas crear`}
//               state={matchItem ? 'good' : 'other'}
//               AuxComponent={[
//                   () => (<TagItem item={matchItem} deleteTag={loadDefaultState}/>)
//               ]}
//           />
//           <ListContainer>
//               {
//                   searchList?.length && searchList.map((item, index) => {
//                       return <ItemLayout
//                                   actualizarEstado={selectItem}
//                                   {...item}
//                                   key={index}
//                                   className="itemSelection"
//                                   actives={matchItem}
//                               />
//                   })
//               }
//           </ListContainer>

//           <ButtonContainer>
//               <ControlButton
//                   id={idSubmitButton}
//                   loader={loader}
//                   formValidate={matchItem}
//                   label="Crear"
//                   handleAction={createWallet}
//               />
//           </ButtonContainer>
//       </>
//       :
//       <WalletSkeleton/>
//   }