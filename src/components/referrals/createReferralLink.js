import React, { useState } from "react";
// import btcoin from "../../assets/btc.webp";
// import person2 from "../../assets/person2.png";
// import person1 from "../../assets/person1.png";
// import gift from "../../assets/gift.png";
import InputForm from "../widgets/inputs/inputForm";
import ControlButton from "../widgets/buttons/controlButton";
import useKeyActionAsClick from "../../hooks/useKeyActionAsClick";
import useToastMessage from "../../hooks/useToastMessage";
import styled from 'styled-components'
// import referralImg from './assets/referral.png'
import { device } from '../../const/const'
import IconSwitch from '../widgets/icons/iconSwitch'
import useViewport from "../../hooks/useWindowSize";


const CreateReferralLink = (props) => {

  const [ toastMessage ] = useToastMessage();
  const [ loader, setLoader ] = useState(false);
  const { isMovilViewport } = useViewport();
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
  //  </div>

  const iconSize = isMovilViewport ? 220 : 330

    return (
      <RefCodeForm
        id="refCodeForm"
        >
        {
          isMovilViewport &&
          <IconSwitch size={iconSize} icon="createRefCode" />
        }
        <InputContainer>
            <InputForm
              className="setRefCode"
              type="text"
              placeholder={`Ej: miCodigoReferido`}
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
            <ButtonContainer id="ButtonContainer">
              <ControlButton
                id={idForClickeableElement}
                handleAction={setRefCode}
                loader={loader}
                formValidate={isValidCode === 'good'}
                label="Crear código de referido"
                className="settingButton"
              />
            </ButtonContainer>
        </InputContainer>

        {
          !isMovilViewport &&
          <IconSwitch size={iconSize} icon="createRefCode" />
        }

        

      </RefCodeForm>
    );
}

export default CreateReferralLink;


const InputContainer = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 20px;
  max-height:220px;

  @media ${device.mobile}{
    align-self:end;
  }
`

const ButtonContainer = styled.div`
  height: 85px;
  bottom: 10px;
  display: grid;
  align-items: center;
  justify-self: start;

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

    @media ${device.tabletL} {
      width: 100%;
      bottom: 0;
    }


`

const RefCodeForm = styled.form`
  display: grid;
  grid-template-rows: auto 1fr;
  
  .iconSty{
    justify-content:center;
  }

  img{
    align-self: center;
    filter:grayscale(.4);
  }

  @media ${device.mobile}{
    grid-template-rows: 1fr auto;
  }

  @media ${device.laptopM} {
    grid-row-gap:10px;
  
  }

  @media only screen and (max-width: 900px) {
    grid-row-gap:35px;
    
  }

  @media only screen and (min-width: 1550px) {
    ${'' /* img{
      height: 370px;
      width: 370px;
    } */}
  }

  ${'' /* @media ${device.laptopL} {
    grid-row-gap:50px;
    img{
      height: 370px;
    }
  } */}


  .setRefCode{
    width: 100%;
    max-width: 650px;
    align-self: baseline;
  }

  ${'' /* #controlsContainer{
    height: 85px;
    position: absolute;
    bottom: 10px;
  }

   */}



`

// const InputContainer = styled.section`
//   width: 100%;
//   display: grid;
//   align-items: center;
//   justify-items:center;
//
//   .setRefCode{
//     width: 100%;
//     max-width: 550px;
//   }
// `
