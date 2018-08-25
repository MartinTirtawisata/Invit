const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');

describe("test for status code", function(){
    before(function(){
        return runServer();
    })

    after(function(){
        return closeServer();
    })

    it('should show 200 status code when getting', function(){
        return chai.request(app).get('/').then(res => {
            console.log(res)
            expect(res).to.have.status(200);
        })
    })
})