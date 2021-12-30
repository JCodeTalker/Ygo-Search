import { LazyLoadImage } from "react-lazy-load-image-component"
import { cardType } from "../CardInfo"
import cardBack from '../../images/card-back-2.jpg'
import { useDrag } from "react-dnd"
import "./styles.scss";

type propsType = {
  card: cardType,
  draggable: boolean,
  cursor: string
}

export function MiniCard(props: propsType) {

  const [, dragRef] = useDrag({ // looks like it doesn't work too down in the component's tree
    type: 'CARD',
    item: () => {
      return { name: props.card.name, id: props.card.id, cardData: props.card, draggable: props.draggable }
    }
  })

  return (
    <div ref={dragRef} draggable={false} style={{ height: "min-content" }} data-bs-toggle="tooltip" data-bs-placement="right" title={props.card.name}>
      <LazyLoadImage
        className="mini-card"
        placeholderSrc={cardBack}
        effect="blur"
        src={props.card.card_images[0].image_url_small}
        alt="card"
        style={{ cursor: props.cursor }}
      />
    </div>
  )
}