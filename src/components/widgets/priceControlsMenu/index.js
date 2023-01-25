import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import Button from 'components/widgets/buttons/button'
import { MdOutlineShowChart } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import IconSwitch from 'components/widgets/icons/iconSwitch'
import {
    HoverControl,
    ControlsContainer,
    CurrencyListContainer,
    CurrencyList,
    CurrencyItem,
    SwitchControls
} from './styles'

const PriceControlContainer = ({ actions, local_collections, state }) => {

    const [ currentIndex, setCurrentIndex ] = useState(0)

    const showPrices = async () => {
        const module = await import("../prices");
        if(!module)return;
        const PricesModal = module.default
        actions.renderModal(PricesModal);
    };

    const previousCurrency = () => {
        if(currentIndex < 1)return;
        setCurrentIndex(prevState => prevState - 1)
        actions.searchCurrentPairAction(local_collections[currentIndex - 1]?.buy_pair, "pair")
    } 

    const nextCurrency = () => {
        if(currentIndex >= (local_collections?.length - 1))return;
        setCurrentIndex(prevState => prevState + 1)
        actions.searchCurrentPairAction(local_collections[currentIndex + 1]?.buy_pair, "pair")
    } 

    useEffect(() => {
        if(state?.currencyLabel && !isEmpty(local_collections)){
            let currencyIndex = local_collections.findIndex(item => item.primaryShortName === state?.currencyLabel)
            setCurrentIndex(currencyIndex >= 0 ? currencyIndex : 0)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.currencyLabel])


    return(
        <HoverControl>
                <ControlsContainer>
                    <Button  
                        size="small"
                        className="button__prices--show-prices"
                        onClick={showPrices}
                    >
                        <MdOutlineShowChart />
                        Ver precios
                    </Button>
                    <CurrencyListContainer>
                        <CurrencyList height={local_collections?.length} position={currentIndex}>
                            {   
                                !isEmpty(local_collections) &&
                                local_collections.map((localCurrency, index) => {
                                    return(
                                        <CurrencyItem key={index}>
                                            <IconSwitch
                                                icon={localCurrency?.primaryShortName?.toLocaleLowerCase()}
                                                size={18}
                                            />
                                            <p>{localCurrency.primaryShortName}</p>
                                        </CurrencyItem>
                                    )
                                })
                            }
                        </CurrencyList>
                    </CurrencyListContainer>
                    <SwitchControls>
                        <Button  
                            disabled={currentIndex < 1 ? true : false}
                            size="small"
                            className={`button__prices--switch-price ${currentIndex < 1 ? 'disabled' : ''}`}
                            onClick={previousCurrency}
                        >
                            <IoIosArrowUp />
                        </Button>
                        <Button  
                            disabled={currentIndex >= (local_collections?.length - 1) ? true : false}
                            size="small"
                            className="button__prices--switch-price"
                            onClick={nextCurrency}
                        >
                            <IoIosArrowDown />
                        </Button>
                    </SwitchControls>
                </ControlsContainer>
            </HoverControl>
    )

}

export default PriceControlContainer




