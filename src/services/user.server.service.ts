import * as jwt from 'jsonwebtoken';
import config from "../config/config";

class UserService {
    getUserFromJwt(req, res, next) {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
            jwt.verify(req.headers.authorization.split(' ')[1], config.jwtSecret, function (err, decode) {
                if (err) req.user = undefined;
                req.user = decode;
                next();
            });
        } else {
            req.user = undefined;
            next();
        }
    }
}

export const userService = new UserService();