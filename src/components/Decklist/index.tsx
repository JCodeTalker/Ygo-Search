import { useEffect, useState } from "react"
import { useDrop } from "react-dnd"
import { cardType } from "../CardInfo"
import { MiniCard } from "../MiniCard"
import './styles.scss'

type cardObj = {
  name: string,
  content?: cardType,
  count: number
}

type cardListType = cardObj[]

type dropItemType = {
  id: number, cardData: cardType, name: string
}


export function Decklist() {

  const lista: cardListType =
    [{
      name: '',
      count: 0
    }]

  const [mainDeck, setMainDeck] = useState<cardListType>()
  const [mainDeckDrop, setMainDrop] = useState<dropItemType>()

  const [extraDeck, setExtraDeck] = useState<cardListType>()
  const [extraDeckDrop, setExtraDrop] = useState<dropItemType>()


  const [{ canDrop, isOver, didDrop }, drop,] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: dropItemType, monitor) => {
      setMainDrop(item)
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
      didDrop: monitor.didDrop()
    })
  }))


  const [, drop2] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: dropItemType, monitor) => {
      setExtraDrop(item)
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
      didDrop: monitor.didDrop()
    })
  }))

  function preventFourthCardCopy(cardDropped: dropItemType | undefined, deckPart: cardListType | undefined, setListState: React.Dispatch<React.SetStateAction<cardListType | undefined>>) {
    if (cardDropped !== undefined) {

      let index = -1

      if (deckPart) {
        index = deckPart.findIndex(x => x.name === cardDropped.name)
      }


      if (index !== -1 && deckPart && deckPart[index].count < 3) {
        let newList = deckPart.filter((item, pos) => pos !== index)

        setListState([
          ...newList,
          {
            name: cardDropped.name,
            content: cardDropped.cardData,
            count: deckPart[index].count + 1
          }
        ])
      } else {
        if (index === -1 && deckPart) {
          console.log(deckPart)
          let list = deckPart
          list.push({ name: cardDropped.name, count: 1, content: cardDropped.cardData })
          // deckPart?.length > 0 ? setListState(prev => [...prev, { name: cardDropped.name, count: 1, content: cardDropped.cardData }]) : setListState([{ name: cardDropped.name, count: 1, content: cardDropped.cardData }])
          setListState(list)
        } else {
          setListState([{ name: cardDropped.name, count: 1, content: cardDropped.cardData }])
        }
      }
    }
  }

  useEffect(() => {
    preventFourthCardCopy(mainDeckDrop, mainDeck, setMainDeck)
  }, [mainDeckDrop])

  useEffect(() => {
    // if (extraDeck) {
    preventFourthCardCopy(extraDeckDrop, extraDeck, setExtraDeck)
    // }
  }, [extraDeckDrop])

  function toCardList(card: cardObj) {
    let cards = []
    for (let i = 0; i < card.count; i++) {
      cards.push(card.content && <MiniCard card={card.content} key={i} />)
    }

    return cards
  }


  return (
    <>
      <div id="main-deck" ref={drop}>
        {mainDeck?.map((card) => toCardList(card))}
      </div>

      <div id="extra-deck" ref={drop2}>
        {extraDeck?.map(card => toCardList(card))}
      </div>
    </>
  )
}