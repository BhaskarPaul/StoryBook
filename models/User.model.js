const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        googleID: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("user", userSchema);
