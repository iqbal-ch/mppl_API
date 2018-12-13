const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
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
    }

    // image:{
    //   type : mongoose.Schema.Types.ObjectId, ref: 'Image'
    // }

});

module.exports = mongoose.model('Event', EventSchema);
