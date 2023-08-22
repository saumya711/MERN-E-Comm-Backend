var admin = require("firebase-admin");

var serviceAccount = require("../config/fbServerviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
