const mongoose = require("mongoose");
const { Schema } = mongoose;

const usuarioSchema = new Schema({
  nombreUsuario: {
    type: String,
  },
  apellidoUsuario: {
    type: String,
  },
  emailUsuario: {
    type: String,
  },
  numeroUsuario: {
    type: String,
  },
  idUsuarioRol: {
    type: Schema.Types.ObjectId,
    ref: "rol",
  },
  contrasenaUsuario: {
    type: String,
  },
  statusUsuario: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("usuario", usuarioSchema);
