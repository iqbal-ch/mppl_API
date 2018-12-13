const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },

    password: {
        type: String,
        required: true
    },

    name: {
		    type: String,
        require: true
    },

	//   address: {
	// 	    type: String,
    //     require : true
    // },

	  phone_number: {
            type: String
    }

    // status: {
    //   type: String,
    //   default: "1"
    // }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByEmail = function(email, callback){
    var query = {email: "admin@eventarich.com"};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}
