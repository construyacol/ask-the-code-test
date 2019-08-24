import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../../widgets/loaders'
import ActivityList from '../../widgets/activityList'
import { scroller } from 'react-scroll'


class ActivityView extends Component{

  state = {
    activity:[]
  }


  componentDidMount(){
    this.props.initial(this.props.match.params.path, this.props.match.params.id)
    scroller.scrollTo('firstInsideContainer', {
      duration: 0,
      smooth: true,
      offset: -55,
      containerId: 'containerElement'
    })
  }

  componentWillReceiveProps(props){
    // const {
    //   swaps
    // } = props
    //
    // const {
    //   current_swaps
    // } = this.state
    //

  }

render(){

  const {
    current_wallet,
    wallets,
    all_pairs
  } = this.props

  // console.log('_______________________________________________ACTIVITY LIST', current_wallet, wallets, all_pairs)

  return(
    <Fragment>
    {
      // (!current_wallet || !wallets || !deposits && !swaps || !all_pairs) ?
      (!current_wallet || !wallets || !all_pairs) ?
      <SimpleLoader
        label="Cargando Actividad..."
      />
      :
          <ActivityList
            {...this.props}
          />
    }
    </Fragment>
  )
}
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}



function mapStateToProps(state, props){

  const { current_wallet } = state.ui.current_section.params
  const { user, user_id, wallets, withdrawals, deposits, swaps, activity, all_pairs } = state.model_data

  return{
    current_wallet:state.ui.current_section.params.current_wallet,
    local_currency:state.model_data.pairs.localCurrency,
    current_pair:!current_wallet ? null : (state.ui.current_section.params.pairs_for_account[current_wallet.id] && state.ui.current_section.params.pairs_for_account[current_wallet.id].current_pair),
    user:user[user_id],
    wallets,
    withdrawals,
    deposits,
    swaps,
    activity,
    all_pairs:all_pairs
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (ActivityView)
