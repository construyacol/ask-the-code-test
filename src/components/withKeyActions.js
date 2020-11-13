import React from "react";
import useKeyActionAsClick from "../hooks/useKeyActionAsClick";

export default function withKeyActions(AsComponent) {
  return function (props) {
    const idCancel = useKeyActionAsClick(
      true,
      `cancel-button-${props.eventName}`,
      8,
      true,
      props.eventName,
      true
    );
    const idAccept = useKeyActionAsClick(
      true,
      `accept-button-${props.eventName}`,
      13,
      false,
      props.eventName,
      true
    );

    return <AsComponent idCancel={idCancel} idAccept={idAccept} {...props} />;
  };
}
