import { useEffect } from "react"
import { useSelector } from "react-redux"

export default function useBlockScroll() {
    const isModalVisible = useSelector(state => state.form.isModalVisible)
    const isModalRenderShowing = useSelector(state => state.ui.modal.render)

    useEffect(() => {
        const scrollContainer = document.getElementById('containerElement')
        if (scrollContainer) {
            if (isModalRenderShowing || isModalVisible) {
                scrollContainer.classList.add('no-scroll')
            } else if (scrollContainer.classList.contains('no-scroll')) {
                scrollContainer.classList.remove('no-scroll')
            }
        }
    }, [isModalRenderShowing, isModalVisible])
}