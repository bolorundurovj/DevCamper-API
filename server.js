const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

//Route files
const bootcamps = require('./routes/bootcamps');

//Middleware Imports
const logger = require('./middleware/logger');

//Load Env Vars
dotenv.config({ path: './config/config.env' });

const app = express();

//My logging middleware
app.use(logger);

//Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
  )
);
