import React, { useEffect, useState, Component  } from 'react'
import available_countries from '../../api/ui/implemented_countries/countries.json'
import { objectToArray, matchItem } from '../../../services'
import ScrollMagic from 'scrollmagic'
import SAmerica from '../../widgets/maps/sAmerica'
import IconSwitch from '../../widgets/icons/iconSwitch'
import ActiveItem from '../../widgets/items/active_item'

const controller = new ScrollMagic.Controller();

class SelectCountryLanding extends Component{


  state = {
    disabled:true,
    available_countries:null,
    available_country_list:null,
  }

  action_loader = (payload) =>{
    // this.props.action.Loader(payload)
    // this.setState({disabled:false})
    // console.log('AAAAAA||||||||| ==========================>  available_countries', available_countries)
  }



  componentDidMount(){

    this.load_countries()

    let colombia = new ScrollMagic.Scene({
          triggerElement: ".layerStickyTriggerCountry1",
          triggerHook:0.05,
          duration: "100px"
      })
      .addTo(controller);

      colombia.on("enter", async(event) => {
        if(this.props.current_country === 'colombia'){return false}
        await this.props.country_change('colombia')
        this.update_country(this.props.current_country)
      })
  //


    let peru = new ScrollMagic.Scene({
          triggerElement: ".layerStickyTriggerCountry2",
          triggerHook:0.05,
          duration: "100px"
      })
      .addTo(controller);

      peru.on("enter", async(event) => {
        if(this.props.current_country === 'peru'){return false}
        await this.props.country_change('peru')
        this.update_country(this.props.current_country)
      })



    let ecuador = new ScrollMagic.Scene({
          triggerElement: ".layerStickyTriggerCountry3",
          triggerHook:0.05,
          duration: "100px"
      })
      .addTo(controller);

      ecuador.on("enter", async(event) => {
        if(this.props.current_country === 'ecuador'){return false}
        await this.props.country_change('ecuador')
        this.update_country(this.props.current_country)
      })
  //
  //
    let argentina = new ScrollMagic.Scene({
          triggerElement: ".layerStickyTriggerCountry4",
          triggerHook:0.05,
          duration: "100px"
      })
      .addTo(controller);

      argentina.on("enter", async(event) => {
        if(this.props.current_country === 'argentina'){return false}
        await this.props.country_change('argentina')
        this.update_country(this.props.current_country)
      })
  //
  let chile = new ScrollMagic.Scene({
        triggerElement: ".layerStickyTriggerCountry5",
        triggerHook:0.05,
        duration: "100px"
    })
    .addTo(controller);

    chile.on("enter", async(event) => {
      if(this.props.current_country === 'chile'){return false}
      await this.props.country_change('chile')
      this.update_country(this.props.current_country)
    })
  //
  //
  // let brazil = new ScrollMagic.Scene({
  //       triggerElement: ".layerStickyTriggerCountry6",
  //       triggerHook:0.05,
  //       duration: "100px"
  //   })
  //   .addTo(controller);
  //
  //   brazil.on("enter", async(event) => {
  //     if(this.props.current_country === 'brazil'){return false}
  //     await this.props.country_change('brazil')
  //     this.update_country(this.props.current_country)
  //   })



  }
    //
    // init_component = () =>{
    //   const quePasaMani = await objectToArray(available_countries)
    //   console.log('AAAAAA||||||||| ==========================>  available_countries', quePasaMani)
    // }
    //
    load_countries = async() =>{

      const country_list = await objectToArray(available_countries)
      return this.setState({
        available_countries:available_countries,
        available_country_list:country_list
      })
    }


    update_country = async(value) =>{
      const { available_country_list } = this.state
      let match = await matchItem(available_country_list, {primary:value}, 'value')
      if(match && match.length === 1){
        //Si hay una coincidencia con la busqueda simulamos el click en el país de coincidencia
        this.setState({country_match:match[0]})
        this.simulate_click(document.getElementById(`${match[0].value}`), 'click');
      }
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



export const CountryList = props =>{



  const [ countryList, setCountryList ] = useState([])

  useEffect(()=>{

    const load_countries = async() =>{
      const country_list = await objectToArray(available_countries)
      setCountryList(country_list)


      // return this.setState({
      //   available_countries:available_countries,
      //   available_country_list:country_list
      // })
    }

    load_countries()

  }, [])

  let movil = window.innerWidth<768

  return(
    <div className="CurrencyList">
      <h1 className="fuente titleCurrencyList">Seguimos creciendo para tí con operaciones en:</h1>
    <div className="currencyListCont">
      {
        countryList.map((country)=>{
          return (
            <div key={country.value} className={`currencyListItem ${country.value === props.current_country ? 'active' : ''} `} >
               <IconSwitch
                 icon={country.value}
                 size={30}
               />

               <div className="textCurrencyList">
                 <p className="fuente" >{country.ui_name}</p>
                 <div className={`currencyStatus ${country.value === props.current_country ? 'active' : ''} ${movil ? 'active' : ''}`}>

                   {
                     (country.value === 'colombia' ||
                      country.value === 'peru') ?
                     <p className="fuente implementedCurrency">
                       <i className="fas fa-check"></i>
                       Disponible
                     </p>
                     :
                     <p className="fuente implementedCurrency No">
                       <i className="far fa-clock"></i>
                       Proximamente
                     </p>
                   }


                 </div>
               </div>

               <div className={`conteActiveItem ${country.value === props.current_country ? 'active' : ''} `}>
                 <ActiveItem/>
               </div>

             </div>
          )
        })
      }
    </div>
  </div>
  )


}





export default SelectCountryLanding
