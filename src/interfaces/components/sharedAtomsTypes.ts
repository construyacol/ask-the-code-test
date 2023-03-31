// @ts-nocheck
import { ChildrenReactNode } from 'interfaces/utils';

export interface buttonTypes extends ChildrenReactNode {
  size?: 'large' | 'medium' | 'small';
  className?: string | String;
  variant?: 'text' | 'contained' | 'outlined';
  color?: string | String;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  href?: string | String | LocationDescriptor<unknown>;
}

export interface textTypes extends ChildrenReactNode {
    size?: 'large' | 'medium' | 'small';
    className?: string;
}
