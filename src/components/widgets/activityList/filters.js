import React from 'react'

const ActivityFilters = props => {

  const {
    filter,
    currentFilter,
    filterChange,
    toggleFilter
  } = props

  let movil_viewport = window.innerWidth < 768

  return(
    <section className="ALFilterSect">

      <div className="ALfiltros fuente" style={{height:filter?'45px':'0px'}}>
        {/* <p id="activity" className={`ALitemFill ${currentFilter === 'all' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="activity" className="fas fa-globe-africa"></i>
          Todo
        </p> */}

        <p id="deposits" className={`ALitemFill ${currentFilter === 'deposits' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="deposits" className="fas fa-arrow-down"></i>
          {
            !movil_viewport &&
            'Depositos'
          }
        </p>
        <p id="withdrawals" className={`ALitemFill ${currentFilter === 'withdrawals' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="withdrawals" className="fas fa-arrow-up"></i>
          {
            !movil_viewport &&
            'Retiros'
          }
        </p>
        <p id="swaps" className={`ALitemFill ${currentFilter === 'swaps' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="swaps" className="fas fa-retweet"></i>
          {
            !movil_viewport &&
            'Cambios'
          }
        </p>
      </div>


        <div className={` ALif2 ALitemFill ${filter ? 'ALactive' : ''} ${movil_viewport ? 'movil' : ''}`} onClick={movil_viewport ? null : toggleFilter}>
          <div className="ALif2ItemAll" style={{top:filter ? '-100%' : '0%'}}>

              <div className="ALif2Item currentFill">
                <i className="fas fa-filter"></i>
                <p>{currentFilter.toUpperCase()}</p>
              </div>

              <div className="ALif2Item" style={{fontSize:movil_viewport ? '12px' : '14px'}}>
                <i className="fas fa-filter"></i>
                {
                  movil_viewport ?
                  <p>{currentFilter.toUpperCase()}</p>
                  :
                  <p>VER</p>
                }
              </div>

          </div>
        </div>




    </section>
  )

}

export default ActivityFilters
