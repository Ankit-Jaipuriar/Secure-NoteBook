const mongoose = require("mongoose")

const fileSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("file",fileSchema)