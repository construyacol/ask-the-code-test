import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
// import SimpleLoader from '../../widgets/loaders'
import ActivityList from '../../widgets/activityList/activity'
import { scroller } from 'react-scroll'
import ActivityFilters from '../../widgets/activityList/filters'
import { LoaderView } from '../../widgets/activityList/order_item'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'


import './wallet_views.css'
import useToastMessage from '../../../hooks/useToastMessage'



const ActivityView = props => {

  const { params } = props.match
  const [ loader, setLoader ] = useState(false)
  const [coinsendaServices] = useCoinsendaServices()
  const [ toastMessage ] = useToastMessage()



  const redirect = (activity_list) => {
    // console.log('|||||||||||||||||||||| ====== ActivityView ======> ', activity_list, activity_list && !activity_list.length)
    if ((activity_list && activity_list.length)) { return false }
    toastMessage('Esta cuenta aún no tiene actividad')
    props.history.push(`/${params.primary_path}/deposit/${params.account_id}`)
  }

  const redirect_activity = async (path) => {
    // alert('redirect_activity')
    props.action.current_section_params({ currentFilter: path })
    return props.history.push(`/${params.primary_path}/activity/${params.account_id}/${path}`)
  }


  const get_activity = async (method) => {
    // const method = `get_${path}`
    let activity = []
    const { activity_for_account } = props
    const { account_id } = params

    if (method !== 'get_deposits') {
      if (activity_for_account[account_id] && (activity_for_account[account_id].deposits && activity_for_account[account_id].deposits.length)) { return redirect_activity('deposits') }
      if (!activity_for_account[account_id] || (activity_for_account[account_id] && !activity_for_account[account_id].deposits)) {
        // alert('get_deposits')
        activity = await coinsendaServices.get_deposits(account_id)
        if (activity.length) { return props.history.push(`/${params.primary_path}/activity/${params.account_id}/deposits`) }
      }
    }

    if (method !== 'get_withdraws') {
      if (activity_for_account[account_id] && (activity_for_account[account_id].withdraws && activity_for_account[account_id].withdraws.length)) { return redirect_activity('withdraws') }
      if (!activity_for_account[account_id] || (activity_for_account[account_id] && !activity_for_account[account_id].withdraws)) {
        // alert('get_withdraws')
        activity = await coinsendaServices.get_withdraws(params.account_id)
        if (activity.length) { return props.history.push(`/${params.primary_path}/activity/${params.account_id}/withdraws`) }
      }
    }

    if (method !== 'get_swaps') {
      if (activity_for_account[account_id] && (activity_for_account[account_id].swaps && activity_for_account[account_id].swaps.length)) { return redirect_activity('swaps') }
      if (!activity_for_account[account_id] || (activity_for_account[account_id] && !activity_for_account[account_id].swaps)) {
        // alert('get_swaps')
        activity = await coinsendaServices.get_swaps(params.account_id)
        if (activity.length) { return props.history.push(`/${params.primary_path}/activity/${params.account_id}/swaps`) }
      }
    }

    return redirect(activity)
  }



  useEffect(() => {
    if (!props.order_list || !props.order_list.length) {
      // console.log(props.order_list, props[params.tx_path])
      const init_activity = async () => {
        setLoader(true)
        if(params.primary_path === 'withdraw_accounts'){
          await coinsendaServices.get_withdraws_by_withdraw_account(params.account_id)
        }else{
          let method = `get_${params.tx_path}`
          let activity_list = await coinsendaServices[method](params.account_id)
          if (!activity_list.length) {
            toastMessage(`Esta billetera no tiene ${getTxPath(params.tx_path)}`, 'error')
            get_activity(method)
          }
        }
        setLoader(false)
      }
      init_activity()
    }
  }, [params.tx_path])

  // useEffect(() => {
  //   window.requestAnimationFrame(() => {
  //     scroller.scrollTo('firstInsideContainer', {
  //       duration: 0,
  //       smooth: true,
  //       containerId: 'containerElement',
  //       offset: -20
  //     })
  //   })
  // }, [])

  return (
    <div className="ActivityView">
      <ActivityFilters view={params.primary_path}/>
      {
        (loader || !props.order_list) ?
          <LoaderView />
          :
          <ActivityList
            activity={props.order_list}
            getDefaultPair={coinsendaServices.getDefaultPair}
            {...props}
          />
      }
    </div>
  )

}



function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}



function mapStateToProps(state, props) {

  const { swaps, withdraws, deposits } = state.modelData
  const { loader } = state.isLoading
  const { activity_for_account } = state.storage
  const { params } = props.match

  return {
    order_list: activity_for_account[params.account_id] && activity_for_account[params.account_id][params.tx_path],
    activity_for_account,
    swaps,
    withdraws,
    deposits,
    loader
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ActivityView)




const getTxPath = tx_path => {
  return tx_path === 'swaps' ? 'Intercambios' : tx_path === 'deposits' ? 'Depositos' : 'Retiros'
}
