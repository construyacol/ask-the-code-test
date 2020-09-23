import { useEffect } from "react";
import { useSelector } from "react-redux";

const ID_FOR_CLICKEABLE_ELEMENTS = 'main-clickeable-element'

export default function useKeyActionAsClick(elementId = ID_FOR_CLICKEABLE_ELEMENTS, keyCode = 13) {
    const isModalVisible = useSelector(state => state.form.isModalVisible)
    const isModalRenderVisible = useSelector(state => state.ui.modal.render)

    const doClick = () => {
        const clickeableElement = document.getElementById(elementId)
        if(clickeableElement) {
            clickeableElement.click && clickeableElement.click()
        }
    }

    useEffect(() => {
        if(!window.onkeyup) {
            window.onkeyup = (event) => {
                if (event.keyCode === keyCode && !event.srcElement.tagName.includes('INPUT')) {
                    if(!isModalVisible && !isModalRenderVisible) {
                        event.preventDefault()
                        doClick()
                    }
                }
            }
        }

        return () => {
            window.onkeyup = false
        }
    }, [window.onkeyup])

    return elementId
}