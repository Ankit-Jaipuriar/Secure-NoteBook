const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  content: {
    type: String, // or use `Buffer` if storing large files
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Reference to the User model
    required: true,
  },
});

module.exports = mongoose.model("file", fileSchema);
