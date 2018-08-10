const log = require('./log');
const templates = require('./templates');

// this is a http router like you would see in many web frameworks
// could be fleshed out more but this is just to show you the basics
let self = module.exports = {

    routes: [],
    // simply formats the route data and pushes onto our routes array
    // mehtod: string: http method
    // path: string: path that will be matched against
    // callback: the callback to the route to process the request/reponse
    addRoute: (method, path, callback) => {

        self.routes.push({
            method: method,
            path: new RegExp(path),
            callback: callback
        })

    },
    // convenience function to add a GET route
    // path: string: string that will be used as regex to match
    // callback: (request, response) => any: called if path matches
    get: (path, callback) => {

        self.addRoute('GET', path, callback);

    },
    // convenience function to add a POST route
    // path: string: string that will be used as regex to match
    // callback: (request, response) => any: called if path matches
    post: (path, callback) => {

        self.addRoute('POST', path, callback);

    },
    // convenience function to add a PUT route
    // path: string: string that will be used as regex to match
    // callback: (request, response) => any: called if path matches
    put: (path, callback) => {

        self.addRoute('PUT', path, callback);

    },
    // convenience function to add a DELETE route
    // path: string: string that will be used as regex to match
    // callback: (request, response) => any: called if path matches
    delete: (path, callback) => {

        self.addRoute('DELETE', path, callback);

    },
    // a basic request handler and logger that just checks our routes
    // for a corresponding routes and then calls the callback on the route
    // request: http.ClientRequest
    // response: http.ServerResponse
    requestHandler: (request, response) => {

        try {

            log.info('request', null, {
                method: request.method,
                url: request.url
            });

            // loop out routes
            for (let route of self.routes) {

                // check the method
                if (route.method === request.method) {

                    if (route.path.test(request.url)) {

                        // fire the callback if it matches
                        route.callback(request, response);
                        return;

                    }

                }

            }

            // no valid route found
            self.notFound(request, response);

        } catch (error) {

            log.error('Internal server error.', error);
            self.internalServerError(request, response);

        }

    },
    // renders 404 error
    // request: http.ClientRequest
    // response: http.ServerResponse
    notFound: (request, response) => {

        response.statusCode = 404;
        response.end(templates.render('404'));

    },
    // renders internal server ie any uncaught error
    // request: http.ClientRequest
    // response: http.ServerResponse
    internalServerError: (request, response) => {

        response.statusCode = 500;
        response.end(templates.render('500'));

    }


};
