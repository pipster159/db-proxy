const {close} = require("fs");
module.exports = file => {
    return new Promise(resolve => {
        close(file, e => {
            if (e) {
                console.error(e)
                resolve(false)
            }
            resolve(true)
        })
    })
}