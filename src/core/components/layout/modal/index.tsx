import { useActions } from "hooks/useActions";
import OtherModalLayout from "components/widgets/modal/otherModalLayout";
import { ChangeEvent } from 'react'


export default function ModalLayout(props:any){

    const actions = useActions()
    const closeModal = (e?:ChangeEvent<HTMLInputElement>):void => {
        if(props?.loading)return;
        if (!e || (e?.target?.dataset?.close_modal)){
          actions.renderModal(null);
        }
    };
    
    return(
        <OtherModalLayout
            onkeydown={true}
            on_click={closeModal}
        >
                {props.children}
        </OtherModalLayout>
    )
}



