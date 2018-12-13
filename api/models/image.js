const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    // butuh diliat enaknya pake types object atau increment number aja
    _id: mongoose.Schema.Types.ObjectId,


    event_image_path: {
      type: String,
      required: true
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true
  },

  status: {
    type: String,
    default: "waiting admin's confirmation.."
  },

    userId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true

    }

});

module.exports = mongoose.model('Image', ImageSchema);
