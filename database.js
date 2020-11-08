var admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Firebase SDK initialization

console.log("[DATABASE] Connecting... (" + process.env.DATABASE_URL + ")");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});
console.log("[DATABASE] Connected.");

const db = admin.database();
const fs = admin.firestore();

const linkRef = db.ref('links');
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
    return { counter: state.counter, lastCounterUserID: state.lastCounterUserID };
}

/**
 * Increment state counter by value.
 * @param {number} value to increment
 */
async function incrementCounter(value, lastCounterUserID) 
{
    var currentCounter = await getCounter();
    var newCounter = currentCounter.counter + value;
    var newLastCounterUserID = lastCounterUserID;

    stateRef.update({ counter: newCounter, lastCounterUserID: newLastCounterUserID });
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
    counter: 0,
    lastCounterUserID: null
}

module.exports = {
    getCounter,
    incrementCounter
}