import { FormEvent, useEffect, useState } from "react"
import { useDrop } from "react-dnd"
import { useAuth } from "../../hooks/useAuth"
import { firestoreDb } from "../../services/firebase"
import { cardType } from "../CardInfo"
import { MiniCard } from "../MiniCard"
import firebase from 'firebase/compat/app'
import './styles.scss'

export type cardObj = {
  name: string,
  content?: cardType,
  count: number
}

export type cardListType = cardObj[]

type dropItemType = {
  id: number, cardData: cardType, name: string, draggable: boolean
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
  const [deckLength, setDeckLength] = useState(0)
  const [extraDeckLength, setExtraDeckLength] = useState(0)
  const [deckName, setDeckName] = useState("")
  const { user } = useAuth()


  const [, dropRef] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: dropItemType) => {
      if (!item.cardData.type.includes("Synchro") && !item.cardData.type.includes("XYZ") && !item.cardData.type.includes("Link") && !item.cardData.type.includes("Fusion") && item.draggable) {
        setMainDrop(item)
      }
    }
  }))


  const [, dropRef2] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: dropItemType) => {
      if ((item.cardData.type.includes("Synchro") || item.cardData.type.includes("XYZ") || item.cardData.type.includes("Link") || item.cardData.type.includes("Fusion")) && item.draggable) {
        setExtraDrop(item)
      }
    }
  }))

  function addDropToDeck(cardDropped: dropItemType, deckPart: cardListType | undefined,
    setListState: React.Dispatch<React.SetStateAction<cardListType | undefined>>, setDeckLength: React.Dispatch<React.SetStateAction<number>>) {

    if (!deckPart) { // if deck is empty
      setListState([{ name: cardDropped.name, count: 1, content: cardDropped.cardData }])
      setDeckLength(prev => prev + 1)
      return
    }

    let cardDroppedLastIndex = deckPart.findIndex(card => card.name === cardDropped.name) // get the index of the current dropped item(if it exists)

    if (cardDroppedLastIndex === -1) {  // if there's a deck, but the card being dragged not in list
      let list = deckPart
      list.push({ name: cardDropped.name, count: 1, content: cardDropped.cardData })
      setListState(list)
      setDeckLength(prev => prev + 1)
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
      setDeckLength(prev => prev + 1)
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

      await firestoreDb.collection("usuarios").doc(user.name).update({ // saving the deck's name on the user's doc
        decks: firebase.firestore.FieldValue.arrayUnion(deckName)
      })

      alert('Recipe saved.')
    } else {
      alert("You must login in before saving a deck.")
    }
  }

  useEffect(() => { // adds dragged cards to main deck component
    if (mainDeck && provideDeckPartLength(mainDeck) === 61) {
      return
    }
    mainDeckDrop && addDropToDeck(mainDeckDrop, mainDeck, setMainDeck, setDeckLength)
  }, [mainDeckDrop])

  useEffect(() => { // adds dragged cards to extra deck component
    if (extraDeck && provideDeckPartLength(extraDeck) === 16) {
      return
    }
    extraDeckDrop && addDropToDeck(extraDeckDrop, extraDeck, setExtraDeck, setExtraDeckLength)
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
      miniCards.push(card.content && <MiniCard cursor="" draggable={false} card={card.content} key={i} />)
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

      <span className="deck-length" >
        <h5>Main Deck</h5>
        {deckLength > 0 ?
          <h6 style={{ color: 'blue' }} >{deckLength} card{deckLength > 1 && 's'}(minimum: 40).</h6>
          :
          <h6 style={{ color: 'red' }} className={`${!props.saveButton && 'invisible'}`} >Empty</h6>
        }
      </span>
      <div id="main-deck" ref={dropRef} className="rounded">
        {mainDeck?.map((card) => toMiniCard(card))}
      </div>
      {mainDeck && provideDeckPartLength(mainDeck) >= 41 ? //should be 41
        <button type="button" className={`btn btn-primary m-3 position-fixed bottom-0 end-0 ${!props.saveButton && 'invisible'}`} data-bs-toggle="modal" data-bs-target="#exampleModal" >
          Save recipe
        </button>
        : ""}
      <span className="mt-2 deck-length">
        <h5>Extra Deck</h5>
        {extraDeckLength > 0 && <h6>{extraDeckLength} card{extraDeckLength > 1 && 's'}(maximum: 15).</h6>}
      </span>
      <div id="extra-deck" ref={dropRef2} className="rounded">
        {extraDeck?.map(card => toMiniCard(card))}
      </div>
    </>
  )
}