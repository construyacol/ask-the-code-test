import React, { Component, Fragment } from 'react'
import btcoin from '../../assets/btc.webp'
import person2 from '../../assets/person2.png'
import person1 from '../../assets/person1.png'
import gift from '../../assets/gift.png'
import InputForm from '../widgets/inputs'
import { ButtonForms } from '../widgets/buttons/buttons'


class CreateReferralLink extends Component {

  state = {
    createLink:false
  }

  creatingLink = async(e) => {
    const { value } = e.target
    let res = await this.refCodeIsValid(value)
    return this.setState({createLink:res, ref_code:res ? value : null})
  }


    refCodeIsValid = (ref_code) =>{
      let min_length = ref_code.length > 5;
      let max_length = ref_code.length < 21;
      let alphanumeric = /^[a-z0-9]+$/i.test(ref_code);
      return min_length && max_length && alphanumeric;
    }


    send_ref_code = () =>{
      return this.props.createLink(this.state.ref_code)
    }


  render(){

    const { createLink } = this.state

    return(
      <Fragment>

        <div className="referralImg">
          <img id="btcAward" src={btcoin} alt=""/>
          <img id="person1" src={person1} alt=""/>
          <img id="person2" src={person2} alt=""/>
          <img id="gift" className="jello-horizontal" src={gift} alt=""/>
        </div>

        <div className="formControl">
          <InputForm
            placeholder={`Ej. minuevocodigoreferido`}
            actualizarEstado={this.creatingLink}
            active={createLink}
          />

          <ButtonForms
            siguiente={this.send_ref_code}
            type="primary"
            active={createLink}
            >
            Crear link
          </ButtonForms>
        </div>

      </Fragment>
    )
  }
}


export default CreateReferralLink
