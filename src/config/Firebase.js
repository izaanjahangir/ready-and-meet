import * as firebase from 'firebase';
// Initialize Firebase
const config = {
    apiKey: "AIzaSyB7nSMMlHHE8qS44Hz843IqRg6MGlxtXSM",
    authDomain: "izaan-meeting-app.firebaseapp.com",
    databaseURL: "https://izaan-meeting-app.firebaseio.com",
    projectId: "izaan-meeting-app",
    storageBucket: "izaan-meeting-app.appspot.com",
    messagingSenderId: "1049468411035"
};
firebase.initializeApp(config);

const loginWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });

    return new Promise(async (resolve, reject) => {
        const response = await firebase.auth().signInWithPopup(provider)
            .catch(err => reject(err));

        if (response) resolve(response)
    })
}

const readUserFirestore = (uid) => {
    if (!uid) {
        uid = firebase.auth().currentUser.uid;
    }

    return new Promise(async (resolve, reject) => {
        const response = await firebase.firestore().collection("users").doc(uid).get()
            .catch(err => reject(err));
            
        if (response) resolve(response)
    })
}

const writeUserFirestore = (data,uid) => {
    if (!uid) {
        uid = firebase.auth().currentUser.uid;
    }
    return new Promise(async (resolve, reject) => {
        await firebase.firestore().collection('users').doc(uid).set({data})
            .catch(err => reject(err))
        
        resolve();
    })
}

export {
    loginWithFacebook,
    readUserFirestore,
    writeUserFirestore
}