module.exports = (ret, logger) => {
    if (ret.error) {
        logger.e(ret.error);
    } else if (ret.message) {
        logger.d(`Message in return : \n${JSON.stringify(ret, null, 2)}`, '', 'v');
    } else if (!ret.success) {
        logger.d(`Failure - ${JSON.stringify(ret, null, 2)}`, '', 'v')
    } else if (ret.success) {
        logger.d(`Success - ${JSON.stringify(ret, null, 2)}`, '', 'v')
    } else {
        logger.d(`Parse Failure!! - Unknown return : \n${JSON.stringify(ret, null, 2)}`, '', 'v')
    }
    console.log(ret)
    console.log(`Dev Return out done`)
};