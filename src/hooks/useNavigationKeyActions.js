import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useNavigationKeyActions(items, loader, className, modalRestriction = true, config = {
    next: 37,
    prev: 39,
    default: 0,
    originalLength: false
}) {
    const [currentSelection, setCurrentSelection] = useState(-1)
    const isModalVisible = modalRestriction && useSelector(state => state.form.isModalVisible)
    const isModalRenderShowing = useSelector(state => state.ui.modal.render)

    useEffect(() => {
        if (items && items.length > 0 && !loader) {
            if(isModalVisible) return
            const el = document.getElementById(`${className}${config.default}`)
            el && el.focus()
        }
    }, [items, loader])

    useEffect(() => {
        if (!isModalRenderShowing && !isModalVisible && !window.onkeyup && items && items.length > 0) {
            window.onkeyup = (event) => {
                if(isModalVisible) return
                const length = config.originalLength ? items.length : items.length - 1
                const currentSelectionIsDownZero = currentSelection < 0
                let elementId = 0
                if (event.keyCode === config.next) {
                    elementId = currentSelectionIsDownZero ? length : (currentSelection - 1)
                    const el = document.getElementById(`${className}${Math.max(0, elementId)}`)
                    el && el.focus()
                }
                if (event.keyCode === config.prev || (event.keyCode === 13 && currentSelectionIsDownZero)) {
                    elementId = currentSelectionIsDownZero ? 0 : (currentSelection + 1)
                    const el = document.getElementById(`${className}${Math.min(length, elementId)}`)
                    el && el.focus()
                }
            }
        }
        return () => {
            window.onkeyup = false
        }
    }, [window.onkeyup, isModalVisible, items, loader, isModalRenderShowing])

    return [setCurrentSelection]
}

export function useItemsInteractions(props, { suprKeyAction, enterKeyAction }, modalRestriction = true) {
    const [isSelected, setIsSelected] = useState(false)
    const isModalVisible = modalRestriction && useSelector(state => state.form.isModalVisible)

    useEffect(() => {
        const element = document.getElementById(props.focusedId)
        // const parentElement = document.getElementById(`hoverable${props.focusedId}`)
        if (element) {
            // if (parentElement) {
            //     parentElement.onmouseenter = (event) => {
            //         element.focus()
            //     }
            // }

            element.onfocus = () => {
                setIsSelected(true)
                props.setCurrentSelection(props.number)
            }

            element.onblur = () => {
                setIsSelected(false)
            }

            element.onkeydown = (event) => {
                element.blur()
                if(isModalVisible) return
                if (event.keyCode === 46) {
                    event.stopPropagation()
                    suprKeyAction(() => element.focus())
                }
                if (event.keyCode === 13) {
                    event.stopPropagation()
                    enterKeyAction()
                }
            }
        }
    }, [isModalVisible])

    return [isSelected]
}