/**
 * @exports database/mysql
 * @namespace database/mysql
 * @description MySQL Pool Loader Handler
 */
const PoolLoader = require("./poolLoader")

module.exports = (log, override) => {
    const {verify, query, getClient, close} = PoolLoader(log, override)
    return {
        verify,
        query,
        getClient,
        close
    }
}