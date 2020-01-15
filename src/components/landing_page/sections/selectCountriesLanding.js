import React, { Component  } from 'react'
import available_countries from '../../api/ui/implemented_countries/countries.json'
import SAmerica from '../../widgets/maps/sAmerica'

class SelectCountryLanding extends Component{


  state = {
    disabled:true,
  }

  action_loader = (payload) =>{
    // this.props.action.Loader(payload)
    // this.setState({disabled:false})
  }


  componentDidMount(){
    setTimeout(()=>{
      this.update_country('peru')
    }, 2000)
  }


    update_country = async(value) =>{
        this.simulate_click(document.getElementById(`${value}`), 'click');
      }

    simulate_click = (el, etype) =>{
      // Función para simular click sobre el elemento (path country)
      if(!el){return false}
      if (el.fireEvent) {
        el.fireEvent('on' + etype);
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }

    render(){

      const {
        disabled
      } = this.state



      return(
          <div className={`SamericaContainer ${!disabled ? 'enableMap' : ''}`} >
            <div className="blocker" style={{display:'initial'}}></div>
              <SAmerica
                width="100%"
                height="100%"
                action_loader={this.action_loader}
                available_countries={available_countries}
              />
          </div>
      )
    }


}




export default SelectCountryLanding
