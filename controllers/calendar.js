const express    = require('express');
const bodyParser = require('body-parser');
const router     = express.Router();

const User  = require('../models/user');
const Event = require('../models/event');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/', ensureAuthenticated, (req, res) => {
    res.render('pages/calendar');
});
/*
// Uue sündmuse lisamine
router.get('/calendar', (req, res) => {
    let title   = ;
    let start   = ;
    let end     = ;
    let allDay  = ;
    let bgColor = ;

    let newEvent = new Event({
        title   : title,
        start   : start,
        end     : end,
        allDay  : allDay,
        bgColor : bgColor,
        owner   : user._id
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
*/
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