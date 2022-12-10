
import { InputStyle, InputWrapper } from './styles';
import { inputProps } from 'interfaces/components/atoms/inputProps'
 
export default function Input({
  placeholder,
  name, 
  value, 
  type,
  autoComplete,
  autocapitalize, 
  size, 
  color,
  accept,
  width,
  onChange,
  onClick,
  checked,
  disabled = false,
  className = '', 
  variant = 'standard', 
}: inputProps) {
 
  return (
    <InputWrapper className={`${className} ${variant}`} color={`${color || ''}`}>
      <InputStyle
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        name={name}
        value={value}
        accept={accept}
        checked={checked}
        width={width}
        onClick={onClick}
        onChange={onChange}
        autoCapitalize={autocapitalize}
        autoComplete={autoComplete === true ? `${name}` : ''}
        color={`${color || ''}`}
        className={`${className} ${size || ''} ${variant} ${disabled ? 'disabled' : ''}`}
      />
    </InputWrapper>
  );
}