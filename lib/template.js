/**
 *  @param {String[]} code
 *  @param {String} userCode
 *  @return {String}
 * */

const getCode = (code, userCode) => {
    return `
        import java.util.*;
        import java.lang.*;
        
        class Main {
            public static void main(String[] args) {
            
                CodeKing codeKing = new CodeKing();
                ${ code.map(c => c).join('\n\t') }
            }
        }
        
        ${userCode}
    `
}

/**
 *  @param {String} code
 *  @param {String} input
 *  @return {String}
 */

const margeCode = (code, input) => {
    splitInput(input).forEach(({ key, value, data: {type, dataType} }, idx) => {
        if (type === 'Array') {
            code = code.replaceAll(`dataType${idx + 1}`, `${dataType}[]`);
            value = value.replaceAll('[', '{');
            value = value.replaceAll(']', '}');
        }
        else if (type === 'Number') {
            code = code.replaceAll(`dataType${idx + 1}`, 'int');
        }
        else if (type === 'String') {
            code = code.replaceAll(`dataType${idx + 1}`, 'String');
        }
        else {
            code = code.replaceAll(`dataType${idx + 1}`, 'char');
        }

        code = code.replaceAll(`key${idx + 1}`, key);
        code = code.replaceAll(`value${idx + 1}`, value);

    });

    return code.replaceAll('sout', 'System.out.println');
}

/**
 *  @param {String} inputString
 *  @returns {Array<{key: string, value: string, data: {type: string, dataType: string}}>}
 */

const splitInput = (inputString) => {
    return inputString.split('; ').map(pair => {
        const [key, value] = pair.split(' = ');
        let type;
        let dataType;
        if (value && value.trim()[0] === '[') {
            type = 'Array';
            if(value.trim()[1] === "'") {
                dataType = 'Char';
            } else if (!isNaN(parseFloat(value.trim()[1])) && isFinite(value.trim()[1])) {
                dataType = 'int';
            } else {
                dataType = 'String';
            }
        } else if (value && !isNaN(parseFloat(value)) && isFinite(value)) {
            type = 'Number';
            dataType = 'int';
        } else if (value && value.trim()[0] === `'`) {
            type = 'Char';
            dataType = 'Char';
        } else {
            type = 'String';
            dataType = 'String';
        }

        return { key, value, data: {type, dataType} };
    }).filter(obj => obj.value !== undefined);
};


module.exports = { getCode, margeCode };

