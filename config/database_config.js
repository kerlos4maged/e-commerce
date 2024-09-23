const mongoose = require('mongoose');

const dtabaseConnection = async () => {

    mongoose.set("strictQuery", true)
    mongoose.set("strictPopulate", false)
    await mongoose.connect(process.env.MONGO_URL)

}

module.exports = dtabaseConnection