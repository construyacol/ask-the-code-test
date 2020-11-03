import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import ActivityList from "../../widgets/activityList/activity";
import ActivityFilters from "../../widgets/activityList/filters";
import { LoaderItem, LoaderView } from "../../widgets/activityList/order_item";

import "./wallet_views.css";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import useViewport from "../../../hooks/useWindowSize";
import useObserver from "../../../hooks/useObserver";
import { scroller } from "react-scroll";
import { InifiniteScrollContainer } from "../../widgets/activityList/infiniteScroll";

const ActivityView = (props) => {
  const { params } = props.match;
  const [loader, setLoader] = useState(true);
  const [coinsendaServices] = useCoinsendaServices();
  const { isMovilViewport } = useViewport();

  const [observer, setElements, entries] = useObserver({
    root: null,
    rootMargin: "0px",
    threshold: 0,
  });

  const items_ = useRef([]);
  const [showLoaderItems, setLoadingItems] = useState(true);
  const [page, setPage] = useState(0);

  const getItems = async () => {
    const res = await coinsendaServices.fetchActivityByAccount(
      params.account_id,
      page
    );
    items_.current = [...items_.current, ...res];
    res && setPage(page + 1);
    if (res.length < 10) {
      setLoadingItems(false);
    }
    setLoader(false);
  };

  const init = async () => {
    window.requestAnimationFrame(async () => {
      setLoadingItems(true);
      setPage(0);
      const elements = document.querySelectorAll(".lazy");
      setElements(elements);
    });
  };

  useEffect(() => {
    isMovilViewport &&
      window.requestAnimationFrame(() => {
        scroller.scrollTo("firstInsideContainer", {
          offset: -60,
          duration: 0,
          smooth: true,
          containerId: "containerElement",
        });
      });
    init();
  }, []);

  useEffect(() => {
    entries &&
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await getItems();
        }
        if (!showLoaderItems) observer.unobserve(entry.target);
      });
  }, [entries, observer]);

  return (
    <div className="ActivityView">
      <ActivityFilters view={params.primary_path} />
      {loader ? (
        <LoaderView />
      ) : (
        <ActivityList
          activity={items_.current}
          getDefaultPair={coinsendaServices.getDefaultPair}
          {...props}
        />
      )}
      {showLoaderItems && (
        <InifiniteScrollContainer
          style={{ opacity: `${loader ? "0" : "1"}` }}
          className="lazy"
        >
          <LoaderItem />
        </InifiniteScrollContainer>
      )}
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

function mapStateToProps(state, props) {
  const { loader } = state.isLoading;
  const { params } = props.match;
  const isWithdraws = params.primary_path === "withdraw_accounts";

  return {
    loader,
    isWithdraws,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityView);
