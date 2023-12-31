import React, { useEffect } from "react";
import loadable from "@loadable/component";
import { useItemsInteractions } from "../../../hooks/useNavigationKeyActions";
import { InputKeyActionHandler } from "../accountList/styles";
import { getCdnPath } from '../../../environment'
import { CURRENCY_INDEX_IMG } from 'core/config/currencies'
import './items.css'
import { parseSymbolCurrency } from 'core/config/currencies'

const IconSwitch = loadable(() => import("../icons/iconSwitch"));

let timerId;
function NewItemsLayout(props) {
  const {
    type,
    actives,
    name,
    code,
    placeholder,
    primarySelect,
    format,
    itemType,
    pair_id,
    actualizarEstado,
    handleClick,
    specialMode = false,
    classNames
  } = props;

  const doSelectionForItem = () => {
    if(timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      actualizarEstado && actualizarEstado(pair_id);
    }, 100);
  };
  const _handleClick = specialMode ? doSelectionForItem : handleClick;
  const [isSelected, setFocus] = useItemsInteractions(
    {...props, uniqid: pair_id},
    { suprKeyAction: () => false, enterKeyAction: _handleClick },
    false
  );

  useEffect(() => {
    specialMode && actives && setFocus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!specialMode && isSelected && !actives) {
      doSelectionForItem(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, actives]);

  const _activated = specialMode ? isSelected : actives;


  return (
    <div
      id={`${primarySelect ? "primarySelect" : ""}`}
      className={`${classNames} ${type === "payment_method" ? "ILtuvieja" : ""} `}
    >
      <InputKeyActionHandler
        aria-label="itemFromList"
        name="itemFromList"
        autoComplete="off"
        id={props.focusedId}
      />
      <div
        className={`item ${_activated ? "itemSelection" : ""}`}
        onClick={!actives || itemType === "banks" ? doSelectionForItem : null}
      >
        {!format && code && type ? (
          type === "coins" ||
          type === "payment_method" ||
          type === "service_mode" ? (
            _activated ? (
              <div title={name} id={code}>
                <img
                  className="itemSobre activaos"
                  src={`${getCdnPath('assets')}${type}/${CURRENCY_INDEX_IMG[code] || code}2.png`}
                  alt=""
                  width="60"
                />
              </div>
            ) : (
              <div title={name} id={code}>
              
                <img
                  className="itemFuera"
                  src={`${getCdnPath('assets')}${type}/${CURRENCY_INDEX_IMG[code] || code}.png`}
                  width="60"
                  alt=""
                  id={code}
                  title={name}
                />
                <img
                  className="itemSobre"
                  src={`${getCdnPath('assets')}${type}/${CURRENCY_INDEX_IMG[code] || code}2.png`}
                  width="60"
                  alt=""
                  id={code}
                  title={name}
                />
              </div>
            )
          ) : (
            <img
              className={`banquis ${_activated ? "itemVisible" : ""}`}
              src={`${getCdnPath('assets')}${type}/${CURRENCY_INDEX_IMG[code] || code}.png`}
              alt=""
              id={code}
              title={name}
              width="85"
            />
          )
        ) : (
          <IconSwitch icon={code} size={45} />
        )}
        {primarySelect ? (
          <div id="primarySelectText" className="primarySelectText">
            <p className="title-deposit-fiat_ fuente" title={name}>{name}</p>
            {placeholder &&
              placeholder.map((item) => {
                return (
                  <p className="fuente item-type-tx" key={item.id}>
                    {item.name}
                  </p>
                );
              })}
          </div>
        ) : (
          <p title={name}>{(code && parseSymbolCurrency(code)?.toUpperCase()) || name}</p>
        )}
      </div>
      {placeholder && !primarySelect && (
        <div className="placeHoldCont">
          {placeholder.map((item) => {
            return (
              <p className="ILplaceholder fuente" key={item.id}>
                {item.name}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default React.memo(NewItemsLayout);
