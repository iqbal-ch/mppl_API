const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    date_created : {
        type: Date
    },

    description: {
        type: String
    },

    address:String
    ,

    qty:Number,

    status: {
      type: String,
      default: "Belum Dibayar"
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },

    IdBarang: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Barang', required: true
    }
  
    //   IdBarang: [{
    //       nama: String, qty: Number
    //   }]
});

module.exports = mongoose.model('Order', OrderSchema);
