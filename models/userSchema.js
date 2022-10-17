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
    plat_username: reqStringFalseDefEmpty,
    plat_school: reqStringFalse,
    profile_completed: reqBoolFalse,
    plat_levels_unlocked: [reqStringFalse],
    plat_levels_completed: [reqStringFalse],
    play_current_level: { type: String, required: true, default: "1" },
    date: {
        type: String,
        default: dateStringWithTime
    },
    solvedQuestions: [reqStringFalseDefEmpty],
    solvedAnswers: [reqStringFalseDefEmpty],
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
    accessToken: reqStringFalseDefEmpty,
    guilds: [
        {
            id: reqStringFalseDefEmpty,
            name: reqStringFalseDefEmpty,
            icon: reqStringFalseDefEmpty,
            owner: reqBoolFalse,
            permissions: reqNumberFalse,
            features: [],
            permissions_new: reqStringFalseDefEmpty
        }
    ],

})

// Export Schema
module.exports = mongoose.model("User", userSchema)
