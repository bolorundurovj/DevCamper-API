const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
// const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const connectDB = require('./config/db');

//Load Env Vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

//Middleware Imports
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');

const app = express();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

//Set security headers
app.use(helmet());

//My logging middleware
app.use(logger);

//Body Parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

// //Dev logging middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

//File Uploading
app.use(fileupload());

//Sanitize Data
app.use(mongoSanitize());

//Prevent XSS attacks
app.use(xss());

//Prevent HPP attacks
app.use(hpp());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//  Apply to all requests
app.use(limiter);

//Use CORS
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
      .yellow.bold
  )
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bgWhite);
  //Close server && exit process
  server.close(() => {
    process.exit(1);
  });
});
