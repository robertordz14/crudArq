const rolModel = require("../models/rol");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const rol = await rolModel.find({ rolStatus: true });
    idRol = req.query.idRol;
    const Rolefind = await rolModel.findById(idRol);
    if (Rolefind) {
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          name: Rolefind,
        },
      });
    }
    if (rol.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No roles were found in the database.",
        cont: {
          rol,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          rol,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting the roles.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const rol = new rolModel(req.body);
    let err = rol.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error to insert role.",
        cont: {
          err,
        },
      });
    }
    const rolefind = await rolModel.findOne({
      nombreRol: { $regex: `${rol.nombreRol}$`, $options: "i" },
    });
    if (rolefind) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "The role you are trying to register already exists",
        cont: {
          nombreRol: rolefind.nombreRol,
        },
      });
    }
    const newrole = await rol.save();
    if (newrole.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: Role could not be registered.",
        cont: {
          newrole,
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
      msg: "Error: Error to insert role",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const idRol = req.query.idRol;
    if (req.query.idRol == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }

    req.body._id = idRol;

    const Rolefind = await rolModel.findById(idRol);

    if (!Rolefind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The role was not found in the database.",
        cont: Rolefind,
      });
    }
    const newrole = new rolModel(req.body);
    let err = newrole.validateSync();

    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting role.",
        cont: {
          err,
        },
      });
    }
    const roleupdate = await rolModel.findByIdAndUpdate(
      idRol,
      { $set: newrole },
      { new: true }
    );
    if (!roleupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the role.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The role was updated successfully.",
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating role.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idRol == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }

    idRol = req.query.idRol;
    const Rolefind = await rolModel.findById(idRol);
    if (!Rolefind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The role was not found in the database.",
        cont: Rolefind,
      });
    }
    const roledelete = await rolModel.findOneAndUpdate(
      { _id: Rolefind },
      { $set: { rolStatus: "0" } }
    );
    if (!roledelete) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: When trying to delete the role.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: the role has been successfully removed.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete role.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
