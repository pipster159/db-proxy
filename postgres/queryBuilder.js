module.exports = (log, toSnake, toCamel) => {
    const createInsertQuery = (data, schema, table, returnField) => {
        let properties = [], values = [], counts;
        let count = 1;
        /* Set properties and values array from data object */
        let valuesStr = ``
        if(Array.isArray(data)){
            let first = true
            data.forEach(row => {
                counts = [];
                for(let column in row){
                    if(first){
                        properties.push(`${toSnake(column)}`);
                    }
                    values.push(row[column]);
                    counts.push(`$${count}`);
                    count++;
                }
                valuesStr += first ? `(${counts.join(", ")})` : `(, ${counts.join(", ")})`
            })
        }
        else{
            counts = []
            for (let property in data) {
                properties.push(`${toSnake(property)}`);
                values.push(data[property]);
                counts.push(`$${count}`);
                count++;
            }
            valuesStr = `(${counts.join(", ")})`
        }
        /* Build the query string for update */
        let text = `INSERT INTO ${schema}.${table} (${properties.join(", ")}) VALUES ${valuesStr} RETURNING ${returnField?returnField:'id'}`;
        log.d(`Query:\n${JSON.stringify(text,null,4)}`, 'query','vvv');
        log.d(`Values:${values}`, 'query','vvv');
        return {text, values};
    }
    const createUpdateQuery = (data, schema, table, targetValue, targetColumn, addPrecision) => {
        let properties = [], values = [];
        let count = 1;
        /* Set properties and values array from data object */
        for (let property in data) {
            properties.push(`${toSnake(property)}=$${count}`);
            values.push(data[property]);
            count++;
        }
        /* Set the id of row to be updated */
        values.push(targetValue);
        /* Build the query string for update */
        let text = `UPDATE ${schema}.${table} SET ${properties.join(", ")} WHERE ${targetColumn?targetColumn:'id'} = $${count}`;
        if(addPrecision){
            for(let field in addPrecision){
                text += ` AND ${field}=$${++count}`;
                values.push(addPrecision[field])
            }
        }
        log.d(`Query: ${JSON.stringify(text,null,4)}`, 'query','vvvv');
        log.d(`Values: ${values}`, 'query','vvvv');
        return {text, values};
    }
    const createFunctionCall = (schema, func, params) => {
        log.d(`Caught a request to create function call. Schema: ${schema} Function: ${func}`, 'query','vvv');
        params = params.map(param => `'${param}'`)
        return `SELECT * FROM ${schema}.${func}(${params.join(",")})`
    }

    const createSelectQuery = (data, schema, table, value, column, addPrecision, int, multi, tail) => {
        log.d(`Caught a request to create select query. Data is ${data[0]}`, 'query','vvv');
        let properties = [];
        // Check if everything is desired in return, if so set properties to the string *
        if(data && data[0] === "*") {
            log.d(`All fields should be returned`,'query','vvv');
            properties = "*";
        }
        else data.map(field=>properties.push(toSnake(field)));
        log.d(`Properties are ${properties}`,'query','vvv');
        // Check if properties is an array or a string, if a string simply place the string, if an array make a comma separated string.
        let text;
        if(!column){
            text = `SELECT ${typeof(properties)==='string'?properties:properties.join(',')} FROM ${schema}.${table}`
        }else{
            let valuesParameterized = '$1'
            if(multi){
                valuesParameterized = value.map((thisValue, index)=>`$${++index}`)
                valuesParameterized = `(${valuesParameterized})`
            }
            text = `SELECT ${typeof(properties)==='string'?properties:properties.join(',')} FROM ${schema}.${table} WHERE ${column?column:'id'} ${multi?` IN `:'='}${valuesParameterized}`
        }
        if(addPrecision){
            for(let field in addPrecision){
                if(Array.isArray(addPrecision[field])){
                    text += ` AND (`
                    let first = true
                    addPrecision[field].forEach(val => {
                        if(!first) {
                            text += ` OR `
                        }
                        text += `${field}='${val}'`
                        first = false
                    })
                    text += `)`
                }
                else{
                    text += ` AND ${field}='${addPrecision[field]}'`;
                }

            }
        }
        if(tail){
            text += tail
        }
        log.d(`SQL Query Built -\nText:\n${JSON.stringify(text,null,4)}\nValues:\n${value}`,'query','vvv');
        if(int) value = parseInt(value)
        if(value === false) value = undefined
        return {text, values:value !== undefined?Array.isArray(value)?value:[value]:undefined}
    }
    const createDeleteQuery = (schema, table, email, emailOverride, addPrecision) => {
        let query = {
            text: `DELETE FROM ${schema}.${table} WHERE ${emailOverride?emailOverride:'email'} = $1`,
            values:[email]
        };
        if(addPrecision){
            for(let field in addPrecision){
                query.text += ` AND ${field}='${addPrecision[field]}'`;
            }
        }
        query.text += ` RETURNING *`;
        log.d(`Query is:\n${JSON.stringify(query,null,2)}`,'query','vvv');
        return query;
    }
    const camelify = data => {
        let ret = {};
        for(let property in data){ret[toCamel(property)] = data[property]}
        return ret
    }

    return {
        createInsertQuery,
        createUpdateQuery,
        createSelectQuery,
        createDeleteQuery,
        createFunctionCall,
        camelify
    }
}