const mongoose = require("mongoose");
const { Schema } = mongoose;

const tareaSchema = new Schema({
  Tproyectos: {
    type: Schema.Types.ObjectId,
    ref: "proyecto",
  },
  Tusuarios: {
    type: Schema.Types.ObjectId,
    ref: "usuario",
  },
  nombreTarea: {
    type: String,
  },
  descripcionTarea: {
    type: String,
  },
  statusTarea: {
    type: String,
  },
});

module.exports = mongoose.model("tareas", tareaSchema);
