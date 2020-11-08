import * as express from 'express';
import * as bodyParser from "body-parser";
import { request } from './request'
const fs = require('fs');

function JSON_stringify(s, emit_unicode = false)
{
    var json = JSON.stringify(s);
    return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
        function(c) {
            return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
        }
    );
}

// Create a new express application instance
const app: express.Application = express();

// support application/json type post data
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

app.all("*", function (req, res, next) {
    request.get(req.url)
        .then(response => {
            res.type(response.type);

            // http://thexem.de/map/allNames?origin=tvdb&seasonNumbers=true
            if (response.type !== "application/json" || !req.url.startsWith("/map/allNames")) {
                res.send(response.text || response.body)
                return;
            }

            console.log("Overriding request")

            let body = response.body;
            let rawdata = fs.readFileSync('config/xem-mapping.json');
            let mapping = JSON.parse(rawdata);

            let excludeEntries = mapping.exclude || [];
            console.log(`Exclude entries: ${excludeEntries.length}`);
            excludeEntries.forEach((key) => {
                delete body.data[key];
            })

            let includeEntries = Object.entries(mapping.include || []);
            console.log(`Include entries: ${includeEntries.length}`)
            includeEntries.forEach(([key, value]) => {
                if (key in body.data) {
                    body.data[key] = body.data[key].concat(value);
                } else {
                    body.data[key] = value;
                }
            });



            res.send(JSON_stringify(body))
        })
        .catch(reason => {
            res.send(reason)
            next();
        })
});

// The port the express app will listen on
const port = process.env.PORT || 3005;

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});
