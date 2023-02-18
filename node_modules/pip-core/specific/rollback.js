module.exports = async (logger, client, eMessage) => {
    let rolledBack = false;
    logger.a(`Rolling back database transaction`)
    while (!rolledBack) {
        try {
            await client.query('ROLLBACK')
            rolledBack = true;
        } catch (e) {
            logger.e(e, 'v', eMessage)
        }
    }
    logger.a(`Rollback complete`)
}