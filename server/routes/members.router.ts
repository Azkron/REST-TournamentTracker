import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import Member from '../models/member';

export class MembersRouter {
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
        Member.find().sort({ pseudo: 'asc'}).exec((err, members) => {
            if (err) res.send(err);
            res.json(members);
        });
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        Member.find({ pseudo: req.params.id }, (err, members) => {
            if (err) res.send(err);
            res.json(members);
        });
    }

    public create(req: Request, res: Response, next: NextFunction) {
        let member = new Member(req.body);
        member.save(function (err, task) {
            if (err) res.send(err);
            res.json(task);
        });
    }

    public update(req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        let member = new Member(req.body);
        Member.findOneAndUpdate({ pseudo: req.params.id },
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
        Member.findOneAndRemove({ pseudo: req.params.id },
            function (err, task) {
                if (err)
                    res.send(err);
                res.json(task);
            });
    }

    public deleteAll(req: Request, res: Response, next: NextFunction) {
        Member.remove({},
            function (err) {
                if (err)
                    res.send(err);
                res.json({status: 'ok'});
            });
    }
}