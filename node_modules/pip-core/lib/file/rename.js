const {rename} = require("fs");
module.exports = (oldPath, newPath) => {
    return new Promise(resolve => {
        rename(oldPath, newPath, e => {
            if (e) {
                console.error(e)
                resolve(false)
            }
            resolve(true)
        })
    })
}