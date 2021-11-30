const express = require("express");
const app = express();

app.use("/rol", require("./rol"));
app.use("/registro", require("./registro"));
app.use("/login", require("./login"));
app.use("/proyecto", require("./proyecto"));
app.use("/tareas", require("./tareas"));
app.use("/historial", require("./historial"));

module.exports = app;
