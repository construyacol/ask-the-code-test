import { ChildrenReactNode } from './utils'

export interface textTypes extends ChildrenReactNode {
    className?:string | String;    
    style?:object;    
    color?:string;    
}
