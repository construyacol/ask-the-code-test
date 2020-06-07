import React from 'react'
import styled from 'styled-components'

const OrderItem = props => {

  return(
    <LoaderItem {...props} />
  )

}


export default OrderItem

const LoaderItem = (props) => {

  const loaderItems = new Array(props.arrayLength || 3).fill({})

  return(
    <ActivityLayout>
      {!props.arrayLength && <p className="titleActivity"></p>}
      <LayoutList>

        {
          loaderItems.map((e, key) =>{
            return(
              <OrderContaner key={key}>
                <Order>
                  <DataContainer className="align_first loader">
                    <div className="loaderImg"></div>
                    <div className="loaderElement"></div>
                  </DataContainer>

                  <DataContainer className="align_middle loader">
                    <div className="loaderElement"></div>
                  </DataContainer>

                  <DataContainer className="align_last loader">
                    <div className="loaderElement"></div>
                  </DataContainer>
                </Order>
              </OrderContaner>
            )
          })
        }


      </LayoutList>
    </ActivityLayout>
  )
}


export const Order = styled.div`
  border: 1px solid #8080808f;
  border-radius: 6px;
  height: 73px;
  cursor: pointer;
  display: grid;
  align-items: center;
  padding: 0 25px;
  position: relative;
  overflow: hidden;
  transition: .3s;
  transform-origin: top;
`

export const DataContainer = styled.div`

  width: auto;
  position: absolute;
  align-self: center;


  &.align_first{
    justify-self: start;
    margin-left: 20px;
  }
  &.align_middle{
    justify-self: center;
  }
  &.align_last{
    justify-self: end;
    margin-right: 20px;
  }

  &.align_first.loader{
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 10px;
    align-items: center;
  }

  .loaderImg{
    height: 35px;
    width: 35px;
    background: #cacaca;
    border-radius: 50%;
  }

  .loaderElement{
    width: 100px;
    height: 13px;
    background: #cacaca;
    border-radius: 4px;
  }

  &.loader{
    animation-name: orderLoader;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    opacity: .5;
  }

  @keyframes orderLoader{
    0%{
      opacity: .5;
    }
    70%{
      opacity: 1;
    }
    100%{
      opacity: .5;
    }
  }


`

export const OrderContaner = styled.div`
  transition: .3s;
  perspective: 2000px;
  transform: scale(.98);
`


export const ActivityLayout = styled.section`
  width: 100%;
  height: auto;
  position: relative;

  .titleActivity{
    margin-bottom: 15px;
    height: 16px;
    width: 115px;
    background: #cacaca;
    border-radius: 4px;
  }
`


export const LayoutList = styled.section`
  display: grid;
  grid-template-rows: repeat(auto-fill, 80px);
  height: auto;
  grid-auto-flow: row dense;
  min-height: 100%;
  grid-row-gap: 20px;
  transform-style: preserve-3d;
`
