import React, { useEffect } from 'react';
import { getAllUrlParams } from "utils/urlUtils";
import { history } from 'const/const'

type ComponentType<P = {}> = React.ComponentType<P>;

type HocType = <P extends object>(
  Component: ComponentType<P>
) => React.FC<P>;

const withdrawQrHoc: HocType = (Component) => (props:any) => {
  const { withdrawProviders, setNetworkProvider, setAddressValue } = props;
  useEffect(() => {
    if(history.location.search){
        const params = getAllUrlParams(history.location.search)
        if(params?.address && params?.network === withdrawProviders?.current?.provider_type)setAddressValue(params?.address?.replace(" ", "+"))
        setTimeout(() => history.push(history.location.pathname), 1000) //PARTIAL FIX FOR ADDRESS CHANGE
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawProviders])

  useEffect(() => {
    if(history.location.search){
      const params = getAllUrlParams(history.location.search)
      if((params?.network && withdrawProviders?.providers) && withdrawProviders?.providers[params?.network])setNetworkProvider((prevState:any) => ({...prevState, current: withdrawProviders?.providers[params?.network]}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search])


  return <Component {...props} />;
};

export default withdrawQrHoc;

 