

const DefaultComponent = () => ( <p>No hay vista asignada</p> )

const RenderSwitchComponent = (props:any) => {

  const { STAGE_COMPONENTS, component } = props
  const RenderComponent:any = STAGE_COMPONENTS[component as keyof typeof STAGE_COMPONENTS] || STAGE_COMPONENTS.default || DefaultComponent

  return (
    <RenderComponent {...props}/>
  )

};


export default RenderSwitchComponent