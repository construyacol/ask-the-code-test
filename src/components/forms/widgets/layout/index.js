import { Wrapper } from './styles'

const Layout = ({ children }) => {

  return(
    <Wrapper id="mainLayout">
      {children}
    </Wrapper>
  )
}

export default Layout
