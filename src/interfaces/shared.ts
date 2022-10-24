import { ChildrenReactNode } from './utils'

// <HTMLButtonElement, Partial<buttonTypes> & extraOptions></buttonTypes>
// const InfoStateComponent = (props:React.AllHTMLAttributes<infoProps>) => {
export interface textTypes extends ChildrenReactNode {
    className?:string | String;    
    style?:object;    
    color?:string;   
    skeleton?:boolean; 
    size?:number;
}
