import { useState, useEffect } from 'react'
import { useActions } from '../../../../hooks/useActions'
import InputForm from "../../../widgets/inputs/inputForm";
import ControlButton from "../../../widgets/buttons/controlButton";
import useAvailableWalletCreator from "../../../hooks/useAvailableWalletCreator";
import ItemLayout from "../../../widgets/items/itemLayout";
import useKeyActionAsClick from '../../../../hooks/useKeyActionAsClick';
// import { useSelector } from "react-redux";
import { useCoinsendaServices } from "../../../../services/useCoinsendaServices";
import useToastMessage from "../../../../hooks/useToastMessage";
import TagItem from './tagItem'
import WalletSkeleton from './skeleton'
import { history } from '../../../../const/const'
import { capitalizeWord } from '../../../../utils'


import {
  ListContainer,
  ButtonContainer
} from './styles'


// import loadable from '@loadable/component'

// const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

const NewWalletComponent = ({ handleState, handleDataForm:{ dataForm }, ...props }) => {

 
  // const {
  //   finalStage,
  //   nextStage,
  //   prevStage,
  //   stageData,
  //   currentStage
  //   // stageStatus,
  //   // setStageStatus
  // } = stageManager


  const actions = useActions();
  const [ availableCurrencies ] = useAvailableWalletCreator();
  const [ searchList, setSearchList ] = useState()
  const [ matchItem, setMatchItem ] = useState(null)
  const [ loader, setLoader ] = useState(null)
  const [ value, setValue ] = useState("")
  const [coinsendaServices] = useCoinsendaServices();
  const [toastMessage] = useToastMessage();

  const idSubmitButton = useKeyActionAsClick(
      true,
      "next-stage-kyc",
      13,
      false,
      "onkeypress",
      true
    );
  


  const selectItem = (query) => {
      // applys uniqueMatch when there are 2 or more currencies with the same nomenclature for example: bitcoin - bitcoin_testnet, matched over the currency clicked
      const uniqueMatch = availableCurrencies.filter(currency => currency.currency.toLowerCase() === query);
      searchMatch(query?.toLowerCase(), uniqueMatch)
  }

  const handleChange = (inputName, query) => {
      searchMatch(query?.toLowerCase()) 
  }

  const loadDefaultState = () => {
      setMatchItem(null)
      setSearchList(availableCurrencies)
      setValue("")
      document.querySelector("[name='walletCurrency']").value = ""
  }

  const searchMatch = (query, uniqueMatch) => {
      if(!searchList?.length) return;
      setValue(query)
      const matches = uniqueMatch || (query && availableCurrencies.filter(currency => currency.currency.toLowerCase().includes(query)));
      matches?.length === 1 ? setMatchItem(matches[0]) : setMatchItem(null);
      if(!matches?.length)return setSearchList(availableCurrencies);
      setSearchList(matches)
  }

  const createWallet = async () => {

      setLoader(true)
      
      const newWallet = await coinsendaServices.createWallet({...matchItem, currency:capitalizeWord(matchItem?.currency)});
    //   capitalizeWord()
      if (!newWallet) {
        setLoader(false)
        return toastMessage("Error al crear la billetera...", "error");
      }
      await coinsendaServices.getWalletsByUser();
      const { account } = newWallet;
      console.log(account)
      debugger
      const dep_prov = await coinsendaServices.createAndInsertDepositProvider(account);



      if (!dep_prov) {
        setLoader(false)
        return toastMessage("Error al crear el proveedor de deposito de la billetera...", "error");
      }
      let msg = `Nueva wallet ${account?.currency?.currency} creada!`;
      toastMessage(msg, "success");
      actions.success_sound();
      actions.renderModal(null);
      setLoader(false)
      return history.push(`/wallets/deposit/${account.id}`);
  };


  useEffect(() => {
      if(availableCurrencies && !loader){
          console.log(availableCurrencies)
          setSearchList(availableCurrencies)
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableCurrencies])


  return(
        <>
                {
                  searchList?.length ? 
                    <>
                        <h1 className="fuente">Crea una billetera</h1>
                        <InputForm 
                            autoFocus
                            type="text" 
                            placeholder={`Ej: Litecoin`}
                            name="walletCurrency"
                            value={value}
                            handleChange={handleChange}
                            label={`Elige la moneda de la billetera que deseas crear`}
                            state={matchItem ? 'good' : 'other'}
                            AuxComponent={[
                                () => (<TagItem item={matchItem} deleteTag={loadDefaultState}/>)
                            ]}
                        />
                        <ListContainer>
                            {
                                searchList?.length && searchList.map((item, index) => {
                                    return <ItemLayout
                                                actualizarEstado={selectItem}
                                                {...item}
                                                key={index}
                                                className="itemSelection"
                                                actives={matchItem}
                                            />
                                })
                            }
                        </ListContainer>

                        <ButtonContainer>
                            <ControlButton
                                id={idSubmitButton}
                                loader={loader}
                                formValidate={matchItem}
                                label="Crear"
                                handleAction={createWallet}
                            />
                        </ButtonContainer>
                    </>
                    :
                    <WalletSkeleton/>
                }   
         </>                 
  )

}

export default NewWalletComponent

