import {
    timestamp,
    db,
    firebaseAppAuth
} from './Firebase'

import { knightro } from '../Components/Resources'

/*
    Use these whenever you want to get user information
    DO NOT use props to get user information
*/


export const getUserName = () => { return firebaseAppAuth.currentUser.displayName }
export const getEmail = () => { return firebaseAppAuth.currentUser.email }
export const getProfilePicUrl = () => { return firebaseAppAuth.currentUser.photoURL || knightro }
export const getPhoneNumber = () => { return !!firebaseAppAuth.currentUser.phoneNumber }
export const isEmailVerified = () => { return !!firebaseAppAuth.currentUser.emailVerified }
export const getUserId = () => { return firebaseAppAuth.currentUser.uid }


export const createProfile = (firstName, lastName, birthMonth, birthDay, birthYear, gender) => {
    db.collection('users').doc(getUserId()).set({
        name: getUserName(),
        profilePicUrl: getProfilePicUrl(),
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        birthMonth,
        birthDay,
        birthYear,
        gender,
        timestamp: timestamp()
    }).then(() => {
        console.log('Successfully created a new profile!')
    }).catch((error) => {
        console.error('Error', error)
    })
}

export const createActivity = (distanceValue, distanceUnit, hours, minutes, seconds, date_month, date_day, date_year, date_hour, date_minute, tags, title, description) => {
    db.collection('activities').add({
        uid: getUserId(),
        name: getUserName(),
        profilePicUrl: getProfilePicUrl(),
        distanceValue,
        distanceUnit,
        hours,
        minutes,
        seconds,
        date_month,
        date_day,
        date_year,
        date_hour,
        date_minute,
        tags,
        title,
        description,
        timestamp: timestamp()
    }).then(() => {
        console.log('Activity successfully uploaded!')
    }).catch((error) => {
        console.error('Error', error)
    })
}

export const like = (uid, activityID) => {
    db.collection('users').doc(getUserId()).collection('youLiked').doc(activityID).set({
        uid: uid,
        timestamp: timestamp()
    }).then(() => {
        console.log('Succesfully added to youLiked!')
    }).catch((error) => {
        console.error('Error', error)
    })

    db.collection('users').doc(uid).collection('othersLiked').doc(activityID).set({
        uid,
        name: getUserName(),
        profilePicUrl: getProfilePicUrl(),
        timestamp: timestamp()
    }).then(() => {
        console.log('Succesfully added to othersLiked!')
    }).catch((error) => {
        console.error('Error', error)
    })
}

export const unlike = (uid, activityID) => {
    db.collection('users').doc(getUserId()).collection('youLiked').doc(activityID).delete()
    .then(() => {
        console.log('Succesfully removed from youLiked!')
    }).catch((error) => {
        console.error('Error', error)
    })

    db.collection('users').doc(uid).collection('othersLiked').doc(activityID).delete()
    .then(() => {
        console.log('Succesfully removed from othersLiked!')
    }).catch((error) => {
        console.error('Error', error)
    })
}

export const follow = (follow_id, name, profilePicUrl) => {
    db.collection('users').doc(getUserId()).collection('following').doc(follow_id).set({
        name: name,
        profilePicUrl: profilePicUrl,
        timestamp: timestamp()
    }).then(() => {
        console.log('Succesfully added to following!')
    }).catch((error) => {
        console.error('Error', error)
    })

    db.collection('users').doc(follow_id).collection('followers').doc(getUserId()).set({
        name: getUserName(),
        profilePicUrl: getProfilePicUrl(),
        timestamp: timestamp()
    }).then(() => {
        console.log('Succesfully added to followed!')
    }).catch((error) => {
        console.error('Error', error)
    })
}

export const unfollow = (unfollow_id) => {
    db.collection('users').doc(getUserId()).collection('following').doc(unfollow_id).delete()
    .then(() => {
        console.log('Succesfully removed from following!')
    }).catch((error) => {
        console.error('Error', error)
    })

    db.collection('users').doc(unfollow_id).collection('followers').doc(getUserId()).delete()
    .then(() => {
        console.log('Succesfully removed from followers!')
    }).catch((error) => {
        console.error('Error', error)
    })
}