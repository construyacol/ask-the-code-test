import { useSelector } from "react-redux"

export function useModalState() {
    const isModalVisible = useSelector(state => state.form.isModalVisible)
    const isModalRenderVisible = useSelector(state => state.ui.modal.render)
    const isConfirmationModalVisible = useSelector(state => state.ui.modal_confirmation.visible)
    const isOtherModalVisible = useSelector(state => state.ui.otherModal)

    return [isModalVisible, isModalRenderVisible, isConfirmationModalVisible, isOtherModalVisible]
}