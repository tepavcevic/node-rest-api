const { logEvents } = require('./logEvents');

const errorHandler = (error, req, res, next) => {
    console.error(error.stack);
    logEvents(`${error.name}: ${error.message}`, 'errorLog.txt')
    res.status(500).send(error.message);
}

module.exports = errorHandler;