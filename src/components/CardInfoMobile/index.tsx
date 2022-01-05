import { AddToWishlistButton } from "../AddToWishListButton"
import { cardType } from "../CardInfo"
import "./styles.scss";

type cardMobileProps = {
  cardData: cardType
}

export function CardMobile(props: cardMobileProps) {
  return (
    <>
      <div className="card mt-2" >
        <img src={props.cardData.card_images[0].image_url} alt="..." style={{ width: "100%" }} />
        <h5 className="card-title p-3 m-0 border-bottom"> {props.cardData.name} </h5>
        <div className="card-body">
          <div className="card-text" style={{ whiteSpace: 'pre-wrap', textAlign: 'initial' }} > {props.cardData.desc}
            <br />
          </div>
        </div>
        <span className="p-2 mx-auto border-top" >
          {props.cardData.atk ? <p className="m-0"><em>ATK:</em> {props.cardData.atk} <em>{`${props.cardData.type !== "Link Monster" ? "| DEF:" : ""}`}</em> {props.cardData.def} </p> : ''}
          <AddToWishlistButton card={props.cardData} />
        </span>
      </div>
    </>
  )
}