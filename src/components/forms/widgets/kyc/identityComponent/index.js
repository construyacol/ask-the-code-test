import { useEffect } from 'react'
// import { Wrapper as Layout } from '../../layout/styles'
import KycSkeleton from './skeleton'
import { identityStates } from './identityUtils'



export default function IdentityComponent ({ handleDataForm, handleState, closeModal, actions }) {

    const { setDataForm } = handleDataForm

    const init = () => {
        const { needDoInfoStage } = identityStates()
        const wrapperComponent = needDoInfoStage ? 'kyc/identityComponent/info' : 'kyc/identityComponent/files'
        // const wrapperComponent = 'kyc/identityComponent/files'
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