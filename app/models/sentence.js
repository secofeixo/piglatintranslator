// app/models/sentence.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema = mongoose.Schema;

// define the schema for our sentence model
var sentenceSchema = Schema({

    english: String,  // english sentence to be translated
    piglatin: String,  // text translated into pig latin
    user: {						// user who ask for the translation
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    }
});

// create the model for sentences and expose it to our app
module.exports = mongoose.main_conn.model('Sentence', sentenceSchema);
