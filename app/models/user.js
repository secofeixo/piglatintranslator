// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

// define the schema for our user model
var userSchema = mongoose.Schema({
    email: {
    	type: String,
    	unique: true,
    },
    password: String,
    verified: {
    	type: Boolean,
    	defaults: false,
    },
    token: String
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.main_conn.model('User', userSchema);
