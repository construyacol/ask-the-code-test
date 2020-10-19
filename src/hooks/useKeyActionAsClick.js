import { useEffect } from "react";
import { useSelector } from "react-redux";
import { debounce } from "../utils";

const ID_FOR_CLICKEABLE_ELEMENTS = 'main-clickeable-element'

/**
 * useKeyActionAsClick mimifica la accion "click" con algunas condiciones para los componentes indentificados con id devuelto.
 *
 * @param {Boolean} shouldHandleAction Determina cuando se puede ejecutar la accion de Click, puede
 * ser manejada con un estado o solo colocar True para siempre ejecutar la accion, por defecto es true
 * @param {String} elementId ID para elemento al cual se dará Click
 * @param {Event.keyCode|Number} keyCode Codigo de tecla referencial al evento que se espera para ejecutar la accion
 * por defecto es 13 keycode de la tecla Enter
 * @param {Boolean} preventFromInput previene que no se ejecute el key action desde un input, por defecto True
 * @param {Event|String} eventName string|onkeypress|onkeyup|onkeydown evento a esperar para ejecutar el key action, por defecto onkeypress
 * @param {Boolean} activeOnOpenModal Si quieres que los evento se ejecuten incluso con un modal true para que esto suceda,
 * por defecto false
 * @return the element ID o elementId
 * 
 * @example 
 * const elementId = useKeyActionAsClick(true, 'MY_ELEMENT_ID', 32, true, 'onkeyup', true) 
 * @see window.onkeypress
 * @see window.onkeyup
 * @see window.onkeydown
 */
export default function useKeyActionAsClick(
    shouldHandleAction = true,
    elementId = ID_FOR_CLICKEABLE_ELEMENTS,
    keyCode = 13,
    preventFromInput = true,
    eventName = 'onkeypress',
    activeOnOpenModal = false) {
    const isModalVisible = useSelector(state => state.form.isModalVisible)
    const isModalRenderVisible = useSelector(state => state.ui.modal.render)
    const isConfirmationModalVisible = useSelector(state => state.ui.modal_confirmation.visible)
    const isOtherModalVisible = useSelector(state => state.ui.otherModal)

    /**
     * Busca el elemento por el Id y hace 'Click' si existe
     *
     * @param {String} id id referencial del elemento en el DOM actual
     */
    const doClick = (id, event) => {
        const clickeableElement = document.getElementById(id)
        if (clickeableElement) {
            event.preventDefault()
            event.stopPropagation()
            clickeableElement.click && clickeableElement.click()
        }
    }

    /**
     * Guarda los id y condiciones a ejecutar al momento de indentificar el evento 
     * 
     * @param {String} elementId id referencial del elemento en el DOM actual
     * @param {Event.keyCode|Number} elementId keycode a referenciar al ID
     */
    const manageKeyActions = (elementId, keyCode) => {
        if (!window.KEY_CODES_META) {
            window.KEY_CODES_META = {}
        }
        if (!window.KEY_CODES_META[eventName]) {
            window.KEY_CODES_META[eventName] = {}
        }
        window.KEY_CODES_META[eventName][elementId] = {
            keyCode,
            preventFromInput,
            activeOnOpenModal
        }
    }

    /**
     * Evento "eventName" a ejecutar
     * 
     * @param {Event} event evento de tipo keyEvent
     * @returns doClick fn | boolean
     */
    const onKeyEventFn = (event, _doBreak) => {
        // verifica que no este algun modal abierto
        const isNotModalOpened = !isModalVisible && !isModalRenderVisible && !isConfirmationModalVisible && !isOtherModalVisible
        
        // si existe el KEY_CODES_META y el Evento actual
        if (window.KEY_CODES_META && window.KEY_CODES_META[eventName]) {
            // recorre los eventos guardados
            let doBrake = false
            Object.keys(window.KEY_CODES_META[eventName]).map(id => {
                if(doBrake) return typeof _doBreak === 'function' && _doBreak()
                // busca el elemento a Clickear
                const element = document.getElementById(id)
                if(!element) return false
                const keyCodeData = window.KEY_CODES_META[eventName][id]
                if (!keyCodeData.activeOnOpenModal && !isNotModalOpened) return false
                if (keyCodeData.keyCode === event.keyCode) {
                    const isFromInputElement = event.srcElement.tagName.includes('INPUT')
                    const isFromInputWithValue = isFromInputElement && event.srcElement.value
                    const isFromInputWithNoValue = isFromInputElement && !event.srcElement.value
                    if (keyCodeData.preventFromInput && isFromInputWithValue) return false
                    if (keyCodeData.preventFromInput && isFromInputWithNoValue) {
                        event.stopPropagation()
                        event.preventDefault()
                        if(keyCodeData.activeOnOpenModal) event.srcElement.blur()
                        return false
                    }
                    if (id === ID_FOR_CLICKEABLE_ELEMENTS && shouldHandleAction) {
                        doClick(id, event)
                        doBrake = true
                    } else {
                        doClick(id, event)
                        doBrake = true
                    }
                    return false
                }
            })
        }
    }

    const handleKeyAction = async () => {
        window[eventName] = debounce(onKeyEventFn, 100)
    }

    useEffect(() => {
        manageKeyActions(elementId, keyCode)
    }, [elementId, keyCode])

    useEffect(() => {
        handleKeyAction()
        return () => {
            // window[eventName] = false
        }
    }, [window[eventName], isModalVisible, isModalRenderVisible, isConfirmationModalVisible, isOtherModalVisible, shouldHandleAction])

    return elementId
}