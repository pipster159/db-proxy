const fs = require("fs")

module.exports = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, JSON.stringify(data), e => {
            if (e) {
                reject({e: e, file: file})
            } else {
                resolve()
            }
        })
    })
};