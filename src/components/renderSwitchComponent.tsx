

const DefaultComponent = () => ( <p>No hay vista asignada</p> )

function RenderSwitchComponent(props: any): JSX.Element {

  const { STAGE_COMPONENTS, component } = props;
  const RenderComponent: any = STAGE_COMPONENTS[component as keyof typeof STAGE_COMPONENTS] || STAGE_COMPONENTS.default || DefaultComponent;

  return(
    <RenderComponent {...props}>
      {props.children}
    </RenderComponent>
  );

}


export default RenderSwitchComponent