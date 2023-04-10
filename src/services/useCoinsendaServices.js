import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainService } from "./MainService";
import actions from "../actions";
import { useParams } from "react-router-dom";

export const useCoinsendaServices = () => {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const params = useParams();
  const account_id = params?.account_id

  mainService.initialize(
    dispatch,
    reduxState, 
    reduxState.modelData.authData.userToken
  );

  useEffect(() => {
    mainService.setGlobalState(reduxState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState.modelData]);

  return [
    mainService,
    {
      ...reduxState,
      current_wallet:reduxState.modelData.wallets && reduxState.modelData.wallets[account_id],
    },
    actions,
    dispatch,
  ];
};
