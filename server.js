require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const connectDB = require('./config/dbConfig');

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();

//custom middleware logger
app.use(logger)

//handle headers credentials before cors - not to get blocked
app.use(credentials);

//cross origin resource sharing
app.use(cors(corsOptions));


//built in middlewares for form data, json and static files
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

//cookie middleware
app.use(cookieParser());

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
})

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => console.log(`Server runing on port ${PORT}.`));
});