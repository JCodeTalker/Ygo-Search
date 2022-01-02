import './styles.scss'
import arrow from '../../images/right-arrow.svg'
import { useEffect, useState } from 'react'
import { AddToWishlistButton } from '../AddToWishListButton'

export type cardType = {
  name: string,
  race: string,
  desc: string,
  attribute: string,
  level: number,
  atk: number,
  def: number,
  type: string,
  card_images: {
    id: number,
    image_url: string,
    image_url_small: string
  }[],
  id: number,
  archetype: string
}

type infoProps = {
  card: cardType
}

export function CardInfo(props: infoProps) {
  const desc = props.card.desc.split('\n').map((str, index) => <p key={index}>{str}</p>)
  const [cardArt, setArt] = useState(0)

  function changeCardArt() {
    if (cardArt < props.card.card_images.length - 1) {
      setArt(cardArt + 1)
    } else {
      setArt(0)
    }
  }

  useEffect(() => {
    setArt(0)
  }, [props.card])


  return (
    <main id="card-info" className='rounded'>

      <aside style={{ display: 'flex' }}>
        {props.card.card_images.length - 1 >= cardArt ? <img src={props.card.card_images[cardArt].image_url} alt={props.card.name} id="card-image" />
          :
          <img src={props.card.card_images[0].image_url} alt={props.card.name} id="card-image" />}
      </aside>

      {props.card.card_images.length > 1 && <img src={arrow} id="arr" onClick={changeCardArt} data-bs-toggle="tooltip" data-bs-placement="top" title="Change card artwork" />}

      <div id="card-text">
        <h3>{props.card.name}</h3>

        <h5>{`Type: ${props.card.race}`}{props.card.attribute !== undefined && ` | Attribute: ${props.card.attribute} | `}{props.card.type === "XYZ Monster" && `Rank: ${props.card.level}`}{props.card.level && props.card.type !== "XYZ Monster" ? `Level: ${props.card.level}` : ''}</h5>

        <h6>Description:</h6>
        <div id="desc" style={{ margin: '5px' }}>
          {desc}
        </div>

        <div>
          {props.card.atk ? <p><em>ATK:</em> {props.card.atk} | <em>DEF:</em> {props.card.def} </p> : ''}
          <AddToWishlistButton card={props.card} />
        </div>
      </div>
    </main>
  )
}