import { useEffect } from 'react'
// import { Wrapper as Layout } from '../../layout/styles'
import KycSkeleton from './skeleton'
import { identityInfo } from './identityUtils'



export default function IdentityComponent ({ handleDataForm, isNewId}) {

    const { setDataForm } = handleDataForm

    const init = () => {
        
        const { pendingIdentityFile } = identityInfo()
        const wrapperComponent = pendingIdentityFile ? 'kyc/identityComponent/files' : 'kyc/identityComponent/info'
        
        return setDataForm(prevState => {
            return { 
              ...prevState,
              wrapperComponent
            }
        })
    }


    useEffect(() => {
        init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(<KycSkeleton/>)

}