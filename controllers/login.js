const express    = require('express');
const bodyParser = require('body-parser');
const router     = express.Router();
const bcrypt     = require('bcryptjs');
const passport   = require('passport');

const User = require('../models/user');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



router.get('/', (req, res) => {
    return res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('pages/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/calendar',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Olete edukalt välja logitud');
    return res.redirect('/login');
});

router.get('/register', (req, res) => {
    res.render('pages/register');
});

router.post('/register', (req, res) => {
    let username  = req.body.username;
    let password  = req.body.password;

    let newUser = new User({
        username: username,
        password: password
    });

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(err) {
                console.log(err);
                return res.redirect('/register');
            }

            newUser.password = hash;
            newUser.save(function(err) {
                if(err) {
                    console.log(err);
                    return res.redirect('/register');
                }
                return res.redirect('/login');
            })
        });
    });
});

module.exports = router;