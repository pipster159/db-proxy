module.exports = formatDate = (d, time, noSpace) => {
    if (!d) d = new Date;
    let date = d.getDate();
    let month = d.getMonth() + 1;
    if (date < 10) {
        date = `0${date}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    if (time) {
        let hour = d.getHours();
        if (hour < 10) hour = `0${hour}`
        let minute = d.getMinutes();
        if (minute < 10) minute = `0${minute}`
        let second = d.getSeconds();
        if (second < 10) second = `0${second}`
        if (noSpace) {
            return `${d.getFullYear()}-${month}-${date}_${hour}:${minute}:${second}`
        }
        return `${d.getFullYear()}-${month}-${date} ${hour}:${minute}:${second}`
    } else {
        return `${d.getFullYear()}-${month}-${date}`;
    }
};