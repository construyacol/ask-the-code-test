import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import SimpleLoader from "../../widgets/loaders";
import convertCurrencies from "../../../utils/convert_currency";
import OtherModalLayoutPairs from "../../widgets/modal/otherModalLayoutPairs";
import useNavigationKeyActions from "../../../hooks/useNavigationKeyActions";
import NewItemsLayout from "../../widgets/items/new-items-layout";
import { useSelector } from "react-redux";
import { selectWithConvertToObjectWithCustomIndex } from 'hooks/useTxState.js'
import { replaceToCurrency } from "core/config/currencies"



export const PairList = (props) => {
  const [allPairs, setAllPairs] = useState(null);
  const [loaderMsg] = useState("Cargando Pares");
  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))

  const [setCurrentSelection] = useNavigationKeyActions({
    items: allPairs,
    loader: props.loader,
    uniqueIdForElement: "pair-item-",
    modalRestriction: false,
    default: -1,
  });

  const closeModal = props.action.toggleOtherModal;

  useEffect(() => {
    !allPairs && props.allPairs && setAllPairs(props.allPairs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.allPairs]);

  const selectQuote = async (pair_id) => {
    const { currentWallet } = props;
    props.action.isAppLoading(true);
    const data = await convertCurrencies(currentWallet.currency, "1", pair_id);
    props.action.isAppLoading(false);
    props.action.toggleOtherModal();

    if (data) {
      const { to_spend_currency, pair_id } = data;
      await props.action.pairsForAccount(currentWallet.id, {
        current_pair: { 
          pair_id: pair_id,
          currency: to_spend_currency,
          currency_value: data.want_to_spend,
        },
      });
    }
  };

  const { currentWallet, currentPair, loader } = props;
  const currencySymbol = currencies ? currencies[currentWallet?.currency]?.symbol : currentWallet?.currency?.toUpperCase()

  return (
    <OtherModalLayoutPairs
      title={`Cambiar ${replaceToCurrency({currency:currencySymbol})} a:`}
      close_modal={closeModal}
    >
      <div className="PairListFind"></div>
      <div className="PairListItems">

        {allPairs && !loader ? (
          allPairs.map((pair, index) => {
            if(!pair) return null;
            return (
              <NewItemsLayout
                setCurrentSelection={setCurrentSelection}
                focusedId={`pair-item-${index}`}
                number={index}
                handleClick={selectQuote}
                actives={
                  pair.type_currency === "fiat"
                    ? pair.code === currentPair.currency
                    : pair.name === currentPair.currency
                }
                actualizarEstado={selectQuote}
                {...pair}
                key={index}
                specialMode={true}
              />
            );
          })
        ) : (
          <div className="swapLoaderCont">
            <SimpleLoader label={loaderMsg} />
          </div>
        )}

      </div>
    </OtherModalLayoutPairs>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

function mapStateToProps(state, props) {
  const { wallets } = state.modelData;
  const { params } = props.match;
  const currentWallet = wallets[params.account_id];
  const { id, currency } = currentWallet;
  const currentPair =
    state.storage.pairsForAccount[id] &&
    state.storage.pairsForAccount[id].current_pair;
  const allPairs =
    state.storage.pairsForAccount[currency] &&
    state.storage.pairsForAccount[currency].all_pairs;
  return {
    currentWallet,
    allPairs,
    currentPair,
    loader: state.isLoading.loader,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PairList);
