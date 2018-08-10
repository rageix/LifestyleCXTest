const fs = require('fs');
const log = require('./log');
const lib = require('./lib');

let self = module.exports = {

    templates: [],
    // loads a template file from the local system
    // key: string: the array key in self.templates
    // path: string: the path to the template file
    load: (key, path) => {

        fs.readFile(path, (error, content) => {

            if (error){

                // for the sake of simplicity lets just fatally exit if the
                // template file doesn't exist or we can't read it
                log.fatal('failed to load template', error, {
                    path: path
                });

            }

            self.templates[key] = content.toString();

        });

    },
    // get a template from the local self.templates var
    // key: string: key of the template
    // context: object
    render: (key, context) => {

        let data = self.templates[key];

        if(!lib.isEmpty(context)) {

            for (let attr in context) {

                data = data.replace(`#${attr}#`, context[attr]);

            }

        }

        return data;

    }

};
