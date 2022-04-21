import { Wrapper } from './styles'
import { IconClose } from "../../../widgets/shared-styles";
import { useActions } from '../../../../hooks/useActions'

const Layout = ({ children, background, closeControls, className }) => {
  
  const actions = useActions();
  const closeModal = (e, forceClose) => {
    if ((e && e.target?.dataset?.close_modal) || forceClose) {
      actions.isAppLoading(false);
      actions.renderModal(null);
    }
  };

  return(
    <Wrapper 
      id="mainLayout" 
      style={{background}}
      onClick={closeModal}
      data-close_modal={true}
      className={`${className}`}
    >
      {
        closeControls &&
          <IconClose 
              theme="dark" 
              top={15} 
              right={20} 
              size={20} 
              onClick={() => closeModal(null, true)}
          />
      }
      {children}
    </Wrapper>
  )
}

export default Layout
