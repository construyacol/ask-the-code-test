import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";


const selectActivityList = createSelector(
  ({ modelData:{ deposits } }) => deposits,
  (deposits) => {
    if(!deposits){ return [] }
    let activity = []
    Object.keys(deposits).forEach((deposit_id) => {
      deposits[deposit_id].info && deposits[deposit_id].info.is_referral && activity.push(deposits[deposit_id])
    })
    return activity
  }
);


const UseActivity = () => {

  const { primary_path } = useParams();
  const activity = useSelector((state) => selectActivityList(state));
  const [ activityList, setActivityList ] = useState([])

  useEffect(()=>{
    setActivityList(activity)
  }, [activity])

  return {
    activityList,
    setActivityList
  };

};

export default UseActivity;
