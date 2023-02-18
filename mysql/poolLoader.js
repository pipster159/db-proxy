// Handy one-liner for a local database
// docker run -p 3306:3306 --name sitlog_database -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=sitlog -e MYSQL_USER=doc -e MYSQL_PASSWORD=password -d mysql:latest
const index      = require('mysql2');
module.exports = (log, override) => {
    let pool = index.createPool({
        host     : override.host ||       process.env.MYSQL_HOST,
        user     : override.user ||       process.env.MYSQL_USER,
        port     : override.port || process.env.MYSQL_PORT,
        password : override.password || process.env.MYSQL_PASSWORD,
        database : override.database || process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    log.d(`MySQL Database Util called, starting a MySQL Pool with ${override.database ? override.database : process.env.DB_DATABASE}`,'mysql','vv');
    pool.on('acquire', function (connection) {
        log.d(`Connection ${connection.threadId} acquired`,'mysql','vv');
    });
    pool.on('connection', function (connection) {
        log.d(`Connection ${connection.threadId} connected`,'mysql','vv')
    });
    pool.on('enqueue', function () {
        log.d('Waiting for available connection slot','mysql','vv');
    });
    pool.on('release', function (connection) {
        log.d(`Connection ${connection.threadId} released`,'mysql','vv');
    });

    const close = () => {
        log.d(`Closing the MySQL pool`, "mysql", "vv");
        return new Promise((resolve, reject) => {
            pool.end((err) => {
                if (err) reject(err);
                else {
                    log.d(`MySQL pool closed`, "mysql", "vv");
                    resolve(true)
                }
            });
        })
    }

    const getClient = () => {
        log.d(`Obtaining a client for MySQL DB`, 'mysql', 'vv');
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) reject(err); // not connected!
                else resolve(connection)
            });
        })
    }
    const verify = async () => {
        return new Promise((resolve, reject) => {
            pool.getConnection((e, connection) => {
                if(e) reject(e)
                else{
                    connection.release()
                    resolve({e:null,success:true})
                }
            })
        })
    }
    const query = async (text, params) => {
        let result = false;
        const start = Date.now();
        return new Promise((resolve, reject) => {
            log.d(`executing query ${JSON.stringify(text,null,4)}`,'query','vv');
            log.d(`executing query ${params}`,'query','vv');
            result = pool.query(text, params, (e, results, fields) => {
                if(e){
                    log.e(e,'v','Database Query');
                    reject(e)
                }
                const duration = Date.now() - start;
                log.d(`executed query ${JSON.stringify({ text, duration, rows: result.affectedRows },null,4)}`,'query','vv');
                resolve({results, fields})
            });
        })
    }
    return { verify, query, close, getClient }
}