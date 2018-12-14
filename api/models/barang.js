const mongoose = require('mongoose');

const BarangSchema = mongoose.Schema({
    // butuh diliat enaknya pake types object atau increment number aja
    _id: mongoose.Schema.Types.ObjectId,

    //userId: { type: String, ref: 'User', required: true },

    nama: {
        type: String,
        max: 60,
        required: true
    },

    qty: {
        type: Number,
        required: true
    },

    harga: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    size: {
      type: String,
      required: true
    },

    category: {
      type: String, 
      required: true
    },

    image:{
      type : String,
      required: true
    }

});

module.exports = mongoose.model('Barang', BarangSchema);
