const {appendFile} = require("fs");
module.exports = (fh, line) => {
    return new Promise((resolve) => {
        appendFile(fh, line, e => {
            if (e) {
                console.error(e)
                resolve(false)
            }
            resolve(true)
        })
    })
}