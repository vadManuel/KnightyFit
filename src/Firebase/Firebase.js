import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import config from './firebaseConfig'
import withFirebaseAuth from 'react-with-firebase-auth'

firebase.initializeApp(config)
const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp

const firebaseAppAuth = firebase.auth()
const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider(),
    emailProvider: new firebase.auth.EmailAuthProvider()
}

export {
    db,
    firebaseAppAuth,
    withFirebaseAuth,
    providers,
    timestamp
}


// export const users = firebaseApp.firestore().app('users')
// export const usersWishlist = firebaseApp.firestore().app('usersWishlist')
// export const users = firebaseApp.firebase().ref().child('users');
// export const usersWishlist = firebaseApp.firebase().ref().child('usersWishlist');