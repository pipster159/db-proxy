const path = require("path")
const openFile = require("../file/open");
const append = require("../file/append");
const closeFile = require("../file/close");
module.exports = (log, filePath, file) => {
    return setInterval(async () => {
        if (log[file].length > 0) {
            let fh;
            try {
                fh = await openFile(path.join(filePath,file), 'a')
                let theseLogs = log[file];
                log[file] = [];
                let logSave = theseLogs.map(thisLog => {
                    append(fh, `${thisLog.time} - ${thisLog.message}\n`)
                })
                await Promise.all(logSave)
            } catch (e) {
                console.error(e)
            } finally {
                await closeFile(fh)
            }
        }
    }, 5000)
}