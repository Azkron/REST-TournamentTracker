import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { AuthentificationRouter } from "./authentication.router";
import { Member, Address, IMember } from '../models/member';
import { Tournament, ITournament } from '../models/tournament';

export class MembersRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/count', this.getCount);
        this.router.get('/current', this.getCurrent);
        this.router.put('/current', this.updateCurrent);
        this.router.post('/address/current', this.addCurrentAddress);
        this.router.delete('/address/current/:id', this.deleteCurrentAddress);
        this.router.put('/address/current/:id', this.updateCurrentAddress);
        this.router.use(AuthentificationRouter.checkAdmin);   // à partir d'ici il faut être admin
        this.router.get('/', this.getAll);

        this.router.get('/getUnassignedMembers/:id', this.getUnassignedMembers);

        this.router.post('/', this.create);
        this.router.delete('/', this.deleteAll);
        this.router.get('/:id', this.getOne);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.deleteOne);
        this.router.post('/address/:pseudo', this.addAddress);
        this.router.delete('/address/:pseudo/:id', this.deleteAddress);
        this.router.put('/address/:id', this.updateAddress);
    }

    // public getCountMembertAssigned(req: Request, res: Response, next: NextFunction) {
    //     let tournamentId = req.params.id;
    //     Member.count({tournaments : mongoose.Types.ObjectId(tournamentId) }).exec((err, count) => {
    //         if (err) res.send(err);
    //         res.json(count);
    //     });
    // }

    // public getCountMemberUnassigned(req: Request, res: Response, next: NextFunction) {
    //     let tournamentId = req.params.id;
    //     Member.count({ tournaments : { '$ne' : mongoose.Types.ObjectId(tournamentId) }}).exec((err, count) => {
    //         if (err) res.send(err);
    //         res.json(count);
    //     });
    // }

    public getUnassignedMembers(req: Request, res:Response, next: NextFunction) {
        let tournamentId = req.params.id;
        Member.find({tournaments : { '$ne' : mongoose.Types.ObjectId(tournamentId) }}).sort({ pseudo: 'asc' })
        .exec((err, members) => {            
            if (err) res.send(err);
            res.json(members);
        });
    }    

    public getCount(req: Request, res: Response, next: NextFunction) {
        Member.count({}).exec((err, count) => {
            if (err) res.send(err);
            res.json(count);
        });
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        Member.find().populate('addresses').populate('tournaments').sort({ pseudo: 'asc' })
        .exec((err, members) => {            
            if (err) res.send(err);
            res.json(members);
        });
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        Member.find({ pseudo: req.params.id }).populate('addresses').populate('tournaments')
        .exec((err, members) => {
            if (err) res.send(err);
            res.json(members);
        });
    }

    public getCurrent(req: Request, res: Response, next: NextFunction){
        let currPseudo = AuthentificationRouter.getPseudo(req);
        Member.find({ pseudo: currPseudo }).populate('addresses').populate('tournaments')
        .exec((err, members) => {
            if (err) res.send(err);
            res.json(members);
        });
    }


    public create(req: Request, res: Response, next: NextFunction) {
        delete req.body._id;    // _id vient avec la valeur nulle d'angular (via reactive forms) 
                                // => on doit l'enlever pour qu'il reçoive une valeur 
        let member = new Member(req.body);
        member.save(function (err, task) {
            if (err) res.send(err);
            res.json(task);
        });
    }

    public update(req: Request, res: Response, next: NextFunction) {
        let member = new Member(req.body);
        console.log(member);
        Member.findOneAndUpdate({ pseudo: req.params.id },
            req.body,
            { new: true },  // pour renvoyer le document modifié
            function (err, task) {
                if (err)
                    res.send(err);
                res.json(task);
            });
    } 
    
    public updateCurrent(req: Request, res: Response, next: NextFunction) {
        let member = new Member(req.body);
        let currPseudo = AuthentificationRouter.getPseudo(req);
        console.log(member);
        Member.findOneAndUpdate({ pseudo: currPseudo },
            req.body,
            { new: true },  // pour renvoyer le document modifié
            function (err, task) {
                if (err)
                    res.send(err);
                res.json(task);
            });
    }


    public deleteOne(req: Request, res: Response, next: NextFunction) {
        Member.findOneAndRemove({ pseudo: req.params.id })
            .then(m => {
                // delete en cascade des adresses
                m.addresses.forEach(a => Address.findByIdAndRemove(a).exec());
                res.json(m);
            })
            .catch(err => res.send(err))
    }

    public deleteAll(req: Request, res: Response, next: NextFunction) {
        Member.remove({},
            function (err) {
                if (err)
                    res.send(err);
                res.json({ status: 'ok' });
            })
            .then(() => Address.remove({}).exec());
    }

    public addAddress(req: Request, res: Response, next: NextFunction) {
        delete req.body._id;
        let pseudo = req.params.pseudo;
        let address = new Address(req.body);
        Member.findOne({ pseudo: pseudo })
            .then(m => {
                m.addresses.push(address);
                address.member = m;
                return address.save();
            })
            .then(a => {
                a.member.save();
                res.json(address);
            })
            .catch(err => console.log(err));
    }

    public addCurrentAddress(req: Request, res: Response, next: NextFunction) {
        let currPseudo = AuthentificationRouter.getPseudo(req);
        delete req.body._id;
        let address = new Address(req.body);
        Member.findOne({ pseudo: currPseudo })
            .then(m => {
                m.addresses.push(address);
                address.member = m;
                return address.save();
            })
            .then(a => {
                a.member.save();
                res.json(address);
            })
            .catch(err => console.log(err));
    }

    public deleteAddress(req: Request, res: Response, next: NextFunction) {
        let pseudo = req.params.pseudo;
        let id = req.params.id;
        Member.findOne({ pseudo: pseudo })
            .then(m => {
                let i = m.addresses.find(a => a._id == id);
                m.addresses.splice(i, 1);
                return m.save();
            })
            .then(m => {
                return Address.remove({ _id: id })
            })
            .then(() => res.json(true))
            .catch(err => console.log(err));
    }

    public deleteCurrentAddress(req: Request, res: Response, next: NextFunction) {
        let currPseudo = AuthentificationRouter.getPseudo(req);
        let id = req.params.id;
        Member.findOne({ pseudo: currPseudo })
            .then(m => {
                let i = m.addresses.find(a => a._id == id);
                m.addresses.splice(i, 1);
                return m.save();
            })
            .then(m => {
                return Address.remove({ _id: id })
            })
            .then(() => res.json(true))
            .catch(err => console.log(err));
    }

    public updateAddress(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        Address.findOneAndUpdate({ _id: id }, req.body, { new: true })
            .then(a => res.json(a))
            .catch(err => console.log(err));
    }
    

    public updateCurrentAddress(req: Request, res: Response, next: NextFunction) {
        
        let currPseudo = AuthentificationRouter.getPseudo(req);
        let id = req.params.id;
        // delete req.body._id;
        // let newAddress = new Address(req.body);
        Member.findOne({ pseudo: currPseudo })
            .then(m => {
                    Address.findOneAndUpdate({ _id: id, member: m}, req.body, { new: true })
                        .then(a => res.json(a))
                        .catch(err => console.log(err));
            })
            .then(a => res.json(a))
            .catch(err => console.log(err));

    }
}