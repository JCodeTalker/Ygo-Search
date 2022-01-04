import { FormEvent, useState } from "react"
import { useDrop } from "react-dnd"
import { useAuth } from "../../hooks/useAuth"
import { firestoreDb } from "../../services/firebase"
import { cardType } from "../CardInfo"
import { MiniCard } from "../MiniCard"
import firebase from 'firebase/compat/app'
import './styles.scss'

export type cardObj = {
  name: string,
  content: cardType,
  count: number
}

export type cardListType = cardObj[]

export type dropItemType = {
  id?: number, cardData: cardType, name: string, draggable?: boolean
}

type DeckProps = {
  deckLength?: number,
  extraDeckLength?: number,
  saveButton: boolean,
  mainDeckCards: cardListType | undefined,
  extraDeckCards: cardListType | undefined,
  setMainDrop?: React.Dispatch<React.SetStateAction<dropItemType | undefined>>
  setExtraDrop?: React.Dispatch<React.SetStateAction<dropItemType | undefined>>
  isExtraDeckType?: (cardType: string) => boolean
}

export function Decklist(props: DeckProps) {

  const [deckName, setDeckName] = useState("")
  const { user } = useAuth()


  const [, dropRef] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: dropItemType) => {
      if (props.setMainDrop && props.isExtraDeckType)
        !props.isExtraDeckType(item.cardData.type) && props.setMainDrop(item)
    }
  }))

  const [, dropRef2] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: dropItemType) => {
      if (props.setExtraDrop && props.isExtraDeckType)
        props.isExtraDeckType(item.cardData.type) && props.setExtraDrop(item)
    }
  }))

  async function saveRecipe(event: FormEvent) {
    event.preventDefault()
    if (user) {
      let batch = firestoreDb.batch()
      props.mainDeckCards?.forEach(card => {
        batch.set(firestoreDb.collection('usuarios').doc(`${user.name}/${deckName}/${card.name}`), card)
      })
      props.extraDeckCards?.forEach(card => {
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

  function toMiniCard(card: cardObj) {
    let miniCards = []
    for (let i = 0; i < card.count; i++) {
      miniCards.push(card.content && <MiniCard cursor="" draggable={false} card={card.content} key={i} />)
    }

    return miniCards
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
        <h5>Main Deck:</h5>
        {props.deckLength && props.deckLength > 0 ?
          <h6 style={{ color: 'blue' }} >{props.deckLength} card{props.deckLength > 1 && 's'}(min.: 40).</h6>
          :
          <h6 style={{ color: 'red' }} className={`${!props.saveButton && 'invisible'}`} >Empty</h6>
        }
      </span>
      <div id="main-deck" ref={dropRef} className="rounded">
        {props.mainDeckCards?.map((card) => toMiniCard(card))}
      </div>
      {props.deckLength && props.mainDeckCards && props.deckLength >= 41 ? //for minimum deck size
        <button type="button" className={`btn btn-primary m-3 position-fixed bottom-0 end-0 ${!props.saveButton && 'invisible'}`} data-bs-toggle="modal" data-bs-target="#exampleModal" >
          Save recipe
        </button>
        : ""}
      <span className="mt-2 deck-length">
        <h5>Extra Deck:</h5>
        {props.extraDeckLength && props.extraDeckLength > 0 && <h6>{props.extraDeckLength} card{props.extraDeckLength > 1 && 's'}(maximum: 15).</h6>}
      </span>
      <div id="extra-deck" ref={dropRef2} className="rounded">
        {props.extraDeckCards?.map(card => toMiniCard(card))}
      </div>
    </>
  )
}