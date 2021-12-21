import { useEffect, useState } from "react"
import { useDrop } from "react-dnd"
import { useAuth } from "../../hooks/useAuth"
import { firestoreDb } from "../../services/firebase"
import { Button } from "../Button"
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


  const [mainDeck, setMainDeck] = useState<cardListType>()
  const [mainDeckDrop, setMainDrop] = useState<dropItemType>()

  const [extraDeck, setExtraDeck] = useState<cardListType>()
  const [extraDeckDrop, setExtraDrop] = useState<dropItemType>()
  const { user } = useAuth()


  const [{ canDrop, isOver, didDrop }, drop,] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: dropItemType, monitor) => {
      if (!item.cardData.type.includes("Synchro") && !item.cardData.type.includes("XYZ") && !item.cardData.type.includes("Link") && !item.cardData.type.includes("Fusion")) {
        setMainDrop(item)
      }
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
      if (item.cardData.type.includes("Synchro") || item.cardData.type.includes("XYZ") || item.cardData.type.includes("Link") || item.cardData.type.includes("Fusion")) {
        setExtraDrop(item)
      }
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
      didDrop: monitor.didDrop()
    })
  }))

  function addDropToDeck(cardDropped: dropItemType, deckPart: cardListType | undefined,
    setListState: React.Dispatch<React.SetStateAction<cardListType | undefined>>) {

    if (!deckPart) {
      setListState([{ name: cardDropped.name, count: 1, content: cardDropped.cardData }])
      return
    }

    let cardDroppedLastIndex = deckPart.findIndex(card => card.name === cardDropped.name) // get the index of the current dropped item(if it exists)

    if (cardDroppedLastIndex === -1) {  // card not in list
      let list = deckPart
      list.push({ name: cardDropped.name, count: 1, content: cardDropped.cardData })
      setListState(list)
    }

    if (cardDroppedLastIndex !== -1 && deckPart[cardDroppedLastIndex].count < 3) {  // if card already in list
      let newList = deckPart.filter((item, pos) => pos !== cardDroppedLastIndex)
      setListState([
        ...newList,
        {
          name: cardDropped.name,
          content: cardDropped.cardData,
          count: deckPart[cardDroppedLastIndex].count + 1
        }
      ])
    } else {  // if full(i.e, already has 3 copies of the card)
      return
    }
  }


  async function saveRecipe() {
    let batch = firestoreDb.batch()

    mainDeck?.forEach(card => {
      batch.set(firestoreDb.collection('usuarios').doc(`${user?.name}/New Deck/${card.name}`), card)
    })
    batch.commit()
    alert('Recipe saved.')
  }

  useEffect(() => {
    if (mainDeck && provideLength(mainDeck) === 61) {
      return
    }
    mainDeckDrop && addDropToDeck(mainDeckDrop, mainDeck, setMainDeck)
  }, [mainDeckDrop])

  useEffect(() => {
    if (extraDeck && provideLength(extraDeck) === 16) {
      return
    }
    extraDeckDrop && addDropToDeck(extraDeckDrop, extraDeck, setExtraDeck)
  }, [extraDeckDrop])


  function toMiniCard(card: cardObj) {
    let miniCards = []
    for (let i = 0; i < card.count; i++) {
      miniCards.push(card.content && <MiniCard card={card.content} key={i} />)
    }

    return miniCards
  }

  function provideLength(deckPart: cardListType) {
    return deckPart.reduce((total: number, card) => {
      return total + card.count
    }, 1)
  }

  return (
    <>
      <div id="main-deck" ref={drop}>
        {mainDeck?.map((card) => toMiniCard(card))}
      </div>
      <button type="button" onClick={saveRecipe} className="btn btn-primary m-3 position-fixed bottom-0 end-0">
        Save recipe
      </button>
      {/* <div className="position-absolute top-3" style={{ backgroundColor: 'orange', height: '70vh', width: '80vw' }}>  </div> */}
      <div id="extra-deck" ref={drop2}>
        {extraDeck?.map(card => toMiniCard(card))}
      </div>
    </>
  )
}