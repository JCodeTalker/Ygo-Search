import { useAuth } from '../hooks/useAuth'
import { useLayoutEffect, useState } from 'react'
import { CardInfo } from '../components/CardInfo'
import { cardType } from '../components/CardInfo'
import { MainHeader } from '../components/MainHeader'
import { cardSearchFunc } from '../hooks/CardSearch'
import { ScrollableCardList } from '../components/ScrollableCardList'
import { CardMobile } from '../components/CardInfoMobile'
import { Spinner } from '../components/Spinner'
import '../styles/wishList.scss'

export function Wishlist() {
  const { user } = useAuth()
  const [cardInfo, setCardInfo] = useState<cardType>() // card that get emphasized on screen(on click)
  const cardSearch = cardSearchFunc
  const [isDesktop, setDesktop] = useState(window.innerWidth > 940)

  const updateMedia = () => {
    setDesktop(window.innerWidth > 940)
  }

  async function resolveSearch(cardName: string) {
    let [searchResult] = await cardSearch({ exact: true, name: cardName })
    setCardInfo(searchResult)
  }

  useLayoutEffect(() => {
    user?.wishlist && setCardInfo(user.wishlist[0])
  }, [user])

  useLayoutEffect(() => {
    window.addEventListener("resize", updateMedia)
    return () => window.removeEventListener("resize", updateMedia)
  })

  return (
    <>
      <MainHeader resolveFunction={resolveSearch} />
      {user?.wishlist ?
        <div className="container-fluid mt-5 d-flex px-0">
          <div id="main-wishlist">
            <ScrollableCardList cards={user?.wishlist} setSelectedCard={setCardInfo} />
          </div>
          <span id="card-data" className='container-fluid p-0' >
            {!isDesktop ?
              cardInfo && <CardMobile cardData={cardInfo} />
              :
              cardInfo && <CardInfo card={cardInfo} />}
          </span>
        </div>
        :
        <span style={{ justifyContent: 'center' }} className="container-fluid d-flex" >
          <Spinner />
        </span>
      }
    </>
  )
}