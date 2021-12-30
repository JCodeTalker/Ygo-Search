import firebase from 'firebase/compat/app'
// import admin from 'firebase-admin'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};



firebase.initializeApp(firebaseConfig)

export const firestoreDb = firebase.firestore()

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

export const auth = firebase.auth()
export const database = firebase.database()