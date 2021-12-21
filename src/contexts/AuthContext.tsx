import firebase from 'firebase';
import { createContext, Dispatch, ReactNode, useEffect, useState } from 'react';
import { auth, firestoreDb } from '../services/firebase';
import { cardType } from '../components/CardInfo'
import { useHistory } from 'react-router-dom';

type User = {
  id?: string,
  name?: string,
  avatar?: string,
  email?: string | null
  wishlist?: cardType[]
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>
  logOut: () => void
  setUser: Dispatch<React.SetStateAction<User | undefined>>
}

type AuthContextProviderProps = { // children component that will receive the context
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>()
  const history = useHistory()


  function signOut() {
    auth.signOut()
    setUser({})
    if (window.location.pathname === '/') {
      history.go(0)
    } else {
      history.push('/')
    }
  }


  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) { //user is signed in
        const { displayName, photoURL, uid, email } = user

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google");
        }

        getUserWishList(displayName).then(list => {
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
            email: email,
            wishlist: list
          })
        })

      }
    })

    return () => {
      unsubscribe(); // disable event listener
    }
  }, [])


  async function getUserWishList(userName: string) {
    let wishlist: cardType[] = []
    const dbRef = await firestoreDb.collection(`usuarios/${userName}/Card WishList`).get()

    dbRef.forEach(doc => {
      wishlist.push(doc.data() as cardType)
    })

    return wishlist
  }


  async function signInWithGoogle() {

    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)


    if (result.user) { //retrieved data from login
      const { displayName, photoURL, uid, email } = result.user //

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google")
      }


      const users = await firestoreDb.collection(`usuarios`).doc(`${displayName}`).get()
      if (!users.exists) {
        console.log("No data found, creating new user.")
        const newUser = await firestoreDb.collection("usuarios").doc(`${displayName}`).set({
          name: displayName,
          id: uid,
          avatar: photoURL,
          email: email
        })
      } else {
        console.log("User data found: " + users.data())
      }

      getUserWishList(displayName).then(list => {
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email: email,
          wishlist: list
        })
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logOut: signOut, setUser }}>
      {props.children}
    </AuthContext.Provider>
  )
}