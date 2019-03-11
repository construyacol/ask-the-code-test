import React, { Component, Fragment } from 'react'

const ActivityFilters = props => {

  const {
    filter,
    currentFilter,
    filterChange,
    toggleFilter
  } = props

  return(
    <section className="ALFilterSect">

      <div className="ALfiltros fuente" style={{height:filter?'45px':'0px'}}>
        {/* <p id="activity" className={`ALitemFill ${currentFilter === 'all' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="activity" className="fas fa-globe-africa"></i>
          Todo
        </p> */}

        <p id="deposits" className={`ALitemFill ${currentFilter === 'deposits' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="deposits" className="fas fa-arrow-down"></i>
          Depositos
        </p>
        <p id="withdrawals" className={`ALitemFill ${currentFilter === 'withdrawals' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="withdrawals" className="fas fa-arrow-up"></i>
          Retiros
        </p>
        <p id="swaps" className={`ALitemFill ${currentFilter === 'swaps' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="swaps" className="fas fa-retweet"></i>
          Intercambios
        </p>
      </div>

      <div className={` ALif2 ALitemFill ${filter ? 'ALactive' : ''}`} onClick={toggleFilter}>
        <div className="ALif2ItemAll" style={{top:filter ? '-100%' : '0%'}}>

            <div className="ALif2Item currentFill" >
              <i className="fas fa-filter"></i>
              <p>{currentFilter.toUpperCase()}</p>
            </div>

            <div className="ALif2Item" >
              <i className="fas fa-filter"></i>
              <p>VER</p>
            </div>

        </div>
      </div>

    </section>
  )

}

export default ActivityFilters
