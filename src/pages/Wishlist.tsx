import { useAuth } from '../hooks/useAuth'
import { useLayoutEffect, useState } from 'react'
import { CardInfo } from '../components/CardInfo'
import { cardType } from '../components/CardInfo'
import { MainHeader } from '../components/MainHeader'
import { cardSearchFunc } from '../hooks/CardSearch'
import { ScrollableCardList } from '../components/ScrollableCardList'
import '../styles/wishList.scss'
import { CardMobile } from '../components/CardInfoMobile'

export function Wishlist() {
  const { user } = useAuth()
  const [cardInfo, setCardInfo] = useState<cardType>() // card that get emphasized on screen(on click)
  const cardSearch = cardSearchFunc

  async function resolveSearch(cardName: string) {
    let [searchResult] = await cardSearch({ exact: true, name: cardName })
    setCardInfo(searchResult)
  }

  useLayoutEffect(() => {
    user?.wishlist && setCardInfo(user.wishlist[0])
  }, [user])

  return (
    <>
      <MainHeader resolveFunction={resolveSearch} />
      <div className="container-fluid mt-5 d-flex px-0">
        <div id="main-wishlist">
          {user?.wishlist && <ScrollableCardList cards={user?.wishlist} setSelectedCard={setCardInfo} />}
        </div>
        <span id="card-data" className='container-fluid p-0' >
          {window.screen.width <= 480 ?
            cardInfo && <CardMobile cardData={cardInfo} />
            :
            cardInfo && <CardInfo card={cardInfo} />}
        </span>
      </div>
    </>
  )
}