const fs = require("fs")

module.exports = (file) => {
    return new Promise((resolve, reject) => {
        fs.access(file, fs.constants.F_OK, (e) => {
            if (e) {
                reject(e)
            } else {
                fs.readFile(file, 'utf8', (e, data) => {
                    if (e) {
                        reject({e: e, file: file})
                    } else {
                        resolve(JSON.parse(data))
                    }
                })
            }
        })
    })
};