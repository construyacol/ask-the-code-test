import { useState, useEffect } from "react";
import styled, { keyframes } from 'styled-components'
import { AiOutlineScan } from 'react-icons/ai';
import { BsCheck } from 'react-icons/bs';


const StatusIndicator = ({ data }) => {

    const [ status, setStatus ] = useState()
  
    useEffect(()=>{
        // console.log('_______ ====================== StatusIndicator ==>', data)
        if(data){
          setStatus('approve')
        }else{
          setTimeout(()=>setStatus(), 400)
        }
    }, [data])
    
    return(
      <StatusContainer className={`${status === 'approve' ? 'approve' : 'normal'}`}>
        { !status ?
          <AiOutlineScan size={30} color="#a3a3a3"/>
          :
          <BsCheck size={37} color="white" />
        }
      </StatusContainer>
    )
  
  }


  const approve = keyframes`
    0% {
        opacity: 1;
        transform: scale(1);
    }
    30% {
        transform: scale(0);
        opacity: 0;
    }
    50%{
        transform: scale(0);
        opacity: 0;
    }
    80%{
        opacity: 1;
        transform: scale(1.3);
    }
    100%{
        opacity: 1;
        transform: scale(0.9);
        background:#2ad083;
        border: 4px solid white;
    }
    `;
  
  const StatusContainer = styled.div`
      width: 60px;
      height: 60px;
      position: absolute;
      border-radius: 50%;
      background: white;
      border: 2px solid #cfcfcf;
      top:175px;
      right:200px;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      &.approve{
         animation: ${approve} .6s linear forwards;
      }

     

    @media (max-width: 768px) {
      top: 380px;
      right: 0;
      left: 50px;
    }
  `


  
  export default StatusIndicator