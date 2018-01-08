import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import Game from '../models/game';
import { AuthentificationRouter } from "./authentication.router";

export class GamesRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/countGame', this.getCountGame);
        this.router.use(AuthentificationRouter.checkAdmin);   // à partir d'ici il faut être admin
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
        this.router.get('/listResults/', this.getListResults);
        // this.router.get('/:name', this.findByName);
        // this.router.get('/byId/:id', this.findById);
        // this.router.get('/byStartDate/:start', this.findByStartDate);
        // this.router.get('/byFinishDate/:finish', this.findByFinishDate);
        // this.router.get('/byMaxPlayers/:max', this.findByMaxPlayers);
        // this.router.get('/byStartRange/:start/:finish', this.getRange);
        // this.router.put('/:name', this.update);
        // this.router.delete('/:name', this.deleteOne);
        // this.router.delete('/:start/:finish', this.deleteRange);
    }

    public getCountGame(req: Request, res: Response, next: NextFunction) {
        Game.count({}).exec((err, count) => {
            if (err) res.send(err);
            res.json(count);
        });
    }

    public getListResults(req: Request, res: Response, next: NextFunction) {
        let tournamentId = req.params.id;

        Game.find({ tournament : mongoose.Types.ObjectId(tournamentId) }).sort({ player_1: 'asc' })
        .exec((err, game) => {            
            if (err) res.send(err);
            res.json(game);
        });
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
		Game.find().populate('tournament').sort({ name: 'asc' }).exec((err, games) => {
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

    // public update(req: Request, res: Response, next: NextFunction) {
	// 	Tournament.findOneAndUpdate({ name: req.params.name },
    //         req.body,
	// 		{ new: true })  // pour renvoyer le document modifié
    //         .then(r => {
    //             // console.log("r =>" +r)
    //             res.json(r)
    //         } )
    //         .catch(err => res.json(err));
    // }

    // public deleteOne(req: Request, res: Response, next: NextFunction) {
	// 	Tournament.findOneAndRemove({ name: req.params.name })
    //         .then(r => res.json(true))
    //         .catch(err => res.json(err));
    // }
	
    // public deleteRange(req: Request, res: Response, next: NextFunction) {
    //     let d1 = new Date(req.params.start);
    //     let d2 = new Date(req.params.finish);
    //     if (isNaN(d1.valueOf()) || isNaN(d2.valueOf()))
    //         res.json({errmsg: 'bad date range'});
    //     else {
    //         Tournament.find({ start: { $gte: d1, $lte: d2 } })
    //             .remove()
    //             .then(r => res.json(true))
    //             .catch(err => res.json(err));
    //     }
	// }		
}
