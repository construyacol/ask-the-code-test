import Confetti from "react-confetti";

const ConfettiComponent = props => {
  return(
    <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={80}
            gravity={0.05}
            recycle={true}
            opacity={0.6}
    />
  )
}

export default ConfettiComponent
