const {open} = require("fs");
module.exports = (file, flag) => {
    return new Promise(resolve => {
        open(file, flag, (e, fh) => {
            if (e) {
                console.error(e)
                resolve(false)
            }
            resolve(fh)
        })
    })
}