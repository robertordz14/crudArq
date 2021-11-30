const mongoose = require("mongoose");
const { Schema } = mongoose;

const proyectoSchema = new Schema({
  nombreProyecto: {
    type: String,
  },
  descripcionProyecto: {
    type: String,
  },
  proyectoStatus: {
    type: String,
  },
});

module.exports = mongoose.model("proyecto", proyectoSchema);
