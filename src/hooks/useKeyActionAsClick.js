import { useEffect } from "react";
import { useSelector } from "react-redux";

const ID_FOR_CLICKEABLE_ELEMENTS = 'main-clickeable-element'

export default function useKeyActionAsClick(shouldHandleAction = true, elementId = ID_FOR_CLICKEABLE_ELEMENTS, keyCode = 13) {
    const isModalVisible = useSelector(state => state.form.isModalVisible)
    const isModalRenderVisible = useSelector(state => state.ui.modal.render)
    const isConfirmationModalVisible = useSelector(state => state.ui.modal_confirmation.visible)

    const doClick = (id) => {
        const clickeableElement = document.getElementById(id)
        if (clickeableElement) {
            clickeableElement.click && clickeableElement.click()
        }
    }

    const manageKeyActions = (async (elementId, keyCode) => {
        try {
            if(!window.KEY_CODES_META) {
                window.KEY_CODES_META = {}
            }
            window.KEY_CODES_META[elementId] = keyCode
        } catch (error) {
        }
    })

    const handleKeyAction = async () => {
        document.onkeypress = (event) => {
            if (!event.srcElement.tagName.includes('INPUT')) {
                if (!isModalVisible && !isModalRenderVisible && !isConfirmationModalVisible) {
                    if (window.KEY_CODES_META) {
                        Object.keys(window.KEY_CODES_META).map(id => {
                            if (window.KEY_CODES_META[id] === event.keyCode) {
                                event.preventDefault()
                                event.stopPropagation()
                                if (id === ID_FOR_CLICKEABLE_ELEMENTS) {
                                    return shouldHandleAction && doClick(id)
                                }
                                return doClick(id)
                            }
                        })
                    }
                }
            }
        }
    }

    useEffect(() => {
        manageKeyActions(elementId, keyCode)
    }, [elementId, keyCode])

    useEffect(() => {
        if (!document.onkeypress) {
            handleKeyAction()
        }
        return () => {
            document.onkeypress = false
        }
    }, [document.onkeypress, isModalVisible, isModalRenderVisible, isConfirmationModalVisible, shouldHandleAction])

    return elementId
}