import { ChildrenReactNode } from './utils'

export interface titleSection extends ChildrenReactNode {
    titleKey?:string | String; 
    skeleton?:boolean;
    className?:string | String;
    subMenuRef?:React.RefObject<HTMLInputElement>;
    subTitle?:string | String; 
    handleAction?:() => void; 
    iconClass?:string | String;
}

export type params = { primary_path?:string }
