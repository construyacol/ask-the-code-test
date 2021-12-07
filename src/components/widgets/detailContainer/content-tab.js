import React, { useRef, useEffect, useState } from "react";
import loadable from "@loadable/component";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { navigation_components } from "../../api/ui/api.json";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";

import "./detailContainer.css";

const IconSwitch = loadable(() => import("../icons/iconSwitch"));

// TODO: refactor this component
function ContentTab(props) {
  const navState = useRef({
    current: "",
    next: "",
    prev: "",
  });

  const {
    title,
    current_section,
    current_wallet,
    pathname,
    primary_path,
    wallets,
  } = props;

  const { params } = current_section;
  const tabRef = useRef();
  const [haveMenu, setHaveMenu] = useState(false);
  const [menuItems, setMenuItems] = useState(navigation_components.wallets.items_menu);

  const movil_viewport = window.innerWidth < 768;

  useEffect(() => {
    if (primary_path && navigation_components[primary_path]) {
      setMenuItems(navigation_components[primary_path].items_menu);
    }
  }, [primary_path]);

  useEffect(() => {
    if (menuItems && pathname) {
      const currentIndex = menuItems.findIndex((item) => item.link === pathname);
      const current = menuItems[currentIndex].link;
      const next = menuItems[currentIndex + 1] && menuItems[currentIndex + 1].link;
      const prev = menuItems[currentIndex - 1] && menuItems[currentIndex - 1].link;
      navState.current = { current, next, prev };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // useEffect(() => {
  //     window.requestAnimationFrame(() => {
  //         tabRef.current.scrollIntoView({ block: "start", behavior: "smooth" })
  //     })
  // }, [title, path])

  useEffect(() => {
    const haveBalances = wallets[current_wallet] && (wallets[current_wallet].count > 0 || wallets[current_wallet].available > 0);
    const condition = primary_path === "wallets" ? haveBalances && menuItems : menuItems;
    setHaveMenu(condition ? menuItems.length > 0 : pathname !== 'deposit' ? true : false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current_wallet, menuItems, primary_path, wallets]);

  const getLink = (link) => {
    return `/${primary_path}/${link}/${current_wallet}${link === "activity" ? `/${params.currentFilter}` : ""}`;
  };

  const goPrev = () => {
    const el = document.getElementById(`${navState.current.prev}-menu-button`);
    el && el.click();
  };

  const goNext = () => {
    const el = document.getElementById(`${navState.current.next}-menu-button`);
    el && el.click();
  };

  const backButtonId = useKeyActionAsClick(true, "back-button-content-tab", 8, true, "onkeyup");
  const idNext = useKeyActionAsClick(true, "id-next-button", 39, true, "onkeyup");
  const idPrev = useKeyActionAsClick(true, "id-prev-button", 37, true, "onkeyup");

  const controlProps = { goNext, goPrev, idNext, idPrev };

  return (
    <div className="subMenu" ref={tabRef}>
      {haveMenu && pathname && <HiddenButtons {...controlProps} />}
      <div className="menuContainer">
        <div
          className="itemsMenu fuente"
          style={{ display: !pathname ? "none" : "grid" }}
        >
          {haveMenu ? (
            menuItems.map((item, index) => {
              // console.log('||||||||||||||||| |||||||||||||||| ||||||||||||||| |||||||||||||| |||||||||||||     ContentTab', menuItems)
              if (
                (item.link === "activity" ||
                  item.link === "withdraw" ||
                  item.link === "swap") &&
                primary_path === "wallets" &&
                wallets[current_wallet] &&
                wallets[current_wallet].count === 0
              ) {
                return null;
              }
              return (
                <NavLink
                  key={index}
                  id={`${item.link}-menu-button`}
                  to={getLink(item.link)}
                  className={`menuItem ${
                    pathname === item.link ? "active" : ""
                  }`}
                >
                  <div
                    className={`menuMovilIcon ${
                      pathname === item.link ? "active" : ""
                    }`}
                  >
                    <IconSwitch size={20} icon={item.link} color="#14b3f0" />
                  </div>
                  <p>{item.title}</p>
                </NavLink>
              );
            })
          ) : (
            <NavLink to={"#"} className="menuItem active">
              <div className={`menuMovilIcon active`}>
                <IconSwitch size={20} icon={"deposit"} color="#14b3f0" />
              </div>
              <p>Depositar</p>
            </NavLink>
          )}
        </div>

        {!movil_viewport && (
          <Link
            id={backButtonId}
            to={primary_path === "wallets" ? "/wallets" : "/withdraw_accounts"}
            className="DCBack"
            style={{ display: pathname ? "" : "none" }}
          >
            <i className="fas fa-arrow-left"></i>
            <p>Volver</p>
          </Link>
        )}

        <div
          className={`DCTitle ${primary_path} ${movil_viewport ? "movil" : ""}`}
          style={{ display: pathname ? "none" : "" }}
        >
          {movil_viewport ? (
            <MovilMenu primary_path={primary_path} />
          ) : (
            <p className="fuente">{title}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const HiddenButtons = ({ goNext, goPrev, idNext, idPrev }) => (
  <div style={{ width: 0, height: 0, opacity: 0 }}>
    <button id={idPrev} onClick={goPrev}>
      goPrev
    </button>
    <button id={idNext} onClick={goNext}>
      goNext
    </button>
  </div>
);

const MovilMenu = ({ primary_path }) => {
  const dataMenu = [
    {
      key: "wallets",
      ui_text: "Billeteras",
    },
    {
      key: "withdraw_accounts",
      ui_text: "Ctas retiros",
    },
    {
      key: "referral",
      ui_text: "Referidos",
    },
    {
      key: "security",
      ui_text: "Seguridad",
    },
  ];

  return (
    <>
      {dataMenu.map((itemMenu, indx) => {
        const isActive = primary_path === itemMenu.key;
        return (
          <Link
            to={`/${itemMenu.key}`}
            className={`menuItem movil ${isActive ? "active" : ""}`}
            key={indx}
          >
            <IconSwitch
              size={20}
              icon={itemMenu.key}
              color={`${isActive ? "#14b3f0" : "gray"}`}
            />
            <div className={`menuMovilIcon ${isActive ? "active" : ""}`}>
              <p className="fuente">{itemMenu.ui_text}</p>
            </div>
          </Link>
        );
      })}
    </>
  );
};

function mapStateToProps(state, props) {
  let account_opts = {};
  if (props.match) {
    const { path, account_id } = props.match.params;
    account_opts = {
      current_wallet: account_id,
      pathname: path,
    };
  }

  return {
    current_section: state.ui.current_section,
    path: props.match.params.path || null,
    wallets: state.modelData.wallets,
    ...account_opts,
  };
}

export default connect(mapStateToProps)(ContentTab);
