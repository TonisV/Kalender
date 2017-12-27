const express    = require('express');
const bodyParser = require('body-parser');
const router     = express.Router();

const User = require('../models/user');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/', ensureAuthenticated, (req, res) => {
    res.render('pages/calendar');
});


// Kontroll kas tegemist on sisseloginud kasutajaga
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }else{
        req.flash('danger', 'Please login');
        return res.redirect('/login');
    }
}

module.exports = router;