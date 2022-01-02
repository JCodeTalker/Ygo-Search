import { useLayoutEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { firestoreDb } from "../../services/firebase"
import { Button } from "../Button"
import { cardType } from "../CardInfo"

type wishListButtonType = {
  card: cardType
}

export function AddToWishlistButton(props: wishListButtonType) {
  const [showAddButton, setAddButton] = useState(false)
  const contextValues = useAuth()


  useLayoutEffect(() => {
    checkIfInWishlist()
  })
  async function checkIfInWishlist() {
    const card = await firestoreDb.collection(`usuarios/${contextValues.user?.name}/Card WishList`).where('name', '==', `${props.card.name}`).get()
    setAddButton(card.empty)
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

  return (
    <div className="container-fluid p-0 d-flex" >
      {showAddButton ? <Button style={{ margin: '10px' }} onClick={addToWishlist} className="btn btn-primary">Add to wishlist</Button> : <Button style={{ margin: '10px' }} onClick={() => { deleteCard(props.card.name) }} className="btn btn-primary">Remove from wishlist</Button>}
    </div>)
}