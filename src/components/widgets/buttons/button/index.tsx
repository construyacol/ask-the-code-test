import { ButtonStyle } from './styles';
import { buttonTypes } from 'interfaces/components/sharedAtomsTypes';
import { Link } from 'react-router-dom';

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
}: buttonTypes) {

  return (
        <ButtonStyle 
          className={`${className} ${size || ''} ${variant} ${disabled ? 'disabled' : ''}`}
          color={`${color || ''}`}
          disabled={disabled}
          onClick={onClick}
        >
            {children}
        </ButtonStyle>
  )
  
}
 
