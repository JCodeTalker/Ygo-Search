import '../styles/wishList.scss'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { CardInfo } from '../components/CardInfo'
import { cardType } from '../components/CardInfo'
import { MainHeader } from '../components/MainHeader'
import { useCardSearch } from '../hooks/useCardSearch'

type wishListProps = {
  fullscreen?: boolean
}

export function Wishlist() {
  const { user } = useAuth()
  const [cardInfo, setCardInfo] = useState<cardType>() // card that get emphasized on screen(on click)
  const cardSearch = useCardSearch

  async function resolveSearch(cardName: string) {
    let [searchResult] = await cardSearch({ exact: true, name: cardName })
    setCardInfo(searchResult)
  }


  function WishListComponent(props: wishListProps) {
    return (
      <div className="main-wishlist">
        {cardInfo && <CardInfo card={cardInfo} />}
        <div className={`container wishlist ${props.fullscreen ? 'fullscreen' : ''}`}>
          <div className={`row ${props.fullscreen ? 'fullscreen' : ''}`} id="row" >
            {user?.wishlist ?
              user.wishlist.map((cardData, index) => {
                return (
                  <div className="col-2" key={index}>
                    <div className="card">
                      <button className="" style={{ padding: 0 }} onClick={() => { setCardInfo(cardData) }} data-bs-toggle="tooltip" data-bs-placement="right" title={cardData.name}><img src={props.fullscreen ? cardData.card_images[0].image_url : cardData.card_images[0].image_url_small} className="card-img-top" alt="..." /></button>
                      <div className="card-body" >
                      </div>
                      <div className="card-buttons">
                      </div>
                    </div>
                  </div>)
              })
              : ''}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="home">
      <MainHeader resolveFunction={resolveSearch} />
      <div className="main-wishlist">
        <WishListComponent fullscreen={cardInfo ? false : true} />
      </div>
    </div>
  )
}