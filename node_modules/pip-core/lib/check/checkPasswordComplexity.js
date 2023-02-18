module.exports = (password) => {
    let n = password.length;
    let hasLower = false;
    let hasUpper = false;
    let hasDigit = false;
    let specialChar = false;
    let normalChars = "abcdefghijklmopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYS1234567890 ";

    let acceptable = false;

    for (let a = 0; a < n; a++) {
        if (password[a] === password[a].toLowerCase()) {
            hasLower = true;
        }
        if (password[a] === password[a].toUpperCase()) {
            hasUpper = true;
        }
        if (!isNaN(password[a] * 1)) {
            hasDigit = true;
        }
        if (!normalChars.includes(password[a])) {
            specialChar = true;
        }
    }
    if (hasLower && hasUpper && hasDigit && specialChar && (n >= 8)) {
        acceptable = true;
    }
    return acceptable;
};