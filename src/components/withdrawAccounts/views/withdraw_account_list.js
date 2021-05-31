import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import AccountItemList from "../../widgets/account_item_list/accountItemList";
import { SimpleLoader } from "../../widgets/loaders";
import { withdrawProvidersByType, matchItem } from "../../../utils";
import "../WAccount.css";
import { createSelector } from "reselect";
import { useEffect } from "react";
import useNavigationKeyActions from "../../../hooks/useNavigationKeyActions";

function WithdrawAccountList(props) {
  const [withdrawAccounts, setWithdrawAccounts] = useState(null);
  const [preferentialAccounts, setPreferentialAccounts] = useState();
  const [setCurrentSelection] = useNavigationKeyActions({
    items: withdrawAccounts,
    loader: false,
    uniqueIdForElement: "withdrawAccountItem",
    modalRestriction: false,
    next: 40,
    prev: 38,
    default: 1,
    originalLength: true,
  });

  useEffect(() => {
    init();
  }, []);

  const find_units = (amount) => {
    // Este metodo me retorna la cantidad de ordenes en las que se ejecutaría el retiro
    let units = amount / 100;
    let limit = 2;

    for (let i = 0; i < limit; i++) {
      // console.log(`limite: ${limit} - - percent: ${amount} - - units:${units}`)
      if (units <= 1) {
        return (units = 1);
      }
      if (units <= limit) {
        return limit;
      }
      limit++;
    }
  };

  const init = async () => {
    const { withdrawProviders, withdraw_accounts, amount } = props;

    if (!withdrawProviders && !amount) {
      return false;
    }

    let providers_served = await withdrawProvidersByType(withdrawProviders);

    let final_withdraw_accounts = await withdraw_accounts.map((wa) => {
    let provider_max_amount = providers_served[wa.provider_type].provider.max_amount;
    let limit = (amount * 100) / provider_max_amount;

      return {
        ...wa,
        orders: find_units(parseInt(limit)),
        percent: parseInt(limit),
        limit: parseFloat(amount) >= parseFloat(providers_served[wa.provider_type].provider.max_amount) && true,
      };
    });
    // ------------------------------------------------------------------------
    // Este Fragmento de codigo sirve para detectar si hay cuentas de retiro que operen sobre la misma red bancaria o
    // transaccional del proveedor de retiro, definiendolas como cuentas preferenciales porque tienen un menor costo transaccional

    let preferential_accounts = [];
    await withdrawProviders.map(async (withdraw_provider) => {
      if (withdraw_provider.currency_type !== "fiat") {
        return false;
      }

      let result = await matchItem(
        final_withdraw_accounts,
        { primary: withdraw_provider.provider.name },
        "provider_name"
      );

      if (result && result.length > 0) {
        preferential_accounts.push(...result);
      }
    });

    if (preferential_accounts.length > 0) {
      let new_withdraw_list = [...preferential_accounts];
      // new_withdraw_list.push(preferential_accounts[0])

      await final_withdraw_accounts.map(async (wa) => {
        let matches = await matchItem(
          preferential_accounts,
          { primary: wa.id },
          "id"
        );
        if (!matches) {
          new_withdraw_list.push(wa);
        }
      });

      let preferential_account_id = await preferential_accounts.map(
        (p_account) => {
          return p_account.id;
        }
      );

      setWithdrawAccounts(new_withdraw_list);
      setPreferentialAccounts(preferential_account_id);
      return;
    }
    // ------------------------------------------------------------------
    // Si no hay cuentas preferenciales returnamos la lista original
    setWithdrawAccounts(final_withdraw_accounts);
  };

  const newAccount = () => {
    const { withdraw_flow, new_account_method } = props;
    if (withdraw_flow) {
      return new_account_method();
    }
  };

  console.log('|||||||||||||| withdrawAccounts ===> ', withdrawAccounts)

  return (
    <section className="WithdrawAccountList">
      <div className="seccionPrinWA">
        <AccountItemList
          setCurrentSelection={setCurrentSelection}
          number={0}
          focusedId={`withdrawAccountItem${0}`}
          action={newAccount}
          addElement={true}
        />
      </div>

      <div className="listWA">
        {withdrawAccounts ? (
          withdrawAccounts.map((account, id) => {
            return (
              <AccountItemList
                key={account.id}
                setCurrentSelection={setCurrentSelection}
                number={id + 1}
                focusedId={`withdrawAccountItem${id + 1}`}
                amount={props.amount}
                account={account}
                new_withdraw_order={props.new_withdraw_order}
                preferential_accounts={preferentialAccounts}
              />
            );
          })
        ) : (
          <SimpleLoader />
        )}
      </div>
    </section>
  );
}

const selectWithdrawAccountList = createSelector(
  (state) => state.modelData.withdraw_accounts,
  (state) => state.modelData.user,
  (_, props) => props,
  (withdraw_accounts, user, props) => {
    const { currency_type, inherit_account_list } = props;
    let withdraw_account_list = inherit_account_list;
    if (!withdraw_account_list) {
      // si no hay una lista heredada del componente padre entonces ejecute su propia consulta
      user.withdraw_accounts.map((account_id) => {
        if (
          withdraw_accounts[account_id].currency_type !== currency_type ||
          !withdraw_accounts[account_id].visible
        ) {
          return false;
        }
        return withdraw_account_list.push(withdraw_accounts[account_id]);
      });
    }

    return withdraw_account_list;
  }
);

function mapStateToProps(state, props) {
  return {
    withdraw_accounts: selectWithdrawAccountList(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithdrawAccountList);
