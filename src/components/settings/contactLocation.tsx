import { useSelector } from "react-redux";
import { merge } from 'lodash'
import { BiEdit } from "react-icons/bi";
import { UI_DETAIL_NAME } from 'const/uiNames'
import { 
    DetailItem,
    ItemDetailContainer,
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

            <ItemDetailContainer> 

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
                                <DetailItem key={index} className={`${isEditable ? 'isEditable' : ''}`}>
                                    {/* <EditButton className="_editButton">
                                        <p className="fuente edit_p">Editar</p>
                                        <BiEdit 
                                            size={20}
                                            color="var(--paragraph_color)"
                                        />
                                    </EditButton> */}
                                    <p className="fuente itemKey">{UI_DETAIL_NAME[itemKey as keyof typeof UI_DETAIL_NAME] || itemKey}</p>
                                    <p className="fuente2 itemData">{itemData}</p>
                                </DetailItem>
                            )
                        })
                }
            </ItemDetailContainer>
        </>
    )
}


export default ContactLocationComponent