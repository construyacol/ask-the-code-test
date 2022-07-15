import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { current_section_params } from "../../../actions/uiActions";
import SelectList from '../selectList'
import { WALLET_FILTER_LIST, WITHDRAW_ACCOUNT_FILTER_LIST } from '../../../const/const'


import { device } from 'const/const'
import styled from 'styled-components'


const ALFilterSect = styled.section`
  display: flex;
  &.relativePos{
    position: relative;
    z-index: 1; 
  }
  &.stickyPos{
    position: sticky;
    z-index: 3;
  }

`

const ALfiltros = styled.div`
  width: calc(100%);
  height: 45px;
  /*background: #8080801a;*/
  transition: 0.3s;
  border-radius: 6px;
  display: flex;
  align-items: center;
  /*padding: 0 12px;*/
  background: linear-gradient(to right, #e7e7e7b0, #f1f1f1b0, white);
  justify-content: flex-start;
  backdrop-filter: blur(7px);

  p{
    color: var(--paragraph_color);
  }

  @media ${device.mobile} {
    justify-content: space-between;
  }

`

const ALif2Item = styled.div`
  display: flex;
  align-items: center;
  width: 110px;
  justify-items: center;
  justify-content: center;
  color: gray;
  column-gap: 10px;
  margin-right: 10px;
  margin-left: 15px;
  p{
    margin: 0;
  }

`



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
    const mainMenuHeight = document.querySelector('.MenuSuperiorLayout')?.clientHeight
    const accountTitle = document.querySelector('.accountDetailTitle')?.clientHeight
    const totalHeight = subMenuHeight + mainMenuHeight + accountTitle - 12
    FilterElement.current.style.top = `${totalHeight}px`
  }, [])


  let movil_viewport = window.innerWidth < 768;

  const selectListData = props.view !== "withdraw_accounts" ? WALLET_FILTER_LIST : WITHDRAW_ACCOUNT_FILTER_LIST
  

  return (
    <ALFilterSect ref={FilterElement} className={`ALFilterSect ${movil_viewport ? 'stickyPos' : ''}`}>
      <ALfiltros
        className="ALfiltros fuente"
        style={{ height: filter ? "45px" : "0px" }}
      >
        <ALif2Item className="ALif2Item" style={{ fontSize: movil_viewport ? "12px" : "14px" }}>
            <i className="fas fa-filter"></i>
            <p className="fuente">Historial de:</p>
        </ALif2Item>
        <SelectList
        actionHandle={filterChange}
        list={selectListData}
        selectedItem={currentFilter}
        />
      </ALfiltros>
    </ALFilterSect>
  );
};

const mapStateToProps = (state) => {
  const { currentFilter } = state.ui.current_section.params;

  return {
    currentFilter,
  };
};

export default withRouter(connect(mapStateToProps)(ActivityFilters));
