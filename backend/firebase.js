const admin = require('firebase-admin');

// Initialize Firebase with a temporary configuration for presentation
const initializeFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://socialstakes-default-rtdb.firebaseio.com'
  });
};

module.exports = { initializeFirebase };