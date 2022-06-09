import { OnlySkeletonAnimation } from "../loaders/skeleton";
import styled from 'styled-components'

export default function DetailTemplateComponent ({ items, skeletonItems = 4, ...props }){

    return(
        <>
            {
                items && items.length
                ? items.map((item, indx) => {
                    console.log('item[1]', item[1])
                    const RenderComponent = item[1]?.Component
                    return (
                    <ItemContainer
                        key={indx}
                        className={`${items.length === indx + 1 &&  props?.order?.state && props?.tx_path === "deposits" && props?.order?.state}`}
                    >
                        <LeftText className="fuente">{item[0]}</LeftText>
                        <MiddleSection />
                        {
                            RenderComponent ?
                                <RenderComponent/>
                                :
                                <RightText className="fuente2">
                                    {item[1]}
                                </RightText>
                        }
                    </ItemContainer>
                    );
                })
                : new Array(skeletonItems).fill("1").map((item, indx) => {
                    return (
                    <ItemContainer className="skeleton" key={indx}>
                        <LeftText>skeleton --</LeftText>
                        <MiddleSection />
                        <RightText>skeleton -------- </RightText>
                    </ItemContainer>
                    );
                })
            }
        </>
    )

}

const Text = styled.p`
  width: auto;
  margin: 0;
  font-size: 14px;
  color: var(--paragraph_color);
`;

export const MiddleSection = styled.span`
  border-bottom: 1px dotted;
  opacity: 0.15;
`;

export const RightText = styled(Text)`
  text-align: right;
  padding-left: 15px;
  text-transform: capitalize;
  white-space: nowrap;
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const LeftText = styled(Text)`
  text-align: left;
  padding-right: 15px;
  font-weight: bold;
`;

const ItemContainer = styled.div`
  width: 100%;
  height: 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;

  &.skeleton {
    ${OnlySkeletonAnimation}
    ${RightText}, ${LeftText} {
      background: gray;
      color: gray;
      height: 16px;
      border-radius: 3px;
      opacity: 0.5;
    }
  }

  &.pending,
  &.confirmed {
    height: 50px;
    margin-top: 10px;
    border-top: 1px solid #bfbfbf;
    align-items: center;
    ${RightText}, ${LeftText} {
      font-size: 18px;
      color: var(--paragraph_color);
    }
    ${RightText} {
      font-size: 20px;
      font-weight: bold;
    }
  }
`;
