const historialModel = require("../models/historial");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const historial = await historialModel.find();
    if (historial.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No existe historial",
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Historial obtenido correctamente",
        cont: {
          historial,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error al obtener el historial",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const historial = new historialModel(req.body);
    let err = historial.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error al insertar el historial",
        cont: {
          err,
        },
      });
    }
    const historialfind = await historialModel.findOne({
      historialnombre: { $regex: `${historial.historialnombre}$`, $options: "i" },
    });
    if (historialfind) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "El historial ya existe en la base de datos.",
        cont: {
          historialnombre: historialfind.historialnombre,
        },
      });
    }
    const newhistorial = await historial.save();
    if (newhistorial.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: No se pudo insertar el historial",
        cont: {
          newhistorial,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Informacion insertada correctamente",
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error al insertar el historil",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
