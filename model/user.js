const { getDB } = require("../config/db");

async function addUser(document) {
    try {
        const db = await getDB();
        const users = db.collection("users");
        users.insertOne(document)    
    } catch (error) {
        console.error(error)
    }
}

async function findUserByUsername(username) {
    try {
        const db = await getDB();
        const users = db.collection("users");
        return (await users.find({"username" : username}).toArray())[0];
    } catch (error) {
        console.error(error)
    }
}

module.exports = { addUser, findUserByUsername };
