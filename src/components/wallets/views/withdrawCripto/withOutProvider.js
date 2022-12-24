import React from "react";
import IconSwitch from "../../../widgets/icons/iconSwitch";
import styled from 'styled-components'

const WithOutProvider = ({ current_wallet }) => {
  return (
    <Section>
      <IconSwitch icon="maintence" size={90} color="var(--paragraph_color)" />
      <p className="fuente">
        Los retiros de {current_wallet.currency} estan fuera de
        servicio temporalmente, ten paciencia...
      </p>
    </Section>
  );
};

export default WithOutProvider;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 25px;
  p{
    color:var(--paragraph_color);
  }
`