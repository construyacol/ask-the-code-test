import loadable from '@loadable/component'


const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))


const RenderAuxComponent = ({ AuxComponent, ...props }) => {

  return(
    typeof AuxComponent === "object" ?
      AuxComponent.map((SingleAuxComponent, idItem) => {
        if(!SingleAuxComponent){return null}
        if(typeof SingleAuxComponent === 'string'){return <DynamicLoadComponent key={idItem} component={SingleAuxComponent} {...props}/>}
        return <SingleAuxComponent key={idItem} />;
      }) 
    :
    typeof AuxComponent === "string" ?
      <DynamicLoadComponent component={AuxComponent} {...props}/>
    : typeof AuxComponent === "function" &&
      <AuxComponent {...props}/>
  )
}

export default RenderAuxComponent