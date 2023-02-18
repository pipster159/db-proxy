const fs = require("fs")
const path = require("path")

module.exports = (appDir, file) => {
    return new Promise((resolve,reject) => {
        try{
            fs.unlink(path.join(appDir,'./data',file), (e) => {
                if(e)resolve(false)
                else(resolve(true))
            })
        }catch(e){reject(e)}
    })
}