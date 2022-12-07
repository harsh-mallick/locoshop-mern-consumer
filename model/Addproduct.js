const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shops'
    },
    pname: {
        type: String,
        required: true
    },
    pmodel: {
        type: String,
        required: true
    },
    psize: {
        type: String,
        required: true
    },
    pprice: {
        type: String,
        required: true
    },
    pdescription: {
        type: String,
        required: true
    },
    pimage: { 
        data: Buffer, 
        contentType: String 
     }
})

const Products = mongoose.model('Products', userSchema);

module.exports = Products;