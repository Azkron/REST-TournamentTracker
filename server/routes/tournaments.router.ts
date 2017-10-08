import { Router, Request, Response, NextFunction} from 'express';
import * as mongoose from 'mongoose';
import Tournament from '../models/tournament';

export class TournamentsRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
        this.router.delete('/', this.deleteAll);
        this.router.get('/:id', this.getOne);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.deleteOne);
    }
    
    public getAll(req: Request, res: Response, next: NextFunction) {
        Tournament.find().sort({ name: 'asc'}).exec((err, tournaments) => {
            if (err) res.send(err);
            res.json(tournaments);
        });
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        Tournament.find({ name: req.params.id }, (err, tournaments) => {
            if (err) res.send(err);
            res.json(tournaments);
        });
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
        let tournament = new Tournament(req.body); // HAVE NO IDEA WHY IS THIS NEEDED
        Tournament.findOneAndUpdate({ name: req.params.id },
            req.body,
            { new: true },  // to resend the modify doc
            function (err, task) {
                console.log(err, task);
                if (err)
                    res.send(err);
                res.json(task);
            });
    }

    public deleteOne(req: Request, res: Response, next: NextFunction) {
        console.log("delete one");
        Tournament.findOneAndRemove({ name: req.params.id },
            function (err, task) {
                if (err)
                    res.send(err);
                res.json(task);
            });
    }

    public deleteAll(req: Request, res: Response, next: NextFunction) {
        console.log("delete all");
        Tournament.remove({},
            function (err) {
                if (err)
                    res.send(err);
                res.json({status: 'ok'});
            });
    }
}
