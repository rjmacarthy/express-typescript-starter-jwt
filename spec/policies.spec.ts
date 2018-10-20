import { expect } from "chai";
import * as mocks from 'node-mocks-http';
import { loggedInPolicy } from '../src/policies/loggedin.server.policy';

describe("Policies Spec", function () {
    let res: mocks.MockResponse<any>  = mocks.createResponse();;
    let req: mocks.MockResponse<any> = mocks.createRequest();

    beforeEach(()=>{
        req.user = null;
    });

    it('it passed not logged in', async () => {
        req.user = {};
        loggedInPolicy.isLoggedIn(req, res, () => { 
            expect(true).to.be.true;
        });
    });

    it('it fails when not logged in', async () => {
        var success = loggedInPolicy.isLoggedIn(req, res, () => { 
            expect(true).to.be.true;
        });
        expect(success).to.be.false;
    });

});