import { useEffect, useLayoutEffect, useState } from "react";
import { cardListType, cardObj, Decklist } from "../components/Decklist";
import { MainHeader } from "../components/MainHeader";
import { useAuth } from "../hooks/useAuth";
import { firestoreDb } from "../services/firebase";

export function SavedDecks() {

  const { user } = useAuth()
  const [mainDeck, setMainDeck] = useState<cardListType>()
  const [extraDeck, setExtraDeck] = useState<cardListType>()

  useLayoutEffect(() => {
    user?.name && getDeck()
  }, [user])

  useEffect(() => {
    user && console.log(user?.deckNames)
  }, [user])

  async function getDeck() {

    let list: cardListType = []
    let xlist: cardListType = []

    let deck = await firestoreDb.collection(`usuarios/${user?.name}/some other deck`).where("count", "==", 3).get()
    deck.forEach(card => {
      list.push(card.data() as cardObj)
    })
    setMainDeck(list)

    let xDeck = await firestoreDb.collection(`usuarios/${user?.name}/deck with extra 2/Extra Deck/Extra Deck`).get()
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
            <div className="list-group" id="list-tab" role="tablist">
              <a className="list-group-item list-group-item-action active" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="list-home">Home</a>
              <a className="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile">Profile</a>
              <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages">Messages</a>
              <a className="list-group-item list-group-item-action" id="list-settings-list" data-bs-toggle="list" href="#list-settings" role="tab" aria-controls="list-settings">Settings</a>
            </div>
          </div>
          <div className="col-8">
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="list-home" role="tabpanel" aria-labelledby="list-home-list">
                {user && <Decklist saveButton={false} mainDeckCards={mainDeck} extraDeckCards={extraDeck} />}
              </div>
              <div className="tab-pane fade" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list"> {user?.deckNames} </div>
              <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">...</div>
              <div className="tab-pane fade" id="list-settings" role="tabpanel" aria-labelledby="list-settings-list">...</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}