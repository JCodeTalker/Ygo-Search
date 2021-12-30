import { useAuth } from '../hooks/useAuth'
import { useLayoutEffect, useState } from 'react'
import { CardInfo } from '../components/CardInfo'
import { cardType } from '../components/CardInfo'
import { MainHeader } from '../components/MainHeader'
import { useCardSearch } from '../hooks/useCardSearch'
import { ScrollableCardList } from '../components/ScrollableCardList'
import '../styles/wishList.scss'

export function Wishlist() {
  const { user } = useAuth()
  const [cardInfo, setCardInfo] = useState<cardType>() // card that get emphasized on screen(on click)
  const cardSearch = useCardSearch

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
      <div className="container-fluid mt-5 d-flex">
        <div id="main-wishlist">
          {user?.wishlist && <ScrollableCardList cards={user?.wishlist} setSelectedCard={setCardInfo} />}
        </div>
        <span id="card-data" >
          {cardInfo && <CardInfo card={cardInfo} />}
        </span>
      </div>
    </>
  )
}