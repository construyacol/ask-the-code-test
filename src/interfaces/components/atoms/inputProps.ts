
import { InputCommonProps } from '../../utils';

export interface inputProps extends InputCommonProps {
  type?: string;
  value?: string;
  accept?: string;
  placeholder?: string;
  autocapitalize?: string;
  width?: string;
  autoComplete?: boolean;
  checked?: boolean,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  onClick?: React.MouseEventHandler<HTMLInputElement>
}

export type OptionInputProps = inputProps & {
  type: 'radio' | 'checkbox';
  uiName?: string; 
  checked?: boolean,
}
