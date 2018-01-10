import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import Tournament from '../models/tournament';
import Game from "../models/game";
import Member from "../models/member";
import { AuthentificationRouter } from "./authentication.router";

export class TournamentsRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/countTournament', this.getCountTournament);
        this.router.get('/', this.getAll);
        this.router.put('/subscribeCurrent', this.subscribeCurrent);
        this.router.use(AuthentificationRouter.checkAdmin);   // à partir d'ici il faut être admin
        
        this.router.post('/', this.create);
        this.router.delete('/', this.deleteAll);
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
    
    public subscribeCurrent(req: Request, res: Response, next: NextFunction) {
        
        let memberPseudo = AuthentificationRouter.getPseudo(req);
        Member.find({ pseudo: memberPseudo }).exec((err, m) =>{
            if(err) res.send(err);
            Tournament.find({ _id: req.body._id }).populate('members').populate('games').exec((err, t) =>{
                if(err) res.send(err);
                let currMember = m[0];
                let currTournament = t[0];
                
                currTournament.members.push(currMember);

                let count = 0;
                let maxCount = currTournament.members.length;

                if(currTournament.members.length <=1)
                {
                    currTournament.save()
                        .then(t => res.json(t))
                        .catch(err => res.json(err));
                }
                else for(let member of currTournament.members)
                {
                    count++;
                    if(member.pseudo != currMember.pseudo)
                    {
                        console.log("subscribeCurrent member.pseudo = " + member.pseudo);
                        let game = new Game();
    
                        game.player_1 = currMember.pseudo;
                        game.player_2 = member.pseudo;
                        game.tournament = currTournament;
                        console.log("subscribeCurrent game = " + game);
                        
                        game.save().then(g => {
                            if(err) res.send(err);
                            //currTournament.games.push(g);
                            currTournament.games.push(g);
                            if(count == maxCount)
                            {
                                console.log("subscribeCurrent g.player_1 = ");
                                console.log(g.player_1);
                                currTournament.save()
                                    .then(t => {
                                        res.json(t.populate('members').populate('games'));
                                    })
                                    .catch(err => res.json(err));
                            }
                        });
                    }
                }


                
            });
    
            // Tournament.findOneAndUpdate({ name: tournament.name },
            //     tournament,
            //     { new: true })  // pour renvoyer le document modifié
            //     .populate('members').populate('games').then(r => {
            //         // console.log("r =>" +r)
            //         res.json(r)
            //     })
            //     .catch(err => res.json(err));

        });
    }

    public getCountTournament(req: Request, res: Response, next: NextFunction) {
        Tournament.count({}).exec((err, count) => {
            if (err) res.send(err);
            res.json(count);
        });
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
		Tournament.find().populate('members').populate('games').sort({ name: 'asc' }).exec((err, tournaments) => {
            if(err) res.send(err);
            res.json(tournaments);
        });
    }

    public findById(req: Request, res: Response, next: NextFunction) {
        Tournament.find({ _id: req.params.id }).populate('members').populate('games')
            .then(tournament => res.json(tournament))
            .catch(err => res.json([]));
    }
	
	public findByName(req: Request, res: Response, next: NextFunction) {
        Tournament.find({ name: req.params.name }).populate('members').populate('games')
            .then(tournament => res.json(tournament))
            .catch(err => res.json([]));
    }

    public findByStartDate(req: Request, res: Response, next: NextFunction) {
        let d = new Date(req.params.start);
        if (!isNaN(d.valueOf())) {
            Tournament.find({ start: d }).populate('members').populate('games').sort({ name: 'asc' })
                .then(tournaments => res.json(tournaments))
                .catch(err => res.json([]));
        }
        else
            res.json([]);
    }

    public findByFinishDate(req: Request, res: Response, next: NextFunction) {
        let d = new Date(req.params.finish);
        if (!isNaN(d.valueOf())) {
            Tournament.find({ finish: d }).populate('members').populate('games').sort({ name: 'asc' })
                .then(tournaments => res.json(tournaments))
                .catch(err => res.json([]));
        }
        else
            res.json([]);
    }

    public findByMaxPlayers(req: Request, res: Response, next: NextFunction) {
        Tournament.find({ maxPlayers: req.params.max }).populate('members').populate('games').sort({ name: 'asc' })
            .then(tournaments => res.json(tournaments))
            .catch(err => res.json([]));
    }

    public getRange(req: Request, res: Response, next: NextFunction) {
        let d1 = new Date(req.params.start);
        let d2 = new Date(req.params.finish);
        if (isNaN(d1.valueOf()) || isNaN(d2.valueOf()))
            res.json({errmsg: 'bad date range'});
        else {
            Tournament.find({ start: { $gte: d1, $lte: d2 } }).populate('members').populate('games')
                .then(tournaments => res.json(tournaments))
                .catch(err => res.json([]));
        }
    }

    // public createPromise(req: Request, res: Response, next: NextFunction) {
    //     let tournament = new Tournament(req.body);
    //     tournament
    //         .save()
    //         .then(saved => console.log("saved", saved))
    //         .catch(err => console.log("error", err));
    // }

    public create(req: Request, res: Response, next: NextFunction) {
        let tournament = new Tournament(req.body);
        tournament.save()
            .then(r => res.json(r))
            .catch(err => res.json(err));
    }


    public update(req: Request, res: Response, next: NextFunction) {
        let t = new Tournament(req.body);
        //console.log(req.body)
        // console.log("insert game in tournament => " +t.games)
		Tournament.findOneAndUpdate({ name: req.params.name },
            req.body,
			{ new: true })  // pour renvoyer le document modifié
            .then(r => {
                // console.log("r =>" +r)
                res.json(r)
            } )
            .catch(err => res.json(err));
    }

    public deleteOne(req: Request, res: Response, next: NextFunction) {
		Tournament.findOneAndRemove({ name: req.params.name })
            .then(r => res.json(true))
            .catch(err => res.json(err));
    }

    public deleteAll(req: Request, res: Response, next: NextFunction) {
        Tournament.remove({},
            function (err) {
                if (err)
                    res.send(err);
                res.json({ status: 'ok' });
            })
            .then(() => Game.remove({}).exec());
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
