import React from "react";
import SimpleLoader from "./";

const LoaderTrade = (props) => {
  const { label } = props;

  return (
    <div className="LoaderTrade">
      <div className="LoaderTradeContent">
        <div className="LoaderTradeBack opaci"></div>

        <SimpleLoader label={label} />
      </div>
    </div>
  );
};

export default LoaderTrade;
