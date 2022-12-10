import { useMemo } from "react";

const useTruncatedAddress = (account:String) => {
  const truncated = useMemo(
    () => `${account?.substr(0, 15)}...${account?.substr(-10)}`,
    [account]
  );

  return truncated;
};

export default useTruncatedAddress;