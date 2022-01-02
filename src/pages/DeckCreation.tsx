import 'react-lazy-load-image-component/src/effects/blur.css';
import "../styles/recipes.scss";
import { ScrollableCardList } from "../components/ScrollableCardList";
import { Decklist } from "../components/Decklist/index";
import { useLayoutEffect, useState } from 'react';
import { cardSearchFunc } from '../hooks/CardSearch'
import { cardType } from '../components/CardInfo';
import { MainHeader } from '../components/MainHeader';
import { isMobile } from 'react-device-detect';

export function DeckCreation() {
  const getCards = cardSearchFunc
  const [cardList, setCardList] = useState<cardType[]>([])
  const [selectedCard, setSelectedCard] = useState<cardType>()

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

  return (
    <>
      <div id="main" className="container-fluid" style={{ marginBottom: "50px" }} >
        <MainHeader resolveFunction={handleCardListRequest} />
        <div>
          <div className="row">
            <div className="col-5" style={{ padding: 0, margin: "0px", marginTop: "30px" }}>
              {cardList.length > 0 && <ScrollableCardList cards={cardList} key={cardList[0].name} setSelectedCard={isMobile ? setSelectedCard : undefined} />}
            </div>
            <div className="col-7 mt-2">
              <Decklist saveButton cardToAdd={isMobile ? selectedCard : undefined} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}