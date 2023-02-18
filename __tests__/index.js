const proxy = require("../")
const coreConfig = {
    logPath: __dirname,
    logTo: ['console'],
    devLogTags: [],
    logVerbosity: 'vv'
}
const postgresConfig = {
    host:"0.0.0.0",
    user:"phillip",
    database:"pipnet",
    password:"password",
    port:"5432"
}
const mysqlConfig = {
    host:"0.0.0.0",
    user:"phillip",
    database:"pipnet",
    password:"password",
    port:"3306"
}

const test = async () => {
    try{
        const util = proxy.core()
        const log = util.logger(coreConfig)

        log.a("Postgres Verifications")
        const pg = proxy.postgres(log, util, postgresConfig)
        await pg.verify()
        await pg.close()
        log.a("")
        log.a("MySQL Verifications")
        const mysql = proxy.mysql(log, mysqlConfig)
        await mysql.verify()
        await mysql.close()

        console.log(`Finished`)
        process.exit(0)
    }
    catch(e){
        console.error(e)
        process.exit(1)
    }
}
test()