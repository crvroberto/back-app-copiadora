const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const VendaSchema = new Schema({
    
    objetos : [],
    data: { type: Date, default: Date.now },
    obs : String,
    funcionario: String,
    
    
})

module.exports = mongoose.model('Venda', VendaSchema)