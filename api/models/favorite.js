const mongoose = require('mongoose');

const FavoriteSchema = mongoose.Schema({
    // butuh diliat enaknya pake types object atau increment number aja
    _id: mongoose.Schema.Types.ObjectId,

    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },

    time: {
        type: Date,
    }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
