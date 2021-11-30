const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario");
const app = express();

app.post("/", (req, res) => {
  let body = req.body;

  Usuario.findOne(
    { emailUsuario: body.emailUsuario, statusUsuario: true },
    (err, usrDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          msg: "Ocurrio un error al momento del logueo",
          err,
        });
      }
      if (!usrDB) {
        return res.status(400).json({
          ok: false,
          msg: "Mail incorrecto o inexistente, intentelo de nuevo",
        });
      }
      if (!bcrypt.compareSync(body.contrasenaUsuario, usrDB.contrasenaUsuario)) {
        return res.status(401).json({
          ok: false,
          msg: "Contraseña incorrecta, intentelo de nuevo",
        });
      }
      res.json({
        ok: true,
        msg: `Bienvenido ${usrDB.nombreUsuario}`,
        usrDB,
      });
    }
  );
});

module.exports = app;
