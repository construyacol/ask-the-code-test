import { ButtonStyle } from './styles';
import { buttonTypes } from 'interfaces/components/sharedAtomsTypes';
// import loadable from "@loadable/component";
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import SimpleLoader from 'components/widgets/loaders'


// const SimpleLoader = loadable(() => import("components/widgets/loaders"));

// close_modal
export default function Button({
  href = "",
  ...props
}:buttonTypes) {
  return(
    <>
      {
        href ? 
        <Link to={href} replace>
          <ButtonChild {...props} /> 
        </Link>
        :
       <ButtonChild {...props} /> 
      }
    </>
  )
}

function ButtonChild({ 
  size, 
  children, 
  className = '', 
  variant= 'text', 
  color,
  disabled = false,
  onClick,
  loading = false,
  ...props
}: buttonTypes) {

  return (
    <ButtonStyle 
      className={`${className} ${size || ''} ${variant} ${disabled ? 'disabled' : ''}`}
      color={`${color || ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
      > 
      {
        loading && <Loader><SimpleLoader loader={2} /></Loader>
      }
        {children}
    </ButtonStyle>
  )
  
}


const Loader = styled.div`
  position: absolute;
  background: #ffffffeb;
  width: 100%;
  height: 100%;
  display: flex;
  place-content: center;
  align-items: center;
  color: gray;
`
 
