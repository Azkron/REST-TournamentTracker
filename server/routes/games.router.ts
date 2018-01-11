import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import Game from '../models/game';
import { AuthentificationRouter } from "./authentication.router";

export class GamesRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/countGame', this.getCountGame);
        this.router.put('/updateCurrent', this.updateCurrent);
        // this.router.get('/listResults/:id', this.getListResults);
        
        this.router.use(AuthentificationRouter.checkAdmin);   // à partir d'ici il faut être admin
        
        this.router.put('/updateAdmin', this.update);
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
    }

    public getCountGame(req: Request, res: Response, next: NextFunction) {
        Game.count({}).exec((err, count) => {
            if (err) res.send(err);
            res.json(count);
        });
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
		Game.find().populate('tournament').sort({ player_1: 'asc' }).exec((err, games) => {
            if(err) res.send(err);
            res.json(games);
        });
    }

    public create(req: Request, res: Response, next: NextFunction) {
        let game = new Game(req.body);
        console.log("new game player_1=>" +game.player_1 + "  player_2 => " +game.player_2)
        game.save()
            .then(gameWithId => {
                console.log("gameWithIs = " + gameWithId);
                res.json(gameWithId);
            })
            .catch(err => res.json(err));
    }

    public update(req: Request, res: Response, next: NextFunction) {
        let game = new Game(req.body);
        console.log(game);
        Game.findOneAndUpdate({ _id: game._id },
            req.body,
            { new: true },  // pour renvoyer le document modifié
            function (err, task) {
                if (err)
                    res.send(err);
                res.json(task);
            });
    } 

    public updateCurrent(req: Request, res: Response, next: NextFunction) {
        let game = new Game(req.body);
        console.log(game);
        Game.findOneAndUpdate({ _id: game._id },
            req.body,
            { new: true },  // pour renvoyer le document modifié
            function (err, task) {
                if (err)
                    res.send(err);
                res.json(task);
            });
    } 	
}
