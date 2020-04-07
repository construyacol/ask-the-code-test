import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SelectCountry from '../maps/select_country/select_country'
import Coinsenda from '../icons/logos/coinsenda.js'
import IconSwitch from '../icons/iconSwitch'
import './loader.css'
import { withRouter } from 'react-router'
import usePrevious from '../../hooks/usePreviousValue'
import { useCoinsendaServices } from '../../../services/MainService'
import withHandleError from '../../withHandleError'

function LoaderAplication({ actions, history }) {

  const [country, setCountry] = useState('colombia')
  const [progressBarWidth, setProgressBarWidth] = useState(0)
  const [anim, setAnim] = useState('in')
  const [coinsendaServices, reduxState] = useCoinsendaServices()
  const { authData } = reduxState.modelData
  const { appLoadLabel } = reduxState.isLoading
  const previousLoadLabel = usePrevious(appLoadLabel)

  const registerColors = () => {
    if ((window && window.CSS) && window.CSS.registerProperty) {
      window.CSS.registerProperty({
        name: '--primary',
        syntax: '<color>',
        inherits: true,
        initialValue: '#014c7d',
      });
      window.CSS.registerProperty({
        name: '--secondary',
        syntax: '<color>',
        inherits: true,
        initialValue: '#0198ff',
      });
    }
  }

  const initComponent = async (newCountry) => {

    const {
      userToken,
      doLogout
    } = authData

    if (!userToken) return;

    let profile = await coinsendaServices.fetchUserProfile()
    if (!profile) {
      if (!newCountry) { return setCountry(null) }
      profile = await coinsendaServices.addNewProfile(newCountry)
    }

    if (!profile || (!profile.countries[country] && !profile.countries[newCountry])) { return false }

    if (!country && !newCountry) { return false }
    const userCountry = newCountry ? newCountry : country

    const res = await coinsendaServices.countryValidator()


    if (!res) {
      prepareCountrySelection()
      return doLogout()
    }

    // Verificamos que el país sea valido, si no, retornamos al componente para seleccionar país
    if (!res.countries[userCountry]) {
      prepareCountrySelection()
      return false
    }
    await animation('out')
    await setCountry(userCountry)
    await animation('in')

    await coinsendaServices.loadFirstEschema()

    const user = await coinsendaServices.fetchCompleteUserData(userCountry, profile.restore_id)
    if (!user) { return false }

    await actions.isLoggedInAction(true)

    await coinsendaServices.init(userCountry, doLogout)
    // return console.log('||||||||| stop')

    const verificationStatus = await coinsendaServices.getVerificationState()

    if (verificationStatus !== 'accepted') {
      await actions.addNotification('security', null, 1)
      await history.push('/security')
      return actions.isAppLoaded(true)
    }

    await history.push('/wallets')
    return actions.isAppLoaded(true)

  }

  const prepareCountrySelection = async () => {
    await animation('out')
    setCountry(null)
    setProgressBarWidth(0)
    await animation('in')
  }

  const selectCountry = (newCountry) => {
    actions.isAppLoading(true)
    initComponent(newCountry)
  }

  const animation = async (animation) => {
    return new Promise(async (resolve) => {
      setAnim(animation)
      setTimeout(() => {
        return resolve(true)
      }, 300)
    })
  }

  useEffect(() => {
    registerColors()
  }, [])

  useEffect(() => {
    initComponent()
  }, [authData.userToken])

  useEffect(() => {
    if (previousLoadLabel !== appLoadLabel) {
      setProgressBarWidth(progressBarWidth + 33)
    }
  }, [appLoadLabel])

  return (
    <div className={`LoaderAplication ${!country ? 'withOutContry' : ''}`}>
      {
        !country ?
          <div className={`LoaderAplication loaderLayout ${anim}`}>
            <SelectCountry
              select_country={selectCountry}
            />
          </div>
          :
          <div className={`LoaderContainer loaderLayout ${anim}`}>
            <IconSwitch icon={country} size={60} />

            <div className="logotypes">
              <Coinsenda size={50} color="white" />
              <h1 className="fuente">Coinsenda</h1>
            </div>
            <p className="fuente">{appLoadLabel}</p>
          </div>
      }
      <div className="KycprogressBar loader">
        <div className="kycPropgressed" style={{ width: `${progressBarWidth}%` }}></div>
      </div>
    </div>

  )
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}


export default withHandleError(connect(() => ({}), mapDispatchToProps)(withRouter(LoaderAplication)))
