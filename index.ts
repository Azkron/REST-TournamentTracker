import * as http from 'http';
import * as express from 'express';

export class Server {
    private express: express.Application;
    private server: http.Server;
    private port: any;

    constructor() {
        this.express = express();

        // router 1
        let router1 = express.Router();
        router1.get('/t*', (req, res, next) => {
            res.send("Cette route commence par 't'");
        });
        router1.get('*/log', (req, res, next) => {
            console.log("LOG: " + req.url)
        });
        router1.get('/logan', (req, res, next) => {
            res.json("Bonjour Logan!")
        });
        router1.get('/login', (req, res, next) => {
            res.send("Veuillez vous identifier");
        });
        this.express.use('/route1', router1);


        let router2 = express.Router()
        router2.get("*", (req, res, next) =>{
            console.log(req.url);
            next();
        });
        router2.get(/(.*abc.*){2,3}/, (req, res, next) => {
            res.json("Entre 2 et 3 occurences de 'abc'")
        });
        this.express.use('/route2', router2);

        this.express.get('*', (req, res, next) => {
            res.send('<b>ERROR: ' + req.url + '</b>');
        })
    }

    public start(): void {
        this.port = process.env.PORT || 3000;
        this.express.set('port', this.port);
        this.server = http.createServer(this.express);
        this.server.listen(this.port, () => console.log(`Node/Express server running on localhost:${this.port}`));
    }
}

new Server().start();