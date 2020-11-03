import React from "react";
import loadable from "@loadable/component";
import NumberBox from "./number-box";
import styled from "styled-components";
import { device } from "../../const/const";

const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));

const WithdrawAd = ({ loading }) => {
  const Icon = () => <IconSwitch icon={"colombia"} />;

  return (
    <StyledNumberBox
      loading={loading}
      textCss="grid-area: bottom-right;"
      Icon={Icon}
      height="135px"
      quantity={"$500.000"}
      definition="Saldo total en <strong>COP</strong>"
      bottomText={`<p>RETIRAR TOTAL <i class="fas fa-arrow-up"/></p>`}
      withPadding
      center
    />
  );
};

const StyledNumberBox = styled(NumberBox)`
  margin-bottom: 20%;
  @media ${device.tabletL} {
    margin-bottom: 0;
  }
`;

export default WithdrawAd;
