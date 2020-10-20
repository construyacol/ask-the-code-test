import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DEFAULT_ARGS = {
    modalRestriction: true,
    prev: 37,
    next: 39,
    default: 0,
    originalLength: false,
}

/**
 * useNavigationKeyActions simula la navegacion entre un grupo de objetos en el DOM.
 *
 * @param {Object} config representa la configuracion y datos del hook
 * @param {Array} config.items items representativos entre los cuales se navegara por medio de key event
 * @param {Boolean} config.loader indentifica cuando el componente esta listo para ejecutar la accion de navegar
 * @param {String} config.uniqueIdForElement id que identificara los elementos navegables
 * @param {Boolean} config.modalRestriction restringe el uso de esta funcion en modales, por defecto es true
 * @param {Event.keyCode|Number} config.prev representa el keyCode a ser referenciendo como previo o anterior, 
 * por defecto es 37
 * @param {Event.keyCode|Number} config.next representa el keyCode a ser referenciendo siguiente, 
 * por defecto es 39
 * @param {Number} config.default numero del elemento a seleccionar por default, por defecto es el Elmento 0
 * @return _setCurrentSelection
 * 
 * @example 
 * const setCurrentElement = useNavigationKeyActions({ items: [...n], loader: subscription(), uniqueIdForElement: "my-uniqueIdForElement-" }) 
 * @see useItemsInteractions
 * @see window.onkeydown
 */
export default function useNavigationKeyActions(config) {
    const valuesAsProps = { ...DEFAULT_ARGS, ...config }
    const { modalRestriction, uniqueIdForElement, loader, items } = valuesAsProps
    const [currentSelection, setCurrentSelection] = useState(-1)
    const isModalVisible = modalRestriction && useSelector(state => state.form.isModalVisible)
    const isModalRenderShowing = modalRestriction && useSelector(state => state.ui.modal.render)

    useEffect(() => {
        if (items && items.length > 0 && !loader) {
            if (isModalVisible) return
            const el = document.getElementById(`${uniqueIdForElement}${valuesAsProps.default}`)
            el && el.focus()
        }
    }, [items, loader])

    useEffect(() => {
        if (modalRestriction && (isModalRenderShowing || isModalVisible)) {
            setCurrentSelection(-1)
        }
    }, [isModalRenderShowing, isModalVisible])

    useEffect(() => {
        window.onkeydown = (event) => {
            if (!isModalRenderShowing && !isModalVisible && items && items.length > 0) {
                if (isModalVisible) return
                const length = valuesAsProps.originalLength ? items.length : items.length - 1
                const currentSelectionIsDownZero = currentSelection < 0
                let elementId = 0
                let el = null
                if (event.keyCode === valuesAsProps.prev) {
                    elementId = currentSelectionIsDownZero ? length : (currentSelection - 1)
                    el = document.getElementById(`${uniqueIdForElement}${Math.max(0, elementId)}`)
                }
                if (event.keyCode === valuesAsProps.next) {
                    elementId = currentSelectionIsDownZero ? 0 : (currentSelection + 1)
                    el = document.getElementById(`${uniqueIdForElement}${Math.min(length, elementId)}`)
                }
                if(event.keyCode === 13){
                    elementId = currentSelectionIsDownZero ? 0 : currentSelection
                    el = document.getElementById(`${uniqueIdForElement}${Math.min(length, elementId)}`)
                }
                if(el) {
                    el.focus()
                    // event.preventDefault()
                    // event.stopPropagation()
                }
            }
        }
        return () => {
            window.onkeydown = false
        }
    }, [window.onkeydown, isModalVisible, items, loader, isModalRenderShowing, currentSelection])

    const _setCurrentSelection = (newSelection) => {
        if (currentSelection !== newSelection) {
            setCurrentSelection(newSelection)
        }
    }
    return [_setCurrentSelection]
}


/**
 * useItemsInteractions contiene toda las interacciones del elemento, como seleccionarlo como puntero actual hasta
 * las acciones que presenta cuando el seleccionado.
 *
 * @param {Object} props properties heredadas del componente que usara este hook
 * @param {Function} props.setCurrentSelection function retornada de useNavigationKeyActions usada para seleccionar
 * el elemento como puntero actual
 * @param {Number} props.number number index del elemento en el array
 * @param {String} props.focusedId id referencial del elemento en el DOM
 * 
 * @param {Object} keyActions restringe el uso de esta funcion en modales, por defecto es true
 * @param {Function} keyActions.suprKeyAction accion al presionar la tecla suprimir
 * @param {Function} keyActions.enterKeyAction accion al presionar la tecla enter
 * @param {Boolean} modalRestriction restringe este hook en modales
 * @return {[Boolean, Function]} [isSelected, setFocus]
 * 
 * @example 
 * const setCurrentElement = useItemsInteractions(props, {...}, false) 
 * @see useNavigationKeyActions
 * @see Element.onkeydown
 */
export function useItemsInteractions(props, keyActions, modalRestriction = true) {
    const { suprKeyAction, enterKeyAction } = keyActions
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
                    enterKeyAction()
                    event.stopPropagation()
                    event.preventDefault()
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