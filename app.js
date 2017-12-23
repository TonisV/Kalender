const express  = require('express');         // Veebiserveri rakendus
const mongoose = require('mongoose');        // Mongodb'ga suhtlemise rakendus
const passport = require('passport');        // Kasutajate autentimise rakendus
const session  = require('express-session'); // Sesioonide haldamise rakendus

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


// Serveri port millel rakendus töötab
const PORT = 3000;

app.use('/server-info', infoRoutes);
app.use('/', indexRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});