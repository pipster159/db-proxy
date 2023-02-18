A Database Proxy layer for Postgres and MySQL

Docker Dev Database Commands -

`docker run -p 3306:3306 --name devMysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=pipnet -e MYSQL_USER=phillip -e MYSQL_PASSWORD=password -d mysql:latest`

`docker run -p 5432:5432 --name devPostgres -e POSTGRES_PASSWORD='password' -e POSTGRES_USER='phillip' -e POSTGRES_DB='pipnet' -d postgres`


Example Usage:
```
const Proxy = require("db-proxy")
const loggerConfig = {
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
const util = proxy.core()
const log = util.logger(loggerConfig)
const pg = proxy.postgres(log, util, postgresConfig)
const mysql = proxy.mysql(log, mysqlConfig)
```