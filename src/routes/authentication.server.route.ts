import { Express } from "express";
import { authenticationController } from "../controllers/authentication.server.controller";
import { loggedInPolicy } from '../policies/loggedin.server.policy';

export default class IndexRoute {
    constructor(app: Express) {
        app.route('/register')
            .post(authenticationController.register);

        app.route('/signin')
            .post(authenticationController.signin);

        app.route('/me')
            .get(loggedInPolicy.isLoggedIn, authenticationController.me);
    }
}