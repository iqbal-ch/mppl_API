const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    date: {
        type: Date
    },

    date_created : {
        type: Date
    },

    description: {
        type: String
    },

    address: {
        type: String
    },


    budget: {
        type: Number
    },

    status: {
      type: String,
      default: "Waiting"
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    }

});

module.exports = mongoose.model('Order', OrderSchema);
