import React from 'react'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'

import { 
    IconBackContainer,
    IconNextContainer 
} from './styles'


export const BackButtom = ({ onClick, disabled }) => {
    return(
            <IconBackContainer onClick={onClick} disabled={disabled || ''} width="22px">
                <FiArrowLeft size={22} />
            </IconBackContainer>
    )
}


// export const BackButtom = ({ onClick, disabled }) => {
//     return(
//         <Portal target={document.querySelector("#buttonModule__")}>
//             <IconBackContainer onClick={onClick} disabled={disabled || ''} width="22px">
//                 <FiArrowLeft size={22} />
//             </IconBackContainer>
//         </Portal>
//     )
// }


export const NextButtom = ({ onClick, disabled, id }) => {
    return(
        <IconNextContainer id={`${id || ''}`} className="personal_nextButtom_" onClick={onClick} disabled={disabled || ''} width="35px">
                <FiArrowRight size={35} color="#06a" />
        </IconNextContainer>
    )
}

