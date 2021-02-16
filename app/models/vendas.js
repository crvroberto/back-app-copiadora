/**
 * Arquivo: produto.js
 * Author: Glaucia Lemos
 * Descrição: arquivo responsável onde trataremos o modelo da classe 'Produto'
 * Data: 18/10/2017
 * obs.: http://mongoosejs.com/docs/schematypes.html
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const VendaSchema = new Schema({
    
    objetos : [],
    data: { type: Date, default: Date.now },
    obs : String,
    
    
})

module.exports = mongoose.model('Venda', VendaSchema);