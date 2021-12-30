import firebase from 'firebase/compat/app';
import { createContext, Dispatch, ReactNode, useLayoutEffect, useState } from 'react';
import { auth, firestoreDb } from '../services/firebase';
import { cardType } from '../components/CardInfo'
import { useNavigate } from 'react-router-dom';

type User = {
  id?: string,
  name?: string,
  avatar?: string,
  email?: string | null
  wishlist?: cardType[],
  decks?: string[]
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
  const navigate = useNavigate()


  function signOut() {
    auth.signOut()
    setUser({ decks: [""] })
    if (window.location.pathname === '/') {
      navigate(0)
    } else {
      navigate('/')
    }
  }


  useLayoutEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) { //user is signed in
        const { displayName, photoURL, uid, email } = user

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google");
        }

        getUserAdditionalData(displayName).then(list => {
          list.userData && setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
            email: email,
            wishlist: list.wishlist,
            decks: list.userData.decks
          })
        })

      }
    })

    return () => {
      unsubscribe(); // disable event listener
    }
  }, [])


  async function getUserAdditionalData(userName: string) {
    let userData
    const userRef = await firestoreDb.collection("usuarios").doc(userName).get()
    if (userRef.exists) {
      userData = userRef.data() as User
    }

    let wishlist: cardType[] = []
    const dbRef = await firestoreDb.collection(`usuarios/${userName}/Card WishList`).get()

    dbRef.forEach(doc => {
      wishlist.push(doc.data() as cardType)
    })

    return { userData, wishlist }
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
        await firestoreDb.collection("usuarios").doc(`${displayName}`).set({
          name: displayName,
          id: uid,
          avatar: photoURL,
          email: email
        })
      } else {
        console.log("User data found: " + users.data())
        // var decks = users.data()
      }

      getUserAdditionalData(displayName).then(list => {
        list.userData && setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email: email,
          wishlist: list.wishlist,
          decks: list.userData.decks
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