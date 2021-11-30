const mongoose = require("mongoose");
const { Schema } = mongoose;

const historialSchema = new Schema({
  nombreHproyecto: {
    type: Schema.Types.ObjectId,
    ref: "proyectos",
  },
  nombreHtarea: {
    type: Schema.Types.ObjectId,
    ref: "tareas",
  },
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
},
});

module.exports = mongoose.model("historial", historialSchema);
