const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        status: {
            type: String,
            default: "public",
            enum: ["public", "private"],
        },
        body: {
            type: String,
            trim: true,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("story", storySchema);
