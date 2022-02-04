 import styled from 'styled-components'

 const EfectyDisclaimer = (params) => {
     
    return(
        <Layout>
            <h3 className="fuente">Ten presente para reclamar en Efecty:</h3>
            <ul className="fuente">
                <li>Llevar tu documento original</li>
                <li>Indicar el nombre del convenio PHI Pagos <span className="fuente2">111680</span></li>
                <li>Tienes hasta <span className="fuente2">30</span> días para reclamar una vez hecho tu retiro</li>
            </ul>
        </Layout>
    )
 }

 export default EfectyDisclaimer


 const Layout = styled.section`
   width: 100%;
   height:auto;
   margin-top:30px;
   h3, p, ul{
       color:white;
   }
   ul{
       margin-top:40px;
   }
   li{
    margin: 10px 0;
   }
 `

//  Ten presente que para reclamar en Efecty:

// - Debes llevar tu documento original.
// - Indicar el nombre del convenio PHI Pagos 111680.
// - Los retiros que no sean reclamados después de 30 días serán devueltos por Efecty.