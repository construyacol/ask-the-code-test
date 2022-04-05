import { Wrapper } from './styles'
import { IconClose } from "../../../widgets/shared-styles";
import { useActions } from '../../../../hooks/useActions'


const Layout = ({ children, background, closeControls }) => {  

  const actions = useActions();

  const closeModal = () => {
    actions.isAppLoading(false);
    actions.renderModal(null);
  };

  return(
    <Wrapper id="mainLayout" style={{background}}>
      {
        closeControls && 
        <IconClose
          theme="dark" 
          top={15} 
          right={20} 
          size={20} 
          onClick={closeModal}
        />
      }
      {children}
    </Wrapper>
  )
}

export default Layout
