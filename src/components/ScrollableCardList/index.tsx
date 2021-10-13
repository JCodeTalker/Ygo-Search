import { useState } from "react"
import { cardType } from "../CardInfo"
import { MiniCard } from "../MiniCard";
import "./styles.scss";

type cardListProps = {
  cards: cardType[]
}

export function ScrollableCardList(props: cardListProps) {

  const [limit, setLimit] = useState(29)

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) { // if element is fully "scrolled"
      setLimit(prev => prev + 45)
    }
  }


  return (
    <div onScroll={handleScroll} id="card-list" style={{ padding: 0 }}>
      {props.cards && props.cards.map((card, index) => {
        if (index < limit) {
          return <MiniCard card={card} key={index} />
        }
      }
      )}
    </div>
  )
}