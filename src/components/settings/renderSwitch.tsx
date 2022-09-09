import ContactLocationComponent from './contactLocation'
import IdentityListComponent from './identityList'

const RenderComponent = (props:any) => {
    const { component } = props
    let View = component as Element
    const Views = {
      location: <ContactLocationComponent {...props}/>, 
      identity: <IdentityListComponent {...props} />
    };
    return Views[View] || <div>No hay vista disponible</div>;
};


export default RenderComponent