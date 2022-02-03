import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { LoaderView, DepositOrder } from "../widgets/activityList/order_item";
import UseActivity from '../hooks/useActivity'
import InifiniteScrollComponent from "../widgets/activityList/infiniteScroll";
// import OrderItem from "../widgets/activityList/order_item";
// import { useParams } from "react-router-dom";
import useViewport from '../../hooks/useWindowSize'
import { device } from "../../const/const";
import IconSwitch from '../widgets/icons/iconSwitch'
import { OrderContainer } from '../widgets/activityList/order_item'
import { useActions } from "../../hooks/useActions";
import OtherModalLayout from "../widgets/modal/otherModalLayout";

const ReferralActivity = ({ coinsendaServices }) => {

  const [ loader, setLoader ] = useState(true)
  const { activityList, setActivityList } = UseActivity([])


  const LoadActivity = async() => {
    const res = await coinsendaServices.get_referral_deposits();
    console.log('||||||||||  LoadActivity ', res)
    if(!res) setActivityList(false);
  }

  useEffect(() => {
    if(activityList && !activityList.length){
      LoadActivity()
    }else{
      setLoader(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityList])


  return(
        <ActivityList
          activity={activityList}
          loader={loader}
          setLoader={setLoader}
          // AuxComponent={[
          //   () => (<OneComponent/>),
          //   () => (<SecondComponent/>)
          // ]}
        />
  )

}


export default ReferralActivity



const ActivityList = ({ loader, setLoader, activity, AuxComponent }) => {

  const { isMovilViewport } = useViewport()
  const actions = useActions();

  const closeModal = (e, forceClose) => {
    if (e && (e.target.dataset.close_modal || forceClose)) {
      actions.isAppLoading(false);
      actions.renderModal(null);
      // history.goBack()
    }
  };

  const orderDetail = async(order) => {
    const Elements = await import("../widgets/modal/render/orderDetail/index.js");
    const { OrderDetail } = Elements
    await actions.renderModal(() => (
        <OtherModalLayout
        // id="close-button-with-OtherModalLayout"
        on_click={closeModal}
      >
        <OrderDetail currentOrder={order} tx_path={'deposits'}/>
      </OtherModalLayout>
    ))
  }

  return(
    <>
        {
          !activity ? 
          <EmptyStateList
            isMovilViewport={isMovilViewport}
            label="Aún no tienes comisiones acreditadas, compárte tu link de referido y empieza a recibir incentivos."
          />
          :
          (activity && activity.length < 1) ?
          <LoaderView/>
          :
          <ComponentsContainer>
            {AuxComponent && <AuxComponentContainer AuxComponent={AuxComponent} />}
              <ActivityGrid
                title={`${activity ? 'Comisiones de referidos' : ''}`}
                className={`${isMovilViewport ? 'isMovil' : ''}`}
                >
                {
                  activity && activity.map((item, index) => {
                    return (
                      <OrderContainer
                      id={`${item.id}`}
                      onClick={() => orderDetail(item)}
                      key={index}
                    >
                      <DepositOrder
                        index={index}
                        order={item}
                        key={index}
                      />
                    </OrderContainer>
                    )
                  })
                }
              <InifiniteScrollComponent
                setLoader={setLoader}
                loader={loader}
                activityLength={activity && activity.length}
              />
            </ActivityGrid>
        </ComponentsContainer>
        }
    </>
  )

}


const AuxComponentContainer = ({ AuxComponent }) =>
  typeof AuxComponent === "function" ? (
    <AuxComponent />
  ) : (
    typeof AuxComponent === "object" &&
    AuxComponent.map((SingleAuxComponent, idItem) => {
      return <SingleAuxComponent key={idItem} />;
    })
  );

const EmptyStateList = ({ label, isMovilViewport }) => {


  return(
    <EmptyStateGrid>
      <EmptyStateCont className={`${isMovilViewport ? 'isMovil' : ''}`}>
        <IconSwitch size={110} icon="referralEmptyState" />
        <p className="fuente">{label}</p>
      </EmptyStateCont>
    </EmptyStateGrid>
  )

}



const EmptyStateCont = styled.div`
  display: grid;
  justify-items: center;
  padding: 50px 100px;

  &.isMovil{
    padding: 0;
    p{
      padding: 0 20px;
    }
  }

  p{
    text-align: center;
  }

  @media ${device.laptopL} {
    padding: 15px 50px;
  }

`

const EmptyStateGrid = styled.section`
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
`

const ActivityGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, 80px);
  height: auto;
  grid-auto-flow: row dense;
  min-height: 100%;
  grid-row-gap: 20px;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  padding-top: 50px;
  margin-bottom:50px;
  justify-items:center;
  position: relative;


  &::after{
    content:attr(title);
    position: absolute;
    top: 0;
    left: 0;
  }

  ${'' /* .accepted{
    width: 100%;
    max-width: 750px;
  } */}

  ${'' /* &.isMovil{
    .accepted{
      width: calc(100% - 50px);
    }
  } */}

  div.shower>div{
    ${'' /* width: 100%; */}
  }
`

const ComponentsContainer = styled.section`
  width: 100%;
  height: auto;
  position: relative;
  display: grid;
  row-gap: 25px;
`
