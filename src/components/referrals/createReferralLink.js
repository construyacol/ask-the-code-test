import React, { useState } from "react";
// import btcoin from "../../assets/btc.webp";
// import person2 from "../../assets/person2.png";
// import person1 from "../../assets/person1.png";
// import gift from "../../assets/gift.png";
import InputForm from "../widgets/inputs/inputForm";
import ControlButton from "../widgets/buttons/controlButton";
import useKeyActionAsClick from "../../hooks/useKeyActionAsClick";
// import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import useToastMessage from "../../hooks/useToastMessage";
import styled from 'styled-components'
import referralImg from './assets/referral.png'
import { device } from '../../const/const'
import IconSwitch from '../widgets/icons/iconSwitch'
import useViewport from "../../hooks/useWindowSize";


const CreateReferralLink = (props) => {

  const [ toastMessage ] = useToastMessage();
  const [ loader, setLoader ] = useState(false)
  const { isMovilViewport } = useViewport();
  // const [coinsendaServices] = useCoinsendaServices();
  const [ isValidCode, setIsValidCode ] = useState('bad')
  const idForClickeableElement = useKeyActionAsClick(true, "create-referral-button", 13, false, "onkeyup");

  const setRefCode = async() => {
    setLoader(true)
    const form = new FormData(document.getElementById('refCodeForm'))
    let ref_code = form.get('ref_code')
    const res = await props.coinsendaServices.setReferralCode(ref_code.toLowerCase());
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
          <IconSwitch size={isMovilViewport ? 230 : 330} icon="createRefCode" />
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

        <ButtonContainer id="ButtonContainer">
          <ControlButton
            id={idForClickeableElement}
            handleAction={setRefCode}
            loader={loader}
            formValidate={isValidCode === 'good'}
            label="Crear link de referido"
          />
        </ButtonContainer>

      </RefCodeForm>
    );
}

export default CreateReferralLink;


const ButtonContainer = styled.div`
  position: absolute;
  height: 85px;
  bottom: 10px;
  display: grid;
  align-items: center;

    #controlsContainer{
      height: auto;
      padding: 12px 20px;
    }

    .botonForm, .disabledButton{
      height: 59px;
      padding: 0;
    }
    .disabledButton{
      height: 59px;
      padding: 0;
    }
`

const RefCodeForm = styled.form`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items:center;
  grid-row-gap:30px;

  img{
    align-self: center;
  }

  @media ${device.tabletL}{
    img{
      height: 200px;
    }
  }

  .setRefCode{
    width: 90%;
    max-width: 550px;
    align-self: baseline;
  }

  ${'' /* #controlsContainer{
    height: 85px;
    position: absolute;
    bottom: 10px;
  }

   */}



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
