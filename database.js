var admin = require('firebase-admin');

const PRIVATE_KEY = {
    "type": "service_account",
    "project_id": "sombrero-guy-1",
    "private_key_id": "4457c2cb7c5df7dc9b5e5121e78d7fcb2a53884c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCweUJVYYtYoMry\nFPRvTLd22t2VMIzAi64l0Icj60arjXNQdgDdJbtsul4dQyLojeVXgM216uHJR59G\n9Tt0P5GapLrpHdzmUgAqxeKoKb+xrd12vQOrfu8t2s/7h9oq1bPrmoA3sglgcTAz\nLExx/lISvAT+bJRco/4VUd3C6197VJjU2glDy1Rj2feOt58IQPtTOTc0AVM1dnmu\na21AzIRtHHznFp0JYClz/G1tfjSDX36M0IvBCMrt+80RV59q1v5A0PQ1BL2lcVhj\noq6pIWwTF9AZKt3Km3NzA7SB7eh7dZ8YXPNF/F4l3SoZ/CzjQRlSvofOhfC5PRfC\nJjkM45krAgMBAAECggEAH5pvmyu/US1mesju51m1R1c1tGh/5GF/W+1GrlONkd5g\nhsnDKNd/g56yiQoDX+M9bZi2/jukmK+3YfU74vsZX7jdci7zZtnLht1uVFA5sJ+i\n2AdMd3NhcPRNJ83x75baxDgkexTqofdTOu7Vd9qkJw+90zRts1N5BqdlD+mn7UVy\nePNgGRDOPA8Ns5t8j2XDJLl4cBlYqOvHoxkhEyApWj6mcK2VGqoTmEGHpjlWH5Se\nDyLPjelnlNQj5PgwmJSaX3ZDc/T5pP2686yB0CXLMHGEiROcHyiHfaL4G7ERu3UQ\nxjnk9vfAILBePDbNPqxqWdwIQ4byg8u/CEn3NYh3CQKBgQDbOOGSjqrod80iv1gi\n9LJVmWX+eyw/G5Wg11lxnxebLcZQJHc3IneThpdUVUg8xdViIVsA9OQpvd8I/e7X\nc9zGMJbkOskzHPzDGuPPLsyqE3xvdIOr8Ub+yphvbvyTXcFIxJ17quSGQicvNeru\nnJbzJRkgC0RCfgWg5d/gy+/10wKBgQDOFGvfGjqOm0ioH8ISlXFBILumXCgXKO4b\njkFHdOCUbq4eNEwDr86GdIT0+pF2dfJAMoKU72+vlwHNEizRU8YDJTUO78OlzJPz\nUa26kW2P25RVJWLXcSl4qCWxtOUm5/aepn064ickft9qBdIyGvXQwV9Xb1cOQ/rA\n5snRgh+ASQKBgB1yN4J7HWPaa7iGIS2Y1rd+wl97ZgcYCnIvWvlTGFWkwWWUcFr8\nizlKs9sFFY3sOOxUdKfdPSSKN4I6sbFJA9evQSVo7AuskhsW6pCyxZT2xxklemZH\nI3Un+2/EZbLZvhOrLUgmPUn3atIBmQvyBqikTAqs2L9htBnXpsnIOvQ3AoGAEBce\nGQxWOB49vQrFv2e1sQ0aObIGW1CRzsr7o9WnV0+Q/sC8kqkeafcdDnel9ebdpE+N\nTI2pXb9fn6BkqW9uDX7RNrpXv1FK1/uvodqLAGl3mnJR1lp6j3Ypg0eJgNEpu1dq\nfbd8sOfLD98me00JlmQSyqPh2zZJlNgwN9B+HykCgYEAl9duTfUGANfenwLqHhh+\nUqiZOxVSW07UWtVeUjCRqEc/5wNYfO0Fb5B3GPGn7I+TRU0cpSxpSuRW7aj2IkN0\n/LrPcwhfuJ1d7zFfoNPcePLRCGmaac92g9GfCUaY78EzWSpffURKE6SppTTluPyY\nHNjwj5j9ibZhzcdAAsyAU6o=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-0pvys@sombrero-guy-1.iam.gserviceaccount.com",
    "client_id": "105526345891843459284",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-0pvys%40sombrero-guy-1.iam.gserviceaccount.com"
}  
// const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH);
const serviceAccount = PRIVATE_KEY;

// Firebase SDK initialization

console.log("[DATABASE] Connecting... (" + process.env.DATABASE_URL + ")");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});
console.log("[DATABASE] Connected.");

const db = admin.database();

const stateRef = db.ref('state');

initializeState();

async function getState() {
    const snapshot = await stateRef.once('value');
    return snapshot.val();
}

/**
 * Returns state counter.
 */
async function getCounter() {
    const state = await getState();

    return state.counter;
}

/**
 * Increment state counter by value.
 * @param {number} value to increment
 */
async function incrementCounter(value) {
    var currentCounter = await getCounter();
    var newCounter = currentCounter + value;

    stateRef.update({ counter: newCounter });
}

/**
 * Initializing state (if not existing).
 */
async function initializeState() {
    const state = await getState();
    
    if (state === null)
    {
        // State not existing.
        console.log("[DATABASE] Initializing state...");
        stateRef.set(defaultState);
        console.log("[DATABASE] Initialized state:", defaultState);
    }
}

const defaultState = {
    counter: 0
}

module.exports = {
    getCounter,
    incrementCounter
}