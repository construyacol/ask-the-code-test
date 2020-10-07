import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DEFAULT_ARGS = {
    modalRestriction: true,
    prev: 37,
    next: 39,
    default: 0,
    originalLength: false,
}

export default function useNavigationKeyActions(config) {
    const valuesAsProps = { ...DEFAULT_ARGS, ...config }
    const { modalRestriction, className, loader, items } = valuesAsProps
    const [currentSelection, setCurrentSelection] = useState(-1)
    const isModalVisible = modalRestriction && useSelector(state => state.form.isModalVisible)
    const isModalRenderShowing = useSelector(state => state.ui.modal.render)

    useEffect(() => {
        if (items && items.length > 0 && !loader) {
            if (isModalVisible) return
            const el = document.getElementById(`${className}${valuesAsProps.default}`)
            el && el.focus()
        }
    }, [items, loader])

    useEffect(() => {
        if(modalRestriction && (isModalRenderShowing || isModalVisible)) {
            setCurrentSelection(-1)
        }
    }, [isModalRenderShowing, isModalVisible])

    useEffect(() => {
        if (!isModalRenderShowing && !isModalVisible && !window.onkeyup && items && items.length > 0) {
            window.onkeyup = (event) => {
                if (isModalVisible) return
                const length = valuesAsProps.originalLength ? items.length : items.length - 1
                const currentSelectionIsDownZero = currentSelection < 0
                let elementId = 0
                let el = null
                if (event.keyCode === valuesAsProps.prev) {
                    elementId = currentSelectionIsDownZero ? length : (currentSelection - 1)
                    el = document.getElementById(`${className}${Math.max(0, elementId)}`)
                    el && el.focus()
                }
                if (event.keyCode === valuesAsProps.next || (event.keyCode === 13 && currentSelectionIsDownZero)) {
                    elementId = currentSelectionIsDownZero ? 0 : (currentSelection + 1)
                    el = document.getElementById(`${className}${Math.min(length, elementId)}`)
                    el && el.focus()
                }
            }
        }
        return () => {
            window.onkeyup = false
        }
    }, [window.onkeyup, isModalVisible, items, loader, isModalRenderShowing, currentSelection])

    const _setCurrentSelection = (newSelection) => {
        if(currentSelection !== newSelection) {
            setCurrentSelection(newSelection)
        }
    }
    return [_setCurrentSelection]
}

export function useItemsInteractions(props, { suprKeyAction, enterKeyAction }, modalRestriction = true) {
    const [isSelected, setIsSelected] = useState(false)
    const isModalVisible = modalRestriction && useSelector(state => state.form.isModalVisible)

    useEffect(() => {
        const element = document.getElementById(props.focusedId)
        if (element) {
            element.onfocus = () => {
                setIsSelected(true)
                props.setCurrentSelection(props.number)
            }

            element.onblur = () => {
                setIsSelected(false)
            }

            element.onkeydown = (event) => {
                element.blur()
                if (isModalVisible) return
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

    const setFocus = () => {
        const element = document.getElementById(props.focusedId)
        element && element.focus() 
    }

    return [isSelected, setFocus]
}