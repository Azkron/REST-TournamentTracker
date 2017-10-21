import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import Tournament from '../models/tournament';

export class TournamentsRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
        this.router.delete('/', this.deleteAll);
        this.router.get('/:id', this.getOne);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.deleteOne);
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        Tournament.find().sort({ pseudo: 'asc'}).exec((err, members) => {
            if (err) res.send(err);
            res.json(members);
        });
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        Tournament.find({ pseudo: req.params.id }, (err, members) => {
            if (err) res.send(err);
            res.json(members);
        });
    }

    public createPromise(req: Request, res: Response, next: NextFunction) {
        let tournament = new Tournament(req.body);
        tournament
            .save()
            .then(saved => console.log("saved", saved))
            .catch(err => console.log("error", err));
    }

    public create(req: Request, res: Response, next: NextFunction) {
        let tournament = new Tournament(req.body);
        tournament.save(function (err, task) {
            if (err) res.send(err);
            res.json(task);
        });
    }


    public update(req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        let tournament = new Tournament(req.body);
        Tournament.findOneAndUpdate({ pseudo: req.params.id },
            req.body,
            { new: true },  // pour renvoyer le document modifié
            function (err, task) {
                console.log(err, task);
                if (err)
                    res.send(err);
                res.json(task);
            });
    }

    public deleteOne(req: Request, res: Response, next: NextFunction) {
        Tournament.findOneAndRemove({ name: req.params.id },
            function (err, task) {
                if (err)
                    res.send(err);
                res.json(task);
            });
    }

    public deleteAll(req: Request, res: Response, next: NextFunction) {
        Tournament.remove({},
            function (err) {
                if (err)
                    res.send(err);
                res.json({status: 'ok'});
            });
    }
}
