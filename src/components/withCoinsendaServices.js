import React from "react";
import { useCoinsendaServices } from "../services/useCoinsendaServices";
import useToastMessage from "../hooks/useToastMessage";

export default function withCoinsendaServices(AsComponent) {
  return function (props) {
    const [ coinsendaServices, globalState ] = useCoinsendaServices();
    const [toastMessage] = useToastMessage();
    return (
      <AsComponent
        toastMessage={toastMessage}
        coinsendaServices={coinsendaServices}
        globalState={globalState}
        {...props}
      />
    );
  };
}
