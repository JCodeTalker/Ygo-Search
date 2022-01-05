import 'react-lazy-load-image-component/src/effects/blur.css';
import "../styles/recipes.scss";
import { ScrollableCardList } from "../components/ScrollableCardList";
import { cardListType, Decklist, dropItemType } from "../components/Decklist/index";
import { useEffect, useLayoutEffect, useState } from 'react';
import { cardSearchFunc } from '../hooks/CardSearch'
import { cardType } from '../components/CardInfo';
import { MainHeader } from '../components/MainHeader';
import { isMobile } from 'react-device-detect';


export function isExtraDeckType(cardType: string) {
  let extraDeckCardTypes = ["Synchro", "Fusion", "XYZ", "Link"]
  return extraDeckCardTypes.some(type => cardType.includes(type))
}

export function DeckCreation() {
  const getCards = cardSearchFunc
  const [cardList, setCardList] = useState<cardType[]>([])
  const [mainDeck, setMainDeck] = useState<cardListType>()
  const [mainDeckDrop, setMainDrop] = useState<dropItemType>()
  const [extraDeck, setExtraDeck] = useState<cardListType>()
  const [extraDeckDrop, setExtraDrop] = useState<dropItemType>()
  const [deckLength, setDeckLength] = useState(0)
  const [extraDeckLength, setExtraDeckLength] = useState(0)


  function addCardToDeck(cardDropped: dropItemType) {
    if (deckLength === 60 || extraDeckLength === 15) return

    let deckPart
    let setListState
    let setDeckPartLength
    if (isExtraDeckType(cardDropped.cardData.type)) {
      deckPart = extraDeck
      setListState = setExtraDeck
      setDeckPartLength = setExtraDeckLength
    } else {
      deckPart = mainDeck
      setListState = setMainDeck
      setDeckPartLength = setDeckLength
    }

    if (!deckPart) { // if deck is empty
      setListState([{ name: cardDropped.name, count: 1, content: cardDropped.cardData }])
      setDeckPartLength(prev => prev + 1)
      return
    }

    let cardDroppedLastIndex = deckPart.findIndex(card => card.name === cardDropped.name) // get the index of the current dropped item(if it's already on the decklist)

    if (cardDroppedLastIndex === -1) {  // if there's a deck, but the card being dragged not in list
      let list = deckPart
      list.push({ name: cardDropped.name, count: 1, content: cardDropped.cardData })
      setListState(list)
      setDeckPartLength(prev => prev + 1)
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
      setDeckPartLength(prev => prev + 1)
    } else {  // if full(i.e, already has 3 copies of the card)
      return
    }
  }

  async function handleCardListRequest(cardName?: string) {
    cardName = cardName ? cardName : 'complete-list'
    let searchResult: cardType[] = await getCards({ exact: true, name: cardName })
    if (searchResult) {
      setCardList(searchResult)
    }
  }

  useLayoutEffect(() => {
    handleCardListRequest()
  }, [])

  useEffect(() => { // adds dragged cards to main deck component
    mainDeckDrop && addCardToDeck(mainDeckDrop)
  }, [mainDeckDrop])

  useEffect(() => { // adds dragged cards to extra deck component
    extraDeckDrop && addCardToDeck(extraDeckDrop)
  }, [extraDeckDrop])

  return (
    <>
      <div id="main" className="container-fluid" style={{ marginBottom: "50px" }} >
        <MainHeader resolveFunction={handleCardListRequest} />
        <div>
          <div className="row">
            <div className="col-5" style={{ padding: 0, margin: "0px", marginTop: "30px" }}>
              {cardList.length > 0 &&
                <ScrollableCardList cards={cardList} key={cardList[0].name}
                  addCardToDeck={isMobile ? addCardToDeck : undefined} />}
            </div>
            <div className="col-7 mt-2">
              <Decklist saveButton mainDeckCards={mainDeck} extraDeckCards={extraDeck}
                setMainDrop={!isMobile ? setMainDrop : undefined} setExtraDrop={!isMobile ? setExtraDrop : undefined}
                deckLength={deckLength} extraDeckLength={extraDeckLength} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}