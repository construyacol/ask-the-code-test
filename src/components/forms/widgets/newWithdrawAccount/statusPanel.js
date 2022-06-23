import styled from 'styled-components'
import { 
    LabelContainer,
    AccountLabel,
    IconAccount
  } from '../../../widgets/headerAccount/styles'
import loadable from "@loadable/component";
  
  const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

export default function StatusPanelContent ({
    bankName,
    state,
    accountTypes,
    ButtonComponent
   }){
   
   const {
     infoAccount,
     identity
   } = state
 
   let uiBankName = bankName?.selectList[state?.bankName]?.uiName
   let uiAccountType = accountTypes && accountTypes[infoAccount?.accountType]?.ui_name
   let uiIdentityNames = identity?.document_info && `${identity?.document_info?.name} ${identity?.document_info?.surname}`
 
   return(
     <>
       <StatusHeaderContainer>
         <TitleContainer>
           <h1 className="fuente">Cuenta de retiro</h1>
         </TitleContainer>
         <CardInfo className={`${uiBankName?.toLowerCase()}`}>
 
           <InfonContainer className="_headerInfo">
             <LabelContainer>
               <AccountLabel className={`${uiBankName ? '' : 'skeleton' }`}>{uiBankName?.toLowerCase() || 'Awesome bank name...'}</AccountLabel>
               {
                 !["efecty"].includes(uiBankName) &&
                   <AccountLabel className={`_aux ${uiAccountType ? '' : 'skeleton' }`}>{uiAccountType || 'Cuenta de ahorros'}</AccountLabel>
               }
             </LabelContainer>
             <IconAccount className={`${uiBankName ? '' : '_iconSkeleton' }`}>
               {
                 uiBankName &&
                 <IconSwitch
                     icon={state?.bankName}
                     size={35}
                 />
               }
             </IconAccount>
           </InfonContainer>
 
           <InfonContainer>
             <LabelContainer>
               {
                 !["efecty"].includes(uiBankName) &&
                 <AccountLabel className={`numberFont ${infoAccount?.accountNumber ? '' : 'skeleton' }`}>{infoAccount?.accountNumber || '------------'}</AccountLabel>
               }
               <AccountLabel className={`_aux ${uiIdentityNames ? '' : 'skeleton' }`}>{uiIdentityNames || 'Satoshi nakamoto motonaka'}</AccountLabel>
             </LabelContainer>
           </InfonContainer>
 
         </CardInfo>
       </StatusHeaderContainer>
       <ButtonComponent/>
     </>
   )
 }
 



const InfonContainer = styled.div`
${LabelContainer}{
  row-gap: 6px;
}
p{
  margin:0
}
${IconAccount}{
  &._iconSkeleton{
    background:var(--skeleton_color);
  }
}
&._headerInfo{
  display: grid;
  grid-template-columns: 1fr auto;
}
${AccountLabel}{
  &.skeleton{
    text-transform: lowercase;
  }
    text-transform: capitalize;
  &.numberFont{
    font-weight: 500;
    letter-spacing: 6px;
  }
}
`

const CardInfo = styled.div`
width:calc(100% - 40px);
height:calc(150px - 40px);
border: 1px solid var(--skeleton_color);
border-radius: 6px;
padding:20px;
max-width: 250px;
justify-self: center;
display: grid;
align-content: space-between;
border-right: 4px solid var(--primary);
background: #f5f5f5;
-webkit-box-shadow: 2px 9px 19px -7px rgba(0,0,0,0.15);
-moz-box-shadow: 2px 9px 19px -7px rgba(0,0,0,0.15);
box-shadow: 2px 9px 19px -7px rgba(0,0,0,0.15);
&.efecty{
  align-content: flex-start;
}
`

const TitleContainer = styled.div`
h1{
  font-size: 22px;
  font-size: 20px;
  color: var(--paragraph_color);
}
border-bottom: 1px solid var(--skeleton_color);
`

const StatusHeaderContainer = styled.div`
  position: sticky;
  top: 190px;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 15px;
  grid-template-rows: auto 1fr;
  height: auto;
  max-height: 300px;
`
