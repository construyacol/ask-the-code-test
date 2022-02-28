import { useState, useEffect } from 'react'
import styled from 'styled-components'
import OtherModalLayout from '../../widgets/modal/otherModalLayout'
import { IconClose } from "../../widgets/shared-styles";
import { useActions } from '../../../hooks/useActions'
import InputForm from "../../widgets/inputs/inputForm";
import ControlButton from "../../widgets/buttons/controlButton";
import { device, history } from '../../../const/const'
import useAvailableWalletCreator from "../../hooks/useAvailableWalletCreator";
import ItemLayout from "../../widgets/items/itemLayout";
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick';
import TagItem from './tagItem'
import { useSelector } from "react-redux";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import useToastMessage from "../../../hooks/useToastMessage";
import { Option } from './skeleton'
import { OnlySkeletonAnimation } from '../../widgets/loaders/skeleton'

const NewWalletComponent = props => {
    
    const actions = useActions();
    const [ availableCurrencies ] = useAvailableWalletCreator();
    const [ searchList, setSearchList ] = useState()
    const [ matchItem, setMatchItem ] = useState(null)
    const [ loader, setLoader ] = useState(null)
    const { user } = useSelector((state) => state.modelData);
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
    
    const closeModal = (e, forceClose) => {
        if (e && (e.target.dataset.close_modal || forceClose)) {
          actions.renderModal(null);
        }
    }

    const selectItem = (query) => {
        // applys when there are 2 or more currencies with the same nomenclature for example: bitcoin - bitcoin_testnet, matched over the currency clicked
        const uniqueMatch = availableCurrencies.filter(currency => currency.currency.toLowerCase() === query);
        searchMatch(query?.toLowerCase(), uniqueMatch)
    }

    const handleChange = (inputName, query) => {
        searchMatch(query?.toLowerCase())
    }

    const loadDefaultState = () => {
        setMatchItem(null)
        setSearchList(availableCurrencies)
        document.querySelector("[name='walletCurrency']").value = ""
    }
 
    const searchMatch = (query, uniqueMatch) => {
        if(!searchList?.length) return;
        const matches = uniqueMatch || availableCurrencies.filter(currency => currency.currency.toLowerCase().includes(query));
        matches?.length === 1 ? setMatchItem(matches[0]) : setMatchItem(null);
        if(!matches?.length)return setSearchList(availableCurrencies);
        setSearchList(matches)
    }

    const createWallet = async () => {
        setLoader(true)
        const currency = matchItem
        const body = {
            data: {
                name: `Mi billetera ${currency?.currency}`,
                description: "description",
                country: user?.country,
                enabled: true,
                currency: currency.short_currency
            },
        };
        const newWallet = await coinsendaServices.createWallet(body);
        if (!newWallet) {
            return toastMessage("Error al crear la billetera...", "error");
        }
        await coinsendaServices.getWalletsByUser();
        const { account } = newWallet;
        const dep_prov = await coinsendaServices.createAndInsertDepositProvider(
          account
        );
        if (!dep_prov) {
          return toastMessage("Error al crear el proveedor de deposito de la billetera...", "error");
        }
        let msg = `Nueva wallet ${account?.currency?.currency} creada!`;
        toastMessage(msg, "success");
        actions.success_sound();
        actions.renderModal(null);
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
        <OtherModalLayout 
        className="fullScreen"
        on_click={closeModal}
        > 
            <IconClose theme="dark" top={15} right={20} />
            <Layout>
                <Content>
                    {
                        availableCurrencies ? 
                        <>
                            <h1 className="fuente">Crea una billetera</h1>
                            <InputForm 
                                autoFocus
                                type="text" 
                                placeholder={`Ej: Litecoin`}
                                name="walletCurrency"
                                // handleStatus={setAmountState}
                                handleChange={handleChange}
                                label={`Elige la moneda de la billetera que deseas crear`}
                                disabled={!searchList?.length}
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
                </Content>
            </Layout>
        </OtherModalLayout>
    )
}

export default NewWalletComponent


const WalletSkeleton = props => {

    return(
        <>
            <h1 className="fuente skeleton">Crea una billetera</h1>
            <InputForm skeleton />
            <ListContainer className="skeleton">
                <Option/>
                <Option/>
          </ListContainer>
        </>
    )

}


const ButtonContainer = styled.div`
    height:80px;
    display: flex;
    place-content: center;
`

const ListContainer = styled.div`
    display: grid;
    overflow-y: scroll;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    grid-template-rows: repeat(auto-fill, 150px);
    column-gap: 15px;
    row-gap: 15px;
    padding:25px 0;
    height:calc(100% - 50px);

    &.skeleton{
        ${Option}{
            ${OnlySkeletonAnimation}
        }
    }

    &::-webkit-scrollbar {
        width: 7px;
    }

    &::-webkit-scrollbar-thumb {
        background: #475a681f;
    }

    .__itemContainerL__ .item:hover{
        transform: scale(1) !important;
    }

    @media ${device.tablet} {

        padding:25px 0;


        .__itemContainerL__{
            display: grid;
            justify-items: center;
        }

        .__itemContainerL__ .item, ${Option}{
            width:160px;
            height:140px;
        }
        
    }
`

const Content = styled.div`

    max-width:580px;
    height: calc(100% - 50px);
    width: calc(100% - 50px);
    padding: 25px;
    display:grid;
    grid-template-rows:auto auto 1fr auto;
    row-gap:20px;

    h1{
        color:var(--title1);
        font-size:1.5em;
        text-align:center;
    }

    @media ${device.tablet} {
        h1{
           margin-bottom:0;
        }
        height: calc(100% - 40px);
        width: calc(100% - 40px);
        padding: 20px;
    }

`

const Layout = styled.section`
    width:100vw;
    height:100vh;
    background:white;
    display:flex;
    background:white;
    position:absolute;
    top:0;
    left:0;
    display: flex;
    place-content: center;
`

