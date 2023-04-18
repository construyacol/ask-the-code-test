import { HowWorkContainer } from './styles'
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { P } from 'core/components/atoms'

type Props = {
  onClick?: () => void;
  label?: string;
};

export default function HowToWorkCta({ onClick, label="Ver cómo funciona" }:Props): JSX.Element{
  return(
    <HowWorkContainer onClick={onClick}>
      <AiOutlinePlayCircle 
        size={20}
        color="var(--primary)"
      />
      <P size={14} className="no-margin" color="primary">{label}</P>
    </HowWorkContainer>
  )
}