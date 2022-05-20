import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { current_section_params } from "../../../actions/uiActions";
import SelectList from '../selectList'
import { WALLET_FILTER_LIST, WITHDRAW_ACCOUNT_FILTER_LIST } from '../../../const/const'


const ActivityFilters = (props) => {
  
  const { currentFilter } = props;

  // const [filter, setFilter] = useState(true);
  let filter = true
  const FilterElement = useRef()
  // const toggleFilter = () => {
  //   setFilter(!filter);
  // };

  const filterChange = async (e) => {
    let value = e.value;
    const { primary_path, account_id, path } = props.match.params;
    await props.dispatch(current_section_params({ currentFilter: value }));
    props.history.push(`/${primary_path}/${path}/${account_id}/${value}`);
  };

  useEffect(() => { 
    const subMenuHeight = document.querySelector('.subMenu')?.clientHeight
    const supMenuHeight = document.querySelector('.MenuSuperiorLayout')?.clientHeight
    const totalHeight = subMenuHeight + supMenuHeight + 10
    FilterElement.current.style.top = totalHeight
  }, [])


  let movil_viewport = window.innerWidth < 768;

  const selectListData = props.view !== "withdraw_accounts" ? WALLET_FILTER_LIST : WITHDRAW_ACCOUNT_FILTER_LIST
  

  return (
    <section ref={FilterElement} className={`ALFilterSect ${movil_viewport ? 'relativePos' : 'stickyPos'}`}>
      <div
        className="ALfiltros fuente"
        style={{ height: filter ? "45px" : "0px" }}
      >
        <div className="ALif2Item" style={{ fontSize: movil_viewport ? "12px" : "14px" }}>
            <i className="fas fa-filter"></i>
            <p className="fuente">Historial de:</p>
        </div>
        <SelectList
        actionHandle={filterChange}
        list={selectListData}
        selectedItem={currentFilter}
        />
      </div>

      {/* <div
        className={` ALif2 ALitemFill ${filter ? "ALactive" : ""} ${
          movil_viewport ? "movil" : ""
        }`}
      >
        <div className="ALif2ItemAll" style={{ top: filter ? "-100%" : "0%" }}>
          <div className="ALif2Item currentFill">
            <i className="fas fa-filter"></i>
            <p>{currentFilter && currentFilter.toUpperCase()}</p>
          </div>

          
        </div>
      </div> */}
    </section>
  );
};

const mapStateToProps = (state) => {
  const { currentFilter } = state.ui.current_section.params;

  return {
    currentFilter,
  };
};

export default withRouter(connect(mapStateToProps)(ActivityFilters));
