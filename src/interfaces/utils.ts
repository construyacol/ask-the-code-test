export type Return_ObjectString = {
  [key: string]: string;
};
export type Return_ObjectNumber = {
  [key: string]: number;
};
export type ChildrenReactNode = {
  children?: React.ReactNode;
};
export type CommonProps = ChildrenReactNode & {
  color?:
    | `#${string}`
    | `rgba(${string})`
    | `rgb(${string})`
    | 'black'
    | 'text_color'
    | 'title_color'
    | 'skeleton_color'
    | 'primary'
    | 'secondary_background'
    | 'orange_color'
    | 'orange_background'
    | 'green_background'
    | 'green_color';
  className?: string;
  size?: 'large' | 'medium' | 'small';
};


export interface InputCommonProps extends CommonProps {
  variant?: 'outlined' | 'filled' | 'standard';
  name?: string;
  disabled?: boolean,
} 