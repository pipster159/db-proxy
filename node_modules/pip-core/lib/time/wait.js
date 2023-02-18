module.exports = (ms = 5000) => {
    return new Promise(resolve => {
        let id = setInterval(() => {
            clearInterval(id)
            resolve()
        }, ms)
    })
}