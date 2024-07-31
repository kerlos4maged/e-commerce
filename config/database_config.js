const mongoose = require('mongoose');

const dtabaseConnection = async () => {

    mongoose.set("strictQuery", true)
    mongoose.set("strictPopulate",false)
    const connect = await mongoose.connect(process.env.MONGO_URL)
    console.log(`DataBase connect on ${connect.connection.host} `)

}

module.exports = dtabaseConnection