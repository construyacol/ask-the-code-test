import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { LoaderView, DepositOrder } from "../widgets/activityList/order_item";
import UseActivity from '../hooks/useActivity'
import InifiniteScrollComponent from "../widgets/activityList/infiniteScroll";
import emptyImg from './assets/referrals.png'
// import OrderItem from "../widgets/activityList/order_item";
// import { useParams } from "react-router-dom";
import useViewport from '../../hooks/useWindowSize'




const ReferralActivity = ({ coinsendaServices }) => {

  const [ loader, setLoader ] = useState(true)
  const { activityList, setActivityList } = UseActivity()


  useEffect(() => {

    const LoadActivity = async() => {
      const res = await coinsendaServices.get_referral_deposits();
      !res && setActivityList(false)
    }

    if(activityList && !activityList.length){
      LoadActivity()
    }else{
      setLoader(false)
    }

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

  return(
    <>
        {
          !activity ?
          <EmptyStateList
            isMovilViewport={isMovilViewport}
            label="Aún no tienes comisiones acreditadas de tus referidos, compárte el link de referido y empieza a recibir tus comisiones..."
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
                    return <OrderItem key={index}>
                              <DepositOrder
                                index={index}
                                order={item}
                                key={index}
                              />
                          </OrderItem>
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

const OrderItem = styled.div`
  transition: 0.1s;
  perspective: 2000px;
  opacity: 1;
  width: 100%;
  max-width: 800px;
`


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
        <img src={emptyImg} width="110px" alt=""/>
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
