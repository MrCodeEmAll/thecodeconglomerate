const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin.json');

// Initialize Firebase
const initializeFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

module.exports = { initializeFirebase };