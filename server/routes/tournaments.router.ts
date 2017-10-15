import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import Tournament from '../models/tournament';

export class TournamentRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
        this.router.get('/:name', this.findByName);
        this.router.get('/byId/:id', this.findById);
        this.router.get('/byStartDate/:start', this.findByStartDate);
        this.router.get('/byFinishDate/:finish', this.findByFinishDate);
        this.router.get('/byMaxPlayers/:max', this.findByMaxPlayers);
        this.router.get('/byStartRange/:start/:finish', this.getRange);
        this.router.put('/:name', this.update);
        this.router.delete('/:name', this.deleteOne);
        this.router.delete('/:start/:finish', this.deleteRange);
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        Tournament.find().sort({ name: 'asc' })
            .then(members => res.json(members))
            .catch(err => res.json([]));
    }

    public findById(req: Request, res: Response, next: NextFunction) {
        Tournament.find({ _id: req.params.id })
            .then(member => res.json(member))
            .catch(err => res.json([]));
    }

    public findByName(req: Request, res: Response, next: NextFunction) {
        Tournament.find({ name: req.params.name })
            .then(member => res.json(member))
            .catch(err => res.json([]));
    }

    public findByStartDate(req: Request, res: Response, next: NextFunction) {
        let d = new Date(req.params.start);
        if (!isNaN(d.valueOf())) {
            Tournament.find({ start: d }).sort({ name: 'asc' })
                .then(members => res.json(members))
                .catch(err => res.json([]));
        }
        else
            res.json([]);
    }

    public findByFinishDate(req: Request, res: Response, next: NextFunction) {
        let d = new Date(req.params.finish);
        if (!isNaN(d.valueOf())) {
            Tournament.find({ finish: d }).sort({ name: 'asc' })
                .then(members => res.json(members))
                .catch(err => res.json([]));
        }
        else
            res.json([]);
    }

    public findByMaxPlayers(req: Request, res: Response, next: NextFunction) {
        Tournament.find({ maxPlayers: req.params.max }).sort({ name: 'asc' })
            .then(members => res.json(members))
            .catch(err => res.json([]));
    }

    public getRange(req: Request, res: Response, next: NextFunction) {
        let d1 = new Date(req.params.start);
        let d2 = new Date(req.params.finish);
        if (isNaN(d1.valueOf()) || isNaN(d2.valueOf()))
            res.json({errmsg: 'bad date range'});
        else {
            Tournament.find({ start: { $gte: d1, $lte: d2 } })
                .then(members => res.json(members))
                .catch(err => res.json([]));
        }
    }

    public create(req: Request, res: Response, next: NextFunction) {
        let tournament = new Tournament(req.body);
        tournament.save()
            .then(r => res.json(r))
            .catch(err => res.json(err));
    }

    public update(req: Request, res: Response, next: NextFunction) {
        Tournament.findOneAndUpdate({ name: req.params.name },
            req.body,
            { new: true })  // pour renvoyer le document modifié
            .then(r => res.json(r))
            .catch(err => res.json(err));
    }

    public deleteOne(req: Request, res: Response, next: NextFunction) {
        Tournament.findOneAndRemove({ name: req.params.name })
            .then(r => res.json(true))
            .catch(err => res.json(err));
    }

    public deleteRange(req: Request, res: Response, next: NextFunction) {
        let d1 = new Date(req.params.start);
        let d2 = new Date(req.params.finish);
        if (isNaN(d1.valueOf()) || isNaN(d2.valueOf()))
            res.json({errmsg: 'bad date range'});
        else {
            Tournament.find({ start: { $gte: d1, $lte: d2 } })
                .remove()
                .then(r => res.json(true))
                .catch(err => res.json(err));
        }
    }
}
