const express    = require('express');
const bodyParser = require('body-parser');
const router     = express.Router();
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

    let newEvent = new Event({
        title   : req.body.title,
        start   : req.body.start,
        end     : req.body.start,
        allDay  : true,
        bgColor : req.body.bgColor,
        owner   : req.user._id
    });

    if(!newEvent.title) {
        console.log('Title not given');
        res.json('failed');
    }else {
        newEvent.save(function (err) {
            if (err) {
                console.log(err);
            }
            res.json('success');
        });
    }
});

// Update event
router.post('/update', ensureAuthenticated, (req, res) => {

    let event = {
        title   : req.body.title,
        start   : req.body.start,
        end     : req.body.end,
        allDay  : req.body.allDay,
        bgColor : req.body.bgColor,
    };

    let query = {_id: req.body.id};

    if(!query._id) {
        console.log('ID not given');
        res.json('failed');
    }else{
        Event.update(query, event, (err) => {
            if(err) {
                console.log(err);
            }else{
                res.json('success');
            }
        });
    }

});

// Delete event
router.post('/delete', ensureAuthenticated, (req, res) => {

    let query = {_id:req.body.id};

    if(!query._id) {
        console.log('ID not given');
        res.json('failed');
    }else{
        Event.remove(query, function (err) {
            if(err) {
                console.log(err);
            }
            res.json('success');
        });
    }
});

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