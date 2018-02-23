// app/routes.js
const ctrlPigLatinTranslator = require('./controllers/piglatin.controller.js'),
	ctrlUser = require('./controllers/user.controller');

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
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// *************************************
	// SIGNUP
	// *************************************
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// *************************************
	// PROFILE/TRANSLATE
	// *************************************
	// protected in order to be logged in
	app.get('/profile', isLoggedIn, ctrlUser.getProfile);

	app.post('/translate', isLoggedIn, ctrlPigLatinTranslator.translateAndSave);

	// *************************************
	// LOGOUT
	// *************************************
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
