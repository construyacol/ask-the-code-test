import React, { useEffect } from 'react';
import { getAllUrlParams } from "utils/urlUtils";
import { history } from 'const/const'

type ComponentType<P = {}> = React.ComponentType<P>;

type HocType = <P extends object>(
  Component: ComponentType<P>
) => React.FC<P>;

const withdrawQrHoc: HocType = (Component) => (props:any) => {

   const { withdrawProviders } = props;

   // useEffect(() => {
   //    if(history.location.search){
   //       const params = getAllUrlParams(history.location.search)
   //       console.log('paramsFromWithdraw', params)
   //       if(params?.address && params?.network === withdrawProviders?.current?.provider_type)setAddressValue(params?.address?.replace(" ", "+"))
   //    }
   // // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [withdrawProviders])

   useEffect(() => {
    if(history.location.search){
      const params = getAllUrlParams(history.location.search)
      console.log('withdrawQrHoc', params)
      // if(params.network && networks[params.network]) toggleNetwork(params.network);
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [history.location.search])

   return <Component {...props} />;
};

export default withdrawQrHoc;

// export default function kycHoc(AsComponent) {
//   return function (props) {
//     return (
//       <AsComponent
//         {...props}
//       />
//     );
//   };
// }
 