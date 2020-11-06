import localForage from "localforage";
import { COINSENDA_URL } from "../const/const";

export function isValidToken(createAt) {
  const initialDate = createAt.getTime();
  var endDate = new Date().getTime();
  var diff = (endDate - initialDate) / (1000 * 60);
  return !(parseInt(diff) >= 150);
}

export const doLogout = async () => {
  await localForage.removeItem("user_token");
  await localForage.removeItem("created_at");
  if (window.reactSnap && process.env.NODE_ENV === "production") return;
  window.location.href = COINSENDA_URL;
};
