import { useActions } from "hooks/useActions";
import OtherModalLayout from "components/widgets/modal/otherModalLayout";


export default function ModalLayout(props:any){

    const actions = useActions()
    const closeModal = (e?:React.MouseEvent<HTMLDivElement, MouseEvent>):void => {
        if(props?.loading)return;
        if (!e || (e.target instanceof HTMLDivElement && e?.target?.dataset?.close_modal)){
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



