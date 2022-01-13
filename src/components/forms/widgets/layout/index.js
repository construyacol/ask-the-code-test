import { Wrapper } from './styles'

const Layout = ({ children, background }) => {

  return(
    <Wrapper id="mainLayout" style={{background}}>
      {children}
    </Wrapper>
  )
}

export default Layout
