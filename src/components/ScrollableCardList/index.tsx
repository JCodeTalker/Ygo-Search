import { useState } from "react"
import { cardType } from "../CardInfo"
import { dropItemType } from "../Decklist";
import { MiniCard } from "../MiniCard";
import "./styles.scss";

type cardListProps = {
  cards: cardType[],
  addCardToDeck?: (cardDropped: dropItemType) => void,
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
          return props.addCardToDeck || props.setSelectedCard ?
            <button className="clickable-card" key={index}
              onClick={() => {
                if (props.addCardToDeck) {
                  props.addCardToDeck && props.addCardToDeck({ name: card.name, cardData: card })
                }
                if (props.setSelectedCard) {
                  props.setSelectedCard && props.setSelectedCard(card)
                }
              }} >
              <MiniCard cursor="pointer" draggable={false} card={card} key={index} />
            </button>
            :
            <MiniCard draggable cursor="grabbing" card={card} key={index} />
        } else {
          return
        }
      }
      )}
    </div>
  )
}