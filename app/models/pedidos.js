const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendaSchema = new Schema({
    
    objetos : [],
    data: { type: Date, default: Date.now },
    obs : String,
    
})

module.exports = mongoose.model('Pedido', VendaSchema);