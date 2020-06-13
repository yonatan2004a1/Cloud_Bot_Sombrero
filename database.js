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
async function getMember() {
    const state = await getState();
    return state.members;
}

async function incrementMember(value) {
    var currentMember = await getMember();
    var newMember = currentMember + value;

    stateRef.update({ members: newMember });
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