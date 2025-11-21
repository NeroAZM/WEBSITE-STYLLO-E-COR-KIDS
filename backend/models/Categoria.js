const mongoose = require("mongoose");

const CategoriaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Categoria", CategoriaSchema, "CATEGORIAS");
