import { FormEvent, useEffect, useState } from "react"
import { useDrop } from "react-dnd"
import { useAuth } from "../../hooks/useAuth"
import { firestoreDb } from "../../services/firebase"
import { cardType } from "../CardInfo"
import { MiniCard } from "../MiniCard"
import './styles.scss'

export type cardObj = {
  name: string,
  content?: cardType,
  count: number
}

export type cardListType = cardObj[]

type dropItemType = {
  id: number, cardData: cardType, name: string
}

type DeckProps = {
  saveButton: boolean,
  mainDeckCards?: cardListType,
  extraDeckCards?: cardListType
}

export function Decklist(props: DeckProps) {


  const [mainDeck, setMainDeck] = useState<cardListType>()
  const [mainDeckDrop, setMainDrop] = useState<dropItemType>()

  const [extraDeck, setExtraDeck] = useState<cardListType>()
  const [extraDeckDrop, setExtraDrop] = useState<dropItemType>()
  const [deckName, setDeckName] = useState("")
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

  async function saveRecipe(event: FormEvent) {
    event.preventDefault()
    if (user) {
      let batch = firestoreDb.batch()

      mainDeck?.forEach(card => {
        batch.set(firestoreDb.collection('usuarios').doc(`${user.name}/${deckName}/${card.name}`), card)
      })
      extraDeck?.forEach(card => {
        batch.set(firestoreDb.collection('usuarios').doc(`${user.name}/${deckName}/Extra Deck/Extra Deck/${card.name}`), card)
      })
      batch.commit()
      alert('Recipe saved.')
    } else {
      alert("You must login in before saving a deck.")
    }
  }

  useEffect(() => {
    if (mainDeck && provideDeckPartLength(mainDeck) === 61) {
      return
    }
    mainDeckDrop && addDropToDeck(mainDeckDrop, mainDeck, setMainDeck)
  }, [mainDeckDrop])

  useEffect(() => {
    if (extraDeck && provideDeckPartLength(extraDeck) === 16) {
      return
    }
    extraDeckDrop && addDropToDeck(extraDeckDrop, extraDeck, setExtraDeck)
  }, [extraDeckDrop])

  useEffect(() => {
    if (props.mainDeckCards) {
      setMainDeck(props.mainDeckCards)
    }
    if (props.extraDeckCards) setExtraDeck(props.extraDeckCards)
  }, [props.mainDeckCards, props.extraDeckCards])

  function toMiniCard(card: cardObj) {
    let miniCards = []
    for (let i = 0; i < card.count; i++) {
      miniCards.push(card.content && <MiniCard card={card.content} key={i} />)
    }

    return miniCards
  }

  function provideDeckPartLength(deckPart: cardListType) {
    return deckPart.reduce((total: number, card) => {
      return total + card.count
    }, 1)
  }

  return (
    <>
      {/* <!-- Modal --> */}
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Name your new deck</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={saveRecipe}>
                <div className="mb-3">
                  <label htmlFor="deckName" className="form-label">Enter a deck name:</label>
                  <input type="text" className="form-control" id="deckName" onChange={event => setDeckName(event.target.value)} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={saveRecipe} >Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <div id="main-deck" ref={drop} className="rounded">
        {mainDeck?.map((card) => toMiniCard(card))}
      </div>
      {mainDeck && provideDeckPartLength(mainDeck) >= 41 ?
        <button type="button" className={`btn btn-primary m-3 position-fixed bottom-0 end-0 ${!props.saveButton && 'invisible'}`} data-bs-toggle="modal" data-bs-target="#exampleModal" >
          Save recipe
        </button>
        : ""}
      {/* <div id="alert" className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }} data-bs-dismiss="toast"></div> */}
      <div id="extra-deck" ref={drop2} className="rounded">
        {extraDeck?.map(card => toMiniCard(card))}
      </div>
    </>
  )
}