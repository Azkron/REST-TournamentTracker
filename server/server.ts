import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { AuthentificationRouter } from "./routes/authentication.router";
import { Member, Address, IMember } from './models/member';
import { MembersRouter } from './routes/members.router';
import { MembersCommonRouter } from './routes/members-common.router';
import { Tournament } from './models/tournament';
import { TournamentsRouter } from './routes/tournaments.router';
import { Game, IGame } from './models/game';
import { GamesRouter } from './routes/games.router';

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
        this.express.use('/api/token', new AuthentificationRouter().router);
        this.express.use('/api/members-common', new MembersCommonRouter().router);
        this.express.use(AuthentificationRouter.checkAuthorization);    // à partir d'ici il faut être authentifié
        this.express.use('/api/members', new MembersRouter().router);
        this.express.use('/api/tournaments', new TournamentsRouter().router);
        this.express.use('/api/games', new GamesRouter().router);
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
                    console.log('Db initialised');
                }
            });
        };
        connectWithRetry();
    }

    private initData() {
        Member.count({}).then(count => {
            if (count === 0) {
                console.log("Initializing members and adresses...");
                this.initDataTournament();
                

                //test adresses
                let addr1 = new Address({ street_addr: "rue bazar 12", postal_code: "1000", localization: "Bxl" });
                let addr2 = new Address({ street_addr: "rue machin 5", postal_code: "1200", localization: "Bxl" });
                let bruno = new Member({ pseudo: "bruno", password: "bruno", profile: "Hi, I'm bruno!", birthdate: "10/26/1990", addresses: [addr1, addr2] });
                addr1.member = bruno;
                addr2.member = bruno;
                Address.insertMany([addr1, addr2]).then(_ => {
                    Member.insertMany([
                        { pseudo: "testeur", password: "testeur", profile: "Hi, I'm testeur!", birthdate: "10/26/1989" },
                        { pseudo: "ben", password: "ben", profile: "Hi, I'm ben!" },
                        bruno,
                        { pseudo: "boris", password: "boris", profile: "Hi, I'm boris!", birthdate: "09/26/1988" },
                        { pseudo: "alain", password: "alain", profile: "Hi, I'm alain!", birthdate: "10/26/1999" }
                    ]);
                })
                 //test tournaments in members
                 let tourn1 = new Tournament({ name: "Tournoi test 1", start: "10/26/2023", finish: "10/27/2023", maxPlayers: 32 })
                 let tourn2 = new Tournament({ name: "Tournoi test 2", start: "10/26/2023", finish: "10/27/2023", maxPlayers: 32 })

                //new members test
                // let test1 = new Member({ pseudo: "test1", password: "test1", profile: "Hi, I'm test1!", birthdate: "10/26/1988", tournaments: [tourn1, tourn2] });
                // let test2 = new Member({ pseudo: "test2", password: "test2", profile: "Hi, I'm test2!", birthdate: "10/26/1989", tournaments: [tourn1, tourn2] });
                
                // this.initDataGame();
                // let game1 = new Game({ player_1: "test1", player_2: "test2", tournament: tourn2 });
                // let game2 = new Game({ player_1: "test1", player_2: "testeur", tournament: tourn1 });

                // Game.insertMany([game1, game2]);

                // tourn1.games = [game2] as mongoose.Types.Array<IGame>;
                // tourn2.games = [game1] as mongoose.Types.Array<IGame>;

                // tourn1.members = [test1, test2] as mongoose.Types.Array<IMember>;
                // tourn2.members = [test1, test2] as mongoose.Types.Array<IMember>;
                
                // Tournament.insertMany([tourn1, tourn2]).then(_ => {
                //     Member.insertMany([
                //         test1, test2
                //     ])
                // })
            }
        });
        Member.count({ pseudo: 'admin' }).then(count => {
            if (count === 0) {
                console.log("Creating admin account...");
                let m = new Member({
                    pseudo: "admin", password: "admin",
                    profile: "I'm the administrator of the site!", admin: true
                });
                m.save();
            }
        });
    }

    private initDataTournament(){
        Tournament.count({}).then(count => {
            if(count === 0){
                console.log("Initializing tournaments...");
                Tournament.insertMany([
                    { name: "ChessMasterFlash", start: "01/26/2023", finish: "01/27/2023", maxPlayers: 32},
                    { name: "Starcraft ESL", start: "5/6/2019"},
                    { name: "Minecraft Creator", start: "06/20/2023", finish: "07/10/2023"},
                    { name: "Rap Battle of the Century", start: "10/26/2018"},
                    { name: "Decathlon Mortal", start: "04/05/2026", finish: "04/06/2026", maxPlayers: 20},
                ]);
            }
        });
    }

    private initDataGame(){
        Game.count({}).then(count => {
            if(count === 0){
                console.log("Initializing games...");
                // Game.insertMany([
                //      { player_1: "abs", player_2: "abs", score_player_1: "1", score_player_2: "32"}
                // ]);
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