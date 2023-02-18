const path = require("path")
const EventEmitter = require("events");
const openFile = require("../file/open");
const renameFile = require("../file/rename");
const writeLogFile = require("./writeLogFile");
const formatDate = require("../date/formatDate")
const consoleColors = require("../consoleColors")

module.exports = (...args) => {
    const logger = new EventEmitter();

    let log = {
        devLog: [],
        errorLog: [],
        polishLog: [],
        auditLog: [],
        recoveryLog: []
    }
    let intervals = [];

    let logPath = false
    let logVerbosity = 'v'
    let logTo = ['console']
    let devActiveLogTags = []

    if (typeof (args[0]) === "object") {
        if (Array.isArray(args[0])) {
            logPath = args[0][0] ? args[0][0] : logPath
            logVerbosity = args[0][1] ? args[0][1] : logVerbosity
            logTo = args[0][2] ? args[0][2] : logTo
            devActiveLogTags = args[0][3] ? args[0][3] : devActiveLogTags
        } else {
            logPath = args[0].hasOwnProperty('logPath') ? args[0]['logPath'] : logPath
            logVerbosity = args[0].hasOwnProperty('logVerbosity') ? args[0]['logVerbosity'] : logVerbosity
            logTo = args[0].hasOwnProperty('logTo') ? args[0]['logTo'] : logTo
            devActiveLogTags = args[0].hasOwnProperty('devActiveLogTags') ? args[0]['devActiveLogTags'] : devActiveLogTags
        }
    } else if (typeof (args[0]) === "string") {
        logPath = args[0] ? args[0] : logPath
        logVerbosity = args[1] ? args[1] : logVerbosity
        logTo = args[0][2] ? args[2] : logTo
        devActiveLogTags = args[3] ? args[3] : devActiveLogTags
    }

    /* Logger Listeners */
    logger.on('development', data => {
        if (logTo.includes("file")) log.devLog.push({time: formatDate(false, true), message: data.toString()})
        if (logTo.includes("console")) process.stdout.write(`\t${consoleColors.BgBlue}${consoleColors.FgWhite}${data.toString()}${consoleColors.Reset}\n`)
    });
    logger.on('error', data => {
        if (logTo.includes("file")) log.errorLog.push({time: formatDate(false, true), message: `${data.log}\n${data.text ? `${data.text}` : ""}\n`})
        if (logTo.includes("console")) process.stdout.write(`\n\n${consoleColors.BgRed}${consoleColors.FgWhite}${data.log}${data.text ? `\n${consoleColors.BgRed}${consoleColors.FgWhite}Application Error Label: ${data.text}${consoleColors.Reset}` : consoleColors.Reset}\n\n`)
    });
    logger.on('polish', data => {
        if (logTo.includes("file")) log.polishLog.push({time: formatDate(false, true), message: data.toString()})
        if (logTo.includes("console")) process.stdout.write(`${data.toString()}\n`)
    });
    logger.on('audit', data => {
        if (logTo.includes("file")) log.auditLog.push({time: formatDate(false, true), message: data.toString()})
        if (logTo.includes("console")) process.stdout.write(`\t${consoleColors.BgYellow}${consoleColors.FgBlack}${data.toString()}${consoleColors.Reset}\n`)
    });
    logger.on('recovery', data => {
        if (logTo.includes("file")) log.recoveryLog.push({time: formatDate(false, true), message: `\t${data.log}\n\t${data.uj}`})
        if (logTo.includes("console")) process.stdout.write(`\t${consoleColors.BgGreen}${consoleColors.FgWhite}${data.log}${consoleColors.Reset}\n\t${consoleColors.BgGreen}${consoleColors.FgWhite}${data.uj}${consoleColors.Reset}\n`)
    })

    /* Write Log Handles */
    logger.a = str => logger.emit('audit', str);
    logger.p = str => logger.emit('polish', str);
    logger.d = (log, tag, verbosity) => {
        let write = true;
        if (verbosity && verbosity.length > logVerbosity.length) write = false;
        if (tag && devActiveLogTags.includes(tag)) write = false;
        if (write) {
            if (typeof (log) === "object") log = JSON.stringify(log, null, 4);
            logger.emit('development', log);
        }
    };
    logger.e = (log, verbosity, text) => {
        if (verbosity.length === 1 && logVerbosity.length >= 1) {
            if (typeof (log) === "object") {
                log = log.message
            }
        }
        else if (verbosity.length >= 2 && logVerbosity.length >= 2) {
            log = `${log.stack}`
        }
        logger.emit('error', {log, text});
    };
    logger.r = (log, uj) => {
        logger.emit('recovery', {log, uj})
    }

    /* Log Functionality */
    logger.startLogFile = async (filename, formatDate) => {
        if (typeof (logPath) === "string") {
            let fh, renamed
            try {
                fh = await openFile(path.join(logPath, filename), 'wx')
                if (!fh) {
                    try {
                        renamed = renameFile(path.join(logPath, filename), `${path.join(logPath, filename)}_${formatDate(false, true, true)}`)
                        if (!renamed) {
                            return false
                        }
                        fh = await openFile(path.join(logPath, filename), 'w')
                    } catch (e) {
                        console.error(e)
                        return false
                    }
                }
            } catch (e) {
                console.error(e)
                return false
            }
            if (!fh) {
                return false
            }
            return fh
        }
        else{
            console.log(`Cannot start a log file, logger has no log path`)
            return false
        }
    }
    logger.clearIntervals = () => {
        intervals.map(thisInterval => clearInterval(thisInterval))
    }

    if (typeof (logPath) === "string" && logTo.includes("file")) {
        log.devLog.push({time: formatDate(false, true), message: "Dev Log - Started"})
        log.errorLog.push({time: formatDate(false, true), message: "Error Log - Started"})
        log.auditLog.push({time: formatDate(false, true), message: "Audit Log - Started"})
        log.polishLog.push({time: formatDate(false, true), message: "Polish Log - Started"})
        log.recoveryLog.push({time: formatDate(false, true), message: "Recovery Log - Started"})
        intervals.push(writeLogFile(log, logPath, 'devLog'))
        intervals.push(writeLogFile(log, logPath, 'errorLog'))
        intervals.push(writeLogFile(log, logPath, 'auditLog'))
        intervals.push(writeLogFile(log, logPath, 'polishLog'))
        intervals.push(writeLogFile(log, logPath, 'recoveryLog'))
    }
    else if(!logPath && logTo.includes("file")){
        process.stderr.write(`\n\x1b[31mLogger configuation key 'logTo' includes 'file', but a value for logger key 'logPath' wasn't provided.\nPlease provide a string value for 'logPath' in the logger's initialization configuration.\x1b[0m\n\n`)
        throw Error('Logger Failed to initialize properly')
    }

    return logger
}

