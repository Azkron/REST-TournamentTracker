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
        // this.router.get('/', this.getAll);
        this.router.post('/', this.create);
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

    public getAll(req: Request, res: Response, next: NextFunction) {
		Game.find().populate('player_1').populate('player_2').populate('tournament').sort({ name: 'asc' }).exec((err, games) => {
            if(err) res.send(err);
            res.json(games);
        });
    }

    // public findById(req: Request, res: Response, next: NextFunction) {
    //     Tournament.find({ _id: req.params.id })
    //         .then(tournament => res.json(tournament))
    //         .catch(err => res.json([]));
    // }
	
	// public findByName(req: Request, res: Response, next: NextFunction) {
    //     Tournament.find({ name: req.params.name })
    //         .then(tournament => res.json(tournament))
    //         .catch(err => res.json([]));
    // }

    // public findByStartDate(req: Request, res: Response, next: NextFunction) {
    //     let d = new Date(req.params.start);
    //     if (!isNaN(d.valueOf())) {
    //         Tournament.find({ start: d }).sort({ name: 'asc' })
    //             .then(tournaments => res.json(tournaments))
    //             .catch(err => res.json([]));
    //     }
    //     else
    //         res.json([]);
    // }

    // public findByFinishDate(req: Request, res: Response, next: NextFunction) {
    //     let d = new Date(req.params.finish);
    //     if (!isNaN(d.valueOf())) {
    //         Tournament.find({ finish: d }).sort({ name: 'asc' })
    //             .then(tournaments => res.json(tournaments))
    //             .catch(err => res.json([]));
    //     }
    //     else
    //         res.json([]);
    // }

    // public findByMaxPlayers(req: Request, res: Response, next: NextFunction) {
    //     Tournament.find({ maxPlayers: req.params.max }).sort({ name: 'asc' })
    //         .then(tournaments => res.json(tournaments))
    //         .catch(err => res.json([]));
    // }

    // public getRange(req: Request, res: Response, next: NextFunction) {
    //     let d1 = new Date(req.params.start);
    //     let d2 = new Date(req.params.finish);
    //     if (isNaN(d1.valueOf()) || isNaN(d2.valueOf()))
    //         res.json({errmsg: 'bad date range'});
    //     else {
    //         Tournament.find({ start: { $gte: d1, $lte: d2 } })
    //             .then(tournaments => res.json(tournaments))
    //             .catch(err => res.json([]));
    //     }
    // }

    // public createPromise(req: Request, res: Response, next: NextFunction) {
    //     let tournament = new Tournament(req.body);
    //     tournament
    //         .save()
    //         .then(saved => console.log("saved", saved))
    //         .catch(err => console.log("error", err));
    // }

    public create(req: Request, res: Response, next: NextFunction) {
        let game = new Game(req.body);
        console.log("new game player_1=>" +game.player_1 + "  player_2 => " +game.player_2)
        game.save()
            .then(r => res.json(r))
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
