const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const lifeAtAkoodeImageSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            trim: true,
            default: "Life at Akoode",
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: 'lifeatakoodeimages' // Explicitly specify collection name
    }
);

// Export the model
module.exports = mongoose.model("LifeAtAkoodeImage", lifeAtAkoodeImageSchema);
