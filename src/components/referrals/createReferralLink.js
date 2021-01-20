import React, { useState } from "react";
// import btcoin from "../../assets/btc.webp";
// import person2 from "../../assets/person2.png";
// import person1 from "../../assets/person1.png";
// import gift from "../../assets/gift.png";
import InputForm from "../widgets/inputs/inputForm";
import ControlButton from "../widgets/buttons/controlButton";
import useKeyActionAsClick from "../../hooks/useKeyActionAsClick";
import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import useToastMessage from "../../hooks/useToastMessage";

import styled from 'styled-components'

const CreateReferralLink = () => {

  const [ toastMessage ] = useToastMessage();
  const [ loader, setLoader ] = useState(false)
  const [coinsendaServices] = useCoinsendaServices();
  const [ isValidCode, setIsValidCode ] = useState('bad')
  const idForClickeableElement = useKeyActionAsClick(true, "create-referral-button", 13, false, "onkeyup");

  const setRefCode = async() => {
    setLoader(true)
    const form = new FormData(document.getElementById('refCodeForm'))
    let ref_code = form.get('ref_code')
    const res = await coinsendaServices.setReferralCode(ref_code);
    toastMessage(
      `${!res ? 'No se pudo crear el link de referido' : 'Link de referido creado satisfactoriamente'}`,
      `${!res ? 'error' : 'success'}`
    )
    setLoader(false)
  };


  //   <div className="referralImg">
  //   <img id="btcAward" src={btcoin} alt="" height="200px" />
  //   <img id="person1" src={person1} alt="" height="200px" />
  //   <img id="person2" src={person2} alt="" height="200px" />
  //   <img id="gift" className="jello-horizontal" src={gift} alt="" height="200px"/>
  // </div>
    return (
      <RefCodeForm
        id="refCodeForm"
        >
          <InputForm
            className="setRefCode"
            type="text"
            placeholder={`Ej. miCodigoReferido`}
            name="ref_code"
            autoFocus
            handleStatus={setIsValidCode}
            // handleChange={handleChangeAmount}
            label={`Crea tu link de referido`}
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

        <ControlButton
          id={idForClickeableElement}
          handleAction={setRefCode}
          loader={loader}
          formValidate={isValidCode === 'good'}
          label="Crear link de referido"
        />
      </RefCodeForm>
    );
}

export default CreateReferralLink;

const RefCodeForm = styled.form`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items:center;

  .setRefCode{
    width: 100%;
    max-width: 550px;
  }
`

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
