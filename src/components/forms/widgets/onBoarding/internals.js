import {
    TitleContainer,
    StatusHeaderContainer
} from './styles'
import { P } from 'core/components/atoms'
// import { HowToWorkCta } from 'core/components/molecules'
// import { useActions } from 'hooks/useActions'
// import { ModalLayout } from 'core/components/layout'
// import ReactPlayer from 'react-player/youtube';
// import { IconClose } from "components/widgets/shared-styles";



// const InternalsHowToWorks = () => {
//   return(
//     <ModalLayout>
//           <IconClose theme="dark" size={20} top={15} right={15} />
//           <ReactPlayer
//             url="https://www.youtube.com/watch?v=HOGsUJ3o1I4"
//             controls={true}
//             playing={true}
//             width="100%"
//             height="100%"
//             config={{
//               youtube: {
//                 playerVars: { modestbranding: 1, controls: 1, autoplay: 1 },
//               },
//             }}
//           />
//     </ModalLayout>
//   )
// }

export const InternalOnBoarding = ({
    children
  }) => {

    // const actions = useActions()

    // const showHowToWorks = () => {
    //   actions.renderModal(() => <InternalsHowToWorks></InternalsHowToWorks>)
    // }

    return(
        <>
          <StatusHeaderContainer>
            <TitleContainer>
              <h1 className="fuente">Envío a personas</h1>
            </TitleContainer>
            <div>
            <P size={14} lineHeight={21}>Ahora puedes envíar dinero de forma instantanea y gratuita a cualquier persona vinculada o no a Coinsenda por medio de su <strong>correo electrónico</strong></P>
            {/* <HowToWorkCta onClick={showHowToWorks} /> */}
            </div>
          </StatusHeaderContainer>
          {children}
        </>
    )
}
