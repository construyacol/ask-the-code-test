import { useEffect } from "react"
// Esto no esta en uso actualmente
export const useKeyActions = (
    backspaceActions = () => null, 
    enterActions = () => null, 
    escActions = () => null, ) => {
    useEffect(() => {
        document.onkeydown = function (event) {
            console.log('Was pressed ' + event.keyCode)
            // backspace
            if (event.keyCode === 8 || event.keyCode === 46) {
                alert('tres')
                backspaceActions()
                // event.preventDefault();
            }
            // enter
            if (event.keyCode === 13) {
                event.preventDefault()
                enterActions()                
            }
            // esc
            if (event.keyCode === 27) {
                escActions()
                // event.preventDefault();
            }
        }
        return () => {
            document.onkeydown = false
        }
    }, [document.onkeydown])
}

// export default function withKeyActions(AsComponent, formName) {
//     return function (props) {
//         const [escActions, setEscAction] = useState()
//         const [backspaceActions, setBackspaceAction] = useState()
//         const [enterActions, setEnterAction] = useState()
//         const current = formName
    
//         const actions = useActions()
    
//         const close = () => {
//             actions.FlowAnimationLayoutAction('backV', 'back', current, 0)
//             if (current === "ticket") {
//                 return closeTicketModal()
//             }
//             actions.toggleModal()
//             actions.CleanForm(current)
//         }
    
//         const closeTicketModal = () => {
//             actions.ModalView('modalView')
//             actions.CleanForm(current)
    
//             return actions.toggleModal()
//         }

//         useEffect(() => {
//             document.onkeydown = function (event) {
//                 console.log('Was pressed ' + event.keyCode)
//                 // backspace
//                 if (event.keyCode === 8 || event.keyCode === 46) {
//                     backspaceActions && backspaceActions()
//                     // event.preventDefault();
//                 }
//                 // enter
//                 if (event.keyCode === 13) {
//                     // console.log('ENTER was pressed');
//                     alert('enter '+ enterActions)
//                     enterActions && enterActions()
//                     // event.preventDefault();
//                 }
//                 // esc
//                 if (event.keyCode === 27) {
//                     // console.log('ESC was pressed');
//                     escActions ? escActions() : close()
//                     // event.preventDefault();
//                 }
//             }
//             return () => {
//                 document.onkeydown = () => null
//                 setEscAction(null)
//                 setBackspaceAction(null)
//                 setEnterAction(null)
//             }
//         }, [])

//         return (
//             <AsComponent
//                 setEnterAction={setEnterAction}
//                 setBackspaceAction={setBackspaceAction}
//                 setEscAction={setEscAction}
//                 {...props} />
//         )
//     }
// }