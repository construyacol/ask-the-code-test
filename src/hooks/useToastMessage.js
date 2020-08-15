import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { toast_sound } from './../actions/soundActions'

export function useToastMesssage() {
    const dispatch = useDispatch()

    const toastMessage = (msg, type, position) => {

        setTimeout(() => {
            dispatch(toast_sound())
        }, 300)
        
        toast(msg, {
            position: toast.POSITION[!position ? 'BOTTOM_RIGHT' : position],
            pauseOnFocusLoss: false,
            draggablePercent: 60,
            className: `${type === 'error' ? 'toastError' : type === 'success' ? 'DCfondo' : 'DCfondoDefault'}`,
            bodyClassName: `${type === 'error' ? 'toastErrorText' : type === 'success' ? 'DCTtext' : 'DCTtextDefault'}`,
            progressClassName: `${type === 'error' ? 'ErroProgressBar' : type === 'success' ? 'DCProgress' : 'DCProgress'}`,
            autoClose: 4000
        })
    }
    return [ toastMessage ]
}