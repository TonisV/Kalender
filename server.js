const express  = require('express');         // Web application framework
const mongoose = require('mongoose');        // Mongodb object modeling
const passport = require('passport');        // Authentication middleware
const session  = require('express-session'); // Express Session handling middleware

// Routing controllers
const loginRoutes    = require('./controllers/login');
const calendarRoutes = require('./controllers/calendar');

// Db connection
mongoose.connect('mongodb://localhost/calendar', {
    useMongoClient: true,
});
let db = mongoose.connection;

// Db connection check
db.once('open', function() {
    console.log('Connected to database');
});

// Init web app
const app = express();

// Load View Engine
app.set('view engine', 'ejs');

// Set Public Folder
app.use(express.static('public'));

// Express session conf
app.use(session({
    secret: 'session secret',
    resave: true,
    saveUninitialized: true
}));

// Express middleware Conf for showing messages
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Authentication middleware conf
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routing
app.use('/calendar', calendarRoutes);
app.use('/', loginRoutes);

// Server port
const PORT = 3005;
// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});