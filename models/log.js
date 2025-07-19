const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
    message:{
        type: String
    },
    name:{
        type: String
    },
    kind:{
        type: String
    },
    time: {
        type: String,
        default: new Date().toLocaleString()
    }
})

const Log = mongoose.model('Log', LogSchema);
module.exports = Log;