import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useModalState() {
  const isModalRenderVisible = useSelector((state) => state.ui.modal.render);
  const isConfirmationModalVisible = useSelector(
    (state) => state.ui.modal_confirmation.visible
  );
  const isOtherModalVisible = useSelector((state) => state.ui.otherModal);
  const [someModalIsOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (
      isConfirmationModalVisible ||
      isModalRenderVisible ||
      isOtherModalVisible
    ) {
      setIsOpened(true);
    } else {
      setIsOpened(false);
    }
  }, [
    isConfirmationModalVisible,
    isModalRenderVisible,
    isOtherModalVisible,
  ]);

  return someModalIsOpened;
}
