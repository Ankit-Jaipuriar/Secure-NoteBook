const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  encryption: {
    type: Boolean,
    default: false,
  },
  passcode: {
    type: String, 
  },
  shareable: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("file", fileSchema);
