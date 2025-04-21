var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  databaseURL : `https://${serviceAccount.project_id}.firebaseio.com`
});


const db = admin.firestore();


exports.db = db ; 
exports.admin = admin;