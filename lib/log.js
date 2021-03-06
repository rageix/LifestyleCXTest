const winston = require('winston');

const myFormat = winston.format.printf(info => {

    const lib = require('./lib');

    let output = {
        time: info.timestamp,
        level: !lib.isEmpty(info.message.level) ? info.message.level : info.level,
        msg: !lib.isEmpty(info.message.msg) ? info.message.msg : '',
    };

    if (info.message.error) {

        if (info.message.error.message) {

            output['error'] = info.message.error.message;

        }

        if (info.message.error.stack) {

            output['stack'] = info.message.error.stack;

        }


    }

    if (!lib.isEmpty(info.message.data)) {

        output['data'] = info.message.data;

    }

    return JSON.stringify(output);

});

let self = module.exports = {

    logger: winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.timestamp(),
            myFormat
        ),
        transports: [
            new winston.transports.Console(),
        ]
    }),
    // logs a fatal error and exits
    // msg: string
    // error: error
    // data: object
    fatal: (msg, error, data) => {

        self.logger.error({
            level: 'fatal',
            msg: msg,
            error: error,
            data: data
        });

        process.exit(5);

    },
    // logs an error
    // msg: string
    // error: error
    // data: object
    error: (msg, error, data) => {

        self.logger.error({
            msg: msg,
            error: error,
            data: data
        })

    },
    // logs a warning
    // msg: string
    // error: error
    // data: object
    warn: (msg, error, data) => {

        self.logger.warn({
            msg: msg,
            error: error,
            data: data
        })

    },
    // logs an info message
    // msg: string
    // error: error
    // data: object
    info: (msg, error, data) => {

        self.logger.info({
            msg: msg,
            error: error,
            data: data
        })

    },
    // logs a debug message
    // msg: string
    // error: error
    // data: object
    debug: (msg, error, data) => {

        self.logger.debug({
            msg: msg,
            error: error,
            data: data
        })

    },
};
