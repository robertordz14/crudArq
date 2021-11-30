const mongoose = require("mongoose");
const { Schema } = mongoose;

const rolSchema = new Schema({
  nombreRol: {
    type: String,
  },
  rolStatus: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("rol", rolSchema);
