import { LazyLoadImage } from "react-lazy-load-image-component"
import { cardType } from "../CardInfo"
import cardBack from '../../images/card-back-2.jpg'
import { useDrag } from "react-dnd"
import "./styles.scss";
import { useState } from "react";

type propsType = {
  card: cardType
}

export function MiniCard(props: propsType) {

  const [dropCount, setCount] = useState(0)

  const [{ isDragging, didDrop }, dragRef] = useDrag({ // looks like it doesn't work too down in the component's tree
    type: 'CARD',
    item: () => {
      return { name: props.card.name, id: props.card.id, cardData: props.card }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      didDrop: monitor.didDrop()
    })
  })

  // useEffect(() => {
  //   setCount(prev => prev + 1)
  //   console.log(dropCount)
  // }, [didDrop])

  return (
    <div ref={dragRef} style={{ height: "min-content" }}>
      {/* <span ref={dragRef}> */}
      <LazyLoadImage
        className="mini-card"
        // className={isDragging ? 'isDragging' : ''}
        placeholderSrc={cardBack}
        effect="blur"
        src={props.card.card_images[0].image_url_small}
        alt="card"
        style={{ cursor: 'grabbing' }}
      />
      {/* </span> */}
    </div>
  )
}