// @desc    Logs request to console
const logger = (req, res, next) => {
    req.hello = 'Hello World';
    console.info(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} `.bold.blue, `${res.statusCode}`.bold.green);
    next();
}

module.exports = logger;