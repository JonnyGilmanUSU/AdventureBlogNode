const User = require('../models/User');

exports.postSignUp = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Use static method of model to check if the email is unique
        const emailUnique = await User.checkEmailUnique(email);

        if (!emailUnique) {
            return res.status(409).json({ message: 'Sorry, that email is taken.' });
        }
        // Email is unique then Create User Model
        const user = new User({
            firstName,
            lastName,
            email,
            password
        });
        // Save user
        await user.save();
        res.status(201).json({ successMessage: 'Registration successful', redirectUrl: '/login' });
    } catch (error) {
        res.status(500).json({ message: 'Oops there was an error registering user.' });
    }
};

exports.authUser = async (req, res, next) => {
    // Retrieve values from form
    const { email, password } = req.body;

    try {
      // Find matching user by email
      const user = await User.findOne({ email: email });
      let passwordsMatch = false;
      if (user) {
        passwordsMatch = await user.validatePassword(password);
      }
      res.locals.user = user;
      res.locals.passwordsMatch = passwordsMatch;
      next();
    } catch (error) {
      console.log(error);
      next();
    }
};

exports.loginWebApp = async (req, res, next) => {
    const { user, passwordsMatch } = res.locals;
    // console.log("user and password are", user, passwordsMatch);
  
    if (user && passwordsMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({
                loginSuccess: false,
                message: "Failed to save session data."
            });
        }
            res.status(201).json({
                loginSuccess: true,
                user: user,
                successMessage: "Logged in successfully.",
                redirectUrl: "/"  // This is the URL to which you want to redirect the user
            });
        });
    } else {
        // Send JSON response for failed login
        res.status(401).json({
            loginSuccess: false,
            message: "Invalid Credentials",
            entries: { email: req.body.email }  // Avoid sending back the password
        });
    }
};

exports.postLogout = (req, res, next) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to logout.' });
            }
            res.json({ logoutSuccess: true, message: 'Logout successful.' });
        });
    } else {
        res.status(200).json({ logoutSuccess: true, message: 'No session to destroy.' });
    }
};


