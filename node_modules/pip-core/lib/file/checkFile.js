const fs = require("fs");
module.exports = file => {
    return new Promise((resolve, reject) => {
        try {
            fs.access(file, fs.constants.F_OK, (e) => {
                if (e) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}