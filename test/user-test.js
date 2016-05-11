"use strict"
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiHttp);
chai.use(chaiAsPromised);

const apiAddress = 'http://localhost/api';
const app = require('../server/server')

const expect = chai.expect;
const request = chai.request;

describe('Sign Up', () => {
    before(() => {
        let user = app.models.User;
        user.create({ email: 'userTest@gmail.com', password: 'userTest', username: 'userTest' },
            (err, res) => {
                if (err) throw err;
            })
    });

    after(() => {
        let user = app.models.User;
        user.destroyAll({ 'username': 'user1' },
            (err, obj, count) => {
                if (err) throw err;
            });

        user.destroyAll({ 'username': 'userTest' },
            (err, obj, count) => {
                if (err) throw err;
            });
    });

    it('Return error when Username is Empty', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'user1@gmail.com',
                password: 'user1',
                username: ''
            })
            .then(res => {
                expect(res).to.have.status(422);
                done();
            })
            .catch(err => {
                expect(err).to.not.be.null;
                expect(err).to.have.status(422);
                done();
            });
    });

    it('Return error when Email is Empty', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: '',
                password: 'user1',
                username: 'user1'
            })
            .then(res => {
                expect(res).to.have.status(422);
                done();
            })
            .catch(err => {
                expect(err).to.not.be.null;
                expect(err).to.have.status(422);
                done();
            });
    });

    it('Return error when Password is Empty', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'user1@gmail.com',
                password: '',
                username: 'user1'
            })
            .then(res => {
                expect(res).to.have.status(422);
                done();
            })
            .catch(err => {
                expect(err).to.not.be.null;
                expect(err).to.have.status(422);
                done();
            });
    });

    it('Return error when Email Format is Invalid', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'user1',
                password: 'user1',
                username: 'user1'
            })
            .then(res => {
                expect(res).to.have.status(422);
                done();
            })
            .catch(err => {
                expect(err).to.not.be.null;
                expect(err).to.have.status(422);
                done();
            });
    });

    it('Return error when Username is already Exist', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'userTest1@gmail.com',
                password: 'userTest1',
                username: 'userTest'
            })
            .then(res => {
                expect(res).to.have.status(422);
                done();
            })
            .catch(err => {
                expect(err).to.not.be.null;
                expect(err).to.have.status(422);
                done();
            });
    });

    it('Return error when Email already Exist', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'userTest@gmail.com',
                password: 'userTest1',
                username: 'userTest1'
            })
            .then(res => {
                expect(res).to.have.status(422);
                done();
            })
            .catch(err => {
                expect(err).to.not.be.null;
                expect(err).to.have.status(422);
                done();
            });
    });

    it('Return OK when all Data is Valid', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'user1@gmail.com',
                password: 'user1',
                username: 'user1'
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.email).to.equal('user1@gmail.com');
                expect(res.body.username).to.equal('user1');
                expect(res.body.id).exist;
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});