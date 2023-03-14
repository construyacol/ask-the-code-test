import { HowWorkContainer } from './styles'
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { P } from 'core/components/atoms'

type Props = {
  onClick: () => void;
};

export default function HowToWorkCta({ onClick }:Props): JSX.Element{
  return(
    <HowWorkContainer onClick={onClick}>
      <AiOutlinePlayCircle 
        size={20}
        color="var(--primary)"
      />
      <P size={14} className="no-margin" color="primary">Ver cómo funciona</P>
    </HowWorkContainer>
  )
}