const express        = require('express');                // Veebiserveri rakendus
const mongoose       = require('mongoose');               // Mongodb'ga suhtlemise rakendus
const passport       = require('passport');               // Kasutajate autentimise rakendus
const session        = require('express-session');        // Sessioonide haldamise rakendus

// Suunamised
const loginRoutes    = require('./controllers/login');
const calendarRoutes = require('./controllers/calendar');

// Andmebaasi määramine
mongoose.connect('mongodb://localhost/calendar');
let db = mongoose.connection;

// Kontrollimaks kas oleme andmebaasiga ühendatud
db.once('open', function() {
    console.log('Connected to database');
});

// Ligipääs veebiserveri rakendusele
const app = express();

// Vaadete mootori määramine
app.set('view engine', 'ejs');

// Avalik kaust hoidmaks stiili faile jms.
app.use(express.static('public'));

//
app.use(session({
    secret: 'session secret',
    resave: true,
    saveUninitialized: true
}));

// Lisa Express rakendusele teadete kuvamiseks
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport seaded
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Suunamised
app.use('/calendar', calendarRoutes);
app.use('/', loginRoutes);

// Serveri port millel rakendus töötab
const PORT = 3005;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});