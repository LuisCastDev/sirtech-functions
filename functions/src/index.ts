import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
// Inicializando proyecto y CORS
const serviceAccount = require("../src/service/userAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://qhservicedb-default-rtdb.firebaseio.com",
});
const cors = require("cors")({
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
});
// Interfaz
export interface UserData {
    email: string;
    password: string;
    type: string;
    name: string;
}
// Interfaz
// Creando usuario
export const createUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => { return true; });
    // Obteniendo data del front-end
    const data: UserData = request.body;
    return admin.auth().createUser({
        email: data.email,
        emailVerified: false,
        password: data.password,
        displayName: data.name,
        disabled: false,
    }).then((user) => {
        const uid: string = user.uid;
        admin.database().ref(`sqPlatform/users/${uid}/`).set({
            email: data.email,
            type: data.type,
            name: data.name,
            registerDate: Date.now(),
            uid: uid
        });
        response.status(200).send(user);
    }).catch((error) => {
        response.status(409).send(error);
    })
});
// Creando usuario

// Inicializando proyecto CORS
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
