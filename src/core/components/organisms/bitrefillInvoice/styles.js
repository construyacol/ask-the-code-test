import styled from 'styled-components'
import { INSUFFICIENT_FUNDS } from 'const/bitrefill'

export const InvoiceLayout = styled.div`
    padding: 0 .5rem;
    p.${INSUFFICIENT_FUNDS}{
        color: red;
    }
    .itemAccountContainer.${INSUFFICIENT_FUNDS}{
      border-left: 5px solid var(--red_color);
    }

    .itemAccountContainer{
        height: 80px;
    }
`

export const PaymentDetailContainer = styled.div`
    display: grid;
    row-gap: 2rem;
    padding-top: 1.5rem;
`