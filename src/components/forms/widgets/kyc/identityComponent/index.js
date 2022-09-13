import { useEffect } from 'react'
// import { Wrapper as Layout } from '../../layout/styles'
import KycSkeleton from './skeleton'
import { identityInfo } from './identityUtils'
// import { useSelector } from "react-redux";
 

export default function IdentityComponent ({ handleDataForm, isNewId, currentIdentity}) {
 
    const { setDataForm } = handleDataForm
    // const { user } = useSelector((state) => state.modelData);
    
    const init = () => { 

        const { pendingOrRejectedIdentity } = identityInfo()
        const wrapperComponent = ["rejected", "pending"].includes(pendingOrRejectedIdentity?.info_state) ? 'kyc/identityComponent/info' :
        ["rejected", "pending"].includes(pendingOrRejectedIdentity?.file_state) ? 'kyc/identityComponent/files' : 'kyc/identityComponent/info'
        
        // console.log('IdentityComponent', wrapperComponent, handleDataForm)

        return setDataForm(prevState => {
            return { 
              ...prevState,
              wrapperComponent,
              config:{
                isNewId,
                currentIdentity
              }
            }
        })
    }

    useEffect(() => {
        init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(<KycSkeleton/>)

}