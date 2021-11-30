const tareasModel = require("../models/tareas");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const tareas = await tareasModel.find();
    if (tareas.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No hay tareas registradas",
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Informacion obtenida correctamente",
        cont: {
          tareas,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error al obtener tareas",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const tareas = new tareasModel(req.body);
    let err = tareas.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error al insertar tareas",
        cont: {
          err,
        },
      });
    }
    const tareasEncontrada = await tareasModel.findOne({
      nombreTarea: { $regex: `${tareas.nombreTarea}$`, $options: "i" },
    });
    if (tareasEncontrada) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "La tarea ya existe en la base de datos",
        cont: {
          nombreTarea: tareasEncontrada.nombreTarea,
        },
      });
    }
    const newtareas = await tareas.save();
    if (newtareas.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: Al registrar la tarea",
        cont: {
          newtareas,
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
      msg: "Error: Error al insertar las tareas",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const idtareas = req.query.idtareas;
    if (req.query.idtareas == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: Al actualizar los datos.",
        cont: 0,
      });
    }

    req.body._id = idtareas;

    const tareasEncontrada = await tareasModel.findById(idtareas);

    if (!tareasEncontrada) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: No existen tareas en la base de datos",
      });
    }
    const newtareas = new tareasModel(req.body);
    let err = newtareas.validateSync();

    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error al insertar la tarea actualizada",
        cont: {
          err,
        },
      });
    }
    const tareasupdate = await tareasModel.findByIdAndUpdate(
      idtareas,
      { $set: newtareas },
      { new: true }
    );
    if (!tareasupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: No se pudo actualizar",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: Tarea actualizada correctamente.",
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error al actualizar la tarea",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idtareas == "") {
      return res.status.send({
        estatus: "400",
        err: true,
        msg: "Error: El ID es invalido",
        cont: 0,
      });
    }
    idtareas = req.query.idtareas;
    const tareasEncontrada = await tareasModel.findById(idtareas);
    if (!tareasEncontrada) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: No hay tareas en la base de datos",
        cont: tareasEncontrada,
      });
    }
    const tareasdelete = await tareasModel.findOneAndUpdate(
      { _id: tareasEncontrada },
      { $set: { statusTarea: "Cancelado" } }
    );
    if (!tareasdelete) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Al eliminar las tareas",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: Tarea eliminada correctamente`,
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: No se pudo elimiar la tarea",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
