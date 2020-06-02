import React from 'react'
import OtherModalLayout from '../otherModalLayout'
import styled from 'styled-components'
import { swing_in_bottom_bck } from '../../animations'
import AuthReq from '../../itemSettings/modal_views/authreq'


const Withdraw2FaModal = ({callback}) => {

    return(
      <OtherModalLayout>
        <Layout>
          <AuthReq
            isModal2fa
            authenticated={callback}
          />
        </Layout>
      </OtherModalLayout>
    )
  }

  export default Withdraw2FaModal



  const Layout = styled.div`
    width: 500px;
    height: 500px;
    background: white;
    -webkit-animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
    animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
  `
