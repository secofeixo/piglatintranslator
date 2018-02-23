
const logger = require('./log.controller.js'),
  Sentence = require('../models/sentence'),
  configToken = require('../../config/token.js'),
  User = require('../models/user'),
  moment = require('moment'),
  jwt = require('jwt-simple');

function getProfile(req, res) {

  const userid = req.user._id;
  logger.info(`user.controller.js. getProfile. User in session: ${JSON.stringify(userid)}`);
  // get sentences
  // const arSentences = [];
  Sentence.find({user: userid}).sort({'_id': -1}).exec((errSentences, arSentences) => {
    if (errSentences) {
      const sError = `Error reading Sentences. Error: ${errSentences}`;
      logger.error(`user.controller.js. getProfile. ${sError}`);
    }

    res.render('profile.ejs', {
      user : req.user, // get the user out of session and pass to template
      sentences: arSentences,
    });
  });
} // getProfile

function verifyProfile(req, res) {
  const token = req.query.token;
  var payload = jwt.decode(token, configToken.tokenSecret);
  logger.debug(`user.controller.js. verifyProfile. token: ${token}`);
  logger.debug(`user.controller.js. verifyProfile. payload: ${payload}`);
  
  if(payload.exp <= moment().unix()) {
     return res
      .status(401)
        .send({message: "El token ha expirado"});
  }
  
  req.user = payload.sub;
  logger.debug(`user.controller.js. verifyProfile. payload: ${req.user}`);

  User.update({'_id': req.user},{'$set': {'verified': true}}).exec((err) => {
    if (err) {
      logger.error(`user.controller.js. verifyProfile. Error updating user validating email. ${sError}`);
    }

    res.redirect('/profile');
  })


}

module.exports = {
  getProfile,
  verifyProfile,
};
