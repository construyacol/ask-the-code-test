
const initialState = {
  form_kyc_basic: {
    step: 1,
  },
  form_kyc_financial: {
    step: 1,
  },
  form_kyc_advanced: {
    newback: null,
    newfront: null,
    newselfie: null,
    base64: {
      newfront: null,
      newback: null,
      newselfie: null,
    },
    step: 1,
  },
  form_deposit: {
    type_currency: "",
    currency: "bitcoin",
    short_currency_name: "",
    short_bank_name: "",
    amount: "",
    deposit_way: "bankaccount",
    deposit_service: "",
    service_mode: "",
    cost_id: "otros_medios",
    step: 1,
  },
  form_withdraw: {
    amount: "",
    account_from: "",
    withdraw_provider: "",
    withdraw_account: "",
    step: 1,
  },
  form_bank: {
    type: "bank",
    name: "",
    bank_name: "",
    surname: "",
    owner_id: "",
    account_name: "",
    account_type: "",
    account_number: "",
    withdraw_way: "bankaccount",
    step: 2,
  },
  form_wallet: {
    id: "",
    type: "wallet",
    name: "",
    currency: "",
    address: "",
    short_currency_name: "",
    step: 1,
  },
  form_ticket: {
    state: null,
    step: 1,
  },
  form_control_bank: false,
  form_control_wallet: false,
  form_control_deposit: false,
  isModalVisible: false,
  modalView: "modalView",
  search_deposit: [],
  search_bank: [],
  search_coin: [],
  current: "",
  globalStep: 0,
};

const forms = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default forms;
