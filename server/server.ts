// const MONGO_URL = 'mongodb://127.0.0.1/msn';

// export class Server {
//     private express: express.Application;
//     private server: http.Server;
//     private port: any;

//     constructor() {
//         this.express = express();
//         this.middleware();
//         this.mongoose();
//         this.routes();
//     }

//     private middleware(): void {
//         this.express.use(bodyParser.json());
//         this.express.use(bodyParser.urlencoded({extended: false}));
//     }

//     private routes() {
//         this.express.use('/api/tournaments', new TournamentsRouter().router);
//     }

//     private mongoose() {
//         (mongoose as any).Promise = global.Promise;     // see: https://stackoverflow.com/a/38833920
//         let trials = 0;
//         let connectWithRetry = () => {
//             trials++;
//             return mongoose.connect(MONGO_URL, err =>{
//                 if(err) {
//                     if(trials < 3){
//                         console.error('Failed to connect to mongo on startup - retrying in 2 sec');
//                         setTimeout(connectWithRetry, 2000);
//                     }
//                     else{
//                         console.error('Failed to connect to mongo after 3 trials ... ABOOOOOOOOORT!!!!');
//                         process.exit(-1);
//                     }
//                 }
//                 else {
//                     console.log('Connected to MONGODB');
//                     this.initData();
//                 }
//             });
//         };
//         connectWithRetry();
//     }

//     private initData(){
//         let col = mongoose.connection.collections['tournaments'];
//         col.count({}).then(count => {
//             if(count === 0){
//                 console.log("Initializing data...");
//                 col.insertMany([
//                     { name: "ChessMasterFlash", start: "21/8/2023", finish: "27/8/2023", maxPlayers: 32},
//                     { name: "Starcraft ESL", start: "5/6/2019"},
//                     { name: "Mincraft Creator", start: "19/7/2020", finish: "25/7/2020"},
//                     { name: "Rap Battle of the Century", start: "30/9/2025"},
//                     { name: "Decathlon Mortal", start: "5/4/2026", finish: "6/4/2026", maxPlayers: 120},
//                 ]);
//             }
//         });
//     }

//     // start of express server
//     public start(): void {
//         this.port = process.env.PORT || 3000;
//         this.express.set('port', this.port);
//         this.server = http.createServer(this.express);
//         this.server.listen(this.port, () => console.log(`Node/Express server runnin on localhost:${this.port}`));
//     }

// }

import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import Member from './models/member';
import { MembersRouter } from './routes/members.router';
import Tournament from './models/tournament';
import { TournamentsRouter } from './routes/tournaments.router';

const MONGO_URL = 'mongodb://127.0.0.1/msn';

export class Server {
    private express: express.Application;
    private server: http.Server;
    private port: any;

    constructor() {
        this.express = express();
        this.middleware();
        this.mongoose();
        this.routes();
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // initialise les routes
    private routes() {
        this.express.use('/api/members', new MembersRouter().router);
        this.express.use('/api/tournaments', new TournamentsRouter().router);
    }

    // initialise mongoose
    private mongoose() {
        (mongoose as any).Promise = global.Promise;     // see: https://stackoverflow.com/a/38833920
        let trials = 0;
        let connectWithRetry = () => {
            trials++;
            return mongoose.connect(MONGO_URL, err => {
                if (err) {
                    if (trials < 3) {
                        console.error('Failed to connect to mongo on startup - retrying in 2 sec');
                        setTimeout(connectWithRetry, 2000);
                    }
                    else {
                        console.error('Failed to connect to mongo after 3 trials ... abort!');
                        process.exit(-1);
                    }
                }
                else {
                    console.log('Connected to MONGODB');
                    this.initData();
                    this.initDataTournament();
                    console.log('Db initialised');
                }
            });
        };
        connectWithRetry();
    }

    private initData() {
        let col = mongoose.connection.collections['members'];
        col.count({}).then(count => {
            if (count === 0) {
                console.log("Initializing data...");
                col.insertMany([
                    { pseudo: "test", password: "test", profile: "Hi, I'm test!" },
                    { pseudo: "ben", password: "ben", profile: "Hi, I'm ben!" },
                    { pseudo: "bruno", password: "bruno", profile: "Hi, I'm bruno!" },
                    { pseudo: "boris", password: "boris", profile: "Hi, I'm boris!" },
                    { pseudo: "alain", password: "alain", profile: "Hi, I'm alain!" }
                ]);
            }
        });
    }

    private initDataTournament(){
        let col = mongoose.connection.collections['tournaments'];
        col.count({}).then(count => {
            if(count === 0){
                console.log("Initializing data...");
                col.insertMany([
                    { name: "ChessMasterFlash", start: "01/26/2023", finish: "01/27/2023", maxPlayers: 32},
                    { name: "Starcraft ESL", start: "5/6/2019"},
                    { name: "Minecraft Creator", start: "06/20/2023", finish: "07/10/2023"},
                    { name: "Rap Battle of the Century", start: "10/26/2018"},
                    { name: "Decathlon Mortal", start: "04/05/2026", finish: "04/06/2026", maxPlayers: 120},
                ]);
            }
        });
    }

    // démarrage du serveur express
    public start(): void {
        this.port = process.env.PORT || 3000;
        this.express.set('port', this.port);
        this.server = http.createServer(this.express);
        this.server.listen(this.port, () => console.log(`Node/Express server running on localhost:${this.port}`));
    }
}