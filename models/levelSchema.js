// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqStringFalseDefEmpty = { type: String, required: false, default: "" },
    reqStringFalse = { type: String, required: false },
    reqNumberFalse = { type: Number, required: false, default: 0 },
    reqBoolFalse = { type: Boolean, required: false, default: false },

    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

// Schema
const levelSchema = new mongoose.Schema({
    levelNumber: reqNumberFalse,
    maintext: reqStringFalse,
    image: reqStringFalseDefEmpty,
    sourceCodeHint: reqStringFalse,
    date: {
        type: String,
        default: dateStringWithTime
    },
})

// Export Schema
module.exports = mongoose.model("Levels", levelSchema)
