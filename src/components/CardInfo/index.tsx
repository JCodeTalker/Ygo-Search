import './styles.scss'
import { Button } from '../Button'
import { firestoreDb } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'
import arrow from '../../images/right-arrow.svg'
import { useEffect, useState } from 'react'

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
  const contextValues = useAuth()
  const desc = props.card.desc.split('\n').map((str, index) => <p key={index}>{str}</p>)
  const [cardArt, setArt] = useState(0)

  function changeCardArt() {
    if (cardArt < props.card.card_images.length - 1) {
      setArt(cardArt + 1)
    } else {
      setArt(0)
    }
  }

  function addToWishlist() {
    if (contextValues.user?.name) {
      firestoreDb.collection('usuarios').doc(`${contextValues.user?.name}/Card WishList/${props.card.name}`).set(props.card)
      alert('Success!')
    }
    else {
      alert('You must log in first.')
    }

    let newList: cardType[] | undefined = contextValues.user?.wishlist

    newList?.push(props.card)

    contextValues.setUser({
      ...contextValues.user,
      wishlist: newList
    })

  }

  async function deleteCard(cardName: string) {
    let newWishList = contextValues.user?.wishlist?.filter(card => card.name !== cardName)

    contextValues.setUser({
      ...contextValues.user,
      wishlist: newWishList
    })

    await firestoreDb.collection("usuarios").doc(`${contextValues.user?.name}`).collection("Card WishList").doc(cardName).delete();
    alert('Successfully deleted!')
  }

  async function checkIfInWishlist() {
    const card = await firestoreDb.collection(`usuarios/${contextValues.user?.name}/Card WishList`).where('name', '==', `${props.card.name}`).get()
    setAddButton(card.empty)
  }

  useEffect(() => {
    setArt(0)
    checkIfInWishlist()
  }, [props.card])

  const [showAddButton, setAddButton] = useState(false)

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

          {showAddButton ? <Button onClick={addToWishlist} className="btn btn-primary">Add to wishlist</Button> : <Button onClick={() => { deleteCard(props.card.name) }} className="btn btn-primary">Remove from wishlist</Button>}
        </div>
      </div>
    </main>
  )
}