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

    it('should show 200 status for home', function(){
        return chai.request(app).get('/api/home').then(res => {
            // console.log(res)
            expect(res).to.have.status(200);
            // expect(res).to.be.json;
        })
    })

    it('should show 200 status for payment', function(){
        return chai.request(app).get('/payment').then(res => {
            // console.log(res)
            expect(res).to.have.status(200);
        })
    })

    it('should show 200 status for login', function(){
        return chai.request(app).get('/login').then(res => {
            // console.log(res)
            expect(res).to.have.status(200);
        })
    })

    it('should show 200 status for signup', function(){
        return chai.request(app).get('/signup').then(res => {
            // console.log(res)
            expect(res).to.have.status(200);
        })
    })

    it('should show 200 status for seller', function(){
        return chai.request(app).get('/seller').then(res => {
            // console.log(res)
            expect(res).to.have.status(200);
        })
    })
})