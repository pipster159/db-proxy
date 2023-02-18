module.exports = (extension) => {
    let ret;
    switch (true) {
        case extension.includes('ejs'):
            ret = 'text/html';
            break;
        case (extension.includes('js')):
            ret = 'text/javascript';
            break;
        case extension.includes('css'):
            ret = 'text/css';
            break;
        case extension.includes('map'):
            ret = 'application/json';
            break;
        case extension.includes('jpg'):
            ret = 'image/jpeg';
            break;
        default:
            break;
    }
    return ret;
};