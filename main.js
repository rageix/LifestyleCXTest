const http = require('http');
const log = require('./lib/log');
const templates = require('./lib/templates');
const router = require('./lib/router');
const routes = require('./routes/routes');

// in a real project I would have a whole config loading system
// similar to templates and router files but for the sake of time
const port = 8080;

// application main

// set our only routes
// if we wanted this to be more user friendly we'd do some extra processing
// to the route path but for the sake of time I'm just leaving it as is
router.get('^\\/I\\/want\\/title\\/promise\\/', routes.IWantTitlePromiseGet);
router.get('^\\/I\\/want\\/title\\/async\\/', routes.IWantTitleAsyncGet);
router.get('^\\/I\\/want\\/title\\/', routes.IWantTitleGet);

// load our templates
templates.load('404', './templates/404.html');
templates.load('500', './templates/500.html');
templates.load('titles', './templates/titles.html');

// create our server
http.createServer(router.requestHandler)
    .listen(port, (err) => {

    if (err) {

        log.fatal('server.listen()', err);

    }

    log.info(`server is listening on port: ${port}`);

});
