const proyectoModel = require("../models/proyecto");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const proyecto = await proyectoModel.find();
    if (proyecto.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No projects were found in the database.",
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          proyecto,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting the projects.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const proyecto = new proyectoModel(req.body);
    let err = proyecto.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error to insert project.",
        cont: {
          err,
        },
      });
    }
    const proyectoEncontrado = await proyectoModel.findOne({
      nombreProyecto: { $regex: `${proyecto.nombreProyecto}$`, $options: "i" },
    });
    if (proyectoEncontrado) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "The project you are trying to register already exists",
        cont: {
          nombreProyecto: proyectoEncontrado.nombreProyecto,
        },
      });
    }
    const newproject = await proyecto.save();
    if (newproject.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: project could not be registered.",
        cont: {
          newproject,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Information inserted correctly.",
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error to insert project",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const idProyecto = req.query.idProyecto;
    if (req.query.idProyecto == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }

    req.body._id = idProyecto;

    const proyectoEncontrado = await proyectoModel.findById(idProyecto);

    if (!proyectoEncontrado) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The project was not found in the database.",
      });
    }
    const newproject = new proyectoModel(req.body);
    let err = newproject.validateSync();

    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting project.",
        cont: {
          err,
        },
      });
    }
    const Projectupdate = await proyectoModel.findByIdAndUpdate(
      idProyecto,
      { $set: newproject },
      { new: true }
    );
    if (!Projectupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the project.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The project was updated successfully.",
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating project.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idProyecto == "") {
      return res.status.send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    idProyecto = req.query.idProyecto;
    const proyectoEncontrado = await proyectoModel.findById(idProyecto);
    if (!proyectoEncontrado) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The project was not found in the database.",
        cont: proyectoEncontrado,
      });
    }
    const projectdelete = await proyectoModel.findOneAndUpdate(
      { _id: proyectoEncontrado },
      { $set: { proyectoStatus: "CANCELADO" } }
    );
    if (!projectdelete) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: When trying to delete the project.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: the project has been successfully removed.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete project.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
