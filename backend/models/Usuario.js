const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// O terceiro parâmetro 'USUARIOS' força a conexão com a coleção que acabamos de criar
module.exports = mongoose.model("Usuario", UsuarioSchema, "USUARIOS");
