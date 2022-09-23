import { useParams  } from "react-router-dom";
import {
    TitleContainer,
    SubContainer,
    SubTitle,
    Title
} from './styles'
import { titleSection, params } from 'interfaces/tittleSection'
import { UI_NAME_TITLE } from 'const/uiNames'



export default function TitleSection({ 
    titleKey, 
    skeleton, 
    children, 
    className = "",
    subMenuRef,
    subTitle
}:titleSection) {

    const params:params = useParams()
    const key = titleKey || params.primary_path
    const title = UI_NAME_TITLE[key as keyof typeof UI_NAME_TITLE] || key
   
    return(
        <TitleContainer 
            className={`accountDetailTitle ${className} ${key}`}
            ref={subMenuRef}
        >
            <Title className={`fuente ${skeleton ? 'skeleton' : ''}`}>
                <span className={`${subTitle ? '_breadCrumbParent' : ''}`}>{skeleton ? 'Loading module' : title}</span>
                {
                    subTitle && <span className={`_mainBreadCrumb`}>{subTitle}</span>
                }
            </Title>
            {children}
        </TitleContainer>
    )
}

export const SubTitleSection = ({ 
    titleKey, 
    skeleton, 
    children, 
    handleAction, 
    iconClass
}:titleSection) => {

    const params:params = useParams()
    const key = titleKey || params.primary_path
    const title = UI_NAME_TITLE[key as keyof typeof UI_NAME_TITLE] || key

    return(
        <SubContainer>
            <SubTitle 
                className={
                    `fuente ${skeleton ? 'skeleton' : ''} 
                      ${handleAction ? 'cta' : ''}
                      ${iconClass ? 'withIcon' : ''}
                    `
                } 
                onClick={handleAction}
            >
                {
                    iconClass &&
                      <i className={`${iconClass ? iconClass : ''}`}></i>
                }
                {skeleton ? 'Loading module' : title}
            </SubTitle>
            {children}
        </SubContainer>
    )
}
