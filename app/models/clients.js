const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Client = new Schema({
    
    nome : String,
    numero: String,
   
    
})

module.exports = mongoose.model('Client', Client);