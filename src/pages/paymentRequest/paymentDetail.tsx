import { useEffect, useState } from 'react'
import DetailTemplateComponent from 'components/widgets/detailTemplate'
import { ContentDetail, SubTitle } from 'components/forms/widgets/success/styles'
import { paymentDetailProps } from 'interfaces/paymentRequest';

const PaymentDetail = ({ uiCurrencyName, amount }:paymentDetailProps) => {

    const [ paymentDetail, setPaymentDetail ] = useState<any>([])
 
    useEffect(() => {
          let _paymentDetail = []
          // _paymentDetail.push(["Moneda", uiCurrencyName])
          _paymentDetail.push(["Cantidad a pagar", `${amount?.toFormat() || 0} ${uiCurrencyName}`])
          _paymentDetail.push(["Costo", `0 ${uiCurrencyName}`])
          setPaymentDetail(_paymentDetail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount])
 
    return(
       <>
          <SubTitle className="fuente no-margin-bottom">Datos del pago</SubTitle>
          <ContentDetail className="onBottom">
             <DetailTemplateComponent
                skeletonItems={2}
                items={paymentDetail}
             />
          </ContentDetail>
       </>
    )
 }

 export default PaymentDetail