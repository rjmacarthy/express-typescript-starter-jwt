import { Request, Response } from 'express';
import { User } from '../models/user.model';
import config from '../config/config'
import * as jwt from 'jsonwebtoken';

export default class AuthenticationController {

    async register(req: Request, res: Response) {
        var user = new User(req.body);
        if (await User.findOne({ email: req.body.email })) return res.json({ err: 'Email already exists' });
        var user = await user.save();
        res.json(user);
    }

    async signin(req: Request, res: Response) {
        var user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).json({ message: 'Authentication failed. User not found.' });
        await new Promise((resolve, reject) => {
            user.comparePassword(req.body.password, user, (err, success) => {
                if (err && !success) {
                    res.status(401).json({ message: 'Authentication failed. Wrong password.' });
                    reject();
                }
                res.json({
                    token: jwt.sign({ email: user.email, _id: user._id }, config.jwtSecret, {
                        expiresIn: '7d'
                    })
                });
                resolve();
            });
        });
    };

    public async me(req: any, res: Response) {
        await new Promise((resolve, reject) => {
            if (req.user) {
                res.json();
                resolve();
            } else {
                res.status(401).json({ message: 'Unauthorised' });
                reject();
            }
        });

    }

}

export const authenticationController = new AuthenticationController();