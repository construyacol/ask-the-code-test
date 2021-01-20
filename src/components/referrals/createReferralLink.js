import React, { useState } from "react";
import btcoin from "../../assets/btc.webp";
import person2 from "../../assets/person2.png";
import person1 from "../../assets/person1.png";
import gift from "../../assets/gift.png";
import InputForm from "../widgets/inputs/inputForm";
import ControlButton from "../widgets/buttons/controlButton";

import styled from 'styled-components'


// class CreateReferralLink extends Component {
const CreateReferralLink = () => {

  // const [ ref_code, set_ref_code ] = useState(null)

  const creatingLink = async (e) => {
    // const { value } = e.target;
    // let codeIsValid = await refCodeIsValid(value);
    // return this.setState({ ref_code: codeIsValid ? value : null });
  };

  // const refCodeIsValid = (ref_code) => {
  //   let min_length = ref_code.length > 5;
  //   let max_length = ref_code.length < 21;
  //   let alphanumeric = /^[a-z0-9]+$/i.test(ref_code);
  //   return min_length && max_length && alphanumeric;
  // };

  // const send_ref_code = () => {
  //   return this.props.createLink(this.state.ref_code);
  // };

    // const { createLink } = this.state;

    const [ isValidCode, setIsValidCode ] = useState('bad')
    console.log('|||||| isValidCode', isValidCode)

    return (
      <>
        {/* <div className="referralImg">
          <img id="btcAward" src={btcoin} alt="" height="200px" />
          <img id="person1" src={person1} alt="" height="200px" />
          <img id="person2" src={person2} alt="" height="200px" />
          <img id="gift" className="jello-horizontal" src={gift} alt="" height="200px"/>
        </div> */}
      <InputContainer>
        <InputForm
          className="setRefCode"
          type="text"
          placeholder={`Ej. miCodigoReferido`}
          name="ref_code"
          autoFocus
          handleStatus={setIsValidCode}
          // handleChange={handleChangeAmount}
          label={`Crea tu código de referido`}
          // disabled={loader}
          // state={amountState}
          // value={amountValue}
          // SuffixComponent={({ id }) => (
          //   <AvailableBalance
          //     id={id}
          //     handleAction={handleMaxAvailable}
          //     amount={balance.available}
          //   />
          // )}
          // PrefixComponent
        />
      </InputContainer>
        {/* <InputForm placeholder={`Ej. miCodigoReferido`} actualizarEstado={this.creatingLink} active={createLink}/> */}

        {/* <div className="formControl"> */}
          {/* <ButtonForms
            // siguiente={this.send_ref_code}
            type="primary"
            active={isValidCode === 'good'}
          >
            Crear link
          </ButtonForms> */}

          <ControlButton
            // id={idForClickeableElement}
            // loader={loader}
            // handleAction={handleSubmit}
            formValidate={isValidCode === 'good'}
            label="Crear link de referido"
          />
        {/* </div> */}
      </>
    );
}

export default CreateReferralLink;


const InputContainer = styled.section`
  width: 100%;
  display: grid;
  align-items: center;
  justify-items:center;

  .setRefCode{
    width: 100%;
    max-width: 550px;
  }
`
