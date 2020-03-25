import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
// import SimpleLoader from '../../widgets/loaders'
import ActivityList from '../../widgets/activityList/activity'
import { scroller } from 'react-scroll'
import ActivityFilters from '../../widgets/activityList/filters'
import LoaderActivity from '../../widgets/activityList/order_item'

import './wallet_views.css'


const ActivityView = props => {

  const { params } = props.match

  const redirect = (activity_list) =>{
    // console.log('|||||||||||||||||||||| ====== ActivityView ======> ', activity_list, activity_list && !activity_list.length)
    if((activity_list && activity_list.length)){return false}
      props.action.mensaje('Esta cuenta aún no tiene actividad')
      props.history.push(`/${params.primary_path}/deposit/${params.account_id}`)
  }

  const redirect_activity = async(path) => {
    // alert('redirect_activity')
    props.action.current_section_params({currentFilter:path})
    return props.history.push(`/${params.primary_path}/activity/${params.account_id}/${path}`)
  }


  const get_activity = async(method) => {
    // const method = `get_${path}`
    let activity = []
    const { activity_for_account } = props
    const { account_id } = params



    if(method !== 'get_deposits'){
      if(activity_for_account[account_id] && (activity_for_account[account_id].deposits && activity_for_account[account_id].deposits.length)){return redirect_activity('deposits')}
      if(!activity_for_account[account_id] || (activity_for_account[account_id] && !activity_for_account[account_id].deposits)){
        // alert('get_deposits')
        activity = await props.action.get_deposits(account_id)
        if(activity.length){return props.history.push(`/${params.primary_path}/activity/${params.account_id}/deposits`)}
      }
    }

    if(method !== 'get_withdraws'){
        if(activity_for_account[account_id] && (activity_for_account[account_id].withdraws && activity_for_account[account_id].withdraws.length)){return redirect_activity('withdraws')}
          if(!activity_for_account[account_id] || (activity_for_account[account_id] && !activity_for_account[account_id].withdraws)){
          // alert('get_withdraws')
          activity = await props.action.get_withdraws(params.account_id)
          if(activity.length){return props.history.push(`/${params.primary_path}/activity/${params.account_id}/withdraws`)}
        }
    }

    if(method !== 'get_swaps'){
          if(activity_for_account[account_id] && (activity_for_account[account_id].swaps && activity_for_account[account_id].swaps.length)){return redirect_activity('swaps')}
            if(!activity_for_account[account_id] || (activity_for_account[account_id] && !activity_for_account[account_id].swaps)){
            // alert('get_swaps')
            activity = await props.action.get_swaps(params.account_id)
            if(activity.length){return props.history.push(`/${params.primary_path}/activity/${params.account_id}/swaps`)}
          }
    }

    return redirect(activity)
  }

  useEffect(()=>{
    if(!props.order_list || !props.order_list.length){
      const init_activity = async() =>{
        let method = `get_${params.tx_path}`
        // const { activity_for_account } = props
        // console.log('||||||||||| get_METHOD =====> ||||  ', activity_for_account[params.account_id], (activity_for_account[params.account_id] && activity_for_account[params.account_id][params.tx_path]) && !activity_for_account[params.account_id][params.tx_path].length)
        // if((activity_for_account[params.account_id] && activity_for_account[params.account_id][params.tx_path]) && !activity_for_account[params.account_id][params.tx_path].length){return redirect(props[params.tx_path])}
        let activity_list = await props.action[method](params.account_id)
        // console.log('|||||||||||||||||||||| ====== ActivityView ======> ', activity_list, method)
        if(!activity_list.length){
          get_activity(method)
        }
      }
      init_activity()
    }
  }, [params.tx_path])

  useEffect(()=>{
    scroller.scrollTo('firstInsideContainer', {
      duration: 0,
      smooth: true,
      offset: -55,
      containerId: 'containerElement'
    })
  }, [])

  return(
    <div className="ActivityView">
      <ActivityFilters/>
    {
      !props.order_list ?
      // <div className="contLoaderAct" >
      //   <SimpleLoader
      //     label="Cargando Actividad..."
      //   />
      // </div>
      <LoaderActivity/>
      :
      // <LoaderActivity/>
         <ActivityList
           activity={props.order_list}
           {...props}
         />
    }
    </div>
  )

}



function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}



function mapStateToProps(state, props){

  const { swaps, withdraws, deposits } = state.modelData
  const { activity_for_account } = state.storage
  const { params } = props.match

  return{
    order_list:activity_for_account[params.account_id] && activity_for_account[params.account_id][params.tx_path],
    activity_for_account,
    swaps,
    withdraws,
    deposits
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (ActivityView)
