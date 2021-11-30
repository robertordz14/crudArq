const User = require("../models/usuario");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const express = require("express");
const app = express();

app.get("/", function (req, res) {
  User.find({ statusUsuario: true }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        msg: "Ocurrio un error al momento de consultar los usuarios",
        err,
      });
    }
    res.json({
      ok: true,
      msg: "Lista de usuarios obtenida con exito",
      conteo: user.length,
      user,
    });
  });
});

app.post("/", function (req, res) {
  let body = req.body;
  let usr = new User({
    nombreUsuario: body.nombreUsuario,
    apellidoUsuario: body.apellidoUsuario,
    emailUsuario: body.emailUsuario,
    numeroUsuario: body.numeroUsuario,
    idUsuarioRol: body.idUsuarioRol,
    statusUsuario: body.statusUsuario,
    contrasenaUsuario: bcrypt.hashSync(body.contrasenaUsuario, 10),
  });
  usr.save((err, usrDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        msg: "Ocurrio un error",
        err,
      });
    }
    res.json({
      ok: true,
      msg: "Usuario insertado con exito",
      usrDB,
    });
  });
});

app.put("/", function (req, res) {
  let id = req.query.id;
  let body = _.pick(req.body, [
    "nombreUsuario",
    "apellidoUsuario",
    "emailUsuario",
    "userphonenumber",
    "idUsuarioRol",
    "statusUsuario",
  ]);

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: "query" },
    (err, usrDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          msg: "Ocurrio un error al momento de actualizar",
          err,
        });
      }
      res.json({
        ok: true,
        msg: "Usuario actualizado con exito",
        usuario: usrDB,
      });
    }
  );
});

app.delete("/", function (req, res) {
  let id = req.query.id;
  User.findByIdAndUpdate(
    id,
    { statusUsuario: false },
    { new: true, runValidators: true, context: "query" },
    (err, usrDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          msg: "Ocurrio un error al momento de eliminar",
          err,
        });
      }
      res.json({
        ok: true,
        msg: "Usuario eliminado con exito",
        usrDB,
      });
    }
  );
});

module.exports = app;
