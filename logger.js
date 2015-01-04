var fs = require('fs');
var path = require('path');
var winston = require('winston');

var LOGS_DIRECTORY = "./logs";
var LOG_FILE_NAME = "all-logs.log";

if(!fs.existsSync(LOGS_DIRECTORY)){
    fs.mkdirSync(LOGS_DIRECTORY, 0766, function(err){
        console.error("Error trying to create the logs directory: " + LOGS_DIRECTORY);
    });
};

winston.emitErrs = true;

var logger;

function getLogger(){
    if(!logger){
        var logger = new winston.Logger({
            transports: [
                new winston.transports.File({
                    level: 'info',
                    filename: path.join(LOGS_DIRECTORY, LOG_FILE_NAME),
                    handleExceptions: true,
                    json: true,
                    maxsize: 5242880, //5MB
                    maxFiles: 5,
                    colorize: false
                }),
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    json: false,
                    timestamp: true,
                    prettyPrint: true,
                    depth: 2,
                    colorize: true
                })
            ],
            exitOnError: false
        });
    }
    return logger;
};

exports = module.exports = getLogger();
