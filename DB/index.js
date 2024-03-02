const { connect, set } = require('mongoose')
const config = require('../Config')
const Database = config.DATA_BASE_URI
async function ConnectDatabase() {
    try {
        // await connect('mongodb://127.0.0.1:27017/adf')
        set("strictQuery", false);
        await connect(Database)
        console.log("Database Connected")
    } catch (error) {
        console.log("Error in Backend", error)
    }
}

module.exports = ConnectDatabase

