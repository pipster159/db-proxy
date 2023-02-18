const {Pool} = require("pg");

module.exports = (log, override = {}) => {
    const pool = new Pool({
        host: override.host || process.env.DB_HOST,
        user: override.user || process.env.DB_USER,
        database: override.database || process.env.DB_DATABASE,
        password: override.password || process.env.DB_PASSWORD,
        port: override.port || process.env.DB_PORT,
        max: 80,
        idleTimeoutMillis: 0,
        connectionTimeoutMillis: 0,
    });

    log.d(`Postgres Database Util called, starting a Postgres Pool with ${override.database ? override.database : process.env.DB_DATABASE}`,'postgres','vv');
    /** the pool will emit an error on behalf of any idle clients, contains if a backend error or network partition happens **/
    pool.on("error", (err, client) => {
        log.e(err, "vv");
        process.exit(1);
    });
    pool.on("remove", (client) => {
        log.d(`Client has been removed from Postgres pool ${poolStats()}`, "postgres", "vv");
    });
    pool.on("acquire", (client) => {
        log.d(`Client has been acquired from Postgres pool ${poolStats()}`, "postgres", "vv");
    });

    /** These are the exposed methods **/
    const poolStats = () => {
        return `Pool stats: Total: ${pool.totalCount} | Idle: ${pool.idleCount} | Waiting:${pool.waitingCount}`;
    };
    const verify = async () => {
        let client;
        try {
            client = await pool.connect();
            client.release(true);
        } catch (e) {
            log.e(e, "v", "Database Verify");
            return {e};
        }
        return {e: null, success: true};
    };
    const query = async (text, params) => {
        let result = false;
        const start = Date.now();
        try {
            log.d(`executing query ${JSON.stringify(text, null, 4)}`, "query", "vvv");
            log.d(`executing query ${params}`, "query", "vvv");
            result = await pool.query(text, params);
            const duration = Date.now() - start;
            log.d(`executed query ${JSON.stringify({text, duration, rows: result.rowCount}, null, 4)}`, "query", "vvv");
        } catch (e) {
            log.e(e, "v", "Database Query");
        }
        return result;
    };
    const getClient = async () => {
        /** Responsibility of caller to release client **/
        log.d(`Obtaining a client for Postgres DB`, 'postgres', 'vv');
        try {
            return await pool.connect();
        } catch (e) {
            log.e(e, "v", "Database Connection Failure");
            //process.exit(1);
            return false;
        }
    };
    const close = async () => {
        log.d(`Closing the Postgres pool - ${poolStats()}`, "", "vv");
        await pool.end();
        log.d(`Postgres pool closed - ${poolStats()}`, "", "vv");
    };

    return {
        verify, query, getClient, close,
    }
}
