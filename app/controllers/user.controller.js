
const logger = require('./log.controller.js'),
  Sentence = require('../models/sentence');

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

module.exports = {
  getProfile,
};
