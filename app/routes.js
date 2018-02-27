// app/routes.js
const ctrlPigLatinTranslator = require('./controllers/piglatin.controller.js'),
	ctrlUser = require('./controllers/user.controller'),
	ctrlLogin = require('./controllers/login.controller');

module.exports = function(app, passport) {

	// *************************************
	// HOME PAGE
	// *************************************
	app.get('/', (req, res) => {
		res.render('index.ejs'); // load the index.ejs file
	});

	// *************************************
	// LOGIN
	// *************************************
	app.get('/login', (req, res) => {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/api/login', (req, res, next) => {
		passport.authenticate('local-login', (err, user, info) => {
			ctrlLogin.login(req, res, err, user, info);
		})(req, res, next);
	});

	// *************************************
	// SIGNUP
	// *************************************
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/api/signup', (req, res, next) => {
		passport.authenticate('local-signup', (err, user, info) => {
			ctrlLogin.signup(req, res, err, user, info);
		})(req, res, next);
	});

	app.get('/verifyemail', (req, res) => {
	  const user = req.user;
		res.render('verify.ejs', { message: req.flash('verifyMessage') , email: user.email});
	})

	// *************************************
	// PROFILE/TRANSLATE
	// *************************************
	
	// verify the profile
	app.get('/verifyProfile', (req, res) => {
		res.render('verifyProfile.ejs');
	})

	app.get('/api/verifyProfile', ctrlUser.verifyProfile)

// protected in order to be logged in
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile.ejs');
	});
// protected in order to be logged in
	app.get('/api/profileuser', isLoggedIn, ctrlUser.getProfile);

	app.post('/api/translate', isLoggedIn, ctrlPigLatinTranslator.translateAndSave);

	// *************************************
	// LOGOUT
	// *************************************
	app.get('/api/logout', ctrlLogin.logout);
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		if (req.user.verified) {
			return next();
		}
	}
	// if they aren't redirect them to the home page
	// res.status(401).json({msg: 'User not login in'});
	res.redirect('/');
}
