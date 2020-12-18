import React from "react";
import loadable from "@loadable/component";
import "./loader.css";

const Coinsenda = loadable(() => import("../icons/logos/coinsenda"), {
  fallback: (
    <div
      style={{
        height: 50,
        width: 50,
        display: "block",
      }}
    />
  ),
});

function LoaderAplicationTiny() {
  return (
    <div className={`_LoaderAplication withOutContry`}>
      <div className={`LoaderContainer loaderLayout`}>
        <div
          style={{
            height: 70,
            width: 200,
            display: "grid",
          }}
        />

        <div className="logotypes">
          <Coinsenda size={50} color="white" />
          <h1 className="fuente">Coinsenda</h1>
        </div>
        <p className="fuente">Iniciando</p>
      </div>
      <div className="KycprogressBar loader">
        <div className="_kycPropgressed" style={{ width: 2 }}></div>
      </div>
    </div>
  );
}

export default LoaderAplicationTiny;
