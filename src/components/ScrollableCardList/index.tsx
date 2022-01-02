import { useState } from "react"
import { cardType } from "../CardInfo"
import { MiniCard } from "../MiniCard";
import "./styles.scss";

type cardListProps = {
  cards: cardType[],
  setSelectedCard?: React.Dispatch<React.SetStateAction<cardType | undefined>>
}

export function ScrollableCardList(props: cardListProps) {

  const [limitOnScreen, setLimit] = useState(29)

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) { // if element is fully "scrolled"
      setLimit(prev => prev + 45)
    }
  }


  return (
    <div onScroll={handleScroll} id="card-list" className="border border-2 rounded-top shadow-sm" style={{ padding: 0 }}>
      {props.cards && props.cards.map((card, index) => {
        if (index < limitOnScreen) {
          return props.setSelectedCard === undefined ?
            <MiniCard draggable cursor="grabbing" card={card} key={index} />
            :
            <button key={index} style={{ padding: 0, height: 'max-content', cursor: 'pointer !important', borderStyle: 'none' }} onClick={() => { props.setSelectedCard && props.setSelectedCard(card) }} >
              <MiniCard cursor="pointer" draggable={false} card={card} key={index} />
            </button>
        } else {
          return
        }
      }
      )}
    </div>
  )
}