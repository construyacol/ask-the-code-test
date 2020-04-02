import React, { Component, Fragment } from 'react'
import SimpleLoader from '../../loaders'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../../actions'
import SAmerica from '../sAmerica'
import { InputCountry } from '../../inputs'
import { matchItem } from '../../../../services'

import './loader_app.css'

class SelectCountry extends Component {

  state = {
    available_countries:null,
    disabled:true,
    country_match:null
  }

  componentDidMount(){
    this.load_countries()
  }

  action_loader = (payload) =>{
    // this.props.action.isAppLoading(payload)
    this.setState({disabled:false})
  }

  load_countries = async() =>{
    // this.props.action.isAppLoading(true)
    let res = await this.props.action.countryvalidators()
    if(!res){return false}
    // console.log('||||| =====================================> SelectCountry', res)
    return this.setState({
      available_countries:res.countries,
      available_country_list:res.country_list,
    })
  }

  update_country = async(e, without_click) =>{
    // alert('update country')
    const { value } = e.target
    const { available_country_list } = this.state
    let match = await matchItem(available_country_list, {primary:value}, 'value')
    if(match && match.length === 1){
      //Si hay una coincidencia con la busqueda simulamos el click en el país de coincidencia
      this.setState({country_match:match[0]})

      if(!without_click){
        this.simulate_click(document.getElementById(`${match[0].value}`), 'click');
      }
    }
  }

  simulate_click = (el, etype) =>{
    // Función para simular click sobre el elemento (path country)
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  reset_data = () =>{
    this.simulate_click(document.getElementById(`${this.state.country_match.value}`), 'click');
    this.setState({country_match:null})
  }

  new_country_selected = () =>{
    const { value } = this.state.country_match
    this.props.select_country(value)
  }


  render(){

    const{
      appLoadLabel,
      loader
    } = this.props

    const{
      available_countries,
      country_match,
      disabled
    } = this.state


     // console.log('available_countries',available_countries)

    return(
      <Fragment>
        {
          available_countries ?
          <div className="selectCountry">
            <div className="LoaderAppTittle">
              <InputCountry
                country_match={country_match}
                update_country={this.update_country}
                reset_data={this.reset_data}
                loader={loader}
                disabled={disabled}
                handleSubmit={this.new_country_selected}
                active={country_match ? true : null}
              />
            </div>
            <div className={`SamericaContainer ${!disabled ? 'enableMap' : ''}`}>
              <div className="blocker" style={{display:country_match ? 'initial' : 'none'}}></div>
            <SAmerica
              width={900}
              height={768}
              action_loader={this.action_loader}
              available_countries={available_countries}
              select_country_component={this.update_country}
            />
            </div>
            <p></p>

          </div>
          :
          <SimpleLoader label={`${appLoadLabel}`} />
        }
      </Fragment>

    )
  }
}


function mapStateToProps(state, props){

  // console.log('||||||||| LOADEER STATE', state)
  const { user, wallets, all_pairs } = state.modelData
  const { loader } = state.isLoading

  return{
    appLoadLabel:state.isLoading.appLoadLabel,
    user:user,
    wallets,
    all_pairs,
    country:null,
    loader
    // country:'colombia'
  }
}


function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (SelectCountry)
