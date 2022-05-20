import styled from 'styled-components'
import { useParams  } from "react-router-dom";
import { OnlySkeletonAnimation } from '../loaders/skeleton'

const UI_NAME_TITLE = {
    wallets:"Billeteras",
    withdraw_accounts:"Cuentas de retiro",
    referral:"Referidos",
    security:"Centro de seguridad"
}

export default function TitleSection({ titleKey, skeleton }) {

    const params = useParams()
    const key = titleKey || params.primary_path
    const title = UI_NAME_TITLE[key] || key

    return(
        <Title className={`fuente ${skeleton ? 'skeleton' : ''}`}>
            {title}
        </Title>
    )
}

const Title = styled.h1`
    color:var(--paragraph_color);
    font-size:28px;
    margin: 0;
    padding: 40px 0 20px;
    padding: 30px 0 20px;
    border-bottom: 1px solid #d5d5d6;

    &.skeleton{
      color:var(--skeleton_color);
      background:var(--skeleton_color);
      width: fit-content;
      border-radius: 4px;
      padding: 0;
      margin:40px 0 20px;
      ${OnlySkeletonAnimation};
    }
`