import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { current_section_params } from '../../../actions/uiActions'


const ActivityFilters = props => {

  const {
    currentFilter
  } = props

  const [ filter, setFilter ] = useState(true)

  const toggleFilter = () => {
    setFilter(!filter)
  }

  const filterChange = async(e) =>{
    let value = e.target.id
    const { primary_path, account_id, path } = props.match.params
    await props.dispatch(current_section_params({currentFilter:value}))
    props.history.push(`/${primary_path}/${path}/${account_id}/${value}`)
    // console.log('||||||||||||| FILTER CHANGE ==>', value, '= ||| = ',this.props)
  }

  let movil_viewport = window.innerWidth < 768
  // console.log('FILTERS COMPONENT =================> currentFilter ::', currentFilter, props)


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
        <p id="withdraws" className={`ALitemFill ${currentFilter === 'withdraws' ? 'ALactive' : ''}`} onClick={filterChange}>
          <i id="withdraws" className="fas fa-arrow-up"></i>
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
                <p>{currentFilter && currentFilter.toUpperCase()}</p>
              </div>

              <div className="ALif2Item" style={{fontSize:movil_viewport ? '12px' : '14px'}}>
                <i className="fas fa-filter"></i>
                {
                  movil_viewport ?
                  <p>{currentFilter && currentFilter.toUpperCase()}</p>
                  :
                  <p>VER</p>
                }
              </div>

          </div>
        </div>




    </section>
  )

}

const mapStateToProps = state => {

  const { currentFilter } = state.ui.current_section.params


  return{
    currentFilter
  }

}

export default withRouter(connect(mapStateToProps)(ActivityFilters))
