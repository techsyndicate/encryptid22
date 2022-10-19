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
const userSchema = new mongoose.Schema({
    plat_banned: reqBoolFalse,
    plat_name: reqStringFalse,
    plat_school: reqStringFalse,
    plat_levels_unlocked: [reqStringFalse],
    plat_levels_completed: [reqStringFalse],
    play_current_level: reqStringFalse,
    plat_last_completed_time: {
        type: String,
        default: dateStringWithTime
    },
    date: {
        type: String,
        default: dateStringWithTime
    },
    answerlog: [{
        level: reqStringFalse,
        try: reqStringFalse
    }],
    admin: reqBoolFalse,
    id: reqStringFalseDefEmpty,
    username: reqStringFalseDefEmpty,
    avatar: reqStringFalseDefEmpty,
    avatar_decoration: reqStringFalseDefEmpty,
    discriminator: reqStringFalseDefEmpty,
    public_flags: reqNumberFalse,
    flags: reqNumberFalse,
    banner: reqStringFalseDefEmpty,
    banner_color: reqStringFalseDefEmpty,
    accent_color: reqStringFalseDefEmpty,
    locale: reqStringFalseDefEmpty,
    mfa_enabled: reqBoolFalse,
    email: reqStringFalseDefEmpty,
    verified: reqBoolFalse,
    provider: reqStringFalseDefEmpty,
    accessToken: reqStringFalseDefEmpty
})

// Export Schema
module.exports = mongoose.model("User", userSchema)
