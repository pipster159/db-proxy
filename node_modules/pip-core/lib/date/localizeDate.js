/**
* Accepts a string date in the form of YYYY-MM-DD
* Returns an EST/EDT representation of time for the date
* Returns a string in the form YYYY-MM-DDTHH:MM:SS.sss
*/
module.exports = date => {
    /* Determine the year of the date to localize */
    let dateArr = date.split("-")
    if (dateArr[1][0] === "0") {
        dateArr[1] = dateArr[1][1]
    }
    if (dateArr[2][0] === "0") {
        dateArr[2] = dateArr[2][1]
    }
    let year = dateArr[0]

    /* Find the date of the second Sunday in March */
    let march = new Date(`${year}-03-01`)
    let sundayCount = 2
    if (march.getUTCDay() === 0) sundayCount--
    for (let i = 0; i < sundayCount; i++) {
        march.setUTCDate(march.getUTCDate() + (7 - march.getUTCDay()))
    }

    /* Find the date of the first Sunday in November */
    let november = new Date(`${year}-11-01`)
    if (november.getUTCDay() !== 0) {
        november.setUTCDate(november.getUTCDate() + (7 - november.getUTCDay()))
    }

    /* Set the Timezone Offset */
    let tzOffset = 5
    if (parseInt(dateArr[1]) > march.getUTCMonth() + 1 && parseInt(dateArr[1]) < november.getUTCMonth() + 1) {
        /* Daylight Savings Time */
        tzOffset = 4
    } else if (parseInt(dateArr[1]) === march.getUTCMonth() + 1) {
        if (parseInt(dateArr[2]) > march.getUTCDate()) {
            /* Daylight Savings Time */
            tzOffset = 4
        }
    } else if (parseInt(dateArr[1]) === november.getUTCMonth() + 1) {
        if (parseInt(dateArr[2]) <= november.getUTCDate()) {
            /* Daylight Savings Time */
            tzOffset = 4
        }
    }

    /* Return localized date string */
    return `${date}T0${tzOffset}:00:00.000Z`
}