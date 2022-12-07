
import { LabelStyle } from './styles';
import { CommonProps } from 'interfaces/utils'

export default function Label({
  size,
  children,
  color,
  className = ''
}: Pick<CommonProps, 'className' | 'size' | 'children' | 'color'>) {
  return (
    <LabelStyle className={`${className} ${size || ''}`} color={`${color || ''}`}>
      {children}
    </LabelStyle>
  );
}