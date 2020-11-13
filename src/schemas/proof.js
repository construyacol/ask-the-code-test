// import api from '../components/api'
import api from "../components/api";
import { normalize, schema } from "normalizr";

const referral = new schema.Entity("referrals");
const wallet = new schema.Entity("wallets");
const paymentMethod = new schema.Entity(
  "payment_methods",
  {},
  {
    processStrategy: (value, parent, key) => ({ ...value, user_id: parent.id }),
  }
); //el proccessStrategy es opcional, lo utilice en modo ilustrativo para heredar el id del padre(user) a cada elemento
const bankAccount = new schema.Entity("Bank_Accounts");
const order = new schema.Entity(
  "ordenes",
  {
    from: {
      wallet: wallet,
      payment_method: paymentMethod,
    },
    to: {
      wallet: wallet,
      bank_account: bankAccount,
    },
  },
  {
    processStrategy: (value, parent, key) => ({ ...value, user_id: parent.id }),
  }
);

const user = new schema.Entity("user", {
  referrals: {
    referrals_list: [referral],
  },
  address_book: [wallet],
  paymentMethods: [paymentMethod],
  bankAccounts: [bankAccount],
  wallets: [wallet],
  transaction_history: [order],
});

// const article = new schema.Entity('articles', {
//   author:user,
//   comments:new schema.Array(comment)
// })
//
// const user = { user: new schema.Array(level) }

const normalizedData = normalize(api, user);

export default normalizedData;
// export default api
