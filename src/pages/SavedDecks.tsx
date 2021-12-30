import { useLayoutEffect, useState } from "react";
import { cardListType, cardObj, Decklist } from "../components/Decklist";
import { MainHeader } from "../components/MainHeader";
import { useAuth } from "../hooks/useAuth";
import { firestoreDb } from "../services/firebase";

export function SavedDecks() {

  const { user } = useAuth()
  const [mainDeck, setMainDeck] = useState<cardListType>()
  const [extraDeck, setExtraDeck] = useState<cardListType>()
  const [deckPosition, setDeckPosition] = useState(0) // sets what deck position in the user collection(array) should be displayed on screen

  useLayoutEffect(() => {
    user?.decks && getDeck(user.decks[deckPosition])
  }, [user])

  useLayoutEffect(() => {
    user?.decks && getDeck(user.decks[deckPosition])
  }, [deckPosition])

  async function getDeck(deckName: string) {

    let list: cardListType = []
    let xlist: cardListType = []

    let deck = await firestoreDb.collection(`usuarios/${user?.name}/${deckName}`).get()
    deck.forEach(card => {
      list.push(card.data() as cardObj)
    })
    setMainDeck(list)

    let xDeck = await firestoreDb.collection(`usuarios/${user?.name}/${deckName}/Extra Deck/Extra Deck`).get()
    xDeck.forEach(card => {
      xlist.push(card.data() as cardObj)
    })
    setExtraDeck(xlist)
  }

  return (
    <>
      <MainHeader resolveFunction={() => { }} />
      <div className="container mt-5">
        <div className="row">
          <div className="col-4">
            <div className="list-group" id="list-tab" role="tablist" style={{ marginTop: "32px" }} >
              {user?.decks?.map((deckName, index) =>
                (<a key={index} onClick={() => setDeckPosition(index)} className={`list-group-item list-group-item-action ${index === 0 && "active"}`} id={`list-${deckName}-list`.replace(/\s+/g, '-')} data-bs-toggle="list" href={`#list-${deckName}`.replace(/\s+/g, '-')} role="tab" aria-controls={`list-${deckName}`.replace(/\s+/g, '-')} >{deckName}</a>))}
            </div>
          </div>
          <div className="col-8">
            <div className="tab-content" id="nav-tabContent">
              {user?.decks?.map((deckName, index) => (
                <div key={index - 1000} className={`tab-pane fade ${index === 0 && "show active"}`} id={`list-${deckName}`.replace(/\s+/g, '-')} role="tabpanel" aria-labelledby={`list-${deckName}-list`.replace(/\s+/g, '-')} > {user.decks && <Decklist saveButton={false} mainDeckCards={mainDeck} extraDeckCards={extraDeck} />} </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}