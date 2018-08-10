const _ = require('lodash');

const EMPTY_STRING_REGEXP = /^\s*$/;
const QUERY_PARAM_REGEXP = /(\?|\&)([^=]+)\=([^&]+)/g;

let self = module.exports = {

    // checks to see if provided arg is empty
    // arg: any
    isEmpty: (arg) => {

        if (_.isNull(arg)) {

            return true;

        }

        if (_.isUndefined(arg)) {

            return true;

        }

        // functions are non empty
        if (_.isFunction(arg)) {

            return false;

        }

        // Whitespace only strings are empty
        if (_.isString(arg)) {

            return EMPTY_STRING_REGEXP.test(arg);

        }

        // For arrays we use the length property
        if (_.isArray(arg)) {

            return arg.length === 0;

        }

        // Dates have no attributes but aren't empty
        if (_.isDate(arg)) {

            return false;

        }

        // If we find at least one property we consider it non empty
        if (_.isObject(arg)) {

            return Object.keys(arg).length === 0;

        }

        return false;

    },
    // takes a url and returns an array of values matching the param
    // url: string: the url to extract params from
    // param: string: the query string param to extract
    getQueryParams: (url, param) => {

        let matches;
        let results = [];

        while ((matches = QUERY_PARAM_REGEXP.exec(url)) !== null) {

            // This is necessary to avoid infinite loops with zero-width matches
            if (matches.index === QUERY_PARAM_REGEXP.lastIndex) {

                QUERY_PARAM_REGEXP.lastIndex++;

            }

            // matches[2] is the param name
            if (matches[2] === param) {

                // matches[3] is the param value
                results.push(matches[3]);

            }

        }

        return results;

    }

};
