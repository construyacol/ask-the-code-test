import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useObserver } from "hooks/useObserver";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import { useParams } from "react-router-dom";
import { LoaderItem } from "./order_item";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ loader, setLoader, activityLength, listKey }) => {

  const [show, setElement] = useObserver();
  const [ coinsendaServices, {storage: { activity_for_account }} ] = useCoinsendaServices();
  const { tx_path, account_id, primary_path } = useParams();
  const [availableActivity, setAvailableActivity] = useState(true);
  // const params = useParams()

  const getActivity = async () => {

    setLoader(true);
    const method =
      primary_path === "withdraw_accounts"
      ? "get_withdraws_by_withdraw_account"
      : listKey === 'referral'
      ? "get_referral_deposits"
      : `get_${tx_path}`;

      
      const skip = activityLength || (activity_for_account && activity_for_account[account_id] && activity_for_account[account_id][tx_path] && activity_for_account[account_id][tx_path].length);
  
      let activity = [];
      if (skip > 10) {
        activity = await coinsendaServices[method](account_id, 15, skip);
      }
      setLoader(false);
    if (!activity.length) {
      setAvailableActivity(false);
    }
  };

  useEffect(() => {
    if (show && availableActivity) {
      getActivity();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <>
      {!loader ? (
        <InfiniteScrollItem ref={setElement} />
      ) : (
        <InifiniteScrollContainer>
          <LoaderItem />
        </InifiniteScrollContainer>
      )}
    </>
  );
};

export const InifiniteScrollContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  height: 80px;
  display: grid;
  align-items: center;
  justify-items: center;
  &.lazy {
  }
`;

export const InfiniteScrollItem = styled.div`
  width: 100%;
  height: 20px;
`;
