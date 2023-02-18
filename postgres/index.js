/**
 * @exports database/postgres
 * @namespace database/postgres
 * @description Postgres Pool Loader and Query Builder Handler
 */
const PoolLoader = require("./poolLoader")
const QueryBuilder = require("./queryBuilder")
module.exports = (log, util, override) => {
    const {verify, query, getClient, close} = PoolLoader(log, override)
    const {
        createSelectQuery, createUpdateQuery, createDeleteQuery, createInsertQuery, createFunctionCall
    } = QueryBuilder(log, util.toSnake, util.toCamel)
    return {
        verify,
        query,
        getClient,
        close,
        createInsertQuery,
        createDeleteQuery,
        createUpdateQuery,
        createSelectQuery,
        createFunctionCall
    }
}