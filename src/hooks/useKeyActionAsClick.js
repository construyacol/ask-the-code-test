import { useEffect } from "react";
import { useSelector } from "react-redux";

const ID_FOR_CLICKEABLE_ELEMENTS = 'main-clickeable-element'

export default function useKeyActionAsClick(shouldHandleAction = true, elementId = ID_FOR_CLICKEABLE_ELEMENTS, keyCode = 13) {
    const isModalVisible = useSelector(state => state.form.isModalVisible)
    const isModalRenderVisible = useSelector(state => state.ui.modal.render)
    const isConfirmationModalVisible = useSelector(state => state.ui.modal_confirmation.visible)

    const doClick = () => {
        const clickeableElement = document.getElementById(elementId)
        if(clickeableElement) {
            clickeableElement.click && clickeableElement.click()
        }
    }

    useEffect(() => {
        if(!document.onkeypress) {
            document.onkeypress = (event) => {
                if (event.keyCode === keyCode && !event.srcElement.tagName.includes('INPUT')) {
                    if(!isModalVisible && !isModalRenderVisible && !isConfirmationModalVisible) {
                        event.preventDefault()
                        event.stopPropagation()
                        return shouldHandleAction && doClick()
                    }
                }
            }
        }

        return () => {
            document.onkeypress = false
        }
    }, [document.onkeypress, isModalVisible, isModalRenderVisible, isConfirmationModalVisible, shouldHandleAction])

    return elementId
}