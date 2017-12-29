const express    = require('express');
const bodyParser = require('body-parser');
const router     = express.Router();

const User  = require('../models/user');
const Event = require('../models/event');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


// Main Calendar page
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('pages/calendar');
});

// Events feed by user id
router.get('/events', ensureAuthenticated, (req, res) => {
    Event.find({owner:req.user._id}).exec( (err, events) => {
        if(err) {
            console.log(err);
        }else{
            res.json(events);
        }
    });
});

// Add event
router.post('/add', ensureAuthenticated, (req, res) => {

    let title   = req.body.title;
    let start   = req.body.start;
    let bgColor = req.body.bgColor;

    let newEvent = new Event({
        title   : title,
        start   : new Date(start),
        end     : new Date(start),
        allDay  : true,
        bgColor : bgColor,
        owner   : req.user._id
    });

    newEvent.save(function(err) {
        if(err) {
            console.log(err);
            res.json('error');
        }
        res.json('success');
    })

});

/*
// Update event
router.get('/update', ensureAuthenticated, (req, res) => {
    let title   = title;
    let start   = start;
    let end     = end;

    let newEvent = new Event({
        title   : title,
        start   : start,
        end     : end,
    });

});

// Delete event
router.get('/delete', ensureAuthenticated, (req, res) => {
    let id = id;
});
*/

// Check if it's a logged-in user
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }else{
        req.flash('danger', 'Palun logi sisse');
        return res.redirect('/login');
    }
}

module.exports = router;