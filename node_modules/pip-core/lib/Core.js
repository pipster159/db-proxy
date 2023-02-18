const Core = () => {
    let util = {};
    util.consoleColors = require("./consoleColors")
    util.genRandomId = require("./random/getRandomId")
    util.getRandomInt = require("./random/getRandomInt")
    util.randomBoolean = require("./random/getRandomBoolean")

    util.setCType = require("./request/setContentType")
    util.checkPasswordComplexity = require("./check/checkPasswordComplexity")
    util.checkFile = require("./file/checkFile")
    util.checkValidEmail = require("./check/checkValidEmail")
    util.randS = require("./random/randS")
    util.pullCSV = require("./file/pullCsv.js")

    util.removeFile = require("./file/removeFile")
    util.pullJSON = require("./file/pullJson")
    util.writeJSON = require("./file/writeJson")
    util.csvToJSON = require("./file/csvToJson")
    util.localizeDate = require("./date/localizeDate")
    util.formatDate = require("./date/formatDate")

    util.toCamel = require("./format/toCamelCase")
    util.toSnake = require("./format/toSnakeCase")

    util.devReturnOut = require("../specific/devReturnOut")

    util.objectEqual = require("./check/objectEqual")
    util.rollback = require("../specific/rollback")
    util.wait5Seconds = require("./time/wait")

    util.append = require("./file/append")
    util.closeFile = require("./file/close")
    util.openFile = require("./file/open")
    util.renameFile = require("./file/rename")
    util.writeLogFile = require("./log/writeLogFile")

    util.logger = require("./log/logger")

    return util
}

module.exports = Core