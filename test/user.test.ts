import * as sinon from 'sinon';
import { expect, assert } from "chai";
import * as mocks from 'node-mocks-http';
import { User } from '../src/models/user.model';
import { after } from 'mocha';
import config from "../src/config/config";
import { authenticationController } from '../src/controllers/authentication.server.controller';
var mongoose = require('mongoose');

describe("User Spec", function () {
    let connectionString = config.mongodb;
    let res: mocks.MockResponse<any>;
    let req: mocks.MockResponse<any> = mocks.createRequest();

    beforeEach(() => {
        delete mongoose.connection.models['User'];
        User.collection.drop();
        res = mocks.createResponse();
    });

    before(() => {
        mongoose.connect(connectionString, {
            promiseLibrary: global.Promise,
            useNewUrlParser: true
        });
    });

    it('Can save a new user', async () => {
        var user = new User();
        user.email = 'email@email.com';
        user.password = 'password';
        var response = await user.save();
        expect(response.password).to.not.be.null;
        expect(response.salt).to.not.be.null;
        assert.isNotNull(response._id);
    });

    it("Can register a new user", async function () {
        req.body = { "email": "email@email.com", "password": "password" };
        await authenticationController.register(req, res);
        var data = JSON.parse(res._getData());
        expect(data.password).to.not.be.null;
        expect(data.salt).to.not.be.null;
        expect(data.email).to.not.be.null;
        assert.equal("email@email.com", data.email);
    });

    it("Can sigin in", async function () {
        req.body = { "email": "email@email.com", "password": "password" };
        await authenticationController.register(req, res);
        res = mocks.createResponse();
        await authenticationController.signin(req, res);
        var data = JSON.parse(res._getData());
        expect(data.token).to.not.be.null;
    });

    it('Can get a user', () => {
        res = mocks.createResponse();
        req.user = { "email": "email@email.com" };
        authenticationController.me(req, res);
        var data = JSON.parse(res._getData());
        expect(data.email).to.not.be.null;
    });

    after(() => {
        mongoose.disconnect();
        process.exit();
    })

});