import { useSelector } from "react-redux";
import { merge } from 'lodash'
import { BiEdit } from "react-icons/bi";
import { 
    ContactLocationItem,
    ContactLocationContent,
    EditButton,
} from './styles'




const ContactLocationComponent = (props:any) => {
    // const currentPendingRequirement = props?.levelRequirements?.pendingRequirements[0]
    const { user  } = useSelector(({ modelData }:any) => modelData);
    const contactLocationData = merge(user?.contact, user?.location)

    console.log('||||||||| ContactLocationComponent ==> ', contactLocationData)
    // debugger
    // 
    // FloatContainer

    return(
        <>
            <h3 className="fuente">
                Datos de contácto y residencia 
            </h3>

            <ContactLocationContent> 

                {   
                    contactLocationData &&
                        Object.entries(contactLocationData).map((item, index) => {
                            const itemKey = item[0];
                            const itemData:string = item[1] as string;

                            if(![
                                "phone", 
                                "email",
                                "country", 
                                "province",
                                "city",
                                "address"
                            ].includes(itemKey))return null;

                            const isEditable = ["phone", "email"].includes(itemKey)

                            return(
                                <ContactLocationItem key={index} className={`${isEditable ? 'isEditable' : ''}`}>
                                    <EditButton className="_editButton">
                                        <p className="fuente edit_p">Editar</p>
                                        <BiEdit 
                                            size={20}
                                            color="var(--paragraph_color)"
                                        />
                                    </EditButton>
                                    <p className="fuente contactLocationKey">{itemKey}</p>
                                    <p className="fuente2 contactLocationData">{itemData}</p>
                                </ContactLocationItem>
                            )
                        })
                }
            </ContactLocationContent>
        </>
    )
}


export default ContactLocationComponent