import { useState } from 'react'
import PriceControlContainer from 'components/widgets/priceControlsMenu'
import { 
    PriceContainer,
    LabelPrice,
    Hr
} from './styles'



export const DesktopPriceComponent = ({ state, actions, local_collections = [] }) => {

    return(
        <PriceContainer>   
            <PriceControlContainer
                actions={actions}
                local_collections={local_collections}
                state={state}
            />
            <LabelPrice className={`${!state.buy_price ? 'skeleton' : ''}`}>
                <p className="fuente">TE COMPRAMOS <strong>{state?.currencyLabel}</strong> A</p>
                <LabelPriceView 
                    price={state?.sell_price} 
                />
            </LabelPrice>
            <Hr/>
            <LabelPrice className={`${!state.buy_price ? 'skeleton' : ''}`}>
                <p className="fuente">TE VENDEMOS <strong>{state?.currencyLabel}</strong> A</p>
                <LabelPriceView 
                    price={state?.buy_price} 
                />
            </LabelPrice>
        </PriceContainer>
    )
} 


export const MovilPriceComponent = ({ state, actions }) => {

    const [ showBuyPrice ] = useState(false)

    const showPrices = async () => {
        const module = await import("../prices");
        if(!module)return;
        const PricesModal = module.default
        actions.renderModal(PricesModal);
        // setTimeout(() => props.closeMenu(), 500) 
      };

    return(
        <PriceContainer className="mobile" onClick={showPrices}>
            {
                showBuyPrice ? 
                <LabelPrice className={`${!state.buy_price ? 'skeleton' : ''}`}>
                    <p className="fuente">TE COMPRAMOS <strong>{state?.currencyLabel}</strong> A</p>
                    <LabelPriceView 
                        price={state?.sell_price} 
                    />
                </LabelPrice>
                :
                <LabelPrice className={`${!state.buy_price ? 'skeleton' : ''}`}>
                    <p className="fuente">TE VENDEMOS <strong>{state?.currencyLabel}</strong> A</p>
                    <LabelPriceView 
                        price={state?.buy_price} 
                    />
                </LabelPrice>
            }
        </PriceContainer>
    )
}


const LabelPriceView = ({ price }) => {
    return(
        <h3>${price || '---,---,---'}</h3>
    )
}



