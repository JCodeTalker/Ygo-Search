import { AddToWishlistButton } from "../AddToWishListButton"
import { cardType } from "../CardInfo"

type cardMobileProps = {
  cardData: cardType
}

export function CardMobile(props: cardMobileProps) {
  return (
    <>
      <div className="card mt-2" style={{ width: "fit-content" }}>
        <img src={props.cardData.card_images[0].image_url} alt="..." style={{ width: "175px" }} />
        <div className="card-body" style={{ height: "260px", overflowY: "auto" }}>
          <h5 className="card-title"> {props.cardData.name} </h5>
          <div className="card-text"> {props.cardData.desc}
            <br />
            {props.cardData.atk ? <p><em>ATK:</em> {props.cardData.atk} | <em>DEF:</em> {props.cardData.def} </p> : ''}
          </div>
          <AddToWishlistButton card={props.cardData} />
        </div>
      </div>
    </>
  )
}