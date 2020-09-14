import React, { useEffect, Fragment } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import SimpleLoader from '../widgets/loaders'
import { security_center } from '../api/ui/settings.json'
import ItemSettingsInit from '../widgets/itemSettings/'
import { scroller } from 'react-scroll'
import { useCoinsendaServices } from '../../services/useCoinsendaServices'
import { useActions } from '../../hooks/useActions'


const SecurityCenter = props => {


  const [ coinsendaServices ] = useCoinsendaServices()
  const actions = useActions()

  const validate_state = () => {
    if (props.verification_state !== 'accepted') {
      scroller.scrollTo('firstInsideContainer', {
        offset: 220,
        duration: 1,
        smooth: true,
        containerId: 'containerElement'
      })
      coinsendaServices.freshChatShowTags(['verify'], 'article')
    }
  }


  useEffect(()=>{
    validate_state()
    return () => {
      actions.default_video_state()
    }
  }, [])


    // console.log('SECURITY_CENTER::::', this.props)
    return (
      <Fragment>
        <DetailContainerLayout
          title="Centro de seguridad"
          {...props}
        >
          {
            props.loader ?
              <SimpleLoader
                label="Obteniendo configuraciones"
              />
              :
              security_center &&
              <ItemSettingsInit data={security_center} />
          }

          {/* {
          security_center &&
          <ItemSettingsInit data={security_center} />
        } */}
        </DetailContainerLayout>
      </Fragment>
    )
}

function mapStateToProps(state, props) {
  const { user } = state.modelData
  const { verification_state } = state.ui

  return {
    user: user,
    loader: state.isLoading.loader,
    verification_state
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(SecurityCenter)
