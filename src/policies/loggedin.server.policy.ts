import { Request, Response } from 'express';

class LoggedInPolicy {

    isLoggedIn(req: any, res: Response, next: Function) {
        if (req.user) {
            next();
        } else {
            res.status(401).json({ err: 'Not authorised' });
            return false;
        }
    }

}

export const loggedInPolicy = new LoggedInPolicy();