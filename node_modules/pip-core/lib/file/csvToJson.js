module.exports = data => {
    /**
     *  Expects first row to be header for columns
     *  Parses each data row into a JSON object using headers as keys
     *  Returns an array of JSON objects
     **/
    let transactions = []

    /* Obtain an array where each item is a row by splitting the string by new line character: "\n" */
    data = data.split("\n")

    /* Take the first row as column header data */
    let keys = data[0]
    /* Break the first row into an array where each item is a column header value */
    keys = keys.split(",")
    /* Remove the first row from data to be parsed */
    data.shift()

    /* Parse the data rows into JSON format */
    data.forEach(transaction => {

        /* Break the row into an array where each item is a column value */
        transaction = transaction.split(",")

        /* Check if the array of column values has more items than the array of column header values */
        if (transaction.length > keys.length) {
            /* This row has column data which contains commas as part of the data, determining the difference between a control comma and a data comma */
            let correctedTransaction = []
            let index = 0

            /* Check each value in the array of column values for this row, using quotation mark as a determinant for control comma vs data comma */
            transaction.forEach(piece => {

                /* Check for the presence of quotation marks in this column's value piece */
                let quotationMarks = piece.match(/"/)

                /* Set the column value to an empty string if it does not yet exist in the corrected array of transaction column values */
                if (!correctedTransaction[index]) correctedTransaction[index] = ""

                /* Append this column's value piece to the corrected array of transaction column values */
                correctedTransaction[index] += piece
                if (quotationMarks) {
                    if (quotationMarks.length === 2) {
                        /* If there are 2 quotation marks in this piece of data it is a complete column value, increment the index for corrected array */
                        index++
                    } else if (quotationMarks.length === 1) {
                        /* If there is 1 quotation mark in this piece of data it is a partial column value, check the number of quotation marks in the value of this index in the corrected array, with the addition of this piece of data */
                        let thisPiecesQuotationMarks = correctedTransaction[index].match(/"/g)
                        /* If there are 2 quotation marks in the value of this index in the corrected array, with the addition of this piece of data, increment the index for corrected array  */
                        if (thisPiecesQuotationMarks.length === 2) index++
                    }
                } else {
                    /* There are no quotation marks in this piece of data, the data is a partial piece of a column value. It was appended to the current index's column in the corrected array */
                }
            })
            /* Set the transaction array to be the corrected transaction array */
            transaction = correctedTransaction
        }

        /* Setup a blank JSON object to map data into */
        let thisTransaction = {}

        /* Use this flag to catch an empty row of data */
        let blank = true

        /* Loop over the array of column header values, use the values as keys for the JSON object */
        keys.forEach((key, index) => {

            /* Flip the blank data row flag to true if possible */
            if (transaction[index]) blank = false
            /* Set this column value to the JSON object to the key of correlating with the column header */
            thisTransaction[key] = transaction[index]
        })

        /* If the blank data row flag has been flipped to true, add this JSON object to the array of transaction data */
        if (!blank) transactions.push(thisTransaction)
    })

    /* Return the array of transaction objects */
    return transactions
}