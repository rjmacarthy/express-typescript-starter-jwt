import * as bodyParser from "body-parser";
import config from "./config";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { userService } from '../services/user.server.service';

export default function (db) {
    var app: express.Express = express();

    //Models
    for (let model of config.globFiles(config.models)) {
        require(path.resolve(model));
    }

    if (config.useMongo) {
        mongoose.connect(config.mongodb)
            .then(() => {
                console.log(`Connected to mongo on ${config.mongodb}`);
            })
            .catch(() => { console.log("Error connecting to mongos"); });
    }

    (<any>mongoose).Promise = require('bluebird');

    // view engine setup
    app.set("views", path.join(__dirname, "../../src/views"));
    app.set("view engine", "jade");

    //app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "../../src/public")));
    app.use(userService.getUserFromJwt);

    //Routes
    for (let route of config.globFiles(config.routes)) {
        require(path.resolve(route)).default(app);
    }

    // catch 404 and forward to error handler
    app.use((req: express.Request, res: express.Response, next: Function): void => {
        let err: Error = new Error("Not Found");
        next(err);
    });

    // production error handler
    app.use((err: any, req: express.Request, res: express.Response, next): void => {
        res.status(err.status || 500).render("error", {
            message: err.message,
            error: {}
        });
    });

    if (app.get("env") === "development") {
        app.use((err: Error, req: express.Request, res: express.Response, next): void => {
            res.status(500).render("error", {
                message: err.message,
                error: err
            });
        });
    }



    return app;
};