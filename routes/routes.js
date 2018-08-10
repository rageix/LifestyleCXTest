const lib = require('../lib/lib');
const log = require('../lib/log');
const templates = require('../lib/templates');
const requestLib = require('request');
const requestPromise = require('request-promise');
const async = require('async');
const RSVP = require('rsvp');

const TITLE_REGEX = /<title>(.+)<\/title>/i;

let self = module.exports = {

    // url: string: text to put in item
    // title: string
    makeListItem: (url, title) => {

        return `<li>${url} - ${title}</li>`;

    },
    // processes a request returning a list item string
    // error: request object
    // response: request response object
    processResponse: (address, error, response) => {

        if (error !== null) {

            // request has an error
            // this is not the proper response but just following doc on this one
            return self.makeListItem(address, 'NO RESPONSE');

        }

        if (response.statusCode !== 200) {

            // not totally correct as responses other than 200 could be OK
            // but for the sake of time treat any non 200 response as no response
            return self.makeListItem(address, 'NO RESPONSE');

        } else {

            // we got a 200 response
            let body = response.body;

            // try and match the title
            let matches = body.match(TITLE_REGEX);

            // the title will have len of 2 if it worked
            if (matches !== null && matches.length === 2) {

                return self.makeListItem(address, `"${matches[1]}"`);

            } else {

                return self.makeListItem(address, 'INVALID TITLE TAG');

            }

        }

    },
    // this is a recursive function that will chain requests back to back
    // addresses: array: addresses to get
    // index: number: the current index to get
    // response: string: the response data
    // callback: () => any: callback function to call on completion
    getAddresses: (addresses, index, titles, callback) => {

        // we only want to fetch if we can get from the array
        if ((addresses.length - 1) >= index) {

            // of course we could "correct" or validate the address by making
            // sure it was a valid url and contains http:// or https:// but time is limited
            requestLib.get(addresses[index], (error, response, body) => {

                titles += self.processResponse(addresses[index], error, response);

                self.getAddresses(addresses, index + 1, titles, callback);

            })

        } else {

            callback(titles);

        }

    },
    // request: http.ClientRequest
    // response: http.ServerResponse
    IWantTitleGet: (request, response) => {

        // extract our addresses
        let addresses = lib.getQueryParams(request.url, 'address');

        // chain get our titles
        self.getAddresses(addresses, 0, '', (titles) => {

            // render our template
            response.end(templates.render('titles', {
                titles: titles
            }))

        })

    },
    // request: http.ClientRequest
    // response: http.ServerResponse
    IWantTitleAsyncGet: (request, response) => {

        let titles = '';

        // extract our addresses
        let addresses = lib.getQueryParams(request.url, 'address');

        async.forEach(addresses, (address, callback) => {

            requestLib.get(address, (error, response, body) => {

                titles += self.processResponse(address, error, response);

                callback();

            });

        }, (error) => {

            if (error) {

                log.error('error', error)

            }

            response.end(templates.render('titles', {
                titles: titles
            }))

        });

    },
    // request: http.ClientRequest
    // response: http.ServerResponse
    IWantTitlePromiseGet: (request, response) => {

        let titles = '';

        // extract our addresses
        let addresses = lib.getQueryParams(request.url, 'address');

        let promises = addresses.map((address) => {

            let options = {
              method: 'GET',
              uri: address,
              resolveWithFullResponse: true
            };

            return requestPromise(options).promise();

        });

        RSVP.all(promises).then((responses) => {

            // loop responses
            for (let i = 0; i < responses.length; i++) {

                titles += self.processResponse(responses[i].response.href, null, responses[i]);

            }

        }).catch((error) => {

            // if any of the requests fail then this function is called
            // maybe not best solution considering we can't output all the errors
            titles += self.processResponse(error.options.uri, error, null);

        }).finally(() => {

            response.end(templates.render('titles', {
                titles: titles
            }))

        });

    },

};
