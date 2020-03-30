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

function LoaderAplication(props) {
  const [country, setCountry] = useState('colombia')
  const [progressBarWidth, setProgressBarWidth] = useState(0)
  const [anim, setAnim] = useState('in')
  const previousLoadLabel = usePrevious(props.appLoadLabel)

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
    const { authData, actions } = props
    const {
      userToken,
      userId,
      doLogout
    } = authData

    let profile = await actions.get_profile(userId, userToken)
    if (!profile) {
      if (!newCountry) { return setCountry(null) }
      profile = await actions.add_new_profile(newCountry, userToken)
      actions.isAppLoading(false)
    }

    if (!profile || (!profile.countries[country] && !profile.countries[newCountry])) { return false }


    if (!country && !newCountry) { return false }
    let userCountry = newCountry ? newCountry : country

    let res = await actions.countryvalidators()

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

    await actions.loadFirstEschema()

    let user = await actions.get_user(userToken, userCountry, profile.userId, authData.email, profile.restore_id)
    if (!user) { return false }
    let userData = {
      ...user.entities.user[user.result],
      userToken: userToken
    }

    await actions.updateUser(userData)
    await props.actions.logged_in(true)

    await actions.inicializarClasses(userCountry, doLogout)

    let get_withdraw_providers = await actions.get_withdraw_providers(props.user)
    await actions.get_withdraw_accounts(userData, get_withdraw_providers)

    let verification_state = await actions.get_verification_state()

    if (verification_state !== 'accepted') {
      await props.actions.AddNotification('security', null, 1)
      await props.history.push('/security')
      return actions.ready_to_play(true)
    }

    await props.history.push('/wallets')
    return actions.ready_to_play(true)

  }

  const prepareCountrySelection = async () => {
    await animation('out')
    setCountry(null)
    setProgressBarWidth(0)
    await animation('in')
  }

  const selectCountry = (newCountry) => {
    props.actions.isAppLoading(true)
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
    initComponent()
    registerColors()
  }, [])

  useEffect(() => {
    if (previousLoadLabel === props.appLoadLabel) {
      setProgressBarWidth(progressBarWidth + 8)
    }
  }, [props.appLoadLabel])

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
            <p className="fuente">{props.appLoadLabel}</p>
          </div>
      }
      <div className="KycprogressBar loader">
        <div className="kycPropgressed" style={{ width: `${progressBarWidth}%` }}></div>
      </div>
    </div>

  )
}

function mapStateToProps(state) {

  const { user, wallets, all_pairs, authData } = state.modelData
  // const { loader } = state.isLoading

  const { loggedIn } = state.auth

  return {
    appLoadLabel: state.isLoading.appLoadLabel,
    user: user,
    wallets,
    all_pairs,
    loggedIn,
    authData
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoaderAplication))
