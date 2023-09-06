import { useEffect, useState } from 'react'
import DetailTemplateComponent from 'components/widgets/detailTemplate'
import { ContentDetail, SubTitle } from 'components/forms/widgets/success/styles'

const PaymentDetail = ({ uiCurrencyName, amount, cost }:any) => {

    const [ paymentDetail, setPaymentDetail ] = useState<any>([])
 
    useEffect(() => {
          let _paymentDetail = []
          // _paymentDetail.push(["Moneda", uiCurrencyName])
          _paymentDetail.push(["Cantidad a pagar", `${amount || 0} ${uiCurrencyName}`])
          _paymentDetail.push(["Costo", `${cost} ${uiCurrencyName}`])
          setPaymentDetail(_paymentDetail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, cost])
 
    return(
       <>
          <SubTitle className="fuente no-margin-bottom">Datos del pago</SubTitle>
          <ContentDetail className="onBottom __contentDetail">
             <DetailTemplateComponent
                skeletonItems={2}
                items={paymentDetail}
             />
          </ContentDetail>
       </>
    )
 }

 export default PaymentDetail