const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Define routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


mongoose.connect('mongodb+srv://Admin:' + process.env.MONGO_ATLAS_PW + '@shop-xmoyb.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//start cross origin headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origing', "*"),
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-with, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


// Start Error Handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status) || 500;
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app; 