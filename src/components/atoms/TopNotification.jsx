import { CAPACITOR_PLATFORM, CAPACITOR_PLATFORMS } from 'const/const';
import styled from 'styled-components';

const Container = styled.div`
  height: 40px;
  line-height: 40px;
  width: 100%;
  background: #1ABC9C;
  text-align: center;
  color: #FFFFFF;
  font-family: sans-serif;
  font-weight: lighter;
  font-size: 14px;
  p {
    padding: 0;
    margin: 0;
  }
  p a {
    padding: 5px 10px;
    border-radius: 3px;
    background: #FFF;
    color: #1ABC9C;
    font-weight: bold;
    text-decoration: none;
  }
`

const APP_URL = CAPACITOR_PLATFORM === CAPACITOR_PLATFORMS.ANDROID ? 'https://play.google.com/store/apps/details?id=app.coinsenda' : '';

export function TopNotification() {
    return (
        <Container>
            <p>Una nueva vesión de la app está disponible <small><a href={APP_URL}>Descargar</a></small></p>
        </Container>
    )
  }