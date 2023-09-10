import { useMemo } from "react";
const useTruncatedAddress = (account:String) => {
  const truncated = useMemo(() => truncatedString(account), [account])
  return truncated;
};
export const truncatedString = (account:String, amount:number = 10) => `${account?.substr(0, amount)}...${account?.substr(-amount)}`
export default useTruncatedAddress;
