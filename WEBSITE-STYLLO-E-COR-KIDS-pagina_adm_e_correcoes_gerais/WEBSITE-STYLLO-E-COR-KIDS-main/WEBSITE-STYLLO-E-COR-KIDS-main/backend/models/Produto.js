const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  ageRange: { type: String, required: true },
  images: { type: String, required: true }, 
  sizes: { type: String, required: true },  
  colors: { type: String, required: true }, 
}, { 
  versionKey: false 
});

// O terceiro parâmetro 'DADOS' mantém a conexão com sua coleção existente
module.exports = mongoose.model('Produto', ProdutoSchema, 'DADOS');