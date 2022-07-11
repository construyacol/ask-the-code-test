import styled from 'styled-components';

export const ToastContainer = styled.div`
  position: relative;
  z-index: 999999999999999999999999999999;

  .putito {
    box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.41) !important;
  }
  .toast-error {
    background: #e93b28 !important;
    border-radius: 7px !important;
  }
  
  .toast-error-text {
    color: white !important;
    font-weight: bold !important;
    text-align: center !important;
  }
  
  .error-progress-bar {
    background: #9a281c !important;
  }
  
  .dc-background {
    background: linear-gradient(to bottom right, #129a8e, #37ed7d) !important;
    border-radius: 6px !important;
    height: 2px !important;
  }
  
  .dc-background-default {
    /*background: linear-gradient(to bottom right, #129A8E, #37ED7D);*/
    border-radius: 6px !important;
    height: 2px !important;
  }
  
  .dc-text {
    color: white !important;
    /*color:#13b5f1 !important;*/
    font-size: 17px !important;
    text-align: center !important;
  }
  
  .dc-text-default {
    color: #2b3742 !important;
    font-weight: bold;
    font-size: 14px !important;
    text-align: center !important;
  }
  
  .dc-progress {
    /*background: hsla(0,0%,100%,.7) !important;*/
    /*background: linear-gradient(to right, #377fd7, #13b5f1) !important;*/
    background: #00ff7d !important;
    opacity: 0.85 !important;
  }
`;

export const SavePaymentContainer = styled.div`
  display: flex;
  font-size: 14px;
  justify-content: center;
  height: 64px;

  p {
    display: flex;
    align-items: center;
    margin-left: 5px;
  }

  .m-success {
    color: #149e8c;
    display: flex;
    align-items: center;
    margin-left: 6px;
    font-size: 21px;
  }
  
`;